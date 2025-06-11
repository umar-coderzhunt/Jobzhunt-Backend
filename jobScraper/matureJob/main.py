from flask import Flask
from module.matureJob.routes import mature_job_bp
from config.config import PORT, HOST

def create_app():
    app = Flask(__name__)
    app.register_blueprint(mature_job_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host=HOST, port=PORT)
