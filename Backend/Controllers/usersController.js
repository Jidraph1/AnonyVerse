import bcrypt from "bcrypt";
import mssql from "mssql";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import { pool } from "../Config/config.js";
import { loginSchema, registerSchema } from "../Validators/userValidators.js";
import cloudinary from "../cloudinaryConfig.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return res.status(422).json(error.details);
    }
    const userid = v4();
    const hashPwd = await bcrypt.hash(password, 4);
    const conn = await pool;

    if (conn.connected) {
      const result = await conn
        .request()
        .input("userid", userid)
        .input("username", username)
        .input("email", email)
        .input("password", hashPwd)
        .execute("uspRegisterUser");
      if (result.rowsAffected[0] == 0) {
        res.json({ Error: "error creating user" });
      } else {
        const token = jwt.sign(
          { username, email, userid },
          process.env.SECRET,
          {
            expiresIn: "4h",
          }
        );
        res.status(200).json({ message: "Register success", token });
      }
    } else {
      res.status(500).json({ message: "error connecting to db" });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(422).json(error.details);
    }
    const conn = await pool;
    if (conn.connected) {
      const user = await conn
        .request()
        .input("email", email)
        .execute("uspGetUser");
      if (user.rowsAffected[0] === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        const {
          username,
          password: hashedPwd,
          email,
          userid,
        } = user.recordset[0];
        const result = await bcrypt.compare(password, hashedPwd);

        if (result) {
          // User exists, and the password is correct
          const token = jwt.sign(
            { username, email, userid },
            process.env.SECRET,
            { expiresIn: "4h" }
          );
          res
            .status(200)
            .json({ message: "Login success", token, user: { id: userid } });
        } else {
          // Wrong password
          res.status(403).json({ message: "Wrong password" });
        }
      }
    } else {
      res.status(500).json({ message: "error connecting to db" });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Followers controllers
// Follow User
export const followUser = async (req, res) => {
  try {
    const { followerUserId, followingUserId } = req.body;

    const conn = await pool;

    if (conn.connected) {
      // Execute the FollowUser stored procedure
      await conn
        .request()
        .input("followerUserId", followerUserId)
        .input("followingUserId", followingUserId)
        .execute("FollowUser");

      res.status(200).json({ message: "User followed successfully" });
    } else {
      res.status(500).json({ message: "Error connecting to the database" });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const { followerUserId, followingUserId } = req.body;

    const conn = await pool;

    if (conn.connected) {
      // Execute the UnfollowUser stored procedure
      await conn
        .request()
        .input("followerUserId", followerUserId)
        .input("followingUserId", followingUserId)
        .execute("UnfollowUser");

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      res.status(500).json({ message: "Error connecting to the database" });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const getFollowersCount = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the user ID as a URL parameter

    const conn = await pool;

    if (conn.connected) {
      const query = `
            SELECT COUNT(*) AS followersCount
            FROM followers
            WHERE following_user_id = @userId;
            
            `;

      const result = await conn.request().input("userId", userId).query(query);

      const followersCount = result.recordset[0].followersCount;
      res.status(200).json({ followersCount });
    } else {
      res.status(500).json({ message: "Error connecting to the database" });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

// Update the profile with a new profile picture
export const updateProfile = async (req, res) => {
  try {
    const { userid } = req.params;
    const { bio, profilePicture } = req.body;

    // Check if a file was uploaded
    if (!profilePicture) {
      return res.status(400).json({ Error: "No file uploaded" });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(profilePicture, {
      folder: "profile-pictures", // Optional: specify a folder in your Cloudinary account
    });

    // Get the secure URL of the uploaded image
    const profilePic = result.secure_url;

    const conn = await pool;

    if (conn.connected) {
      const updateResult = await conn
        .request()
        .input("userid", userid)
        .input("profilePicture", profilePic) // Use the Cloudinary URL
        .input("bio", bio)
        .execute("uspUpdateUserProfile");

      if (updateResult.rowsAffected[0] > 0) {
        res.status(200).json({ message: "Profile updated successfully" });
      } else {
        res.status(404).json({ Error: "User not found or no changes made" });
      }
    } else {
      res.status(500).json({ message: "Error connecting to the database" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userid } = req.params;

    const conn = await pool;

    if (conn.connected) {
      const result = await conn
        .request()
        .input("userid", userid)
        .execute("uspGetUserProfile");

      if (result.recordset.length > 0) {
        const profile = result.recordset[0];
        res.status(200).json(profile);
      } else {
        res.status(404).json({ Error: "Profile not found" });
      }
    } else {
      res.status(500).json({ message: "Error connecting to the database" });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};
