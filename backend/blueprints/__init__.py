from .main import main
from .calendar import calendar
from .auth import auth
from .payment import payment
from .admin import admin


# Register all blueprints to app
def register_blueprints(app):
    app.register_blueprint(main)
    app.register_blueprint(calendar)
    app.register_blueprint(auth)
    app.register_blueprint(payment)
    app.register_blueprint(admin)
    