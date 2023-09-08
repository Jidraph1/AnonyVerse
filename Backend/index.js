import express from 'express'
import path from 'path'
import cors from 'cors';
import { userRouter, postRouter, likeRouter, commentRouter } from './Routers/usersRouter.js'



// const cors = require ('cors')

const app  = express()

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use(cors())

app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/likes', likeRouter)
app.use('/comments', commentRouter)

app.use((err, req, res, next)=>{
    res.json({Error: err})
})

app.listen(4505, ()=>{
    console.log('Server running on port 4505');
})