from database import *
from database import execute_query
from database import execute_query_dict


def getAllUsers():
    query = """
    SELECT User_id, FName, LName 
    FROM USERS
    """

    return execute_query_dict(query)


def getUserClasses(user_identifier):
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
        c.Class_ID,
        c.Date AS Class_Date,
        c.Time_start,
        c.Time_end,
        c.Price,
        CASE 
            WHEN p.Payment_ID IS NOT NULL THEN 'Paid'
            ELSE 'Not Paid'
        END AS Payment_Status
    FROM 
        Enrollment e
    JOIN 
        Class c ON e.Class_ID = c.Class_ID
    LEFT JOIN 
        Payment p ON e.User_ID = p.User_ID AND e.Class_ID = p.Class_ID
    WHERE 
        e.User_ID = :userid and c.Date<getDate(); 

    """

    # Prepare parameters based on input type
    params = {
        "userid": user_identifier
    }

    # Execute query
    return execute_query_dict(query, params)

def getUserData(userid):
    query = """
    SELECT 
        SELECT  *
        FROM USERS AS U
        where U.User_ID=:userid
    """