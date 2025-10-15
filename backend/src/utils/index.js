import express from "express"
import cors from "cors"
import dotenev from "dotenv"
import { client } from "../db/db.js";
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
//server running 
app.listen(port,()=>
{
    console.log(`server is running on http:localhost:${port}`)
})