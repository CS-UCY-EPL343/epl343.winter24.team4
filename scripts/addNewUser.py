from database import *
from sqlalchemy import text

def AddNewUserToDb(Fname,Lname,Email,Password):
    qry = """INSERT INTO Users (Fname, Lname, Email, Password) VALUES (:Fname, :Lname, :Email, :Password);"""
    
    with engine.connect() as connection:
        connection.execute(
            text(qry),
            {"Fname": Fname, "Lname": Lname, "Email": Email, "Password": Password}
        )
        connection.commit()
        connection.close()   