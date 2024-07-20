import * as redis from "redis";

const uri = process.env.REDIS_URI || "";

const connectRedis = async () => {
  try {
    const redisClient = redis.createClient({ url: uri });
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();

    console.log("Connected to the Redis");
  } catch (error) {
    console.error(error);
  }
};

export default connectRedis;
