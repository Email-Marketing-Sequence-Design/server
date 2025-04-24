import express from "express";
import cors from "cors";
import config from "./config/index.js";
import routes from "./routes/index.js";
import bodyParser  from 'body-parser'

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

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

app.use("/api/v1", routes)

app.all("/*path", (_req, res) => {
  console.log("Route Not Found");
  return res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
