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

    async function addEmployee(empid,fname,lname,dob,salary,gender,superid,designation)
    {
const addEmp= await client.query(`
   INSERT INTO Employees (empid,Fname,lname,dob,salary,gender,superid,designation) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,[empid,fname,lname,dob,salary,gender,superid,designation]);
    }

    addEmployee(11,"Atharv","Batule","2005-07-05",20000,"male",1234,"Attending");

    const result=await client.query(`
    select * from Employees
    `);
    console.log(result.rows)
    console.log("Employees table created successfully");