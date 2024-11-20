from flask import Flask
from backend.blueprints import register_blueprints  
from sqlalchemy import create_engine, text


def create_app():
    app = Flask(__name__)
    register_blueprints(app)  

    return app


if __name__ == '__main__':
    app = create_app()  

    connection_string = "mssql+pyodbc://ALFS_DB:Ew6uEb8Y@apollo.in.cs.ucy.ac.cy/ALFS_DB?driver=ODBC+Driver+17+for+SQL+Server"

    engine = create_engine(connection_string)  #with engine.connect as connection:
    
    #with engine.connect() as connection:
    #    connection.execute(text(qry))
    #    connection.commit()
    #    connection.close()
    #    print('done')   
    
    
    app.run(debug=True)  
    