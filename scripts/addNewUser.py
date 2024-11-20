from database import *
from sqlalchemy import text

def AddNewUserToDb(Fname,Lname,Email,Password):
    qry=f"""INSERT INTO [Users] ([Fname],[Lname],[Email],[Password]) Values({Fname},{Lname},{Email},{Password});"""
    with engine.connect() as connection:
        connection.execute(text(qry))
        connection.commit()
        connection.close()