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
      req.body.nurse_name.split(" ")[0],
      req.body.nurse_name.split(" ")[1], // lname
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

    async function updateNurse(empid, fname, lname, dob, salary, gender, superid, designation,phone)
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

    // async function deleteNurse(empid)
    //  {
    //     const deleteSrg = await client.query(
    //     ` DELETE FROM Employees
    //       WHERE empid = $1 `
    //       ,[empid]);
    // }  

    router.put("/",async(req,res)=>{
  try {
   const empid = parseInt(req.body.employee_id);
    const salary = parseInt(req.body.nurse_salary);
    const superid = parseInt(req.body.supervisor_id);
    const phone=parseInt(req.body.nurse_contact)
     if (isNaN(empid) || isNaN(salary) || isNaN(superid)||isNaN(phone)) {
      return res.status(400).send("Employee ID, Salary,phone no. and Supervisor ID must be numbers");
    }

    await updateNurse(
      empid,
      req.body.nurse_name.split(" ")[0], // lname
      req.body.nurse_name.split(" ")[1],// fname
      req.body.nurse_dob,
      salary,
      req.body.nurse_gender,
      superid,
      req.body.nurse_designation,
      phone
    );

    res.send("Surgeon added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})


    router.delete("/",async(req,res)=>{
      try{
      await deleteNurse(parseInt(req.body.employee_id))
      }catch(err){console.log(err)}
      })

      async function deleteNurse(empid)
     {
        const deleteNurse = await client.query(
        ` DELETE FROM Employees
          WHERE empid = $1 `
          ,[empid]);
    }  


export default router;