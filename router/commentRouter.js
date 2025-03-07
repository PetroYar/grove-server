import { Router } from "express";
import commentControler from "../controler/commentControler.js";
import authMiddleware from "../middleware/authMiddleware.js";

const commentRouter = Router()

commentRouter.post('/',authMiddleware,commentControler.create)
commentRouter.get("/",  commentControler.getAll);
commentRouter.put("/:id", commentControler.update);




export default commentRouter