
USE ALFS
-- Drop foreign key constraints and tables in the correct order
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID('FK_Enrollment_Class'))
BEGIN
    ALTER TABLE Enrollment DROP CONSTRAINT FK_Enrollment_Class;
END;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID('FK_Enrollment_Users'))
BEGIN
    ALTER TABLE Enrollment DROP CONSTRAINT FK_Enrollment_Users;
END;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID('FK_Class_Exercise_Type'))
BEGIN
    ALTER TABLE Class DROP CONSTRAINT FK_Class_Exercise_Type;
END;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID('FK_Payment_Users'))
BEGIN
    ALTER TABLE Payment DROP CONSTRAINT FK_Payment_Users;
END;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID('FK_Payment_Payment_Type'))
BEGIN
    ALTER TABLE Payment DROP CONSTRAINT FK_Payment_Payment_Type;
END;

-- Drop tables
IF OBJECT_ID('[Enrollment]', 'U') IS NOT NULL DROP TABLE [Enrollment];
IF OBJECT_ID('[Payment]', 'U') IS NOT NULL DROP TABLE [Payment];
IF OBJECT_ID('[Class]', 'U') IS NOT NULL DROP TABLE [Class];
IF OBJECT_ID('[Exercise_Type]', 'U') IS NOT NULL DROP TABLE [Exercise_Type];
IF OBJECT_ID('[Payment_Type]', 'U') IS NOT NULL DROP TABLE [Payment_Type];
IF OBJECT_ID('[Users]', 'U') IS NOT NULL DROP TABLE [Users];



CREATE TABLE [Users] (
    [User_ID] INT PRIMARY KEY IDENTITY,
    [FName] VARCHAR(100) NOT NULL,
    [Lname] VARCHAR(100) NOT NULL,
    [Email] VARCHAR(255) NOT NULL UNIQUE,
    [Password] VARCHAR(255) NOT NULL,
    [Birthday] DATE,
    [Phone] varchar(15),
    [Temporary] BIT NOT NULL DEFAULT 0,
    [Registration_Date] DATE NOT NULL DEFAULT GETDATE(),
    [isAdmin] BIT NOT NULL DEFAULT 0,
    [Balance] DECIMAL(10, 2) DEFAULT 0.00
);


CREATE TABLE Exercise_Type (
    [Ex_ID] INT PRIMARY KEY IDENTITY,
    [Name] VARCHAR(100) NOT NULL
);


CREATE TABLE Class (
    [Class_ID] INT PRIMARY KEY IDENTITY,
    [Date] DATE NOT NULL,
    [Time_start] TIME NOT NULL,
    [Time_end] TIME NOT NULL,
    [Max_capacity] INT NOT NULL,
    [Price] DECIMAL(10, 2) NOT NULL,
    [Ex_ID] INT NOT NULL FOREIGN KEY REFERENCES Exercise_Type([Ex_ID])
);


CREATE TABLE Enrollment (
    [Class_ID] INT NOT NULL FOREIGN KEY REFERENCES Class([Class_ID]),
    [User_ID] INT NOT NULL FOREIGN KEY REFERENCES [Users](User_ID),
    [Attendance_Status] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Enrollment] PRIMARY KEY ([Class_ID], [User_ID])
);


CREATE TABLE Payment_Type (
    [Payment_Type_ID] INT IDENTITY,
    [P_Name] VARCHAR(50) NOT NULL
    CONSTRAINT [PK_Payment_Type] PRIMARY KEY ([Payment_Type_ID])
);


CREATE TABLE Payment (
    [Payment_ID] INT IDENTITY,
    [Amount] DECIMAL(10, 2) NOT NULL,
    [Payment_Datetime] DATETIME NOT NULL DEFAULT GETDATE(),
    [User_ID] INT NOT NULL FOREIGN KEY REFERENCES [Users]([User_ID]),
    [Payment_Type_ID] INT NOT NULL FOREIGN KEY REFERENCES Payment_Type([Payment_Type_ID])
    CONSTRAINT [PK_Payment] PRIMARY KEY ([Payment_ID])
);
