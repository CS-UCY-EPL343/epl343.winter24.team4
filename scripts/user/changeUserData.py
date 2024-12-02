from database import execute_query, execute_query_dict

def getInfoFromUserId(user_id):
    query = """
                SELECT *
                FROM [Users]
                WHERE [user_id] = :user_id
                """

    # Pass parameters as a dictionary
    params = {
        "user_id": user_id,
    }

    return execute_query_dict(query, params)

def changePassword(new_password, user_id):
    query="""
    UPDATE [Users] SET PASSWORD= :new_password where user_id=:user_id"""
    params = {
        "new_password":new_password,
        "user_id":user_id,
    }
    return execute_query_dict(query, params)

def changeEmail(new_email, user_id):
    query="""
    UPDATE [Users] SET EMAIL= :new_email where user_id=:user_id"""
    params = {
        "new_email":new_email,
        "user_id":user_id,
    }
    return execute_query_dict(query, params)