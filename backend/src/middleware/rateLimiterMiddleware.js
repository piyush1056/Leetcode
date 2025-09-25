const redisClient = require("../config/redis");

const createRateLimiter = (windowSizeInSeconds = 3600, maxRequests = 60) => {
  return async (req, res, next) => {
    try {
      // Use user ID if logged in; otherwise fall back to IP + User-Agent
      const identifier = req.result
        ? req.result.id
        : `${req.ip}-${req.headers["user-agent"]}`;
      const key = `rate_limit:${identifier}`;

      const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      const windowStartTime = currentTime - windowSizeInSeconds;

      // Remove all entries older than the window start time
      await redisClient.zRemRangeByScore(key, 0, windowStartTime);

      // Count how many requests remain in the current time window
      const requestCount = await redisClient.zCard(key);

      if (requestCount >= maxRequests) {
        return res.status(429).json({
          error: `Too many requests, please try again after ${
            windowSizeInSeconds / 60
          } minutes`,
        });
      }

      // Add this request to the sorted set with currentTime as the score
      await redisClient.zAdd(key, [
        {
          score: currentTime,
          value: `${currentTime}:${Math.random()}:${req.method} ${req.originalUrl}`,
        },
      ]);

      // Ensure the key expires once the window has passed
      await redisClient.expire(key, windowSizeInSeconds);

      next();
    } 
    catch (error) {
      console.error("Rate limiter error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = createRateLimiter;