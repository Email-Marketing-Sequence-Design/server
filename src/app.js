import express from "express";
import cors from "cors";
import config from "./config/index.js";
import { scheduleTestEmail } from "./jobs/emailJobs.js";
import { scheduleEmailSequence } from "./jobs/scheduleEmailSequence.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [config.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello From Backend Server!");
  console.log("Cookies: ", req.cookies);
});

app.post("/api/test-email", async (req, res) => {
  try {
    const { to, subject, text, delay } = req.body;
    await scheduleTestEmail({ to, subject, text }, delay);
    res.json({ message: "Test email scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling test email:", error);
    res.status(500).json({ error: "Failed to schedule test email" });
  }
});

app.post("/api/schedule-sequence", async (req, res) => {
  try {
    const { emailAddress, emails } = req.body;

    // Validate the input
    if (!emailAddress || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        error:
          "Invalid input. Required: emailAddress and non-empty emails array",
      });
    }

    // Schedule the sequence
    await scheduleEmailSequence(emailAddress, emails);

    res.json({
      success: true,
      message: "Email sequence scheduled successfully",
      data: req.body,
      totalEmails: emails.length,
    });
  } catch (error) {
    console.error("Error scheduling email sequence:", error);
    res.status(500).json({
      error: "Failed to schedule email sequence",
      details: error.message,
    });
  }
});

app.all("/*path", (_req, res) => {
  console.log("Route Not Found");
  return res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
