import { Router } from "express";
import { registerUser,loginUser, followUser, unfollowUser,getFollowersCount } from "../Controllers/usersController.js";
import { createPost, getAllPosts, deletePost, addComment, getCommentsByPostId, editComment } from "../Controllers/postsControllers.js";
import { likePost, unlikePost,} from "../Controllers/likesControllers.js";
// import { userAuth } from "../Middlewares/userMiddleware.js";

export const userRouter = Router()
export const postRouter = Router()
export const likeRouter = Router()
export const commentRouter = Router()

// User Registration
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/follow', followUser)
userRouter.post('/unfollow', unfollowUser)
userRouter.get('/countfollow/:userid', getFollowersCount)

// Posts
postRouter.post('/new-post', createPost)
postRouter.get('/posts', getAllPosts)
postRouter.delete('/delete', deletePost)

// Likes
likeRouter.post('/checklikes',likePost)
likeRouter.post('/unlikepost',unlikePost)

// Comments
commentRouter.post('/addcomment', addComment)
commentRouter.get('/getcommentsbyid/:postid', getCommentsByPostId);
commentRouter.put('/editcomment/:commentid', editComment);





