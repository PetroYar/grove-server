import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import adminRouter from "./router/adminRouter.js";
import authRouter from "./router/authRouter.js";

import productRouter from "./router/productRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import visitRouter from "./router/visitRouter.js";
import commentRouter from "./router/commentRouter.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", adminRouter);
app.use("/api", authRouter);

app.use("/api", productRouter);
app.use("/api/category", categoryRouter);
app.use("/", visitRouter);
app.use("/api/comment", commentRouter);

const startApp = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(5000, () => {
      console.log(" start server");
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
