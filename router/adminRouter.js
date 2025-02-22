import { Router } from "express";
import adminControler from "../controler/adminControler.js";

const adminRouter = Router()

adminRouter.post('/admin/login',adminControler.login)



export default adminRouter