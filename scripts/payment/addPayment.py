from database import *
from sqlalchemy import text
from database import execute_query


def addPayment(userid, amount, payment_type):
    query = """
    INSERT INTO Payment (Amount, User_ID, Payment_Type_ID)
    VALUES (:amount, :userid, :payment_type);
    """
    params = {
        "amount": amount,
        "userid": userid,
        "payment_type": payment_type,
    }
    return execute_query(query, params)

if __name__ == "__main__":
    addPayment(11,20,1)