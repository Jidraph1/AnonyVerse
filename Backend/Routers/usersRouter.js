import { Router } from "express";
import { registerUser,loginUser } from "../Controllers/usersController.js";
import { createPost, getAllPosts, deletePost } from "../Controllers/postsControllers.js";
import { likePost, unlikePost,} from "../Controllers/likesControllers.js";
// import { userAuth } from "../Middlewares/userMiddleware.js";
export const userRouter = Router()
export const postRouter = Router()
export const likeRouter = Router()


userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)


postRouter.post('/new-post', createPost)
postRouter.get('/posts', getAllPosts)
postRouter.delete('/delete', deletePost)

likeRouter.post('/checklikes',likePost)
likeRouter.post('/unlikepost',unlikePost)

