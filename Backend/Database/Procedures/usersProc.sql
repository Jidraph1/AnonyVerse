USE anonyverse 
GO


CREATE OR ALTER PROC uspRegisterUser (@userid VARCHAR(200), @username VARCHAR(200), @email VARCHAR(200), @password VARCHAR(200)) AS
BEGIN
    INSERT INTO Users(userid, username,email,[password])
    VALUES(@userid,@username, @email,@password)
END;
GO

CREATE OR ALTER PROC uspGetUser (@email VARCHAR(200)) AS
BEGIN
    SELECT password, username, email, userid from users WHERE email = @email
END;
GO

SELECT * FROM Users
GO
SELECT * FROM Posts
GO

