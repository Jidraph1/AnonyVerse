import { v4 } from "uuid";
import { pool } from "../Config/config.js";



export const createPost = async (req, res) => {
    try {
        const {userid, postCaption, postImage } = req.body;
        // console.log(req.info);
        // const userId = req.info.userid;
        const postId = v4();
        const postDate = new Date();

        const conn = await pool;
        if (conn.connected) {
            const result = await conn
                .request()
                .input("postid", postId)
                .input("userid", userid)
                .input("postCaption", postCaption)
                .input("postImage", postImage)
                .input("postDate", postDate)
                .execute("CreatePostProcedure");

            if (result.rowsAffected[0] === 0) {
                res.status(500).json({ Error: "Post not created" });
            } else {
                res.status(200).json({ message: "Post created successfully" });
            }
        } else {
            res.status(500).json({ message: "Error connecting to the database" });
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const conn = await pool;
        if (conn.connected) {
            const posts = await conn.request().execute('GetAllPosts');
            if (posts.rowsAffected[0] === 0) {
                res.json({ Error: 'No posts found' });
            } else {
                res.status(200).json({ data: posts.recordset });
            }
        } else {
            res.status(500).json({ message: 'Error connecting to the database' });
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postid, userid } = req.body; // Assuming you pass both postid and userid in the request body

        const conn = await pool;

        if (conn.connected) {
            // Check if the user has permission to delete the post
            const permissionQuery = await conn
                .request()
                .input("postid", postid)
                .input("userid", userid)
                .query("SELECT 1 FROM Posts WHERE postid = @postid AND userid = @userid");

            if (permissionQuery.recordset.length === 0) {
                res.status(403).json({ Error: "Permission denied to delete this post" });
                return;
            }

            const result = await conn
                .request()
                .input("postid", postid)
                .execute("DeletePostProcedure");

            if (result.rowsAffected[0] === 0) {
                res.status(404).json({ Error: "Post not found" });
            } else {
                res.status(200).json({ message: "Post deleted successfully" });
            }
        } else {
            res.status(500).json({ message: "Error connecting to the database" });
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};





// addComment 
export const addComment = async (req, res) => {
    try {
        // Extract comment data from the request body, except for commentid and commentDate
        const { postid, userid, commentText } = req.body;

        // Generate a unique comment ID using UUID
        const commentid = v4();

        // Get the current date and time
        const commentDate = new Date();

        const conn = await pool; // Assuming you have a database connection pool

        if (conn.connected) {
            // Execute the AddComment stored procedure
            const addCommentQuery = `
                EXEC AddComment @commentid, @postid, @userid, @commentText, @commentDate;
            `;

            await conn
                .request()
                .input('commentid', commentid)
                .input('postid', postid)
                .input('userid', userid)
                .input('commentText', commentText)
                .input('commentDate', commentDate)
                .query(addCommentQuery);

            res.status(200).json({ message: 'Comment added successfully' });
        } else {
            res.status(500).json({ message: 'Error connecting to the database' });
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};


// Get Comments on posts by id

export const getCommentsByPostId = async (req, res) => {
    try {
        const { postid } = req.params; // Extract postid from URL parameters

        const conn = await pool; // Assuming you have a database connection pool

        if (conn.connected) {
            // Query to retrieve comments for the specified post
            const getCommentsQuery = `
                SELECT commentid, userid, commentText, commentDate
                FROM Comments
                WHERE postid = @postid;
            `;

            const comments = await conn
                .request()
                .input('postid', postid)
                .query(getCommentsQuery);

                
            res.status(200).json({ comments: comments.recordset });
        } else {
            res.status(500).json({ message: 'Error connecting to the database' });
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};
