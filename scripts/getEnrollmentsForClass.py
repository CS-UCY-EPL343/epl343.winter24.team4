from database import *
from database import execute_query_dict

def getEnrollmentsForClass(class_id):
    query = """
    SELECT E.User_ID, U.FName, U.LName, U.Email, U.Phone
    FROM USERS U , ENROLLMENT E
    WHERE Class_ID = :class_id AND E.User_ID = U.User_ID
    """
    params = {
        "class_id": class_id
    }

    return execute_query_dict(query, params)