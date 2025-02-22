import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

import adminRouter from "./router/adminRouter.js";
import authRouter from "./router/authRouter.js";

import productRouter from "./router/productRouter.js";
import productControler from "./controler/productControler.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Налаштування multer для зберігання файлів
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Зберігання файлів у папці "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Іменування файлів
  },
});

export const upload = multer({ storage: storage });

app.use("/", adminRouter);
app.use("/api", authRouter);

app.use("/api/", upload.single("image"), productRouter);


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
