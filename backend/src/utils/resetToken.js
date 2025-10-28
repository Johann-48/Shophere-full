const crypto = require("crypto");

function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
}

function hashResetToken(token) {
  if (!token) return null;
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildResetUrl(token, email) {
  const fallbackBase = `${(
    process.env.FRONTEND_URL || "http://localhost:5173"
  ).replace(/\/$/, "")}/reset-password`;
  const configuredBase =
    (process.env.RESET_PASSWORD_PAGE_URL || "").trim() || fallbackBase;
  const separator = configuredBase.includes("?") ? "&" : "?";
  const encodedToken = encodeURIComponent(token);
  const encodedEmail = email ? `&email=${encodeURIComponent(email)}` : "";
  return `${configuredBase}${separator}token=${encodedToken}${encodedEmail}`;
}

module.exports = {
  generateResetToken,
  hashResetToken,
  buildResetUrl,
};
