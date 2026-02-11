const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problem");
const submissionRouter =  require("./routes/submit")
const cors  = require("cors")
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const profileRouter = require('./routes/profile');
const adminRouter =  require('./routes/admin');

app.use(cors( {origin: ['http://localhost:3000', 'http://localhost:5173'], credentials:true } ));
app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission' ,submissionRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);
app.use('/admin', adminRouter);
app.use('/profile', profileRouter);



const InitalizeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("✅ Database Connected");
    console.log("✅ Redis Connected");

    app.listen(process.env.PORT, () => {
      console.log("Server listening at port number: " + process.env.PORT);
    });
  } catch (err) {
    console.log("❌ Connection Error:", err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("\n⚠️  Shutting down gracefully...");
  try {
    await redisClient.quit();
    await mongoose.connection.close();
    console.log("✅ Connections closed");
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
  } finally {
    process.exit(0);
  }
});

InitalizeConnection();




