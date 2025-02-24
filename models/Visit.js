import mongoose from "mongoose";

const Visit = new mongoose.Schema({
  date: String, 
  count: { type: Number, default: 1 },
});


export default mongoose.model("Visit",Visit)