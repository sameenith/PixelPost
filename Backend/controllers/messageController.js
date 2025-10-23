import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    const { textMessage: message } = req.body;

    console.log(message);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // now establish conversation if not established
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);
    console.log(newMessage);

    // implement real time socket io for data transfer
    const receverSocketId = getReceiverSocketId(receiverId);
    if (receverSocketId) {
      io.to(receverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      newMessage,
      success: true,
    });
  } catch (error) {
    console.log("Error in sendMessage: ", error);

    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        message: [],
        success: true,
      });
    }

    return res.status(200).json({
      messages: conversation?.messages,
      success: true,
    });
  } catch (error) {
    console.log("Error in getMessage: ", error);

    return res.status(500).json({
      message: "An error occurred on the server.",
      success: false,
    });
  }
};
