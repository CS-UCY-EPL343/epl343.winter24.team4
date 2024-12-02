from database import *
from sqlalchemy import text
from database import execute_query

def SelectUserByName(first_name=None, last_name=None):
    try:
        if first_name and last_name:
            query = """
            SELECT User_ID, FName, LName, Email
            FROM Users
            WHERE FName = :first_name AND LName = :last_name;
            """
            params = {"first_name": first_name, "last_name": last_name}
        elif first_name:
            query = """
            SELECT User_ID, FName, LName, Email
            FROM Users
            WHERE FName = :first_name;
            """
            params = {"first_name": first_name}
        elif last_name:
            query = """
            SELECT User_ID, FName, LName, Email
            FROM Users
            WHERE LName = :last_name;
            """
            params = {"last_name": last_name}
        else:
            return "Invalid query parameters. Provide at least one of first_name or last_name."
        
        return execute_query(query, params)
    except Exception as e:
        return f"An error occurred: {str(e)}"