import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { client } from "../db/db.js";

dotenv.config();
const router = express.Router();

router.use(express.json());
router.use(cors());

/* ========================= GET SURGERIES ========================= */
router.get("/", async (req, res) => {
  try {
    const [
      surgeries,
      attending,
      nurse,
      anesthesiologist,
      resident,
      intern,
      patient,
      or
    ] = await Promise.all([
      getSurgeries(),
      client.query(`SELECT * FROM employees WHERE designation = 'Attending'`),
      client.query(`SELECT * FROM employees WHERE designation = 'Nurse'`),
      client.query(`SELECT * FROM employees WHERE designation = 'Anesthesiologist'`),
      client.query(`SELECT * FROM employees WHERE designation = 'Resident'`),
      client.query(`SELECT * FROM employees WHERE designation = 'Intern'`),
      client.query(`SELECT * FROM patients`),
      client.query(`SELECT * FROM or_table`)
    ]);

    res.json({
      result: surgeries,
      attending: attending.rows,
      nurse: nurse.rows,
      anesthesiologist: anesthesiologist.rows,
      resident: resident.rows,
      intern: intern.rows,
      patient: patient.rows,
      or: or.rows
    });

  } catch (err) {
    console.error("❌ GET /surgery failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= QUERY ========================= */
async function getSurgeries() {
  const result = await client.query(`
    SELECT
      s.surgery_id,
      s.patient_id,
      s.or_id,
      s.surgery_date,
      s.surgery_start,
      s.surgery_end,
      s.surgery_notes,
      s.procedure,

      MAX(CASE WHEN e.designation='Attending' THEN e.fname || ' ' || e.lname END) AS attending_name,
      MAX(CASE WHEN e.designation='Resident' THEN e.fname || ' ' || e.lname END) AS resident_name,
      MAX(CASE WHEN e.designation='Intern' THEN e.fname || ' ' || e.lname END) AS intern_name,
      MAX(CASE WHEN e.designation='Nurse' THEN e.fname || ' ' || e.lname END) AS nurse_name,
      MAX(CASE WHEN e.designation='Anesthesiologist' THEN e.fname || ' ' || e.lname END) AS anesthesiologist_name

    FROM surgery s
    LEFT JOIN surgery_staff ss ON ss.surgery_id = s.surgery_id
    LEFT JOIN employees e ON e.empid = ss.emp_id
    GROUP BY s.surgery_id
    ORDER BY s.surgery_id ASC;
  `);

  return result.rows;
}

/* ========================= ADD SURGERY ========================= */
router.post("/", async (req, res) => {
  await client.query("BEGIN");
  try {
    const {
      surgery_id, patient_id, or_id,
      surgery_date, surgery_start, surgery_end,
      surgery_notes, procedure,
      attending_id, resident_id, intern_id,
      nurse_id, anesthesiologist_id
    } = req.body;

    await client.query(`
      INSERT INTO surgery
      (surgery_id, patient_id, or_id, surgery_date, surgery_start, surgery_end, surgery_notes, procedure)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [
      surgery_id, patient_id, or_id,
      surgery_date, surgery_start, surgery_end,
      surgery_notes, procedure
    ]);

    const staff = [
      attending_id, resident_id, intern_id, nurse_id, anesthesiologist_id
    ].filter(id => id && !isNaN(id));

    for (const emp_id of staff) {
      await client.query(
        `INSERT INTO surgery_staff (surgery_id, emp_id) VALUES ($1,$2)`,
        [surgery_id, emp_id]
      );
    }

    await client.query("COMMIT");
    res.json({ success: true });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ POST /surgery failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ========================= UPDATE SURGERY ========================= */
router.put("/", async (req, res) => {
  await client.query("BEGIN");
  try {
    const {
      surgery_id, patient_id, or_id,
      surgery_date, surgery_start, surgery_end,
      surgery_notes, procedure,
      attending_id, resident_id, intern_id,
      nurse_id, anesthesiologist_id
    } = req.body;

    await client.query(`
      UPDATE surgery
      SET or_id=$1, surgery_date=$2, surgery_start=$3,
          surgery_end=$4, surgery_notes=$5, procedure=$6
      WHERE surgery_id=$7 AND patient_id=$8
    `, [
      or_id, surgery_date, surgery_start,
      surgery_end, surgery_notes, procedure,
      surgery_id, patient_id
    ]);

    await client.query(`DELETE FROM surgery_staff WHERE surgery_id=$1`, [surgery_id]);

    const staff = [
      attending_id, resident_id, intern_id, nurse_id, anesthesiologist_id
    ].filter(id => id && !isNaN(id));

    for (const emp_id of staff) {
      await client.query(
        `INSERT INTO surgery_staff (surgery_id, emp_id) VALUES ($1,$2)`,
        [surgery_id, emp_id]
      );
    }

    await client.query("COMMIT");
    res.json({ success: true });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ PUT /surgery failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
