from database import *
from sqlalchemy import text
from database import execute_query

def PaymentTypes():
    query = """
        Select * from Payment_Type
        """
    return execute_query_dict(query)
