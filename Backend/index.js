import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
// import xlsx from  'xlsx2';
import connection from './config/db.js';   ///autoTriggers what is in db.js

dotenv.config();

const app=express();



app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("server get request!")
})

app.listen(3000,()=>{
    console.log('server is running on port 3000')
})