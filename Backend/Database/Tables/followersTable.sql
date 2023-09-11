USE anonyverse
GO

CREATE TABLE Followers (
    follower_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    follower_user_id VARCHAR(200) NOT NULL,
    following_user_id VARCHAR(200) NOT NULL,
    FOREIGN KEY (follower_user_id) REFERENCES Users(userid),
    FOREIGN KEY (following_user_id) REFERENCES Users(userid)
);


SELECT * FROM Followers;