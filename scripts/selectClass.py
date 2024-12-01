from database import *
from sqlalchemy import text
from database import execute_query

def SelectClass(time_start=None, date=None, class_id=None):
    try:
        if class_id is not None:
            query = """
            SELECT * FROM Class
            WHERE Class_ID = :class_id;
            """
            params = {"class_id": class_id}
            return execute_query(query, params)
        
        elif time_start is not None and date is not None:
            query = """
            SELECT * FROM Class
            WHERE Time_start = :time_start AND Date = :date;
            """
            params = {"time_start": time_start, "date": date}
            return execute_query(query, params)
        
        else:
            return "Invalid query parameters. Provide either class_id or both time_start and date."
    except Exception as e:
        return f"An error occurred: {str(e)}"

    
def SelectAllClasses():
    query = """
    SELECT * FROM Class;
    """
    return execute_query(query)

def SelectUsersOfClass(time_start=None, date=None, class_id=None):
    if class_id is not None:
        query = """
        SELECT 
            u.User_ID, 
            u.FName, 
            u.LName, 
            u.Email, 
            u.Phone, 
            e.Attendance_Status
        FROM 
            Enrollment e
        JOIN 
            Users u 
        ON 
            e.User_ID = u.User_ID
        WHERE 
            e.Class_ID = :class_id;
        """
        params = {"class_id": class_id}
        return execute_query(query, params)
    elif time_start is not None and date is not None:
        class_result = SelectClass(time_start=time_start, date=date)
        class_data = json.loads(class_result)

        if class_data and isinstance(class_data, list) and len(class_data) > 0:
            class_id = class_data[0].get("Class_ID")
            if class_id:
                return SelectUsersOfClass(class_id=class_id)
            else:
                return "Class_ID not found in the provided class data."
        else:
            return "No class found for the specified date and time."
    else:
        return "Invalid input. Provide either Class_ID or both Time_Start and Date."

def selectWeekClasses(start_date,end_date):
    query=  """
           SELECT 
                Class.Class_ID,
                Class.Date,
                Class.Time_start,
                Class.Time_end,
                Class.Max_capacity,
                Class.Price,
                Exercise_Type.Name AS Exercise_Type,
                (Class.Max_capacity - COALESCE(COUNT(Enrollment.User_ID), 0)) AS Remaining_Capacity
            FROM 
                Class
            JOIN 
                Exercise_Type ON Class.Ex_ID = Exercise_Type.Ex_ID
            LEFT JOIN 
                Enrollment ON Class.Class_ID = Enrollment.Class_ID
            WHERE 
                Class.Date BETWEEN :start_date AND :end_date
            GROUP BY 
                Class.Class_ID, 
                Class.Date, 
                Class.Time_start, 
                Class.Time_end, 
                Class.Max_capacity, 
                Class.Price, 
                Exercise_Type.Name
            """
    params = {"start_date": start_date, "end_date": end_date}
    return execute_query_dict(query, params)

