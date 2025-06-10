import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors';

import connection from './config/db.js';   ///autoTriggers what is in db.js
import excelRoutes from './routes/excelRoutes.js'

dotenv.config();

const app=express();



app.use(cors());
app.use(express.json());
app.use('/api',excelRoutes);


app.get("/",(req,res)=>{
    res.send("server get request!")
})




app.listen(3000,()=>{
    console.log('server is running on port 3000')
})