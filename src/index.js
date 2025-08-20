const express = require('express');
const app = express();
require('dotenv').config();
const main = require("./config/db");
const CookieParser= require('cookie-parser');
// const User = require("./models/user");
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');


app.use(express.json());
app.use(CookieParser());

app.use('/user',authRouter);

const InitialiseConnection = async()=>{
  
    try {
         await Promise.all[main(),redisClient.connect()];
         console.log("DB Connected");

        app.listen(process.env.PORT,()=>{
          console.log("Server listening at port: "+ process.env.PORT);
        })

    } 
    catch (error) {
        console.log("Error:"+error);
    }
}
 

InitialiseConnection();

// main()
// .then(async ()=>{
//     app.listen(process.env.PORT,()=>{
//     console.log("Server listening at port: "+ process.env.PORT);
//     })
// })
// .catch(error=>console.log("Error Occurred" + error));

