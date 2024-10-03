from flask import Flask
from blueprints import *  

def create_app():
    app = Flask(__name__)

    register_blueprints(app)

    return app



if __name__ == '__main__':
    app = create_app()  
    app.run(debug=True)  
    