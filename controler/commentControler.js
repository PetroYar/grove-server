import Comment from "../models/Comment.js";

const commentControler = {
  create: async (req, res) => {
    try {
      const userId = req.admin.id;
      console.log(userId);

      const { description } = req.body;

      if (!userId) {
        return res
          .status(400)
          .json({ error: "Немає ідентифікатора користувача" });
      }

      if (!description) {
        return res.status(400).json({ error: "Опис обов'язковий" });
      }

      const newComment = new Comment({
        userId,
        description,
        isPublished: false,
      });

      await newComment.save();
      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Помилка при створенні коментаря:", error);
      return res.status(500).json({ error: "Помилка сервера" });
    }
  },
  getAll: async (req, res) => {
    try {
      const { _limit = 5, _start = 0, _order = "desc" } = req.query;
      const limit = parseInt(_limit, 10);
      const start = parseInt(_start, 10);
      const sortOrder = _order === "desc" ? -1 : 1;
      const currentPage = Math.floor(start / limit) + 1;

      const result = await Comment.aggregate([
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
              {
                $project: {
                  _id: 1,
                  description: 1,
                  createdAt: 1,
                  isPublished: 1,
                  user: { $arrayElemAt: ["$user.username", 0] },
                },
              },
            ],
          },
        },
      ]);

      const totalComments = result[0].totalCount[0]?.count || 0;
      const comments = result[0].posts;
      const totalPages = Math.ceil(totalComments / limit);

      res.status(200).json({
        firstPage: 1,
        lastPage: totalPages,
        currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        comments,
        _limit: limit,
        _start: start,
        _order: _order,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error retrieving comments", error });
    }
  },
  update: async (req, res) => {
    const { id } = req.params; 
    const { isPublished } = req.body; 

    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { isPublished }, 
        { new: true } 
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      res.status(200).json(updatedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating comment status", error });
    }
  },
};

export default commentControler;
