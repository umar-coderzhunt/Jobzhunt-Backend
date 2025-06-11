import logging
import asyncio
from datetime import datetime, timezone
from aiohttp import ClientSession, ClientError
from config.config import CREATE_API

async def worker(worker_id, queue, checker, raw_coll, http):
    """Worker function to process jobs from queue"""
    logger = logging.getLogger(f"worker-{worker_id}")
    
    while True:
        try:
            # Get job from queue
            doc = await queue.get()
            job_id = doc.get("_id")
            url = doc.get("jobUrl", "")
            
            if not url:
                logger.error(f"No jobUrl found for document {job_id}")
                queue.task_done()
                continue
                
            try:
                logger.info(f"Processing job {job_id}: {url}")
                # Check job application type
                res = await checker.check_job_application_type(url)
                now = datetime.now(timezone.utc)
                
                if res["hasCompanyWebsite"] and res["companyWebsiteUrl"]:
                    logger.info(f"Found external URL for {job_id}: {res['companyWebsiteUrl']}")
                    flags = {
                        "isEasyApply": False,
                        "isMatureJob": True,
                        "linkPassed": True,
                        "updatedAt": now
                    }
                    
                    # Create mature job
                    payload = {
                        "rawJob": str(job_id),
                        "source": "careerpage",
                        "url": res["companyWebsiteUrl"],
                        "isApplied": False,
                        "isRelevant": True,
                        "appliedBy": []
                    }
                    try:
                        async with http.post(CREATE_API, json=payload, timeout=30) as r:
                            if r.status in (200, 201):
                                logger.info(f"🚀 Created mature job for {job_id}")
                            else:
                                text = await r.text()
                                logger.error(f"❌ API error {r.status} for {job_id}: {text}")
                    except ClientError as e:
                        logger.error(f"❌ HTTP error creating mature job for {job_id}: {str(e)}")
                    except asyncio.TimeoutError:
                        logger.error(f"❌ Timeout creating mature job for {job_id}")
                    except Exception as e:
                        logger.error(f"❌ Unexpected error creating mature job for {job_id}: {str(e)}")
                else:
                    # Everything else is treated as easy apply
                    logger.info(f"Easy Apply job {job_id}: {url}")
                    flags = {
                        "isEasyApply": True,
                        "isMatureJob": False,
                        "linkPassed": False,
                        "updatedAt": now
                    }
                
                # Update the document with the determined flags
                try:
                    await raw_coll.update_one(
                        {"_id": job_id},
                        {"$set": flags}
                    )
                    logger.info(f"Updated job {job_id} with flags: {flags}")
                except Exception as e:
                    logger.error(f"Failed to update job {job_id}: {str(e)}")
                
            except Exception as e:
                logger.error(f"Error processing job {job_id}: {str(e)}")
                # Update the job as Easy Apply on error to prevent retries
                try:
                    await raw_coll.update_one(
                        {"_id": job_id},
                        {"$set": {
                            "isEasyApply": True,
                            "isMatureJob": False,
                            "linkPassed": False,
                            "updatedAt": datetime.now(timezone.utc)
                        }}
                    )
                    logger.info(f"Marked job {job_id} as Easy Apply due to error")
                except Exception as update_error:
                    logger.error(f"Failed to update job {job_id} after error: {str(update_error)}")
            finally:
                queue.task_done()
                
        except asyncio.CancelledError:
            logger.info(f"Worker {worker_id} cancelled")
            break
        except Exception as e:
            logger.error(f"Worker {worker_id} error: {str(e)}")
            if not queue.empty():
                queue.task_done()
            # Add a small delay before continuing to prevent tight error loops
            await asyncio.sleep(1)
