import { Router } from "express";
import commentControler from "../controler/commentControler.js";

const commentRouter = Router()

commentRouter.post('/',commentControler.create)


export default commentRouter