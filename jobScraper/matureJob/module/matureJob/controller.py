from flask import jsonify
import logging
from asgiref.sync import async_to_sync
from .service import run_pipeline

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def handle_request():
    logger.info("Received request to /mature-job endpoint")
    try:
        logger.info("Starting pipeline execution")
        # Convert async function to sync using asgiref
        result = async_to_sync(run_pipeline)()
        logger.info(f"Pipeline completed successfully: {result}")
        return jsonify({"status": "success", "detail": result})
    except Exception as e:
        logger.error(f"Error in pipeline execution: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "detail": str(e)}), 500
