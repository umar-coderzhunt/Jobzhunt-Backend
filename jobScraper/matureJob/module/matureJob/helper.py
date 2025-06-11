import logging
from urllib.parse import urlparse, parse_qs

logger = logging.getLogger(__name__)

def extract_job_id(url: str) -> str:
    """Extract job ID from LinkedIn URL."""
    parts = urlparse(url).path.split("/")
    if "view" in parts:
        idx = parts.index("view")
        if idx + 1 < len(parts):
            return parts[idx + 1].split("-")[-1]
    return ""

def clean_url(url: str) -> str:
    """Clean a URL by only handling LinkedIn external apply URLs."""
    try:
        # Parse the URL
        parsed = urlparse(url)
        
        # Only process LinkedIn external apply URLs
        if 'linkedin.com' in parsed.netloc and 'externalApply' in parsed.path:
            # Get the 'url' parameter from query string
            query_params = parse_qs(parsed.query)
            if 'url' in query_params:
                # Get the first URL parameter and decode it
                actual_url = query_params['url'][0]
                return actual_url
        
        # For all other URLs, return as is
        return url
    except Exception as e:
        logger.error(f"Error cleaning URL {url}: {e}")
        return url

async def get_raw_documents(raw_coll, worker_count, queue_max):
    """Get documents from raw collection that need processing"""
    try:
        # Get total count first
        total_count = await raw_coll.count_documents({
            "isEasyApply": False,
            "isMatureJob": False,
            "linkPassed": False
        })
        logger.info(f"Total documents matching filter: {total_count}")
        
        # Use a consistent snapshot by getting all matching IDs first
        cursor = raw_coll.find(
            {
                "isEasyApply": False,
                "isMatureJob": False,
                "linkPassed": False
            },
            {"_id": 1}
        ).limit(worker_count * queue_max)
        
        # Get all matching IDs
        doc_ids = [doc["_id"] async for doc in cursor]
        logger.info(f"Found {len(doc_ids)} documents to process in this batch")
        
        if not doc_ids:
            return []
            
        # Now fetch the full documents for these IDs
        # This ensures we get a consistent set of documents
        cursor = raw_coll.find({"_id": {"$in": doc_ids}})
        docs = [doc async for doc in cursor]
        
        # Double check that none of these documents were processed while we were getting them
        docs = [doc for doc in docs if not (
            doc.get("isEasyApply", False) or 
            doc.get("isMatureJob", False) or 
            doc.get("linkPassed", False)
        )]
        
        logger.info(f"Returning {len(docs)} documents for processing")
        return docs
        
    except Exception as e:
        logger.error(f"Error fetching documents: {str(e)}")
        return []
