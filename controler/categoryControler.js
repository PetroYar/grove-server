import cloudinary from "cloudinary";
import fs from "fs";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import slugify from "slugify";

const categoryControler = {
  create: async (req, res) => {
    console.log(33)
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

      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Імя обов'язкове" });
      }
      if (!description) {
        return res.status(400).json({ error: "Опис обов'язковий" });
      }
      const slugi = slugify(name, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      });
      const newCategory = new Category({
        name,
        description,
        slug: slugi,
        image: result.secure_url,
        imageId: result.public_id,
      });
      await newCategory.save();

      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  deleteOne: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({ error: "Категорія не знайдена" });
      }

      await cloudinary.v2.uploader.destroy(
        category.imageId,
        (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ error: "Помилка видалення зображення" });
          }
        }
      );

      await Category.findByIdAndDelete(id);

      res.status(200).json({ message: "Категорію видалено" });
    } catch (error) {
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  getAll: async (req, res) => {
    try {
      const categories = await Category.find();
      if (categories.length === 0) {
        return res.status(404).json({ message: "Категорії не знайдені" });
      }
      res.status(200).json(categories);
    } catch (error) {
      console.error("Помилка при отриманні категорій:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невірний ID категорії" });
      }

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ error: "Категорію не знайдено" });
      }

      let updatedImage = category.image;
      let updatedImageId = category.imageId;

      if (req.file) {
        console.log("File received:", req.file);

        const result = await cloudinary.v2.uploader.upload(req.file.path);
        updatedImage = result.secure_url;
        updatedImageId = result.public_id;

        if (category.imageId) {
          console.log("Deleting old image from Cloudinary...");
          await cloudinary.v2.uploader.destroy(category.imageId);
        }

        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.log("Помилка видалення файлу з локальної папки:", err);
          }
        });
      } else {
        console.log("No file received");
      }
      const slugi = slugify(name, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      });
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
          name,
          description,
          slug: slugi,
          image: updatedImage,
          imageId: updatedImageId,
        },
        { new: true }
      );

      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Помилка при оновленні категорії:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

export default categoryControler;
