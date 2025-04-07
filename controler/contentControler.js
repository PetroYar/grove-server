// import Content from "../models/Content.js";
// import cloudinary from "cloudinary";
// import fs from "fs";

// const contentControler = {
//   create: async (req, res) => {
//     try {
//       const { key, value, page } = req.body;

//       if (!key) {
//         return res.status(400).json({ message: "Ключ обов'язковий" });
//       }
//       if (!page) {
//         return res.status(400).json({ message: "Назва сторінки обов'язкова" });
//       }

//       if (!value && !req.file) {
//         return res
//           .status(400)
//           .json({ message: "Необхідно передати або контент, або фото" });
//       }

//       const existingContent = await Content.findOne({ key });
//       if (existingContent) {
//         return res.status(400).json({ message: "Такий ключ уже існує" });
//       }

//       let image = null;
//       let imageId = null;

//       if (req.file) {
//         const result = await cloudinary.v2.uploader.upload(req.file.path);
//         image = result.secure_url;
//         imageId = result.public_id;
//       }

//       const newContent = new Content({
//         key,
//         value: value || "",
//         page,
//         image,
//         imageId,
//       });

//       await newContent.save();

//       res.status(201).json(newContent);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     } finally {
//       if (req.file?.path) {
//         fs.unlink(req.file.path, (err) => {
//           if (err) {
//             console.error("Помилка видалення файлу з локальної папки:", err);
//           }
//         });
//       }
//     }
//   },

//   getPageContent: async (req, res) => {
//     try {
//       const { page } = req.params;
//       if (!page) {
//         return res.status(400).json({ message: "Не вказано сторінку" });
//       }

//       const content = await Content.find({ page });

//       if (content.length === 0) {
//         return res
//           .status(404)
//           .json({ message: "Контент для цієї сторінки не знайдено" });
//       }

//       res.json(content);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
//   getPages: async (req, res) => {
//     try {
//       const pages = await Content.distinct("page");
//       res.json(pages);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   getOne: async (req, res) => {
//     try {
//       const content = await Content.findOne({ key: req.params.key });

//       if (!content) {
//         return res.status(404).json({ message: "Контент не знайдено" });
//       }

//       res.json(content);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   update: async (req, res) => {
//     try {
//       const { key } = req.params;
//       const { value } = req.body;

//       const content = await Content.findOne({ key });
//       if (!content) {
//         return res.status(404).json({ error: "Контент не знайдений" });
//       }

//       let updatedImage = content.image;
//       let updatedImageId = content.imageId;

//       if (req.file) {
//         console.log("File received:", req.file);

//         const result = await cloudinary.v2.uploader.upload(req.file.path);
//         updatedImage = result.secure_url;
//         updatedImageId = result.public_id;

//         if (content.imageId) {
//           console.log("Deleting old image from Cloudinary...");
//           await cloudinary.v2.uploader.destroy(content.imageId);
//         }

//         fs.unlink(req.file.path, (err) => {
//           if (err) {
//             console.log("Помилка видалення файлу з локальної папки:", err);
//           }
//         });
//       }

//       const updatedContent = await Content.findByIdAndUpdate(
//         content._id,
//         {
//           value: value || content.value,
//           image: updatedImage,
//           imageId: updatedImageId,
//         },
//         { new: true }
//       );

//       res.status(200).json(updatedContent);
//     } catch (error) {
//       console.error("Помилка при оновленні контенту:", error);
//       res.status(500).json({ error: "Помилка сервера" });
//     }
//   },

//   delete: async (req, res) => {
//     try {
//       const deletedContent = await Content.findOneAndDelete({
//         key: req.params.key,
//       });

//       if (!deletedContent) {
//         return res.status(404).json({ message: "Контент не знайдено" });
//       }

//       res.json({ message: "Контент успішно видалено" });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
// };

// export default contentControler;

import Content from "../models/Content.js";
import cloudinary from "cloudinary";

const contentControler = {
  create: async (req, res) => {
    try {
      const { key, value, page } = req.body;

      if (!key) {
        return res.status(400).json({ message: "Ключ обов'язковий" });
      }
      if (!page) {
        return res.status(400).json({ message: "Назва сторінки обов'язкова" });
      }

      if (!value && !req.file) {
        return res
          .status(400)
          .json({ message: "Необхідно передати або контент, або фото" });
      }

      const existingContent = await Content.findOne({ key });
      if (existingContent) {
        return res.status(400).json({ message: "Такий ключ уже існує" });
      }

      let image = null;
      let imageId = null;

      if (req.file) {
        const fileBuffer = req.file.buffer;
        const base64Data = fileBuffer.toString("base64");
        const fileUri = `data:${req.file.mimetype};base64,${base64Data}`;

        const result = await cloudinary.v2.uploader.upload(fileUri);
        image = result.secure_url;
        imageId = result.public_id;
      }

      const newContent = new Content({
        key,
        value: value || "",
        page,
        image,
        imageId,
      });

      await newContent.save();

      res.status(201).json(newContent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPageContent: async (req, res) => {
    try {
      const { page } = req.params;
      if (!page) {
        return res.status(400).json({ message: "Не вказано сторінку" });
      }

      const content = await Content.find({ page });

      if (content.length === 0) {
        return res
          .status(404)
          .json({ message: "Контент для цієї сторінки не знайдено" });
      }

      res.json(content);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getPages: async (req, res) => {
    try {
      const pages = await Content.distinct("page");
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const content = await Content.findOne({ key: req.params.key });

      if (!content) {
        return res.status(404).json({ message: "Контент не знайдено" });
      }

      res.json(content);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;

      const content = await Content.findOne({ key });
      if (!content) {
        return res.status(404).json({ error: "Контент не знайдений" });
      }

      let updatedImage = content.image;
      let updatedImageId = content.imageId;

      if (req.file) {
        console.log("File received:", req.file);

        const fileBuffer = req.file.buffer;
        const base64Data = fileBuffer.toString("base64");
        const fileUri = `data:${req.file.mimetype};base64,${base64Data}`;

        const result = await cloudinary.v2.uploader.upload(fileUri);
        updatedImage = result.secure_url;
        updatedImageId = result.public_id;

        if (content.imageId) {
          console.log("Deleting old image from Cloudinary...");
          await cloudinary.v2.uploader.destroy(content.imageId);
        }
      } else {
        console.log("No file received");
      }

      const updatedContent = await Content.findByIdAndUpdate(
        content._id,
        {
          value: value || content.value,
          image: updatedImage,
          imageId: updatedImageId,
        },
        { new: true }
      );

      res.status(200).json(updatedContent);
    } catch (error) {
      console.error("Помилка при оновленні контенту:", error);
      res.status(500).json({ error: "Помилка сервера" });
    }
  },

  delete: async (req, res) => {
    try {
      const deletedContent = await Content.findOneAndDelete({
        key: req.params.key,
      });

      if (!deletedContent) {
        return res.status(404).json({ message: "Контент не знайдено" });
      }

      if (deletedContent.imageId) {
        await cloudinary.v2.uploader.destroy(deletedContent.imageId);
      }

      res.json({ message: "Контент успішно видалено" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default contentControler;