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
