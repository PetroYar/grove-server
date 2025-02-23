import mongoose from "mongoose";

const Product = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    imageId: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", Product);
