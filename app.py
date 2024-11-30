import secrets

from flask import Flask
from backend.blueprints import register_blueprints 




def create_app():
    app = Flask(__name__)
    app.secret_key = secrets.token_hex(32)
    register_blueprints(app)

    return app


if __name__ == '__main__':
    app = create_app()  

    app.run(debug=True)  
    