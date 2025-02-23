import mongoose from "mongoose";

const Category = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    imageId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", Category);
