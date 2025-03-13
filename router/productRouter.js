import { Router } from "express";
import productControler from "../controler/productControler.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const productRouter = Router();

productRouter.post("/product", uploadMiddleware, productControler.create);
productRouter.delete("/product/:id", productControler.delete);
productRouter.get("/products", productControler.getAll);
productRouter.get(
  "/products/category/:slug",
  productControler.getByCategorySlug
);
productRouter.get("/product/:id", productControler.getOne);
productRouter.put("/product/:id", uploadMiddleware, productControler.update);

export default productRouter;
