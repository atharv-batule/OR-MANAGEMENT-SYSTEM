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
    const empid = parseInt(req.body.employee_id);
    const salary = parseInt(req.body.surgeon_salary);
    const superid = parseInt(req.body.supervisor_id);

    if (isNaN(empid) || isNaN(salary) || isNaN(superid)) {
      return res.status(400).send("Employee ID, Salary, and Supervisor ID must be numbers");
    }

    await addSurgeon(
      empid,
      req.body.surgeon_name,
      "", // lname
      req.body.surgeon_dob,
      salary,
      req.body.surgeon_gender,
      superid,
      req.body.surgeon_designation
    );

    res.send("Surgeon added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});




export default router;