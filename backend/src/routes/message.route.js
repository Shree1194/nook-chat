import express from "express";
import {
  getConversationsForSidebar,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Turn multer failures (file too large, wrong field, rejected type) into 4xx JSON
// instead of an unhandled 500.
function handleUpload(req, res, next) {
  upload.single("media")(req, res, (error) => {
    if (!error) return next();
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    res.status(status).json({ message: error.code === "LIMIT_FILE_SIZE" ? "File is too large (25 MB maximum)" : error.message });
  });
}

router.use(protectRoute);

router.get("/users", getUsersForSidebar);
router.get("/conversations", getConversationsForSidebar);
router.get("/:id", getMessages);
router.post("/send/:id", handleUpload, sendMessage);

export default router;
