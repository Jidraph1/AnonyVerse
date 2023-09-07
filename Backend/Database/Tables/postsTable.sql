USE anonyverse;
GO

CREATE TABLE Posts (
    postid NVARCHAR(255) PRIMARY KEY,
    userid VARCHAR(255) REFERENCES Users(userid),
    postImage NVARCHAR(255) NOT NULL,
    postCaption NVARCHAR(500),
    likesCount INT DEFAULT 0,
    postDate DATETIME DEFAULT GETDATE()
);