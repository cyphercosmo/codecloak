import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // We don't need any backend routes for this app
  // as all the steganography functionality is handled client-side
  
  // If needed, we could add API endpoints for:
  // - Saving encoded snippets with short URLs
  // - Retrieving statistics on usage
  // - User accounts for saving snippets
  
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
