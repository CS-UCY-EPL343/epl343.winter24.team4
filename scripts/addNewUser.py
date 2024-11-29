from database import *
from sqlalchemy import text
from database import execute_query

def AddNewUserToDb(Fname, Lname, Email, Password):
    """
    Adds a new user to the database using the execute_query function.

    Args:
        Fname (str): First name of the user.
        Lname (str): Last name of the user.
        Email (str): Email address of the user.
        Password (str): Password of the user.

    Returns:
        bool: True if the user was added successfully, False otherwise.
    """
    qry = """INSERT INTO Users (Fname, Lname, Email, Password) VALUES (:Fname, :Lname, :Email, :Password);"""
    
    # Use execute_query to handle the insertion
    return execute_query(qry, Fname=Fname, Lname=Lname, Email=Email, Password=Password)
