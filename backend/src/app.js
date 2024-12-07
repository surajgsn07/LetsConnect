import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
const app = express()

app.use(cors({
    origin: 'https://letsconnect-ui.netlify.app',
    // origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json())
// app.use(express.urlencoded());
app.use(express.static("public"))
app.use(cookieParser());

//routes import 
import userRouter from './routes/user.router.js'
import { ApiError } from "./utils/ApiError.js";
import postRouter from "./routes/post.router.js";
import commentRouter from "./routes/comment.router.js";
import messageRouter from "./routes/message.router.js"

// routes declaration
app.use("/users" , userRouter);
app.use("/posts" , postRouter);
app.use("/comments" , commentRouter);
app.use("/messages" , messageRouter);



// Error handling middleware
// app.use((err, req, res, next) => {
//     if (err instanceof ApiError) {
//         res.status(err.statusCode).json({
//             message: err.message,
//             errors: err.errors
//         });
//     } else {
//         res.status(500).json({
//             message: 'Internal Server Error',
//             errors: []
//         });
//     }
// });


export {app} 