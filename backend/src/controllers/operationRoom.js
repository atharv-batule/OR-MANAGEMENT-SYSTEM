import express from "express";
import { client } from "../db/db.js";

const router = express.Router();

// GET all operation rooms
router.get("/", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM or_table ORDER BY orid"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch operation rooms" });
  }
});

// POST - Create new operation room
router.post("/", async (req, res) => {
  try {
    const { orid, status, equipments } = req.body;
    
    const result = await client.query(
      "INSERT INTO or_table (orid, status, equipments) VALUES ($1, $2, $3) RETURNING *",
      [orid, status || "Available", equipments]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create operation room" });
  }
});

// PUT - Update operation room
router.put("/", async (req, res) => {
  try {
    const { orid, status, equipments } = req.body;
    
    const result = await client.query(
      "UPDATE or_table SET status = $1, equipments = $2 WHERE orid = $3 RETURNING *",
      [status, equipments, orid]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Operation room not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update operation room" });
  }
});

// DELETE - Delete operation room
router.delete("/", async (req, res) => {
  try {
    const { orid } = req.body;
    
    const result = await client.query(
      "DELETE FROM or_table WHERE orid = $1 RETURNING *",
      [orid]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Operation room not found" });
    }
    
    res.json({ message: "Operation room deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete operation room" });
  }
});

export default router;