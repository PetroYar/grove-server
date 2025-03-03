import mongoose from "mongoose";

const Content = new mongoose.Schema({
  page: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, },
  image: { type: String,  },
  imageId: { type: String, },
});

export default mongoose.model("Content", Content);
