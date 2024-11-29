from database import *
from sqlalchemy import text
from database import execute_query

def insert_class(date, time_start, time_end, max_capacity, price, ex_id):
    query = """
    INSERT INTO Class (Date, Time_start, Time_end, Max_capacity, Price, Ex_ID)
    VALUES (?, ?, ?, ?, ?, ?);
    """
    return execute_query(query, date, time_start, time_end, max_capacity, price, ex_id)
