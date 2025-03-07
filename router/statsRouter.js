import { Router } from "express";
import statsControler from "../controler/statsControler.js";

const statsRouter = Router();

statsRouter.get("/", statsControler.getStats);

export default statsRouter;
