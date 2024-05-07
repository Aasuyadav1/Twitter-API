require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors")
const connectDb = require("./Conf/database.conf")
const authRouter = require("./Routers/auth.route");
const postRouter = require("./Routers/post.route");
const commentRouter = require("./Routers/comment.route")


const PORT = process.env.API_PORT || 5000 ;
const corsOptions = {
    origin : process.env.CORS_ORIGIN_URL,
    methods : 'GET, POST, PUT, DELETE, PATCH, HEAD',
    credentials : true // allow session cookie from browser
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', authRouter)
app.use('/api', postRouter)
app.use('/api', commentRouter)



connectDb()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})