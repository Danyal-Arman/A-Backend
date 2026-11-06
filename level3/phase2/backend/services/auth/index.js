import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.get("/",(req, res)=>{
  return res.status(200).json({message:"Hello from auth service"});  
});
app.listen(port, ()=>{
    console.log(`Your server is running on port ${port}`)
})