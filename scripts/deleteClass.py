from database import *
from sqlalchemy import text
from database import execute_query

def DeleteClass(class_id):
    query = """
    DELETE FROM Class
    WHERE Class_ID = :class_id;
    """
    params = {"class_id": class_id}
    return execute_query(query, params)