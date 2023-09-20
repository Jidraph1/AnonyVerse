USE anonyverse
GO


-- Create the LikePost stored procedure
CREATE OR ALTER PROCEDURE LikePost
    @userid VARCHAR(200),
    @postid NVARCHAR(200)
AS
BEGIN
    BEGIN TRY
        -- Check if the user has already liked the post to prevent duplicate likes
        IF NOT EXISTS (SELECT 1 FROM Likes WHERE userid = @userid AND postid = @postid)
        BEGIN
            -- Start a transaction
            BEGIN TRANSACTION;

            -- Insert a like record into the Likes table
            INSERT INTO Likes (userid, postid)
            VALUES (@userid, @postid);

            -- Update the likesCount in the Posts table
            UPDATE Posts
            SET likesCount = likesCount + 1
            WHERE postid = @postid;

            -- Commit the transaction
            COMMIT TRANSACTION;

            -- Return a success message
            SELECT 'Post liked successfully' AS Message;
        END
        ELSE
        BEGIN
            -- Return a message indicating that the user has already liked the post
            SELECT 'User has already liked this post' AS Message;
        END
    END TRY
    BEGIN CATCH
        -- Roll back the transaction in case of an error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Log the error (you can replace this with your own logging mechanism)
        INSERT INTO ErrorLog (ErrorMessage, ErrorDate)
        VALUES (ERROR_MESSAGE(), GETDATE());

        -- Return an error message
        SELECT 'Error occurred while liking the post' AS Message;
    END CATCH
END;
GO

-- Create the UnlikePost stored procedure
CREATE OR ALTER PROCEDURE UnlikePost
    @userid VARCHAR(200),
    @postid NVARCHAR(200)
AS
BEGIN
    -- Check if the user has liked the post to allow unliking
    IF EXISTS (SELECT 1 FROM Likes WHERE userid = @userid AND postid = @postid)
    BEGIN
        -- Delete the like record from the Likes table
        DELETE FROM Likes WHERE userid = @userid AND postid = @postid;

        -- Update the likesCount in the Posts table
        UPDATE Posts SET likesCount = likesCount - 1 WHERE postid = @postid;
        
        -- Return a success message
        SELECT 'Post unliked successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Return a message indicating that the user hasn't liked the post
        SELECT 'User has not liked this post' AS Message;
    END
END;
GO
