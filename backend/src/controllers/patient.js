import express from "express"
import cors from "cors"
import dotenev from "dotenv"
import { client } from "../db/db.js";
dotenev.config();
const router=express.Router()
const port=process.env.PORT||3000;


router.use(express.json())
router.use(cors())

router.get("/", async (req, res) => {
   try {
    console.log("hello from patient")
    const result = await displayPatient(); 
    res.json(res.data); 
    console.log();
    console.log("in here")
  } catch (err) {
    console.error(err);
    console.log(err)
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function init() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS patients(
      patientid INT PRIMARY KEY,
      Fname VARCHAR(255),
      lname VARCHAR(255),
      dob DATE,
      salary INT,
      gender VARCHAR(255),
      designation VARCHAR(255)
    )
  `);

  const result = await client.query(`SELECT * FROM patients`);
  console.log(result.rows);
  console.log("patients table created successfully");
}

init();

    async function displayPatient()
     {
        const result=await client.query(`
        SELECT * FROM patients
        `);
        return result.rows;
    }  
   

    
    

   // Add a new patient
router.post("/", async (req, res) => {
  try {
    const {
      patient_num,
      patient_name,
      patient_age,
      patient_gender,
      patient_dob,
      patient_contact,
      patient_address,
      patient_medical_history,
      surgery_id
    } = req.body;

    // Validation
    

    // Insert into DB
    await client.query(
  `INSERT INTO patients (patientid, Fname, lname, dob, salary, gender)
   VALUES ($1, $2, $3, $4, $5, $6)`,
  [
    patientid,
    Fname,
    "",
    dob,
    salary,
    gender,
    
  ]
);

    res.status(201).send("✅ Patient added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});





export default router;