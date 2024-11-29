from database import *
from sqlalchemy import text
from database import execute_query

def DeleteEnrollment(class_id, user_id):
    query = """
    DELETE FROM Enrollment
    WHERE Class_ID = :class_id AND User_ID = :user_id;
    """
    params = {
        "class_id": class_id,
        "user_id": user_id
    }
    return execute_query(query, params)
