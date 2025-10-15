# Image & Audio Uploads on Vercel (Durable Storage)

This guide explains how to make the website’s upload system work reliably on Vercel.

TL;DR: Serverless instances have no persistent local disk. Use S3-compatible storage (AWS S3, Cloudflare R2, DigitalOcean Spaces) in production, and keep local disk only for development.

## Why not local disk on Vercel?

- Vercel’s serverless environment is ephemeral: files written to disk are lost on cold starts/redeploys and are not shared across instances.
- Our backend supports a "local" driver (great for local development) and an "s3" driver (recommended for production on Vercel).

## Quick Start (Recommended: S3/R2/Spaces)

1) Create a bucket
- AWS S3, Cloudflare R2, or DigitalOcean Spaces.
- Ensure public GET access for objects (via bucket policy or a CDN with the correct configuration).

2) Add environment variables (Vercel → Project Settings → Environment Variables)

Required
- `STORAGE_DRIVER = s3`
- `S3_BUCKET = <your-bucket>`
- `S3_REGION = <your-region>` (e.g., `us-east-1`)
- `S3_ACCESS_KEY_ID = <key-id>`
- `S3_SECRET_ACCESS_KEY = <secret>`

S3-compatible (R2/Spaces)
- `S3_ENDPOINT = https://<your-endpoint>`
- `S3_FORCE_PATH_STYLE = true`
- `S3_DISABLE_ACL = true` (R2/Spaces usually don’t support ACLs)

Optional (nicer public URLs)
- `PUBLIC_UPLOADS_BASE_URL = https://cdn.example.com` (or your bucket/CDN URL). When set, the backend builds absolute URLs with this base.

3) Deploy
- No code changes required beyond envs. The backend detects `STORAGE_DRIVER=s3`, uploads to the bucket, and returns public URLs.

4) Validate
- Open: `https://<your-vercel-app>/api/health` → it should show `{ storage: { driver: "s3", ... } }`.
- Upload test (PowerShell example):
  ```powershell
  curl.exe -s -X POST -F "imagem=@C:\\path\\to\\file.jpg;type=image/jpeg" https://<your-vercel-app>/api/upload/image/imagem
  ```
  You should get `{ caminho: "https://..." }` pointing at your bucket or CDN.

## Local driver (for development only)

- When `STORAGE_DRIVER` is omitted (default), the backend uses the local driver. In dev, Vite proxies `/uploads` to the backend and static serving works.
- On Vercel, local files are stored under `/tmp` and are ephemeral. We added a rewrite so `/uploads/*` routes through the API handler:
  - In `vercel.json`:
    ```json
    {
      "rewrites": [
        { "source": "/api/(.*)", "destination": "/api/index.js" },
        { "source": "/uploads/(.*)", "destination": "/api/index.js" },
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```
- This allows quick tests but is not durable across deploys/instances.

## Endpoints and field names

- Dashboard product image upload (make photo principal):
  - `POST /api/upload/:produtoId` with form-data field `foto`
  - Returns `{ url: "<display-ready-URL>" }`

- Chat image upload:
  - `POST /api/upload/image/imagem` with form-data field `imagem`
  - Returns `{ caminho: "<display-ready-URL>" }`

- Product gallery image (attach additional images):
  - `POST /api/products/:id/images` with form-data field `file`
  - Returns `{ id, url, principal }`

- Chat audio upload (currently local driver by default):
  - `POST /api/upload/audio` with form-data field `audio`
  - Returns `{ caminho: "<display-ready-URL>" }`
  - Note: Can be extended to S3 similarly if desired.

The backend now returns absolute URLs when `PUBLIC_UPLOADS_BASE_URL` (or S3 settings) are present. In dev, relative URLs like `/uploads/...` still work thanks to the Vite proxy.

## Frontend expectations

- The frontend uses the upload endpoints above. It renders whatever URL the backend returns.
- In dev, Vite proxies `/api` and `/uploads` to `http://localhost:4000` (see `frontend/vite.config.js`).
- In production, returned absolute URLs work without extra configuration.

## Minimal S3 bucket policy (S3 only)

If not using a CDN in front of the bucket, allow public GET on objects (simplified example — adjust for your security needs):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<your-bucket>/*"
    }
  ]
}
```

For R2/Spaces, configure the equivalent visibility on your provider.

## Troubleshooting

- 403 on S3 URL
  - Ensure bucket policy allows public GET or place a CDN with the correct access configuration. For R2/Spaces, set `S3_DISABLE_ACL=true` and make objects public via provider settings.

- Wrong or broken URLs for R2/Spaces
  - Set `S3_ENDPOINT` and `S3_FORCE_PATH_STYLE=true`. We construct URLs as `https://<endpoint>/<bucket>/<key>` for custom endpoints.

- Upload works locally but fails on Vercel
  - Verify envs are set in Vercel (Production & Preview as needed) and a new deployment picked them up.
  - Check `https://<your-vercel-app>/api/health` for the active driver.

- Images only render when they are full URLs
  - This guide addresses that by returning absolute URLs when envs are set. Ensure `PUBLIC_UPLOADS_BASE_URL` or S3 is configured in production.

## Optional: move audio to S3

We can update `/api/upload/audio` to use the S3 driver as well (mirroring the image flow). This is recommended if you plan to keep audio messages long-term on Vercel.

## Quick checklist

- [ ] Set `STORAGE_DRIVER=s3` and required S3/R2/Spaces envs in Vercel
- [ ] (Optional) Set `PUBLIC_UPLOADS_BASE_URL` to a CDN/custom domain
- [ ] Deploy and verify `/api/health`
- [ ] Test chat image upload and dashboard product image upload
- [ ] Confirm images appear site-wide without manual URL fixes

## References

- Backend storage config: `backend/src/config/storage.js`
- URL helper: `backend/src/utils/url.js`
- Upload routes:
  - `backend/src/index.js` (product image upload)
  - `backend/src/routes/imageUploadRoutes.js` (chat image upload)
  - `backend/src/routes/productImages.routes.js` (product gallery images)
  - `backend/src/routes/uploadRoutes.js` (audio upload)
- Vercel rewrites: `vercel.json`
- Env template: `backend/.env.example`
