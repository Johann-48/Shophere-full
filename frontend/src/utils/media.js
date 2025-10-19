const PLACEHOLDER = "/assets/placeholder.png";

const isAbsolute = (url) => /^https?:\/\//i.test(url || "");
const isDataUri = (url) => /^data:/i.test(url || "");
const isBlobUri = (url) => /^blob:/i.test(url || "");

export const resolveMediaUrl = (rawUrl) => {
  if (!rawUrl) return PLACEHOLDER;
  if (isAbsolute(rawUrl) || isDataUri(rawUrl) || isBlobUri(rawUrl)) {
    return rawUrl;
  }

  if (rawUrl.startsWith("/")) {
    return rawUrl;
  }

  const sanitized = rawUrl.replace(/^\.\//, "");

  if (sanitized.startsWith("uploads/")) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return origin ? `${origin}/${sanitized}` : `/${sanitized}`;
  }

  if (sanitized.includes("/uploads/")) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return origin
      ? `${origin}${sanitized.startsWith("/") ? sanitized : `/${sanitized}`}`
      : sanitized;
  }

  return PLACEHOLDER;
};

export const fallbackOnError = (event) => {
  if (event?.target) {
    event.target.onerror = null;
    event.target.src = PLACEHOLDER;
  }
};
