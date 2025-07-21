"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const aiCategorize_1 = require("./aiCategorize");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let events = [];
// GET all events
app.get("/", (req, res) => {
    res.send("the server is running");
});
app.get("/events", (req, res) => {
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
    res.status(200).json(sortedEvents);
});
// POST new event
app.post("/events", (req, res) => {
    const { title, date, time, notes } = req.body;
    console.log(req.body);
    if (!title || !date || !time) {
        return res
            .status(400)
            .json({ error: "Title, date, and time are required." });
    }
    const newEvent = {
        id: (0, uuid_1.v4)(),
        title,
        date,
        time,
        notes,
        category: (0, aiCategorize_1.categorizeEvent)(title, notes || ""),
        archived: false,
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
});
// PUT archive event
app.put("/events/:id", (req, res) => {
    const { id } = req.params;
    const event = events.find((e) => e.id === id);
    if (!event) {
        return res.status(404).json({ error: "Event not found." });
    }
    event.archived = true;
    res.status(200).json(event);
});
// DELETE event
app.delete("/events/:id", (req, res) => {
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
