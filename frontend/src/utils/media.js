const PLACEHOLDER = "/assets/placeholder.svg";

const isAbsolute = (url) => /^https?:\/\//i.test(url || "");
const isDataUri = (url) => /^data:/i.test(url || "");
const isBlobUri = (url) => /^blob:/i.test(url || "");

const withOrigin = (path) => {
  if (!path) return PLACEHOLDER;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") {
    return normalized;
  }
  return `${window.location.origin}${normalized}`;
};

export const resolveMediaUrl = (rawUrl) => {
  if (!rawUrl) return PLACEHOLDER;
  if (isAbsolute(rawUrl) || isDataUri(rawUrl) || isBlobUri(rawUrl)) {
    return rawUrl;
  }

  const sanitized = rawUrl
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "")
    .trim();

  if (!sanitized) return PLACEHOLDER;

  if (sanitized.startsWith("/uploads")) {
    return withOrigin(sanitized);
  }

  if (sanitized.startsWith("uploads/")) {
    return withOrigin(sanitized);
  }

  if (sanitized.startsWith("audios/")) {
    return withOrigin(`/uploads/${sanitized}`);
  }

  if (sanitized.includes("/uploads/")) {
    return withOrigin(sanitized.startsWith("/") ? sanitized : `/${sanitized}`);
  }

  if (/^[\w.-]+\.(jpe?g|png|gif|webp|avif|svg)$/i.test(sanitized)) {
    return withOrigin(`/uploads/${sanitized}`);
  }

  if (sanitized.startsWith("/")) {
    return withOrigin(sanitized);
  }

  return PLACEHOLDER;
};

export const fallbackOnError = (event) => {
  if (event?.target) {
    event.target.onerror = null;
    event.target.src = PLACEHOLDER;
  }
};
