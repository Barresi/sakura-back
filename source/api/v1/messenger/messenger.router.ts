import { Router } from "express";
import { getSocketIoInstance } from "./messenger.controller";
import wrap from "@src/api/async-wrapper";

const messenger = Router();

// POST /messenger/send-message
messenger.post("/send-message", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Broadcast the message to all connected clients
  const io = getSocketIoInstance();
  io.emit("new-message", message);

  return res.status(200).json({ success: true });
});

export default messenger;
