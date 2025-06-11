from flask import Blueprint
from .controller import handle_request

mature_job_bp = Blueprint('mature_job', __name__)

@mature_job_bp.route('/mature-job', methods=['POST'])
def route_mature_job():
    return handle_request()
