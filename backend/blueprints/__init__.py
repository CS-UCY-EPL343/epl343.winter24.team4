from .main import main
from .api import api
from .auth import auth  

# Register all blueprints to app
def register_blueprints(app):
    app.register_blueprint(main)
    app.register_blueprint(api)
    app.register_blueprint(auth) 
    