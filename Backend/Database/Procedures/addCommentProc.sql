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


-- DROP PROC DeleteComment
CREATE OR ALTER PROCEDURE DeleteComment
    @commentid NVARCHAR(200),
    @userid VARCHAR(200)
AS
BEGIN
    -- Check if the user making the request is the owner of the comment
    IF EXISTS (
        SELECT 1
        FROM Comments
        WHERE commentid = @commentid
            AND userid = @userid
    )
    BEGIN
        -- Delete the specified comment
        DELETE FROM Comments
        WHERE commentid = @commentid;
        
        -- Return a success message
        SELECT 'Comment deleted successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Throw a custom error message
        THROW 50001, 'You are not authorized to delete this comment.', 1;
    END;
END;
GO

SELECT * FROM Comments 

ALTER TABLE Comments
ADD isDeleted BIT DEFAULT 0; -- Assuming isDeleted is a boolean flag (BIT) with a default value of 0 (false)





SELECT * FROM Comments
-- DROP PROCEDURE AddComment;