import { Router } from "express";
import { registerUser,loginUser } from "../Controllers/usersController.js";
import { userAuth } from "../Middlewares/userMiddleware.js";
export const userRouter = Router()


userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

