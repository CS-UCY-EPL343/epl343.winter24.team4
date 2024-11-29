from database import *
from sqlalchemy import text
from database import execute_query

def GetAllExerciseTypes():
    query = "SELECT * FROM Exercise_Type;"
    return execute_query(query)