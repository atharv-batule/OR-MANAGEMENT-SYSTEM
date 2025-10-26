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
    const result = await displayNurse(); 
    res.json(result); 
    console.log();
    console.log("in here")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function displayNurse()
{
    const result=await client.query(`
        SELECT * FROM Employees
         WHERE designation IN ('Nurse') 
          `);
          return result.rows;
} 

router.post("/",async(req,res)=>{
try {
  console.log("inside post")
    const empid = parseInt(req.body.employee_id);
    const salary = parseInt(req.body.nurse_salary);
    const superid = parseInt(req.body.supervisor_id);

    if (isNaN(empid) || isNaN(salary) || isNaN(superid)) {
      return res.status(400).send("Employee ID, Salary, and Supervisor ID must be numbers");
    }

    await addNurse(
      empid,
      req.body.nurse_name,
      "", // lname
      req.body.nurse_dob,
      salary,
      req.body.nurse_gender,
      superid,
      req.body.nurse_designation
    );
console.log("added nurse scuessfully")
    res.send("Nurse added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
);
 async function addNurse(empid,fname,lname,dob,salary,gender,superid,designation)
 {
    const add= await client.query(`
   INSERT INTO Employees (empid,Fname,lname,dob,salary,gender,superid,designation) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,[empid,fname,lname,dob,salary,gender,superid,"Nurse"]);
    }
export default router;