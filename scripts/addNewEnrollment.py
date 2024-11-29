from database import *
from sqlalchemy import text
from database import execute_query

def AddEnrollment(class_id, user_id, attendance_status=0):
    query = """
    INSERT INTO Enrollment (Class_ID, User_ID, Attendance_Status)
    VALUES (:class_id, :user_id, :attendance_status);
    """
    params = {
        "class_id": class_id,
        "user_id": user_id,
        "attendance_status": attendance_status
    }
    return execute_query(query, params)
