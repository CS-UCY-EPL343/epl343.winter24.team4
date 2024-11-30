from database import execute_query, execute_query_dict


def checkUserCredentials(Email):

    query = """
        SELECT *
        FROM [Users]
        WHERE [Email] = :email
        """

    # Pass parameters as a dictionary
    params = {
        "email": Email,
    }

    return execute_query_dict(query, params)