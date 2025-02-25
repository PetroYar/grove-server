import { Router } from "express";
import adminControler from "../controler/adminControler.js";
import authMiddleware from "../middleware/authMiddleware.js";

const adminRouter = Router()

adminRouter.post('/admin/login',adminControler.login)
adminRouter.get("/admin",authMiddleware, adminControler.getAdmin);




export default adminRouter