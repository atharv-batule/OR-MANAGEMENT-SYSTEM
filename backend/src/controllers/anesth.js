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
    const result = await displayAnesth(); 
    res.json(result); 
    console.log();
    console.log("in here")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function displayAnesth()
{
    const result=await client.query(`
        SELECT * FROM Employees
         WHERE designation IN ('Anesthesiologist') 
          `);
          return result.rows;
} 

router.post("/",async(req,res)=>{
try {
  console.log("inside post")
    const empid = parseInt(req.body.employee_id);
    const salary = parseInt(req.body.anaesth_salary);
    const superid = parseInt(req.body.supervisor_id);
    const phone=parseInt(req.body.anaesth_contact)
    if (isNaN(empid) || isNaN(salary) || isNaN(superid)) {
      return res.status(400).send("Employee ID, Salary, and Supervisor ID must be numbers");
    }

    await addAnesth(
      empid,
      req.body.anaesth_name,
      "", // lname
      req.body.anaesth_dob,
      salary,
      req.body.anaesth_gender,
      superid,
      req.body.anaesth_designation,
      phone
    );
console.log("added anesth scuessfully")
    res.send("anesth added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
);
 async function addAnesth(empid,fname,lname,dob,salary,gender,superid,designation,phone)
 {
    const add= await client.query(`
   INSERT INTO Employees (empid,Fname,lname,dob,salary,gender,superid,designation,phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `,[empid,fname,lname,dob,salary,gender,superid,"Anesthesiologist",phone]);
    }
export default router;