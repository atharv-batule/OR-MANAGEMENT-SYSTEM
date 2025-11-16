import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { client } from "../db/db.js";

dotenv.config();
const router = express.Router();

router.use(express.json());
router.use(cors());


//GET ALL HODs

router.get("/", async (req, res) => {
    try {
      const result = await client.query(`
        SELECT dnumber, dname, hod_id, start_date
        FROM department
        ORDER BY dnumber ASC
      `);
  
      res.json(result.rows);
    } catch (err) {
      console.error("GET HOD Error:", err);
      res.status(500).send("Failed to fetch HOD data");
    }
  });
  


//ADD NEW HOD
router.post("/", async (req, res) => {
    try {
      console.log("POST request:", req.body);
  
      const dnumber = parseInt(req.body.hod_dnumber);
      const hod_id = parseInt(req.body.hod_id);
  
      if (isNaN(hod_id) || isNaN(dnumber)) {
        return res.status(400).send("HOD ID and Department Number must be numbers");
      }
  
      await client.query(
        `
        INSERT INTO department (dnumber, dname, hod_id, start_date)
        VALUES ($1, $2, $3, $4)
        `,
        [dnumber, req.body.hod_dname, hod_id, req.body.hod_start_date]
      );
  
      res.send("HOD added successfully");
    } catch (err) {
      console.error("POST HOD Error:", err.message);
      res.status(500).send("Internal Server Error");
    }
  });
  

// update HOD
router.put("/", async (req, res) => {
    try {
      console.log("PUT request:", req.body);
  
      const dnumber = parseInt(req.body.hod_dnumber);
      const hod_id = parseInt(req.body.hod_id);
  
      if (isNaN(dnumber) || isNaN(hod_id)) {
        return res.status(400).send("HOD ID and Department Number must be numbers");
      }
  
      await client.query(
        `
        UPDATE department
        SET dname = $1,
            hod_id = $2,
            start_date = $3
        WHERE dnumber = $4
        `,
        [req.body.hod_dname, hod_id, req.body.hod_start_date, dnumber]
      );
  
      res.send("HOD updated successfully");
    } catch (err) {
      console.error("PUT HOD Error:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  


//DELETE HOD
router.delete("/", async (req, res) => {
    try {
      const dnumber = parseInt(req.body.hod_dnumber);
  
      if (isNaN(dnumber)) {
        return res.status(400).send("Invalid Department Number");
      }
  
      await client.query(
        `
        DELETE FROM department
        WHERE dnumber = $1
        `,
        [dnumber]
      );
  
      res.send("HOD deleted successfully");
    } catch (err) {
      console.error("DELETE HOD Error:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  

export default router;
