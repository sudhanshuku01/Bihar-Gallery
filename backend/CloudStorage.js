import { Storage } from "@google-cloud/storage";
import * as dotenv from "dotenv";

dotenv.config();

const storage = new Storage({ keyFilename: "key.json" });

const bucketName = process.env.GCS_BUCKET_NAME;

export const getObjectUrl = async (key) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(key);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
  });

  return url;
};

export const putObjectUrl = async (key, contentType) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(key);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
    contentType: contentType,
  });

  return url;
};

export const deleteObject = async (key) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(key);

  try {
    await file.delete();
    console.log(`Deleted object with key: ${key}`);
  } catch (error) {
    console.error(`Error deleting object with key ${key}:`, error);
    throw error;
  }
};
