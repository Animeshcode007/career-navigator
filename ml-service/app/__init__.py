from flask import Flask

from app.routes import api


def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 64 * 1024

    app.register_blueprint(api, url_prefix="/api")

    return app