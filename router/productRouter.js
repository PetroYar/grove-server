import { Router } from "express";
import productControler from "../controler/productControler.js";

const productRouter = Router();

productRouter.post("/product/:id", productControler.create);
productRouter.delete("/product/:id", productControler.delete);


export default productRouter;
