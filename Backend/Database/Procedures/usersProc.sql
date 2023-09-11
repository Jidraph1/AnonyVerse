USE anonyverse 
GO

-- Register User
CREATE OR ALTER PROC uspRegisterUser (@userid VARCHAR(200), @username VARCHAR(200), @email VARCHAR(200), @password VARCHAR(200)) AS
BEGIN
    INSERT INTO Users(userid, username,email,[password])
    VALUES(@userid,@username, @email,@password)
END;
GO


-- Get User
CREATE OR ALTER PROC uspGetUser (@email VARCHAR(200)) AS
BEGIN
    SELECT password, username, email, userid from users WHERE email = @email
END;
GO

-- Update Profile
CREATE PROCEDURE uspUpdateUserProfile
    @userid VARCHAR(200),
    @profilePicture NVARCHAR(200),
    @bio NVARCHAR(MAX)
AS
BEGIN
    UPDATE Users
    SET profilePicture = @profilePicture,
        bio = @bio
    WHERE userid = @userid;
END;
GO



SELECT * FROM Users
GO
SELECT * FROM Posts
GO

SELECT * FROM Followees