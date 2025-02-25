import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "30d" });
};

const adminControler = {
  login: async (req, res) => {
    try {
      const { name, password } = req.body;

      const admin = await Admin.findOne({ name });
      if (!admin) {
        return res.status(401).json({ message: "Не вірне Імя" });
      }
      const validatePass = bcrypt.compareSync(password, admin.password);

      if (!validatePass) {
        return res.status(400).json({ message: "Не вірний пароль" });
      }

      const token = generateAccessToken(admin._id);
      return res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ message: "Login error", error });
    }
  },
  getAdmin: async (req, res) => {
    try {
      const admin = await Admin.findById(req.admin.id).select("-password");

      if (!admin) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(admin);
    } catch (error) {
      return res.status(400).json({ message: "Error getting profile", error });
    }
  },
};

export default adminControler;
