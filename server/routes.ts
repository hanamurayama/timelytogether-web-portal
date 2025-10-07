import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReminderSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Email configuration
const NOTIFICATION_EMAIL = "flower.hana0323@gmail.com"; // Replace with YOUR actual email
const NOTIFICATIONS_ENABLED = true;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("🔥 REGISTERING ROUTES - START");

  // simple endpoints for your e-screen
  app.get("/__ok", (_req, res) => {
    res.type("text/plain").send("ok");
  });

  // NEW: Task completion notification endpoint
  app.post("/api/notify-completion", async (req, res) => {
    const { plan, completedAt } = req.body;

    if (!NOTIFICATIONS_ENABLED) {
      return res.json({ success: true, message: "Notifications disabled" });
    }

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: NOTIFICATION_EMAIL,
        subject: `✅ ${plan} completed!`,
        text: `${plan} is marked done!${completedAt ? `\nCompleted at: ${completedAt}` : ""}`,
        html: `<h2>${plan} is marked done!</h2>${completedAt ? `<p>Completed at: ${completedAt}</p>` : ""}`,
      });

      console.log(`✅ Notification sent for: ${plan}`);
      res.json({ success: true });
    } catch (error) {
      console.error("❌ Email error:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  app.get("/api/screen", async (_req, res) => {
    try {
      console.log("[HIT] /api/screen");

      const reminders = await storage.getAllReminders();

      if (reminders.length === 0) {
        return res.type("text/plain").send("No reminders set yet!");
      }

      // Get current time in Los Angeles timezone
      const now = new Date();
      const losAngelesTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );

      // Format date as YYYY-MM-DD in LA timezone
      const year = losAngelesTime.getFullYear();
      const month = String(losAngelesTime.getMonth() + 1).padStart(2, "0");
      const day = String(losAngelesTime.getDate()).padStart(2, "0");
      const today = `${year}-${month}-${day}`;

      // Get current time in HH:MM format with 5-minute buffer
      const bufferTime = new Date(losAngelesTime.getTime() - 5 * 60000);
      const hours = bufferTime.getHours().toString().padStart(2, "0");
      const minutes = bufferTime.getMinutes().toString().padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      // Get all reminders from today onwards
      const upcomingReminders = reminders.filter((r) => {
        // If it's today, only show reminders that haven't passed yet (with buffer)
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
      });

      // Convert 24-hour time to 12-hour with AM/PM
      const [hours24, minutesStr] = nextReminder.time.split(":");
      const hour = parseInt(hours24);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hours12 = hour % 12 || 12;
      const time12Hour = `${hours12}:${minutesStr} ${ampm}`;

      // Format response
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

  app.get("/api/test", (_req, res) => {
    res.json({ message: "Routes file is working!" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
