

import Category from "../models/Category.js";

import Product from "../models/Product.js";
import User from "../models/User.js";

const statsController = {
  getStats: async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const categoryCount = await Category.countDocuments();
      const productCount = await Product.countDocuments();

      res.status(200).json({
        users: userCount,
        categories: categoryCount,
        products: productCount,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Помилка при отриманні статистики", error });
    }
  },
};

export default statsController;
