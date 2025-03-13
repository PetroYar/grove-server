import mongoose from "mongoose";

const Product = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    size: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    imageId: { type: String, required: true },

    seo: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      keywords: { type: [String], required: true },
    },
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", Product);
