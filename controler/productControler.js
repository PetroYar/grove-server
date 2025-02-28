import cloudinary from "cloudinary";
import fs from "fs";
import mongoose from "mongoose";
import slugify from "slugify";
import Product from "../models/Product.js";

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

      const { name, description, price, discount, categoryId } = req.body;

      const seo = JSON.parse(req.body.seo);

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: "Невалідний ID категорії" });
      }
      if (!name) {
        return res.status(400).json({ error: "Імя обов'язкове" });
      }

      if (!description) {
        return res.status(400).json({ error: "Опис обов'язковий" });
      }
      if (!price) {
        return res.status(400).json({ error: "Ціна обов'язкова" });
      }

      if (!seo || !seo.title || !seo.description || !seo.keywords) {
        return res.status(400).json({ error: "SEO мета-дані обов'язкові" });
      }

      const slugi = slugify(name, {
        replacement: "-", 
        remove: /[*+~.()'"!:@]/g, 
        lower: true, 
      });

      const newProduct = new Product({
        name,
        description,
        price,
        slug: slugi,
        image: result.secure_url,
        imageId: result.public_id,
        categoryId,
        seo: {
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
        },
        discount: discount || 0,
      });
      console.log(newProduct);
      await newProduct.save();

      res.status(201).json(newProduct);
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
      res.status(200).json(products);
    } catch (error) {
      console.error("Помилка при отриманні продуктів:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  getAllPagination: async (req, res) => {
    try {
      const { _limit = 5, _start = 0, _order = "desc" } = req.query;
      const limit = parseInt(_limit, 10);
      const start = parseInt(_start, 10);
      const sortOrder = _order === "desc" ? -1 : 1;
      const currentPage = Math.floor(start / limit) + 1;
      const result = await Post.aggregate([
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            posts: [
              { $sort: { createdAt: sortOrder } },
              { $skip: start },
              { $limit: limit },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user",
                },
              },
              { $unwind: "$user" },
            ],
          },
        },
      ]);
      const totalPosts = result[0].totalCount[0]?.count || 0;
      const posts = result[0].posts;
      const totalPages = Math.ceil(totalPosts / limit);

      res.status(200).json({
        firstPage: 1,
        lastPage: totalPages,
        currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        posts,
        _limit: limit,
        _start: start,
        _order: _order,
      });
    } catch (error) {
      return res.status(400).json({ message: "Error retrieving posts", error });
    }
  },
  getOne: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Продукт не знайдено" });
    }
    return res.status(400).json(product);
  },
};

export default productControler;
