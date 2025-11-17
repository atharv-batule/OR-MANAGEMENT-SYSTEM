import express from "express"
import cors from "cors"
import dotenev from "dotenv"
import { client } from "../db/db.js";
dotenev.config();
const router=express.Router()
const port=process.env.PORT||3000;

router.use(express.json())
router.use(cors())

router.post("/", async (req, res) => {
    try {
      console.log("POST request:", req.body);
  

  

  
      await client.query(
        `
        INSERT INTO users (id, email, role, fname,lname,password)
        VALUES ($1, $2, $3, $4)
        `,
        [parseInt(req.body.id), req.body.email, req.body.role, req.body.fname,req.body.lname,req.body.password]
      );
  
      res.send("HOD added successfully");
    } catch (err) {
      console.error("POST HOD Error:", err.message);
      res.status(500).send("Internal Server Error");
    }
  });