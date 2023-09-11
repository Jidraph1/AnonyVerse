CREATE OR ALTER PROCEDURE EditComment
    @commentid NVARCHAR(200),
    @commentText NVARCHAR(1000),
    @userid VARCHAR(200)
AS
BEGIN
    -- Check if the user owns the comment
    IF EXISTS (
        SELECT 1
        FROM Comments
        WHERE commentid = @commentid AND userid = @userid
    )
    BEGIN
        -- Update the comment text
        UPDATE Comments
        SET commentText = @commentText
        WHERE commentid = @commentid;

        SELECT 'Comment updated successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Return a message indicating unauthorized access
        SELECT 'Unauthorized to edit this comment' AS Message;
    END
END;