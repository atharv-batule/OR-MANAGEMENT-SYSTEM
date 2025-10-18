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

//create table
 const emp=await client.query(`
    CREATE TABLE Surgeries IF NOT EXISTS(
  surgery_id SERIAL PRIMARY KEY,
  surgery_date DATE NOT NULL,
  surgery_time TIME NOT NULL,
  surgery_type VARCHAR(100) NOT NULL,
  duration_minutes INT NOT NULL,
  patient_id INT NOT NULL REFERENCES Patients(patient_id),
  operation_room_id INT NOT NULL REFERENCES OperationRooms(room_id),
  surgeon_id INT NOT NULL REFERENCES Employees(employee_id),
  anesthesiologist_id INT REFERENCES Employees(employee_id),
  nurse_id INT REFERENCES Employees(employee_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
    `);
    console.log("success");