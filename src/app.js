import express from "express";
import cors from "cors";
import config from "./config/index.js";
import { scheduleTestEmail } from "./jobs/emailJobs.js";

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
    const scheduleTime = new Date(Date.now() + (delay || 0) * 1000);
    await scheduleTestEmail({ to, subject, text }, scheduleTime);
    res.json({ message: "Test email scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling test email:", error);
    res.status(500).json({ error: "Failed to schedule test email" });
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
