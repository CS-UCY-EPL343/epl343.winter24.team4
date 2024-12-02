from database import *
from database import execute_query_dict

def getClassEnrollments(class_id):
    query = """
    SELECT * FROM Enrollment AS E
    WHERE E.Class_ID = :class_id;
    """
    params = {
        "class_id": class_id
    }

    return execute_query_dict(query, params)