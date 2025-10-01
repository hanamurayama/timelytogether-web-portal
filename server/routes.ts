import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReminderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // simple endpoints for your e-screen
  app.get("/__ok", (_req, res) => {
    res.type("text/plain").send("ok");
  });

  app.get("/api/screen", async (_req, res) => {
    try {
      console.log("[HIT] /api/screen");

      // Get all reminders
      const reminders = await storage.getAllReminders();

      if (reminders.length === 0) {
        return res.type("text/plain").send("No reminders set yet!");
      }

      // Get today's date
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Find reminders for today
      const todaysReminders = reminders.filter((r) => r.date === today);

      if (todaysReminders.length === 0) {
        return res
          .type("text/plain")
          .send("No reminders for today! Enjoy your day");
      }

      // Sort by time
      todaysReminders.sort((a, b) => a.time.localeCompare(b.time));

      // Format without header
      let response = "";

      todaysReminders.forEach((reminder, index) => {
        response += `At: ${reminder.time}\n`;
        response += `Plan: ${reminder.title}\n`;
        response += `From your family: ${reminder.message}\n`;
        if (index < todaysReminders.length - 1) {
          response += `\n---\n\n`;
        }
      });

      res.type("text/plain").send(response);
    } catch (error) {
      console.error("Error fetching screen message:", error);
      res.type("text/plain").send("Error loading reminders");
    }
  });

  app.get("/screen", (_req, res) => {
    console.log("[HIT] /screen");
    res.type("text/plain").send("Take your 2pm meds");
  });

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
