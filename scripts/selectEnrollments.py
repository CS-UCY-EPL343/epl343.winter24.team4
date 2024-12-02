from database import *
from sqlalchemy import text
from database import execute_query


def SelectUserEnrollments(user_id=None):
    if user_id is not None:
        query = """
        SELECT 
            c.Class_ID,
            et.Name ,
            c.Date ,
            c.Time_start,
            c.Time_end ,
            e.Attendance_Status
        FROM 
            Enrollment e
        JOIN 
            Class c ON e.Class_ID = c.Class_ID
        JOIN 
            Exercise_Type et ON c.Ex_ID = et.Ex_ID
        WHERE 
            e.User_ID = :user_id;
        """
        params = {"user_id": user_id}
        return execute_query(query, params)
    else:
        return "Invalid input. Provide a valid User_ID."
