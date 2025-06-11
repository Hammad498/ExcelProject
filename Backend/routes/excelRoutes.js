// import { Router } from "express";
// import upload from "../middlewares/multerMiddleware.js";
// import { uploadExcel,getUsers } from "../controllers/excelController.js";

// const router=Router();

// router.post('/upload',upload.single('file'),uploadExcel);
// router.get('/users',getUsers);


// export default router;

///////////////////

import { Router } from 'express';
import upload from '../middlewares/multerMiddleware.js';
import { uploadExcel, getUsers } from '../controllers/excelController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), uploadExcel);
router.get('/users', authenticate, getUsers);

export default router;
