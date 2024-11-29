from database import *
from sqlalchemy import text
from database import execute_query

def delete_class(class_id):
    query = """
    DELETE FROM Class
    WHERE Class_ID = ?;
    """
    return execute_query(query, class_id)
