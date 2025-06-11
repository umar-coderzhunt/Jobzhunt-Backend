import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("DB_NAME", "")
RAW_COLL = "rawJobs"
CREATE_API = os.getenv("CREATE_API", "")

# LinkedIn API URLs
LINKEDIN_JOB_POSTING_API = os.getenv("LINKEDIN_JOB_POSTING_API", "")

WORKER_COUNT = int(os.getenv("WORKER_COUNT", ""))
QUEUE_MAX = int(os.getenv("QUEUE_MAX", ""))
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", ""))

# Flask specific settings
PORT = int(os.getenv("FLASK_APP_PORT", ""))
HOST = os.getenv("FLASK_APP_HOST", "")