from database import *
from database import execute_query

def getAllUsers():
    query = """
    SELECT User_id, FName, LName 
    FROM USERS
    """

    return execute_query(query)

from database import execute_query_dict

def getUserClassesForMonth(user_identifier, month):
    """
    Fetches the classes for a specific user and month.

    Args:
        user_identifier (int or str): User ID or full username (first + last name).
        month (str): The month in 'yyyy-MM' format.

    Returns:
        None: Prints the class details or an error message.
    """
    query = """
    SELECT 
        c.Date,
        c.Time_start,
        c.Time_end,
        c.Class_ID,
        c.Price
    FROM 
        Enrollment e
    INNER JOIN 
        Class c ON e.Class_ID = c.Class_ID
    INNER JOIN 
        Users u ON e.User_ID = u.User_ID
    WHERE 
        (u.User_ID = :userid OR u.FName + ' ' + u.LName = :username)
        AND FORMAT(c.Date, 'yyyy-MM') = :month
    ORDER BY 
        c.Date, c.Time_start;
    """

    # Prepare parameters based on input type
    params = {
        "userid": user_identifier if isinstance(user_identifier, int) else None,
        "username": user_identifier if isinstance(user_identifier, str) else None,
        "month": month
    }

    # Execute query
    result = execute_query_dict(query, params)