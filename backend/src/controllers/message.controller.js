import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { detectMedia } from "../lib/fileType.js";
import { PUBLIC_USER_FIELDS, isObjectIdString, normalizeMessageText } from "../lib/validation.js";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(PUBLIC_USER_FIELDS);

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationsForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
      // 1. Keep only the messages I sent or received.
      { $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },
      // 2. Collapse them into one row per chat partner, noting our latest message time.
      {
        $group: {
          // The partner is the other person on the message (not me).
          _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      // 3. Put the most recent conversation at the top.
      { $sort: { lastMessageAt: -1 } },
      // 4. Look up each partner's user profile (comes back as an array).
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      // 5. Pull that profile out of the array and make it the document.
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      // 6. Return only public profile fields (no email or Clerk ID).
      { $project: { _id: 1, fullName: 1, profilePic: 1 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversationsForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!isObjectIdString(userToChatId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // 1. Validate the recipient before touching the upload or the database.
    if (!isObjectIdString(receiverId)) {
      return res.status(400).json({ message: "Invalid recipient ID" });
    }
    if (String(senderId) === receiverId) {
      return res.status(400).json({ message: "You cannot send a message to yourself" });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // 2. Validate the content.
    let text;
    try {
      text = normalizeMessageText(req.body?.text);
    } catch (validationError) {
      return res.status(validationError.status).json({ message: validationError.message });
    }
    if (!text && !req.file) {
      return res.status(400).json({ message: "A message needs text or an attachment" });
    }

    let imageUrl;
    let videoUrl;

    if (req.file) {
      // Decide by file content, not by the MIME type the client declared.
      const detected = detectMedia(req.file.buffer);
      if (!detected) {
        return res.status(400).json({ message: "Unsupported file. Upload a JPEG, PNG, GIF, WebP, AVIF, MP4, MOV or WebM file." });
      }
      if (!req.file.mimetype.startsWith(`${detected.kind}/`)) {
        return res.status(400).json({ message: "File content does not match its declared type" });
      }
      if (!hasImageKitConfig()) {
        return res.status(503).json({ message: "ImageKit is not configured. Set IMAGEKIT_PRIVATE_KEY in backend/.env to enable media uploads." });
      }

      const url = await uploadChatMedia({ ...req.file, mimetype: detected.mime, originalname: `upload.${detected.ext}` });
      if (detected.kind === "video") videoUrl = url;
      else imageUrl = url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || undefined,
      image: imageUrl,
      video: videoUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    // only send the message in realtime if user is online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
