import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Get current folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Proxy route
app.get("/prx", async (req, res) => {
  const targetUrl = req.query.url;
  const origin = req.headers.origin;
  const allowedOrigin = "https://cors-3med.onrender.com"; // Change to your site

  // Allow requests from your site OR local file testing (origin null)
  if (origin !== allowedOrigin && origin !== null) {
    return res.status(403).send("Forbidden: your site only");
  }

  if (!targetUrl) {
    return res.status(400).send("Missing URL query parameter");
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    // Only allow browser to read response if origin is allowed
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    res.send(data);
  } catch (error) {
    res.status(500).send("Failed to fetch target URL");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
