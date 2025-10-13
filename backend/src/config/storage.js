const path = require("path");

// Optional S3 client (loaded lazily)
let S3Client, PutObjectCommand;
try {
  ({ S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"));
} catch (_) {
  // not installed; only needed if STORAGE_DRIVER=s3
}

const DRIVER = process.env.STORAGE_DRIVER || (process.env.VERCEL ? "local" : "local");

function getPublicBaseUrl() {
  return process.env.PUBLIC_UPLOADS_BASE_URL || ""; // e.g., https://cdn.example.com
}

function buildPublicUrl(key) {
  const base = getPublicBaseUrl();
  if (base) return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  // fallback to relative path (works locally); on Vercel this may 404 if file not present
  return `/${key.replace(/^\//, "")}`;
}

async function uploadBufferToS3({ buffer, contentType, key }) {
  if (!S3Client || !PutObjectCommand) {
    throw new Error("@aws-sdk/client-s3 not installed. Add it to api/package.json.");
  }
  const region = process.env.S3_REGION || "us-east-1";
  const bucket = process.env.S3_BUCKET;
  const endpoint = process.env.S3_ENDPOINT; // optional (e.g., R2/Spaces)
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";
  const credentials = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  };
  if (!bucket || !credentials.accessKeyId || !credentials.secretAccessKey) {
    throw new Error("Missing S3 env vars: S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY");
  }

  const client = new S3Client({ region, endpoint, forcePathStyle, credentials });
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key.replace(/^\//, ""),
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
      ACL: "public-read",
    })
  );
  return buildPublicUrl(key);
}

module.exports = {
  DRIVER,
  buildPublicUrl,
  getPublicBaseUrl,
  uploadBufferToS3,
};
