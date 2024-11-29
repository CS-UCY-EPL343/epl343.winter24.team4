from database import *
from sqlalchemy import text
from database import execute_query

def update_enrollment(class_id, user_id, attendance_status):
    query = """
    UPDATE Enrollment
    SET Attendance_Status = ?
    WHERE Class_ID = ? AND User_ID = ?;
    """
    return execute_query(query, attendance_status, class_id, user_id)
