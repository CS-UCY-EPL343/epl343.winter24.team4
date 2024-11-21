from sqlalchemy import create_engine
import json

connection_string = "mssql+pyodbc://ALFS_DB:Ew6uEb8Y@apollo.in.cs.ucy.ac.cy/ALFS_DB?driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(connection_string)

def execute_query(query: str, *params):
    """
    Executes an SQL query and processes the results based on the query type.
    Handles the connection lifecycle automatically.

    Args:
        query (str): The SQL query string to be executed.
        *params: Variable length arguments for query parameters.

    Returns:
        bool or str: True/False for write queries, JSON string for SELECT queries.
    """
    try:
        with engine.connect() as connection:
            result = connection.execute(query, *params)
            
            # Check query type
            query_type = query.strip().split(" ", 1)[0].upper()
            if query_type in ['INSERT', 'UPDATE', 'DELETE']:
                # Commit changes if it's a write query
                connection.commit()
                return True
            elif query_type == 'SELECT':
                # Fetch results for SELECT queries
                rows = result.fetchall()
                # Convert to JSON string
                results = [dict(row) for row in rows]
                return json.dumps(results)
            else:
                # Unsupported query type
                return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False



if __name__ == '__main__':
    with engine.connect() as connection:
         print("Database module loaded.")