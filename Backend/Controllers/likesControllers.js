import { v4 } from "uuid";
import { pool } from "../Config/config.js";


export const likePost = async (req, res) => {
    try {
        const { userid, postid } = req.body;

        const conn = await pool;
        if (conn.connected) {
            // Check if the user has already liked the post to prevent duplicate likes
            const checkLikeQuery = `
                SELECT 1
                FROM Likes
                WHERE userid = @userid AND postid = @postid;
            `;
            const likeExists = await conn.request().input('userid', userid).input('postid', postid).query(checkLikeQuery);

            if (likeExists.recordset.length === 0) {
                // Insert a like record into the Likes table
                const insertQuery = `
                    INSERT INTO Likes (userid, postid)
                    VALUES (@userid, @postid);
                `;
                await conn.request().input('userid', userid).input('postid', postid).query(insertQuery);

                // Update the likesCount in the Posts table
                const updateQuery = `
                    UPDATE Posts
                    SET likesCount = likesCount + 1
                    WHERE postid = @postid;
                `;
                await conn.request().input('postid', postid).query(updateQuery);

                // Execute the LikePost stored procedure
                await conn.request().query('EXEC LikePost @userid, @postid;');

                res.status(200).json({ message: 'Post liked successfully' });
            } else {
                res.status(400).json({ message: 'User has already liked this post' });
            }
        } else {
            res.status(500).json({ message: 'Error connecting to the database' });
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

export const unlikePost = async (req, res) => {
    try {
        const { userid, postid } = req.body;

        const conn = await pool;
        if (conn.connected) {
            // Delete the like record from the Likes table
            const deleteQuery = `
                DELETE FROM Likes
                WHERE userid = @userid AND postid = @postid;
            `;
            await conn.request().input('userid', userid).input('postid', postid).query(deleteQuery);

            // Update the likesCount in the Posts table
            const updateQuery = `
                UPDATE Posts
                SET likesCount = likesCount - 1
                WHERE postid = @postid;
            `;
            await conn.request().input('postid', postid).query(updateQuery);

            // Execute the UnlikePost stored procedure
            await conn.request().query('EXEC UnlikePost @userid, @postid;');

            res.status(200).json({ message: 'Post unliked successfully' });
        } else {
            res.status(500).json({ message: 'Error connecting to the database' });
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};
