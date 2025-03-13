import cloudinary from "cloudinary";
import fs from "fs";
import mongoose from "mongoose";
import slugify from "slugify";
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

      const { name, description, price, discount, categories, size } = req.body;
      console.log(req.body);
      const seo = JSON.parse(req.body.seo);

      if (!name) {
        return res.status(400).json({ error: "Імя обов'язкове" });
      }

      if (!description) {
        return res.status(400).json({ error: "Опис обов'язковий" });
      }
      if (!price) {
        return res.status(400).json({ error: "Ціна обов'язкова" });
      }
      if (!size) {
        return res.status(400).json({ error: "Розмір обов'язковий" });
      }

      if (!seo || !seo.title || !seo.description || !seo.keywords) {
        return res.status(400).json({ error: "SEO мета-дані обов'язкові" });
      }

      const slugi = slugify(name, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      });

      const categoryObjectIds =
        categories && typeof categories === "string" && categories.trim() !== ""
          ? categories.split(",").map((id) => new mongoose.Types.ObjectId(id))
          : [];

      const newProduct = new Product({
        name,
        description,
        price,
        size,
        slug: slugi,
        image: result.secure_url,
        imageId: result.public_id,
        categoryId: categoryObjectIds || [],
        seo: {
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
        },
        discount: discount || 0,
      });

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
      const { _limit = 5, _start = 0, _order = "desc" } = req.query;
      const limit = parseInt(_limit, 10);
      const start = parseInt(_start, 10);
      const sortOrder = _order === "desc" ? -1 : 1;
      const currentPage = Math.floor(start / limit) + 1;

      const result = await Product.aggregate([
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            posts: [
              { $sort: { createdAt: sortOrder } },
              { $skip: start },
              { $limit: limit },
              {
                $lookup: {
                  from: "categories",
                  localField: "categoryId",
                  foreignField: "_id",
                  as: "categories",
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  description: 1,
                  price: 1,
                  size: 1,
                  image: 1,
                  createdAt: 1,
                  discount: 1,
                  seo: 1,
                  categories: {
                    $map: {
                      input: "$categories",
                      as: "category",
                      in: {
                        name: "$$category.name",
                        _id: "$$category._id",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      ]);

      const totalProducts = result[0].totalCount[0]?.count || 0;
      const products = result[0].posts;
      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        firstPage: 1,
        lastPage: totalPages,
        currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        products,
        _limit: limit,
        _start: start,
        _order: _order,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error retrieving products", error });
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
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, discount, categories, size } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Невірний ID продукту" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Продукт не знайдено" });
      }

      const seo = JSON.parse(req.body.seo);
      if (!seo || !seo.title || !seo.description || !seo.keywords) {
        return res.status(400).json({ error: "SEO мета-дані обов'язкові" });
      }

      let updatedImage = product.image;
      let updatedImageId = product.imageId;

      if (req.file) {
        console.log("File received:", req.file);

        const result = await cloudinary.v2.uploader.upload(req.file.path);
        updatedImage = result.secure_url;
        updatedImageId = result.public_id;

        if (product.imageId) {
          console.log("Deleting old image from Cloudinary...");
          await cloudinary.v2.uploader.destroy(product.imageId);
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

      const categoryObjectIds =
        categories && typeof categories === "string" && categories.trim() !== ""
          ? categories.split(",").map((id) => new mongoose.Types.ObjectId(id))
          : [];

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name,
          description,
          price,
          size,
          discount: discount || 0,
          slug: slugi,
          categoryId: categoryObjectIds,
          image: updatedImage,
          imageId: updatedImageId,
          seo: {
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
          },
        },
        { new: true }
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Помилка при оновленні продукту:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
  getByCategorySlug: async (req, res) => {
    try {
      const { slug } = req.params; 

     
      const category = await Category.findOne({ slug });

      if (!category) {
        return res.status(404).json({ error: "Категорія не знайдена" });
      }

 
      const products = await Product.find({ categoryId: category._id });

      if (products.length === 0) {
        return res
          .status(404)
          .json({ error: "Продукти не знайдені для цієї категорії" });
      }

      res.status(200).json(products);
    } catch (error) {
      console.error(
        "Помилка при отриманні продуктів за слагом категорії:",
        error
      );
      res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

export default productControler;
