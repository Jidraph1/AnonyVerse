USE anonyverse
GO


-- Create Posts Procedure
CREATE or ALTER PROCEDURE CreatePostProcedure
    @postid NVARCHAR(200),
    @userid NVARCHAR(200),
    @postCaption NVARCHAR(500),
    @postImage NVARCHAR(200),
    @postDate DATETIME
AS
BEGIN
    INSERT INTO Posts (postid, userid, postCaption, postImage, postDate)
    VALUES (@postid, @userid, @postCaption, @postImage, @postDate);
END;
GO

SELECT * FROM Posts
GO

-- Get all Posts Procedure

CREATE OR ALTER PROCEDURE GetAllPosts
AS
BEGIN
    SELECT
        postid,userid,postCaption,postImage,likesCount,postDate
    FROM Posts
    ORDER BY postDate DESC;
END;
GO

-- EXEC GetAllPosts;
-- GO

-- DElete post

CREATE PROCEDURE DeletePostProcedure
    @postid NVARCHAR(200)
AS
BEGIN
    DELETE FROM Posts
    WHERE postid = @postid;
END;
GO
