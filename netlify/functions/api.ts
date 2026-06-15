import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());

app.post("/api/chat", (req, res) => {
  res.json({ text: "test working" });
});

export const handler = serverless(app);
