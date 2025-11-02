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
const or_info=await displaySurg();
res.json(or_info) 
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
async function displaySurg() {
  const result = await client.query(`
    SELECT * FROM surgery_details_view
  `);

  const surgeries = result.rows;
  const updatedSurgeries = await Promise.all(
  surgeries.map(async (surgery) => {
    return {
      ...surgery,
      anesthesiologist_name: (await empName(surgery.anesthesiologist_id))[0]?.fname + " " + (await empName(surgery.anesthesiologist_id))[0]?.lname,
      attending_name: (await empName(surgery.attending_id))[0]?.fname + " " + (await empName(surgery.attending_id))[0]?.lname,
      intern_name: surgery.intern_id ? (await empName(surgery.intern_id))[0]?.fname + " " + (await empName(surgery.intern_id))[0]?.lname : null,
      nurse_name: surgery.nurse_id ? (await empName(surgery.nurse_id))[0]?.fname + " " + (await empName(surgery.nurse_id))[0]?.lname : null,
      resident_name: surgery.resident_id ? (await empName(surgery.resident_id))[0]?.fname + " " + (await empName(surgery.resident_id))[0]?.lname : null,
      patient_name:surgery.patient_id?(await patientDetails(surgery.patient_id))[0]?.fname + " " + (await empName(surgery.resident_id))[0]?.lname : null,
      patient_medical:surgery.patient_id?(await patientDetails(surgery.patient_id))[0]?.medicalhistory : null,
      patient_dob:surgery.patient_id?(await patientDetails(surgery.patient_id))[0]?.dob : null,
      patient_gender:surgery.patient_id?(await patientDetails(surgery.patient_id))[0]?.gender:null,
      patient_phone:surgery.patient_id?(await patientDetails(surgery.patient_id))[0]?.phone:null,
    };
  })
);

return updatedSurgeries;
}
async function empName(empid) {
  const result = await client.query(`
    SELECT
        fname,lname
    FROM employees
    where empid=$1
  `,[empid]);

  return result.rows;
}
async function patientDetails(pat) {
  const result = await client.query(`
    SELECT
        *
    FROM patients
    where patientid=$1
  `,[pat]);

  return result.rows;
}

export default router;