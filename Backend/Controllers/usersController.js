import bcrypt from "bcrypt";
import mssql from "mssql";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import { pool } from "../Config/config.js";
import { loginSchema, registerSchema } from "../Validators/userValidators.js";

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
        const token = jwt.sign({ username, email, userid }, process.env.SECRET, {
          expiresIn: "4h",
        });
        res.status(201).json({ message: "Register success", token });
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
      if (user.rowsAffected[0] == 0) {
        res.json({ Error: " user can not be found" });
      } else {
        const { username, password: hashedPwd, email, userid } = user.recordset[0];
        const result = await bcrypt.compare(password, hashedPwd);
        if (result) {
          const token = jwt.sign({ username, email, userid }, process.env.SECRET, {
            expiresIn: "4h",
          });
          res.status(200).json({ message: "Login success", token });
        } else {
          res.status(403).json({ message: "wrong password" });
        }
      }
    } else {
      res.status(500).json({ message: "error connecting to db" });
    }
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};
