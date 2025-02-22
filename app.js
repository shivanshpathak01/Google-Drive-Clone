const express = require('express');
const userRouter = require('./routes/user.routes')
const app = express();
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.routes');
const appwriteClient = require('./config/appwrite.config')
const multer = require('multer');
const path = require('path');

connectToDB();
dotenv.config();


app.set('view engine','ejs');
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/',indexRouter)
app.use('/user',userRouter)


process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception');
    console.log(err)
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})