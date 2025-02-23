import cloudinary from "cloudinary";
import fs from "fs";
import Category from "../models/Category.js";

const categoryControler = {
  create: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Фото обов'язкове" });
      }
      const result = await cloudinary.v2.uploader.upload(req.file.path);

      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Імя обов'язкове" });
      }
      if (!description) {
        return res.status(400).json({ error: "Опис обов'язковий" });
      }

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log("Помилка видалення файлу з локальної папки:", err);
        }
      });

      const newCategory = new Category({
        name,
        description,
        image: result.secure_url,
        imageId: result.public_id,
      });

      await newCategory.save();

      res
        .status(201)
        .json({ message: "Категорію  створено", data: newCategory });
    } catch (error) {
      console.error("Помилка при створенні категорії:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Category.findById(id);

      if (!product) {
        return res.status(404).json({ error: "Категорія не знайдена" });
      }

      await cloudinary.v2.uploader.destroy(product.imageId, (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Помилка видалення зображення" });
        }
      });

      await Category.findByIdAndDelete(id);

      res.status(200).json({ message: "Продукт видалено" });
    } catch (error) {
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  getAll: async (req, res) => {
    try {
      const categories = await Category.find(); // Отримуємо всі категорії з бази даних
      if (categories.length === 0) {
        return res.status(404).json({ message: "Категорії не знайдені" });
      }
      res
        .status(200)
        .json({ data: categories });
    } catch (error) {
      console.error("Помилка при отриманні категорій:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

export default categoryControler;
