// main.js or wherever you use Redis
import { Storage } from "@google-cloud/storage";
import * as dotenv from "dotenv";
import { cacheUrl, getCachedUrl, deleteCache } from "./Redis.js"; // Import from Redis.js

dotenv.config();

const storage = new Storage({ keyFilename: "key.json" });
const bucketName = process.env.GCS_BUCKET_NAME;

// Get signed URL for reading an object
export const getObjectUrl = async (key) => {
  try {
    // Check if the URL is already cached in Redis
    const cachedUrl = await getCachedUrl(key);
    if (cachedUrl) {
      console.log("Returning cached URL from Redis");
      return cachedUrl;
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(key);

    // Generate a signed URL if not in cache
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });

    // Cache the generated URL in Redis
    await cacheUrl(key, url);

    return url;
  } catch (error) {
    console.error("Error getting object URL:", error);
    throw error;
  }
};

// Get signed URL for writing an object
export const putObjectUrl = async (key, contentType) => {
  try {
    // Check if the URL is already cached in Redis
    const cachedUrl = await getCachedUrl(key);
    if (cachedUrl) {
      console.log("Returning cached URL from Redis");
      return cachedUrl;
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(key);

    // Generate a signed URL if not in cache
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
      contentType: contentType,
    });

    // Cache the generated URL in Redis
    await cacheUrl(key, url);

    return url;
  } catch (error) {
    console.error("Error getting put object URL:", error);
    throw error;
  }
};

// Delete an object from Google Cloud Storage
export const deleteObject = async (key) => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(key);

    await file.delete();
    console.log(`Deleted object with key: ${key}`);

    // Remove the URL from Redis cache after deletion
    await deleteCache(key);
  } catch (error) {
    console.error(`Error deleting object with key ${key}:`, error);
    throw error;
  }
};
