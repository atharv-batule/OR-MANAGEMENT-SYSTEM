import express from "express"
import cors from "cors"
import dotenev from "dotenv"
import { client } from "../db/db.js";
import { authenticateToken, authorize } from "../middlewares/auth.js";

dotenev.config();
const router=express.Router()
const port=process.env.PORT||3000;

router.use(express.json())
router.use(cors())
// authenticateToekn
router.get("/", async (req, res) => {
  
});
router.put("/", async (req, res) => {
  
});

 

router.post("/", async (req, res) => {
  
    
});



   router.delete("/", async (req, res) => {
   
  
});


    export default router;