import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Hardcoded notification email for testing
const NOTIFICATION_EMAIL = "flower.hana0323@gmail.com"; // Replace with YOUR email
const NOTIFICATIONS_ENABLED = true; // Simple on/off switch

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Original endpoint
app.get("/screen", (req, res) => {
  res.send("Take your 2pm meds 💊");
});

// Task completion notification
app.post("/notify-completion", async (req, res) => {
  const { plan, completedAt } = req.body;

  // Check if notifications are enabled
  if (!NOTIFICATIONS_ENABLED) {
    return res.json({ success: true, message: "Notifications disabled" });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: NOTIFICATION_EMAIL,
      subject: `Task Completed: ${plan}`,
      text: `${plan} is marked done!${completedAt ? `\nCompleted at: ${completedAt}` : ""}`,
      html: `<h2>${plan} is marked done!</h2>${completedAt ? `<p>Completed at: ${completedAt}</p>` : ""}`,
    });

    console.log(`Notification sent for: ${plan}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API running on port " + PORT);
});
