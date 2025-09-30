import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReminderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Reminder routes
  app.post("/api/reminders", async (req, res) => {
    try {
      const validatedData = insertReminderSchema.parse(req.body);
      const reminder = await storage.createReminder(validatedData);
      res.status(201).json(reminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Failed to create reminder" });
    }
  });

  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await storage.getAllReminders();
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });

  app.get("/api/reminders/:id", async (req, res) => {
    try {
      const reminder = await storage.getReminder(req.params.id);
      if (!reminder) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      res.json(reminder);
    } catch (error) {
      console.error("Error fetching reminder:", error);
      res.status(500).json({ error: "Failed to fetch reminder" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
