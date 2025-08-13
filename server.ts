// server.ts
import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = Number(process.env.PORT) || 443;
const DOMAIN = process.env.DOMAIN || "localhost";

const httpsOptions =
  process.env.USE_TLS === "True"
    ? {
        key: fs.readFileSync(process.env.TLS_KEY_PATH!),
        cert: fs.readFileSync(process.env.TLS_CERT_PATH!),
      }
    : {};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  }).listen(PORT, () => {
    console.log(`> Server running on https://${DOMAIN}:${PORT}`);
  });
});
