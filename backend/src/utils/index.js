import express from "express"
import cors from "cors"
import dotenev from "dotenv"
import { client } from "../db/db.js";
import surgeonRoutes from "../controllers/surgeon.js";
import patientRoutes from"../controllers/patient.js"
import nurseRoutes from "../controllers/nurse.js"
import anesthRoutes from "../controllers/anesth.js"
import orRoutes from "../controllers/operationRoom.js"
dotenev.config();

const app=express();
const port=process.env.PORT||3000;

app.use(express.json())
app.use(cors())

//routes 

//error handeling

//testing db connection
app.get("/", async(req,res)=>
{
    const result=await client.query("SELECT current_database()");
    res.send(`${result.rows[0].current_database}`)
})
app.post("/", async(req,res)=>
{
    const result=await client.query("SELECT * from user1");
    //res.json(`${result.rows[0]}`)
    
    console.log(result.rows[0])
})

app.get("/registration", async(req,res)=>
{
    const result=await client.query("SELECT current_database()");
   // res.send(`${result.rows[0]}`)
    res.json([
  { "id": 1, "name": "John" },
  { "id": 2, "name": "Sarah" }
])
})

//patient data retrieval
app.get("/registration", async(req,res)=>
{
    const result=await client.query("SELECT current_database()");
   // res.send(`${result.rows[0]}`)
    res.send()
})
app.use("/surgeons", surgeonRoutes);
app.use("/patients", patientRoutes);
app.use("/nurses", nurseRoutes);
app.use("/anesthesiologists", anesthRoutes);
app.use("/operation-rooms",orRoutes );
//server running 
app.listen(port,()=>
{
    console.log(`server is running on http:localhost:${port}`)
})






//export default app