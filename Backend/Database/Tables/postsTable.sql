USE anonyverse;
GO

CREATE TABLE Posts (
    postid NVARCHAR(200) PRIMARY KEY,
    userid VARCHAR(200) REFERENCES Users(userid),
    postCaption NVARCHAR(500),
    postImage NVARCHAR(200) NOT NULL,
    likesCount INT DEFAULT 0,
    postDate DATETIME DEFAULT GETDATE()
);
GO