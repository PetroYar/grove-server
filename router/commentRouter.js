import { Router } from "express";
import commentControler from "../controler/commentControler.js";

import userMiddleware from "../middleware/userMiddleware.js";

const commentRouter = Router();

commentRouter.post("/", userMiddleware, commentControler.create);
commentRouter.get("/", commentControler.getAll);
commentRouter.get("/published", commentControler.getAllPublished);
commentRouter.put("/:id", commentControler.update);
commentRouter.delete("/:id", commentControler.delete);

export default commentRouter;
