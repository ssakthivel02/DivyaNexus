import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createAskDivyaStagingService, statusForAskDivyaResult } from "./askDivya/stagingService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "16kb" }));

  if (process.env.ASK_DIVYA_STAGING_ENABLED === "true") {
    const staging = createAskDivyaStagingService();

    app.get("/api/v1/ask/health", (_req, res) => {
      res.json(staging.health());
    });

    app.post("/api/v1/ask", async (req, res) => {
      const clientKey = req.ip || "anonymous";
      const result = await staging.ask(req.body, clientKey);
      res.status(statusForAskDivyaResult(result)).json(result);
    });
  }

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
