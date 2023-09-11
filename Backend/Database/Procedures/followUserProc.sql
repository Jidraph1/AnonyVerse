USE anonyverse
GO

CREATE OR ALTER PROCEDURE FollowUser
    @followerUserId VARCHAR(200),
    @followingUserId VARCHAR(200)
AS
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM Followers
        WHERE follower_user_id = @followerUserId AND following_user_id = @followingUserId
    )
    BEGIN
        INSERT INTO Followers (follower_user_id, following_user_id)
        VALUES (@followerUserId, @followingUserId);
        
        INSERT INTO Followees (follower_user_id, following_user_id)
        VALUES (@followerUserId, @followingUserId);
    END
END;
GO


CREATE OR ALTER PROCEDURE UnfollowUser
    @followerUserId VARCHAR(200),
    @followingUserId VARCHAR(200)
AS
BEGIN
    DELETE FROM Followers
    WHERE follower_user_id = @followerUserId AND following_user_id = @followingUserId;
    
    DELETE FROM Followees
    WHERE follower_user_id = @followerUserId AND following_user_id = @followingUserId;
END;
GO
