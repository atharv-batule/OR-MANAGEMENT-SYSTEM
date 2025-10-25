import express from "express"
import cors from "cors"
import dotenev from "dotenv"
//import {app} from "./src/utils/index.js"
import { client } from "../db/db.js";
dotenev.config();
const router=express.Router()
const port=process.env.PORT||3000


async function empName(empid) {
  const result = await client.query(`
    SELECT
        fname,lname
    FROM employees
    where empid=$1
  `,[empid]);

  return result.rows;
}

export {empName};