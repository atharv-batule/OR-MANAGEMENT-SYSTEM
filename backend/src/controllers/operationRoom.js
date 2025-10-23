import express from "express"
import cors from "cors"
import dotenev from "dotenv"
//import {app} from "./src/utils/index.js"
import { client } from "../db/db.js";
dotenev.config();
const router=express.Router()
const port=process.env.PORT||3000;

router.use(express.json())
router.use(cors())


router.get("/", async (req, res) => {
   try {
    const result = await displayOR(); // fetch data (e.g., from DB)
    res.json(result); // send it to frontend as JSON
    console.log();
    console.log("in here")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

 router.post("/", async (req, res) => {
  try {
    const orid = parseInt(req.body.room_number);
    if (isNaN(orid) ) {
      return res.status(400).send("Employee ID, Salary,phone no. and Supervisor ID must be numbers");
    }
 const { equipment_list, availability_status } = req.body;

    console.log("POST payload:", { orid, equipment_list, availability_status });
    await addOr(
      orid,
      req.body.equipment_list,
      req.body.availability_status
    );

    res.send("Surgeon added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


async function displayOR()
{
    const result=await client.query(`
    SELECT * FROM or_table 
    `);
    return result.rows;
}

async function addOr(orid, equipmentlist, status) {
  try {
    const result = await client.query(`
      INSERT INTO or_table (orid, equipments, status)
      VALUES ($1, $2, $3)
    `, [orid, equipmentlist, status]);

    console.log(`OR ${orid} added/updated successfully`);
    return result;
  } catch (err) {
    console.error('Error adding/updating OR:', err);
    throw err;
  }
}

export default router;