const { createClient } = require("redis");

const redisClient = createClient({
    username: 'Piyush',
    password: process.env.REDIS_PASS,
    socket: {
          host: 'redis-12446.c212.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 12446
    }
});

module.exports=redisClient;