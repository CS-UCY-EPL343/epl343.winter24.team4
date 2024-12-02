from database import *
from sqlalchemy import text
from database import execute_query


def addPayment(userid, class_id, payment_type):
    query = """
    INSERT INTO Payment  (User_ID, Class_ID, Payment_Type_ID)
    VALUES (:amount, :userid, :payment_type);
    """
    params = {
        "class_id": class_id,
        "userid": userid,
        "payment_type": payment_type
    }
    return execute_query_dict(query, params)

if __name__ == "__main__":
    addPayment(11,20,1)