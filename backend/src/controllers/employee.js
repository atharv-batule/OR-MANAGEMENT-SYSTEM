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
  res.json([
    { name: "atharv", age: 20 },
    { name: "rahul", age: 25 }
  ]);
});

 const emp=await client.query(`
    CREATE TABLE  IF NOT EXISTS Employees(
    empid INT PRIMARY KEY ,
    Fname VARCHAR(255),
    lname VARCHAR(255),
    dob DATE,
    salary INT,
    gender VARCHAR(255),
    superid INT,
    designation VARCHAR(255) 
    )
    `);
  //add employee
    async function addSurgeon(empid,fname,lname,dob,salary,gender,superid,designation)
    {
    const addSrg= await client.query(`
   INSERT INTO Employees (empid,Fname,lname,dob,salary,gender,superid,designation) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,[empid,fname,lname,dob,salary,gender,superid,designation]);
    }

    //update employe
    async function updateSurgeon(empid, fname, lname, dob, salary, gender, superid, designation,phone)
     {
        const updateEmp = await client.query(
        ` UPDATE Employees
          SET 
            fname = $1,
            lname = $2,
            dob = $3,
            salary = $4,
            gender = $5,
            superid = $6,
            designation = $7,
            phone=$8
          WHERE empid = $9
          `
          ,[fname, lname, dob, salary, gender, superid, designation, phone,empid] );
    }
    //delete surgeon querry
    async function deleteSurgeon(empid)
     {
        const deleteSrg = await client.query(
        ` DELETE FROM Employees
          WHERE empid = $1 `
          ,[empid]);
    }  
    deleteSurgeon(11)
    

    async function displaySurgeon(empid)
     {
        const result=await client.query(`
        SeLECT * FROM Employees
        WHERE empid=$1`,[empid]);
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