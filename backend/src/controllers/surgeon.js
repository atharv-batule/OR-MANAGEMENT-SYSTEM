import express from "express"
import cors from "cors"
import dotenev from "dotenv"
//import {app} from "./src/utils/index.js"
import { client } from "../db/db.js";
dotenev.config();
const router=express.Router()
const port=process.env.PORT||3000;
//const port=process.env.PORT||3000;

router.use(express.json())
router.use(cors())

router.get("/", async (req, res) => {
   try {
    const result = await displaySurgeon(); // fetch data (e.g., from DB)
    res.json(result); // send it to frontend as JSON
    console.log();
    console.log("in here")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.put("/",async(req,res)=>{
  try {
   const empid = parseInt(req.body.employee_id);
    const salary = parseInt(req.body.surgeon_salary);
    const superid = parseInt(req.body.supervisor_id);

     if (isNaN(empid) || isNaN(salary) || isNaN(superid)) {
      return res.status(400).send("Employee ID, Salary, and Supervisor ID must be numbers");
    }

    await updateSurgeon(
      empid,
      req.body.surgeon_name.split(" ")[0], // lname
      req.body.surgeon_name.split(" ")[1] || "",// fname
      req.body.surgeon_dob,
      salary,
      req.body.surgeon_gender,
      superid,
      req.body.surgeon_designation,
      phone,
      req.body.dept_no || 0,
      req.body.surgeon_experience_years || 0
    );

    res.send("Surgeon updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})

 const emp=await client.query(`
    CREATE TABLE  IF NOT EXISTS Employees(
    empid INT PRIMARY KEY ,
    Fname VARCHAR(255),
    lname VARCHAR(255),
    dob DATE,
    salary INT,
    gender VARCHAR(255),
    superid INT,
    designation VARCHAR(255),
    phone VARCHAR(20),
    dno INT,
    experience VARCHAR(255) 
    )
    `);
  //add employee
    async function addSurgeon(empid,fname,lname,dob,salary,gender,superid,designation,phone,dno,experience)
    {
    const addSrg= await client.query(`
   INSERT INTO Employees (empid,Fname,lname,dob,salary,gender,superid,designation,phone,dno,experience) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `,[empid,fname,lname,dob,salary,gender,superid,designation,phone,dno,experience]);
    }

    //update employe
    // async function updateSurgeon(empid, fname, lname, dob, salary, gender, superid, designation,phone)
    //  {
    //     const updateEmp = await client.query(
    //     ` UPDATE Employees
    //       SET 
    //         fname = $1,
    //         lname = $2,
    //         dob = $3,
    //         salary = $4,
    //         gender = $5,
    //         superid = $6,
    //         designation = $7,
    //         phone=$8
    //       WHERE empid = $9
    //       `
    //       ,[fname, lname, dob, salary, gender, superid, designation, phone,empid] );
    // }
    //delete surgeon querry
    async function deleteSurgeon(empid)
     {
        const deleteSrg = await client.query(
        ` DELETE FROM employees
          WHERE empid = $1 `
          ,[empid]);
    }  
   
    

    async function displaySurgeon()
     {
        const result=await client.query(`
        SELECT * FROM Employees
         WHERE designation IN ('Attending', 'Intern', 'Resident') 
          `);
          return result.rows;
    }  
    //addEmployee(11,"Atharv","Batule","2005-07-05",20000,"male",1234,"Attending");
    //updateEmployee(11,"Sameer","Naik","2005-07-05",20000,"male",1234,"Attending");

    const result=await client.query(`
    select * from Employees
    `); 
    // const alt=client.query(`
    //   ALTER TABLE Employees
    //   ADD Phone VARCHAR (255)

    //   `)
    console.log(result.rows)
    console.log("Employees table created successfully");

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
      req.body.surgeon_name.split(" ")[0],
      req.body.surgeon_name.split(" ")[1] || "",
      req.body.surgeon_dob,
      salary,
      req.body.surgeon_gender,
      superid,
      req.body.surgeon_designation,
      phone1,
      0,
      req.body.surgeon_experience_years || 0
    );

    res.send("Surgeon added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

async function updateSurgeon(empid, fname, lname, dob, salary, gender, superid, designation,phone,dno,experience)
    {
    const upSur= await client.query(`
UPDATE employees
SET 
  fname = $2,
  lname = $3,
  dob = $4,
  salary = $5,
  gender = $6,
  superid = $7,
  designation = $8,
  phone = $9,
  dno = $10,
  experience = $11
WHERE empid = $1;
    `,[empid, fname, lname, dob, salary, gender, superid, designation,phone,dno,experience]);
    }

   router.delete("/", async (req, res) => {
    console.log("Delete request received!");
  console.log("Request body:", req.body);
  try {
    const empid = parseInt(req.body.employee_id);
    if (isNaN(empid)) return res.status(400).send("Invalid empid");

    await deleteSurgeon(empid);
    res.status(200).send("Surgeon deleted successfully");
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).send("Error deleting surgeon");
  }
});


    export default router;