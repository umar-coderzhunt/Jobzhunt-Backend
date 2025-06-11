import asyncio
import logging
from aiohttp import ClientSession, TCPConnector
from database.mongodb import get_db
from config.config import RAW_COLL, WORKER_COUNT, QUEUE_MAX
from services.job_checker import JobChecker
from services.worker import worker
from .helper import get_raw_documents

logger = logging.getLogger(__name__)

async def process_batch(checker, http, raw_coll, worker_count, queue_max):
    """Process a single batch of documents"""
    queue = asyncio.Queue()
    
    # Fetch raw documents for this batch
    docs = await get_raw_documents(raw_coll, worker_count, queue_max)
    if not docs:
        return 0
        
    logger.info(f"Processing batch of {len(docs)} documents")
    
    for doc in docs:
        await queue.put(doc)

    # Start worker tasks
    workers = []
    for i in range(worker_count):
        w = asyncio.create_task(worker(i, queue, checker, raw_coll, http))
        workers.append(w)

    # Wait until queue is fully processed
    await queue.join()

    # Cancel worker tasks
    for w in workers:
        w.cancel()
        
    return len(docs)

async def run_pipeline():
    logger.info("Initializing pipeline")
    total_processed = 0
    batch_size = WORKER_COUNT * QUEUE_MAX  # 5 * 200 = 1000 per batch
    
    # Initialize browser for job checking
    logger.info("Initializing browser for job checking")
    checker = JobChecker()
    await checker.init_browser()
    logger.info("Browser initialized successfully")

    # Set up HTTP session with connector limits
    logger.info(f"Setting up HTTP session with {WORKER_COUNT} workers")
    connector = TCPConnector(limit=WORKER_COUNT, limit_per_host=WORKER_COUNT)
    http = ClientSession(connector=connector)

    try:
        # Get a fresh database connection for this request
        db = get_db()
        raw_coll = db[RAW_COLL]
        
        # Process batches until no more documents are found
        while True:
            batch_count = await process_batch(checker, http, raw_coll, WORKER_COUNT, QUEUE_MAX)
            if batch_count == 0:
                break
            total_processed += batch_count
            logger.info(f"Completed batch. Total processed so far: {total_processed}")
            
        logger.info(f"Pipeline completed. Total documents processed: {total_processed}")
        return f"Processed {total_processed} documents in total"
        
    finally:
        # Cleanup resources
        logger.info("Cleaning up resources")
        await checker.close()
        await http.close()
        logger.info("Pipeline completed successfully")
