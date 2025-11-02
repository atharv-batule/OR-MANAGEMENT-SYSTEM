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
    const or_info = await client.query(`
  SELECT * FROM surgery_details_view 
`);
res.json(or_info.rows) 
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;