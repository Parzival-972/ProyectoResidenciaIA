// libs/s3.js
import AWS from "aws-sdk";
import { Buffer } from "buffer";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  httpOptions: {
    timeout: 600000, // 10 minutes
    connectTimeout: 600000, // 10 minutes
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadImageWithRetry = async (file, retries = 5) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${Date.now()}_${file.name}`, // File name you want to save as in S3
    ContentType: file.type,
  };

  const convertBlobToBuffer = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  console.log("Uploading image with parameters:", params);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const fileBuffer = await convertBlobToBuffer(file);

      return await new Promise((resolve, reject) => {
        s3.upload(
          { ...params, Body: fileBuffer },
          { partSize: 10 * 1024 * 1024, queueSize: 10 },
          (error, data) => {
            if (error) {
              console.error(`Attempt ${attempt} failed:`, error);
              reject(error);
            } else {
              console.log("Image uploaded successfully to S3:", data.Location);
              resolve(data.Location);
            }
          }
        );
      });
    } catch (error) {
      console.error(
        `Attempt ${attempt} failed, retrying in ${attempt ** 2} seconds...`
      );
      if (attempt === retries) {
        throw error;
      }
      await sleep(attempt ** 2 * 1000); // Exponential backoff
    }
  }
};

export const uploadImage = uploadImageWithRetry;
