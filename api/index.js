// Vercel Serverless Function Entry Point (wrapped with serverless-http)
const app = require("../backend/src/index.js");
const serverless = require("serverless-http");
// Vercel Serverless Function Entry Point - export Express app directly
module.exports = app;
