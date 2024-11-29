from sqlalchemy import create_engine
import json
from sqlalchemy import text
import logging
from datetime import date, time, datetime, timedelta
from decimal import Decimal
#connection_string = "mssql+pyodbc://ALFS_DB:Ew6uEb8Y@apollo.in.cs.ucy.ac.cy/ALFS_DB?driver=ODBC+Driver+17+for+SQL+Server"
# Connection string
connection_string = "mssql+pyodbc://localhost/343?driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(connection_string, isolation_level="AUTOCOMMIT")



logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.DEBUG)

def execute_query(query: str, params=None):
    """
    Executes an SQL query and processes the results based on the query type.
    Handles the connection lifecycle automatically.

    Args:
        query (str): The SQL query string to be executed.
        params (dict or tuple): Query parameters as a dictionary or tuple.

    Returns:
        bool or str: True/False for write queries, JSON string for SELECT queries.
    """
    try:
        # Establish a database connection
        with engine.connect() as connection:
            # Prepare the query
            stmt = text(query)
            query_type = query.strip().split(" ", 1)[0].upper()

            # Handle INSERT, UPDATE, DELETE queries
            if query_type in ['INSERT', 'UPDATE', 'DELETE']:
                try:
                    with connection.begin():  # Start a transaction
                        connection.execute(stmt, params or {})
                    return True
                except Exception as write_error:
                    print(f"Write query error: {write_error}")
                    return False

            # Handle SELECT queries
            elif query_type == 'SELECT':
                try:
                    result = connection.execute(stmt, params or {})
                    rows = result.fetchall()
                    
                    # Convert rows to dictionaries and handle non-serializable types
                    def serialize_row(row):
                        return {
                            key: (
                                value.isoformat() if isinstance(value, (date, time, datetime))
                                else float(value) if isinstance(value, Decimal)
                                else value
                            )
                            for key, value in row._mapping.items()
                        }

                    results = [serialize_row(row) for row in rows]
                    return json.dumps(results)
                except Exception as read_error:
                    print(f"SELECT query error: {read_error}")
                    return False

            else:
                print(f"Unsupported query type: {query_type}")
                return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False


if __name__ == '__main__':
    with engine.connect() as connection:
         print("Database module loaded.")