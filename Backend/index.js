import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app=express();


app.use(express.json());


app.get("/",(req,res)=>{
    res.send("server get request!")
})

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})