from database import execute_query_dict

def getUserClassesMonth(userid):
    query = query = """
    SELECT 
        FORMAT(c.Date, 'yyyy-MM') AS Month,
        COUNT(e.Class_ID) AS NumberOfClasses,
        SUM(c.Price) AS TotalPriceOwed
    FROM 
        Enrollment e
    INNER JOIN 
        Class c ON e.Class_ID = c.Class_ID
    INNER JOIN 
        Users u ON e.User_ID = u.User_ID
    WHERE 
        u.User_ID = :userid
        AND e.Attendance_Status = 1
    GROUP BY 
        FORMAT(c.Date, 'yyyy-MM')
    ORDER BY 
        Month;
    """
    params = {"userid": userid}

    
    return execute_query_dict(query, params)
    

