from database import *
from sqlalchemy import text
from database import execute_query

def AddNewUserToDb(Fname, Lname, Email, Password, Birthday=None, Phone=None):
    """
    Adds a new user to the database using the execute_query function.

    Args:
        Fname (str): First name of the user.
        Lname (str): Last name of the user.
        Email (str): Email address of the user.
        Password (str): Password of the user.
        Birthday (str, optional): Birthday of the user in 'YYYY-MM-DD' format. Defaults to None.
        Phone (str, optional): Phone number of the user. Defaults to None.

    Returns:
        bool: True if the user was added successfully, False otherwise.
    """
    qry = """
    INSERT INTO Users (Fname, Lname, Email, Password, Birthday, Phone)
    VALUES (:Fname, :Lname, :Email, :Password, :Birthday, :Phone);
    """
    
    # Pass parameters as a dictionary
    params = {
        "Fname": Fname,
        "Lname": Lname,
        "Email": Email,
        "Password": Password,
        "Birthday": Birthday,
        "Phone": Phone
    }
    print("Executing query:", qry)
    print("With parameters:", params)
    return execute_query(qry, params)