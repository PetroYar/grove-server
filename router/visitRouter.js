import { Router } from "express";
import visitControler from "../controler/visitControler.js";


const visitRouter = Router()

visitRouter.post('/',visitControler.visit)
visitRouter.get("/visit", visitControler.getVisit);


export default visitRouter