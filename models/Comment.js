import mongoose from "mongoose";

const Comment = new mongoose.Schema(
  {
    description: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
  },
  {
    timestamps: true,
  }
);


export default Comment