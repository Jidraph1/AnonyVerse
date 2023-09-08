-- Create the AddComment stored procedure


USE anonyverse 
GO

CREATE OR ALTER PROCEDURE AddComment
    @commentid NVARCHAR(200),
    @postid NVARCHAR(200),
    @userid VARCHAR(200),
    @commentText NVARCHAR(1000),
    @commentDate DATETIME
AS
BEGIN
    -- Insert a comment into the Comments table
    INSERT INTO Comments (commentid, postid, userid, commentText, commentDate)
    VALUES (@commentid, @postid, @userid, @commentText, @commentDate);
    -- Return a success message
    SELECT 'Comment added successfully' AS Message;
END;
GO


-- DROP PROCEDURE AddComment;