import { Router } from "express";
import categoryControler from "../controler/categoryControler.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const categoryRouter = Router();

categoryRouter.post("/", uploadMiddleware, categoryControler.create);
categoryRouter.delete("/:id", categoryControler.deleteOne);
categoryRouter.get("/", categoryControler.getAll);
categoryRouter.put("/:id",uploadMiddleware, categoryControler.update);


export default categoryRouter;
