import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { EventItem } from "./types";
import { categorizeEvent } from "./aiCategorize";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let events: EventItem[] = [];

// GET all events
app.get("/", (req, res) => {
  res.send("the server is running");
});

app.get("/events", (req: Request, res: Response) => {
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  res.status(200).json(sortedEvents);
});

// POST new event
app.post("/events", (req: Request, res: Response) => {
  const { title, date, time, notes } = req.body;
  console.log(req.body);

  if (!title || !date || !time) {
    return res
      .status(400)
      .json({ error: "Title, date, and time are required." });
  }

  const newEvent: EventItem = {
    id: uuidv4(),
    title,
    date,
    time,
    notes,
    category: categorizeEvent(title, notes || ""),
    archived: false,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// PUT archive event
app.put("/events/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === id);

  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  event.archived = true;
  res.status(200).json(event);
});

// DELETE event
app.delete("/events/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Event not found." });
  }

  events.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
