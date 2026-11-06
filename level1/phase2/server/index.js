import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.get("/",(req, res)=>{
  return res.status(200).json({message:"Hello this is docker"});  
});
app.listen(port, (req,res)=>{
    console.log("Your server is running on port 8000")
})