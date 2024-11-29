from database import *
from sqlalchemy import text
from database import execute_query

def AddClass(date, time_start, time_end, max_capacity, price, ex_id):
    query = """
    INSERT INTO Class (Date, Time_start, Time_end, Max_capacity, Price, Ex_ID)
    VALUES (:date, :time_start, :time_end, :max_capacity, :price, :ex_id);
    """
    params = {
        "date": date,
        "time_start": time_start,
        "time_end": time_end,
        "max_capacity": max_capacity,
        "price": price,
        "ex_id": ex_id
    }
    return execute_query(query, params)
