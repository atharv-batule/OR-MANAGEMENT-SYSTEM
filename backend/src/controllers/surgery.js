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
    const result = await displaySurg(); 
    const attending = await client.query(`
  SELECT * FROM employees WHERE designation = 'Attending'
`);

const nurse = await client.query(`
  SELECT * FROM employees WHERE designation = 'Nurse'
`);

const anesthesiologist = await client.query(`
  SELECT * FROM employees WHERE designation = 'Anesthesiologist'
`);

const resident = await client.query(`
  SELECT * FROM employees WHERE designation = 'Resident'
`);

const intern = await client.query(`
  SELECT * FROM employees WHERE designation = 'Intern'
`);
const patient = await client.query(`
  SELECT * FROM patients 
`);
const or = await client.query(`
  SELECT * FROM or_table 
`);
  res.json(
  {result,
  attending: attending.rows,
  nurse: nurse.rows,
  anesthesiologist: anesthesiologist.rows,
  resident: resident.rows,
  intern: intern.rows,
  patient:patient.rows,
  or:or.rows
    }); 
    console.log();
    console.log("in here")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

async function displaySurg() {
  const result = await client.query(`
    SELECT
        S.surgery_id,
        S.patient_id,
        S.or_id,
        S.surgery_date,
        S.surgery_start,
        S.surgery_end,
        S.surgery_notes,
        MAX(CASE WHEN E.designation = 'Attending' THEN L.emp_id END) AS attending_id,
        MAX(CASE WHEN E.designation = 'Intern' THEN L.emp_id END) AS intern_id,
        MAX(CASE WHEN E.designation = 'Anesthesiologist' THEN L.emp_id END) AS anesthesiologist_id,
        MAX(CASE WHEN E.designation = 'Resident' THEN L.emp_id END) AS resident_id,
        MAX(CASE WHEN E.designation = 'Nurse' THEN L.emp_id END) AS nurse_id
    FROM
        Surgery S
    JOIN
        surgery_staff L ON S.surgery_id = L.surgery_id
    JOIN
        Employees E ON L.emp_id = E.empid
    GROUP BY
        S.surgery_id,
        S.patient_id,
        S.or_id,
        S.surgery_date,
        S.surgery_start,
        S.surgery_end,
        S.surgery_notes;
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
      resident_name: surgery.resident_id ? (await empName(surgery.resident_id))[0]?.fname + " " + (await empName(surgery.resident_id))[0]?.lname : null
    };
  })
);

return (updatedSurgeries);
}
router.post("/",async(req,res)=>{
  try{
  const temp=await addSurg(
parseInt(req.body.surgery_id),
parseInt(req.body.patient_id),
parseInt(req.body.or_id),
req.body.surgery_date,
req.body.surgery_start,
req.body.surgery_end,
req.body.surgery_notes,
parseInt(req.body.attending_id),
parseInt(req.body.resident_id),
parseInt(req.body.intern_id),
parseInt(req.body.nurse_id),
parseInt(req.body.anesthesiologist_id),
req.body.procedure

  );
//   if (temp.rowCount === 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Surgery could not be scheduled. The selected OR is already booked during this time.",
//       });
// }
  
  console.log("Insert result:", temp);
    res.json({ success: true, temp });

  } catch (err) {
    console.error("Error in POST /surgery:", err);
    res.status(500).json({ success: false, error: err.message });
  }finally{}

})
async function addSurg(
  surgery_id, patient_id, or_id, surgery_date, surgery_start, surgery_end,
  surgery_notes, attending_id, resident_id, intern_id, nurse_id, anesthesiologist_id, procedure
) {
  await client.query("BEGIN");
  try {
    const query = `
      WITH conflict AS (
        SELECT COUNT(*) AS cnt
        FROM surgery
        WHERE surgery_date = $4
          AND or_id = $3
          AND (surgery_start, surgery_end) OVERLAPS ($5::time, $6::time)
      ),
      ins_surgery AS (
        INSERT INTO surgery (surgery_id, patient_id, or_id, surgery_date, surgery_start, surgery_end, surgery_notes, procedure)
        SELECT $1, $2, $3, $4, $5, $6, $7, $13
        WHERE (SELECT cnt FROM conflict) = 0
        RETURNING surgery_id
      )
      INSERT INTO surgery_staff (surgery_id, emp_id)
      SELECT surgery_id, emp_id
      FROM ins_surgery,
      LATERAL (VALUES ($8), ($9), ($10), ($11), ($12)) AS v(emp_id);
    `;

    const params = [
      surgery_id, patient_id, or_id, surgery_date, surgery_start, surgery_end,
      surgery_notes, attending_id, resident_id, intern_id, nurse_id, anesthesiologist_id, procedure
    ];

    const result = await client.query(query, params);
    await client.query("COMMIT");
    return result.rowCount;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
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

export default router;