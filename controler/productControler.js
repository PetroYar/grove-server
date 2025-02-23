import cloudinary from "cloudinary";
import fs from "fs";
import mongoose from "mongoose";

import Product from "../models/Product.js";
import Category from "../models/Category.js";

const productControler = {
  create: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Фото обов'язкове" });
      }

      const result = await cloudinary.v2.uploader.upload(req.file.path);

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log("Помилка видалення файлу з локальної папки:", err);
        }
      });
      const categoryId = req.params.id;
      //
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: "Невалідний ID категорії" });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ error: "Не правильний ID категорії" });
      }

      const { name, description, price } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Імя обов'язкове" });
      }
      if (!description) {
        return res.status(400).json({ error: "Опис обов'язковий" });
      }
      if (!price) {
        return res.status(400).json({ error: "Ціна обов'язкова" });
      }

      const newProduct = new Product({
        name,
        description,
        price,
        image: result.secure_url,
        imageId: result.public_id,
        categoryId,
      });

      await newProduct.save();

      res.status(201).json({ message: "Продукт створено", data: newProduct });
    } catch (error) {
      console.error("Помилка при створенні продукту:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ error: "Продукт не знайдений" });
      }

      await cloudinary.v2.uploader.destroy(product.imageId, (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Помилка видалення зображення" });
        }
      });

      await Product.findByIdAndDelete(id);

      res.status(200).json({ message: "Продукт видалено" });
    } catch (error) {
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  getAll: async (req, res) => {
    try {
      const products = await Product.find();
      if (products.length === 0) {
        return res.status(404).json({ message: "Продукти не знайдені" });
      }
      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Помилка при отриманні продуктів:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

export default productControler;
