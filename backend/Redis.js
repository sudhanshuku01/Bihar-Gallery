import { createClient } from "redis";
import * as dotenv from "dotenv";

dotenv.config();

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Function to connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    process.exit(1); // Exit the process if Redis connection fails
  }
};

// Connect to Redis
connectRedis();

// Utility function to cache URLs in Redis with a TTL (Time to Live)
const cacheUrl = async (key, url, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, url); // Cache for 1 hour (3600 seconds)
  } catch (error) {
    console.error("Error caching URL in Redis:", error);
    throw error; // Optional: rethrow to let higher-level code handle it
  }
};

// Function to get cached URLs from Redis
const getCachedUrl = async (key) => {
  try {
    const cachedUrl = await redisClient.get(key);
    return cachedUrl;
  } catch (error) {
    console.error("Error getting cached URL from Redis:", error);
    throw error; // Optional: rethrow to let higher-level code handle it
  }
};

// Function to delete a key from Redis
const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting key ${key} from Redis:`, error);
    throw error;
  }
};

// Export the functions and client
export { redisClient, cacheUrl, getCachedUrl, deleteCache };
