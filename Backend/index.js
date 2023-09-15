import express from 'express'
import path from 'path'
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { userRouter, postRouter, likeRouter, commentRouter } from './Routers/usersRouter.js'


// const cors = require ('cors')

const app  = express()

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use(fileUpload());
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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