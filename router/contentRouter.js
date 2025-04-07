import { Router } from "express";
import contentControler from "../controler/contentControler.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const contentRouter = Router();

contentRouter.post("/",uploadMiddleware, contentControler.create);
contentRouter.get("/page/:page", contentControler.getPageContent);
contentRouter.get("/pages", contentControler.getPages);
contentRouter.get("/:key", contentControler.getOne);
contentRouter.put("/:key",uploadMiddleware, contentControler.update);
contentRouter.delete("/:key", contentControler.delete);

export default contentRouter;
