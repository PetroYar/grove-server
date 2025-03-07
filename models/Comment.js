import mongoose from "mongoose";

const Comment = new mongoose.Schema(
  {
    description: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: { type: Boolean, default: false },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment",Comment) ;
