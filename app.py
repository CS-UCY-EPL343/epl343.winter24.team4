from flask import Flask
from backend.blueprints import register_blueprints 




def create_app():
    app = Flask(__name__)
    register_blueprints(app)  

    return app


if __name__ == '__main__':
    app = create_app()  

    app.run(debug=True)  
    
    #result = add_new_user_to_db('pantelis', 'kanaris', 'pasok@gmail.com', '123abc', '12-1-2004', '23424524')