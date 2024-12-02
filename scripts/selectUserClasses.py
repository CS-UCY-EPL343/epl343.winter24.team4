from database import execute_query_dict

def getUserClassesForMonth(userid, month):
    
    query = """
    SELECT 
        c.Date,
        c.Class_ID,
        c.Price
    FROM 
        Enrollment e
    INNER JOIN 
        Class c ON e.Class_ID = c.Class_ID
    INNER JOIN 
        Users u ON e.User_ID = u.User_ID
    WHERE 
        (u.User_ID = :userid OR u.FName + ' ' + u.LName = :username)
        AND FORMAT(c.Date, 'yyyy-MM') = :month
    ORDER BY 
        c.Date;
    """

    # Prepare parameters based on input type
    params = {
        "userid": userid,
        "month": month
    }

    # Execute query
    return execute_query_dict(query, params)