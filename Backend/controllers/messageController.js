import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    const { message } = req.body;

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

    // implement real time socket io for data transfer

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
      message: conversation?.messages,
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
