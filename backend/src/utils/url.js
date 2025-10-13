function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

function toAbsoluteUrl(url) {
  if (!url) return url;
  if (isAbsoluteUrl(url)) return url;
  const base = process.env.PUBLIC_UPLOADS_BASE_URL;
  if (!base) return url; // fallback: keep relative in dev/local
  const cleanBase = base.replace(/\/$/, "");
  const cleanUrl = url.replace(/^\//, "");
  return `${cleanBase}/${cleanUrl}`;
}

module.exports = { isAbsoluteUrl, toAbsoluteUrl };
