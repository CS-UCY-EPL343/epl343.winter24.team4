from sqlalchemy import create_engine

connection_string = "mssql+pyodbc://ALFS_DB:Ew6uEb8Y@apollo.in.cs.ucy.ac.cy/ALFS_DB?driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(connection_string)

if __name__ == '__main__':
    with engine.connect() as connection:
        print("kostis")#with engine.connect as connection: