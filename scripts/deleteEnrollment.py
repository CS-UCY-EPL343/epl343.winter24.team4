from database import *
from sqlalchemy import text
from database import execute_query

def delete_enrollment(class_id, user_id):
    query = """
    DELETE FROM Enrollment
    WHERE Class_ID = ? AND User_ID = ?;
    """
    return execute_query(query, class_id, user_id)
