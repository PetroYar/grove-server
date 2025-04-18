import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userMiddleware = (req, res, next) => {
  
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default userMiddleware;
