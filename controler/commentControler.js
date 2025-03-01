import Comment from "../models/Comment.js";

const commentControler = {
  create: async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Немає ідентифікатора користувача" });
      }
      if (!description) {
        return res.status(400).json({ error: "Опис обов'язковий" });
      }

      const newComment = new Comment({
        userId: id,
        description,
      });

      await newComment.save();
      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Помилка при створенні коментаря:", error);
      return res.status(500).json({ error: "Помилка сервера" });
    }
  },
};

export default commentControler;
