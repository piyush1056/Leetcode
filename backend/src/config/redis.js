const { createClient } = require("redis");

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-10640.c80.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 10640
    }
});

module.exports=redisClient;