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
         order by empid asc
          `);
          return result.rows;
} 

router.put("/", async (req, res) => {
  try {
    const empid = Number(req.body.employee_id);
    const salary = Number(req.body.anaesth_salary);
    const superid = Number(req.body.supervisor_id);
    const phone = req.body.anaesth_contact?.toString() || "";

    if (isNaN(empid) || isNaN(salary) || isNaN(superid)) {
      return res.status(400).send("Invalid numeric fields");
    }

    const [fname, lname = ""] = req.body.anaesth_name.split(" ");

    await updateAnaesth(
      empid,
      fname,
      lname,
      req.body.anaesth_dob,
      salary,
      req.body.anaesth_gender,
      superid,
      req.body.anaesth_designation,
      phone
    );

    res.send("Anesthesiologist updated successfully");
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).send("Internal Server Error");
  }
});

async function updateAnaesth(
  empid,
  fname,
  lname,
  dob,
  salary,
  gender,
  superid,
  designation,
  phone
) {
  await client.query(
    `
    UPDATE Employees
    SET 
      fname = $2,
      lname = $3,
      dob = $4,
      salary = $5,
      gender = $6,
      superid = $7,
      designation = $8,
      phone = $9
    WHERE empid = $1;
    `,
    [empid, fname, lname, dob, salary, gender, superid, designation, phone]
  );
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

      router.delete("/",async(req,res)=>{
        try{
        await deleteAnaesth(parseInt(req.body.employee_id))
        }catch(err){console.log(err)}
        })

      async function deleteAnaesth(empid)
     {
        const deleteAnaesth = await client.query(
        ` DELETE FROM Employees
          WHERE empid = $1 `
          ,[empid]);
    }  

export default router;