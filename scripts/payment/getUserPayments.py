from database import *
from sqlalchemy import text
from database import execute_query


def getUserPayments(userid):
    query = """
    SELECT * FROM PAYMENT P
    WHERE P.User_ID = :userid
    """
    params = {
        "userid": userid,
    }
    return execute_query_dict(query, params)

if __name__ == "__main__":
    print(getUserPayments(11))