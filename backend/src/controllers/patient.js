import express from "express"
import cors from "cors"
import dotenev from "dotenv"
import { client } from "../db/db.js";
dotenev.config();
const router=express.Router()
const port=process.env.PORT||3000;

router.use(express.json())
router.use(cors())

//get router
router.get("/", async (req, res) => {
   try {
    const result = await displayPatient(); // fetch data (e.g., from DB)
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
    const patientid = parseInt(req.body.patient_num);
   // const salary = parseInt(req.body.surgeon_salary);
    //const srgid = parseInt(req.body.surgery_id);
    const phone=parseInt(req.body.patient_contact)

    if (isNaN(patientid) ) {
      return res.status(400).send("Employee ID, Salary, and Supervisor ID must be numbers");
    }

    await addPatient(
      patientid,
      req.body.patient_name.split(" ")[0],
      req.body.patient_name.split(" ")[1], // lname
      req.body.patient_dob,
      req.body.patient_gender,
      phone,
      req.body.patient_address,
      req.body.patient_medical_history
    );

    res.send("Surgeon added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
router.put("/",async(req,res)=>{
  try {
    const patientid = parseInt(req.body.patient_num);
   // const salary = parseInt(req.body.surgeon_salary);
    //const srgid = parseInt(req.body.surgery_id);
    const phone=parseInt(req.body.patient_contact)

    if (isNaN(patientid) ) {
      return res.status(400).send("Employee ID, Salary, and Supervisor ID must be numbers");
    }

    await updatePatient(
      patientid,
      req.body.patient_name.split(" ")[0],
      req.body.patient_name.split(" ")[1], // lname
      req.body.patient_dob,
      req.body.patient_gender,
      phone,
      req.body.patient_address,
      req.body.patient_medical_history
    );

    res.send("Surgeon added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})
router.delete("/",async(req,res)=>{
try{
await deletePatient(parseInt(req.body.patientid))
}catch(err){console.log(err)}
})
//add patient
async function addPatient(patientid,fname,lname,dob,gender,phone,address,medicalHistory)
    {
    const addSrg= await client.query(`
   INSERT INTO patients (patientid,Fname,lname,dob,gender,phone,address,medicalhistory) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,[patientid,fname,lname,dob,gender,phone,address,medicalHistory]);
    }
async function updatePatient(patientid,fname,lname,dob,gender,phone,address,medicalHistory)
    {
    const upSrg= await client.query(`
UPDATE patients
SET 
  Fname = $2,
  Lname = $3,
  dob = $4,
  gender = $5,
  phone = $6,
  address = $7,
  medicalhistory = $8
WHERE patientid = $1;
    `,[patientid,fname,lname,dob,gender,phone,address,medicalHistory]);
    }
    async function displayPatient()
    {
        const  result=await client.query(`
            SELECT * FROM patients
            `);
            return result.rows;
    }

    async function deletePatient(patientid)
    {
        const  result=await client.query(`
            DELETE FROM patients
            WHERE patientid=$1
            `,[patientid]);
            
    }

export default router;