import { Router } from "express";
import { registerUser,loginUser } from "../Controllers/usersController.js";
import { createPost, getAllPosts } from "../Controllers/postsControllers.js";
// import { userAuth } from "../Middlewares/userMiddleware.js";
export const userRouter = Router()
export const postRouter = Router()


userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)


postRouter.post('/new-post', createPost)
postRouter.get('/posts', getAllPosts)