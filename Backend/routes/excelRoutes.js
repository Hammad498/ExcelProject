import { Router } from "express";
import upload from "../middlewares/multerMiddleware.js";
import { uploadExcel,getUsers } from "../controllers/excelController.js";

const router=Router();

router.post('/upload',upload.single('file'),uploadExcel);
router.get('/users',getUsers);


export default router;
