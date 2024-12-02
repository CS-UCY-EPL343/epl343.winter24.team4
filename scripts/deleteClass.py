from database import *
from sqlalchemy import text
from database import execute_query

def DeleteClass(class_id):
    query = """
    BEGIN TRANSACTION;
    DELETE FROM Enrollment
    WHERE Class_ID = :class_id;
    DELETE FROM Class
    WHERE Class_ID = :class_id;
    COMMIT TRANSACTION;
    """
    params = {"class_id": class_id}
    return execute_query(query, params)
