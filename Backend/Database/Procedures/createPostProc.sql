CREATE or ALTER PROCEDURE CreatePostProcedure
    @postid NVARCHAR(255),
    @userid NVARCHAR(255),
    @postCaption NVARCHAR(500),
    @postImage NVARCHAR(255),
    @postDate DATETIME
AS
BEGIN
    INSERT INTO Posts (postid, userid, postCaption, postImage, postDate)
    VALUES (@postid, @userid, @postCaption, @postImage, @postDate);
END;