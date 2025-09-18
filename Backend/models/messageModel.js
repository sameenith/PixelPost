import mongoose, { model, Schema } from "mongoose";
import User from "./userModel.js";

const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);
export default Message;
