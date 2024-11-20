USE ALFS_DB

CREATE TABLE [Users] (
    [User_ID] INT IDENTITY,
    [FName] NVARCHAR(100) NOT NULL,
    [Lname] NVARCHAR(100) NOT NULL,
    [Email] VARCHAR(255) NOT NULL UNIQUE,
    [Password] NVARCHAR(255) NOT NULL,
    [Birthday] DATE,
    [Phone] NVARCHAR(15),
    [Temporary] BIT NOT NULL DEFAULT 0,
    [Registration_Date] DATE NOT NULL DEFAULT GETDATE(),
    [isAdmin] BIT NOT NULL DEFAULT 0,
    [Balance] DECIMAL(10, 2) DEFAULT 0.00,
    CONSTRAINT [PK_Users] PRIMARY KEY ([User_ID])
);

CREATE TABLE Exercise_Type (
    [Ex_ID] INT IDENTITY,
    [Name] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK_Exercise_Type] PRIMARY KEY ([Ex_ID])
);

CREATE TABLE Class (
    [Class_ID] INT IDENTITY,
    [Date] DATE NOT NULL,
    [Time_start] TIME NOT NULL,
    [Time_end] TIME NOT NULL,
    [Max_capacity] INT NOT NULL,
    [Price] DECIMAL(10, 2) NOT NULL,
    [Ex_ID] INT NOT NULL,
    CONSTRAINT [PK_Class] PRIMARY KEY ([Class_ID])
);

CREATE TABLE Enrollment (
    [Class_ID] INT NOT NULL,
    [User_ID] INT NOT NULL,
    [Attendance_Status] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Enrollment] PRIMARY KEY ([Class_ID], [User_ID])
);

CREATE TABLE Payment_Type (
    [Payment_Type_ID] INT IDENTITY,
    [P_Name] NVARCHAR(50) NOT NULL,
    CONSTRAINT [PK_Payment_Type] PRIMARY KEY ([Payment_Type_ID])
);

CREATE TABLE Payment (
    [Payment_ID] INT IDENTITY,
    [Amount] SMALLMONEY NOT NULL,
    [Payment_Datetime] DATETIME NOT NULL DEFAULT GETDATE(),
    [User_ID] INT NOT NULL,
    [Payment_Type_ID] INT NOT NULL,
    CONSTRAINT [PK_Payment] PRIMARY KEY ([Payment_ID])
);

-- Add foreign keys using ALTER TABLE
ALTER TABLE Class
ADD CONSTRAINT [FK_Class_Exercise_Type] FOREIGN KEY ([Ex_ID]) REFERENCES [Exercise_Type]([Ex_ID]);

ALTER TABLE Enrollment
ADD CONSTRAINT [FK_Enrollment_Class] FOREIGN KEY ([Class_ID]) REFERENCES [Class]([Class_ID]),
CONSTRAINT [FK_Enrollment_Users] FOREIGN KEY ([User_ID]) REFERENCES [Users]([User_ID]);

ALTER TABLE Payment
ADD CONSTRAINT [FK_Payment_Users] FOREIGN KEY ([User_ID]) REFERENCES [Users]([User_ID]),
CONSTRAINT [FK_Payment_Payment_Type] FOREIGN KEY ([Payment_Type_ID]) REFERENCES [Payment_Type]([Payment_Type_ID]);