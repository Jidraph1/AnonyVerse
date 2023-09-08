USE anonyverse
GO

CREATE TABLE Comments (
    commentid NVARCHAR(200) PRIMARY KEY,
    postid NVARCHAR(200) REFERENCES Posts(postid),
    userid VARCHAR(200) REFERENCES Users(userid),
    commentText NVARCHAR(1000) NOT NULL,
    commentDate DATETIME DEFAULT GETDATE()
);

SELECT * FROM Comments 