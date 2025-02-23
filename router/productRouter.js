import { Router } from "express";
import productControler from "../controler/productControler.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const productRouter = Router();

productRouter.post("/product/:id",uploadMiddleware, productControler.create);
productRouter.delete("/product/:id", productControler.delete);
productRouter.get("/product", productControler.getAll);



export default productRouter;
