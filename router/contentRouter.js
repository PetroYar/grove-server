import { Router } from "express";
import contentControler from "../controler/contentControler.js";
import uploadMiddlewareContent from "../middleware/uploadMiddlewareContent.js";

const contentRouter = Router();

contentRouter.post("/",uploadMiddlewareContent, contentControler.create);
contentRouter.get("/page/:page", contentControler.getPageContent);
contentRouter.get("/pages", contentControler.getPages);
contentRouter.get("/:key", contentControler.getOne);
contentRouter.put("/:key",uploadMiddlewareContent, contentControler.update);
contentRouter.delete("/:key", contentControler.delete);

export default contentRouter;
