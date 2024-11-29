from database import *
from sqlalchemy import text
from database import execute_query

def update_class(class_id, date=None, time_start=None, time_end=None, max_capacity=None, price=None, ex_id=None):
    updates = []
    params = []

    if date:
        updates.append("Date = ?")
        params.append(date)
    if time_start:
        updates.append("Time_start = ?")
        params.append(time_start)
    if time_end:
        updates.append("Time_end = ?")
        params.append(time_end)
    if max_capacity:
        updates.append("Max_capacity = ?")
        params.append(max_capacity)
    if price:
        updates.append("Price = ?")
        params.append(price)
    if ex_id:
        updates.append("Ex_ID = ?")
        params.append(ex_id)

    if not updates:
        return False  # No updates provided

    query = f"""
    UPDATE Class
    SET {", ".join(updates)}
    WHERE Class_ID = ?;
    """
    params.append(class_id)
    return execute_query(query, *params)
