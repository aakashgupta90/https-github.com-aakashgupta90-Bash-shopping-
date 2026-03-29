import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// In a real monorepo, these would be in separate files
// I'm structuring them here to mimic the requested "api/" structure
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes (api/src/routes) ---
  const apiRouter = express.Router();

  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  apiRouter.post("/create-payment-intent", (req, res) => {
    const { amount } = req.body;
    res.json({ 
      clientSecret: `pi_mock_${Math.random().toString(36).substring(7)}`,
      amount 
    });
  });

  app.use("/api/v1", apiRouter);

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
