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

      const reminders = await storage.getAllReminders();

      if (reminders.length === 0) {
        return res.type("text/plain").send("No reminders set yet!");
      }

      // Get today's date and current time
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().slice(0, 5); // Format: HH:MM

      // Get all reminders from today onwards
      const upcomingReminders = reminders.filter((r) => {
        // If it's today, only show reminders that haven't passed yet
        if (r.date === today) {
          return r.time >= currentTime;
        }
        // Show all future date reminders
        return r.date > today;
      });

      if (upcomingReminders.length === 0) {
        return res.type("text/plain").send("No upcoming reminders!");
      }

      // Sort by date then time to get the NEXT one
      upcomingReminders.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });

      // Get only the FIRST (next) reminder
      const nextReminder = upcomingReminders[0];

      // Format date with day abbreviation (without year)
      const reminderDate = new Date(nextReminder.date + "T00:00:00");
      const dayAbbrev = reminderDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const monthDay = reminderDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      }); // MM/DD

      // Convert 24-hour time to 12-hour with AM/PM
      const [hours24, minutes] = nextReminder.time.split(":");
      const hours = parseInt(hours24);
      const ampm = hours >= 12 ? "PM" : "AM";
      const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
      const time12Hour = `${hours12}:${minutes} ${ampm}`;

      // Format response with combined date/time line
      let response = "";
      response += `When: ${dayAbbrev}, ${monthDay}, ${time12Hour}\n`;
      response += `Plan: ${nextReminder.title}\n`;
      response += `From your family: ${nextReminder.message}`;

      res.type("text/plain").send(response);
      
    } catch (error) {
      console.error("Error fetching screen message:", error);
      res.type("text/plain").send("Error loading reminders");
    }
  });
  //Test
  // app.get("/screen", (_req, res) => {
  //   console.log("[HIT] /screen");
  //   res.type("text/plain").send("Take your 2pm meds");
  // });

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
