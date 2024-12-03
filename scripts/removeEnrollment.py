from sqlalchemy.orm import query_expression

from database import execute_query_dict


def removeEnroll(user_id,class_Id):
    query="""
    DELETE FROM enrollment where user_id= :user_id and class_Id=:class_Id"""
    params= {'user_id': user_id, 'class_Id': class_Id}
    return execute_query_dict(query,params)
