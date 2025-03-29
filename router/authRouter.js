import { Router } from "express";
import authControler from "../controler/authControler.js";
import { check } from "express-validator";

import userMiddleware from "../middleware/userMiddleware.js";

const authRouter = Router();

authRouter.post(
  "/auth/registration",
  // [
  //   check("username", "Username cannot be empty").notEmpty(),
  //   check("password", "Password must be between 6").isLength({
  //     min: 6,
  //   }),
  //   check("email", "Please enter a valid email address").isEmail(),
  // ],
  authControler.registration
);
authRouter.post("/auth/login", authControler.login);
authRouter.get("/user",userMiddleware, authControler.getUser);

export default authRouter;
