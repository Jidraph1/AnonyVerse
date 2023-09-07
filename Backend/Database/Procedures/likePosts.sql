USE anonyverse
GO


-- Create the LikePost stored procedure
CREATE OR ALTER PROCEDURE LikePost
    @userid VARCHAR(200),
    @postid NVARCHAR(200)
AS
BEGIN
    -- Check if the user has already liked the post to prevent duplicate likes
    IF NOT EXISTS (SELECT 1 FROM Likes WHERE userid = @userid AND postid = @postid)
    BEGIN
        -- Insert a like record into the Likes table
        INSERT INTO Likes (userid, postid)
        VALUES (@userid, @postid);

        -- Update the likesCount in the Posts table
        UPDATE Posts
        SET likesCount = likesCount + 1
        WHERE postid = @postid;
        
        -- Return a success message
        SELECT 'Post liked successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Return a message indicating that the user has already liked the post
        SELECT 'User has already liked this post' AS Message;
    END
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
