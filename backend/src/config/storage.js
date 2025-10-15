const path = require("path");

// Optional S3 client (loaded lazily)
let S3Client, PutObjectCommand;
try {
  ({ S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"));
} catch (_) {
  // not installed; only needed if STORAGE_DRIVER=s3
}

let blobPutPromise;

async function getBlobPut() {
  if (!blobPutPromise) {
    blobPutPromise = (async () => {
      try {
        const mod = await import("@vercel/blob");
        if (!mod.put) {
          throw new Error(
            "@vercel/blob does not export put(). Update the package."
          );
        }
        return mod.put;
      } catch (err) {
        if (err.code === "ERR_MODULE_NOT_FOUND") {
          throw new Error(
            "@vercel/blob not installed. Add it to backend/package.json."
          );
        }
        if (err.code === "ERR_REQUIRE_ESM") {
          throw new Error(
            "@vercel/blob is ESM-only. Ensure Node 18+ and dynamic import are available."
          );
        }
        throw err;
      }
    })();
  }
  return blobPutPromise;
}

const DRIVER =
  process.env.STORAGE_DRIVER ||
  process.env.NEXT_PUBLIC_STORAGE_DRIVER ||
  "local";

function getPublicBaseUrl() {
  return process.env.PUBLIC_UPLOADS_BASE_URL || ""; // e.g., https://cdn.example.com
}

function buildDefaultS3PublicUrl(key) {
  const region = process.env.S3_REGION || "us-east-1";
  const bucket = process.env.S3_BUCKET;
  const endpoint = process.env.S3_ENDPOINT; // optional (e.g., R2/Spaces)
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";
  const cleanKey = key.replace(/^\//, "");
  if (!bucket) return `/${cleanKey}`; // last resort

  if (endpoint) {
    const base = endpoint.replace(/\/$/, "");
    // Prefer path-style for custom endpoints (works for R2/Spaces)
    return `${base}/${bucket}/${cleanKey}`;
  }
  // Default AWS S3 virtual-hosted–style URL
  return `https://${bucket}.s3.${region}.amazonaws.com/${cleanKey}`;
}

function buildPublicUrl(key) {
  const base = getPublicBaseUrl();
  if (base) return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  // Fallback: construct from S3 settings (bucket/endpoint) so links are public by default
  return buildDefaultS3PublicUrl(key);
}

async function uploadBufferToS3({ buffer, contentType, key }) {
  if (!S3Client || !PutObjectCommand) {
    throw new Error(
      "@aws-sdk/client-s3 not installed. Add it to api/package.json."
    );
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
    throw new Error(
      "Missing S3 env vars: S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY"
    );
  }

  const client = new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials,
  });
  const putParams = {
    Bucket: bucket,
    Key: key.replace(/^\//, ""),
    Body: buffer,
    ContentType: contentType || "application/octet-stream",
  };
  // Some S3-compatible providers (e.g., Cloudflare R2) don't support ACL; make it optional
  if (process.env.S3_DISABLE_ACL !== "true") {
    putParams.ACL = process.env.S3_ACL || "public-read";
  }
  await client.send(new PutObjectCommand(putParams));
  return buildPublicUrl(key);
}

async function uploadBufferToBlob({ buffer, contentType, key }) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN environment variable.");
  }
  const cleanKey = key.replace(/^\/+/, "");
  const put = await getBlobPut();
  const blob = await put(cleanKey, buffer, {
    access: "public",
    contentType: contentType || "application/octet-stream",
    token,
  });
  return blob.url;
}

module.exports = {
  DRIVER,
  buildPublicUrl,
  getPublicBaseUrl,
  uploadBufferToS3,
  uploadBufferToBlob,
};
