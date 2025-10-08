import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReminderSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function registerRoutes(app: Express): Promise<Server> {
  // Email configuration
  const NOTIFICATION_EMAIL = "flower.hana0323@gmail.com";
  const NOTIFICATIONS_ENABLED = true;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("🔥 REGISTERING ROUTES - START");

  // simple endpoints for your e-screen
  app.get("/__ok", (_req, res) => {
    res.type("text/plain").send("ok");
  });

  app.get("/api/notify-completion-test", async (req, res) => {
    console.log("🚀 GET NOTIFY ENDPOINT HIT!");
    res.json({ success: true, message: "GET version works!" });
  });

  // Task completion notification endpoint
  app.post("/api/notify-completion", async (req, res) => {
    console.log("🚀 POST ENDPOINT HIT!");
    const { plan, completedAt } = req.body;
    console.log("Received data:", { plan, completedAt });

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

      console.log(`✅ Email sent for: ${plan}`);
      res.json({ success: true, message: "Notification sent!" });
    } catch (error) {
      console.error("❌ Email error:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  console.log("✅ Registered /api/notify-completion endpoint");

  app.get("/api/screen", async (_req, res) => {
    try {
      console.log("[HIT] /api/screen");

      const reminders = await storage.getAllReminders();

      if (reminders.length === 0) {
        return res.type("text/plain").send("No reminders set yet!");
      }

      const now = new Date();
      const losAngelesTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );

      const year = losAngelesTime.getFullYear();
      const month = String(losAngelesTime.getMonth() + 1).padStart(2, "0");
      const day = String(losAngelesTime.getDate()).padStart(2, "0");
      const today = `${year}-${month}-${day}`;

      const bufferTime = new Date(losAngelesTime.getTime() + 10 * 60000);
      const hours = bufferTime.getHours().toString().padStart(2, "0");
      const minutes = bufferTime.getMinutes().toString().padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      const upcomingReminders = reminders.filter((r) => {
        // Create full datetime for the reminder
        const reminderDateTime = new Date(`${r.date}T${r.time}:00`);

        // Skip reminders that are already in the past
        if (reminderDateTime < losAngelesTime) {
          return false;
        }

        // Apply buffer check for today's reminders
        if (r.date === today) {
          return r.time >= currentTime;
        }

        // Include all future dates
        return r.date > today;
      });

      if (upcomingReminders.length === 0) {
        return res.type("text/plain").send("No upcoming reminders!");
      }

      upcomingReminders.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });

      const nextReminder = upcomingReminders[0];

      const reminderDate = new Date(nextReminder.date + "T00:00:00");
      const dayAbbrev = reminderDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const monthDay = reminderDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      });

      const [hours24, minutesStr] = nextReminder.time.split(":");
      const hour = parseInt(hours24);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hours12 = hour % 12 || 12;
      const time12Hour = `${hours12}:${minutesStr} ${ampm}`;

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

  app.delete("/api/reminders/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteReminder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      res.json({ success: true, message: "Reminder deleted" });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  });

  //mark complete > delete reminder
  app.post("/api/reminders/:id/complete", async (req, res) => {
    try {
      const deleted = await storage.deleteReminder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Reminder not found" });
      }
      res.json({
        success: true,
        message: "Reminder marked complete and deleted",
      });
    } catch (error) {
      console.error("Error completing reminder:", error);
      res.status(500).json({ error: "Failed to complete reminder" });
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
