import express from "express"
import cors from "cors"
import dotenev from "dotenv"
dotenev.config();

const app=express();
const port=process.env.PORT||3000;

app.use(express.json())
app.use(cors)

//routes 

//error handeling

//server running 
app.listen(port,()=>
{
    console.log(`server is running on http:localhost:${port}`)
})