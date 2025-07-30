import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import {createComment, getComments, deleteComment} from "../controllers/comment.controller.js"

const router = express.Router()

router.get("/post/:postId", protectRoute, getComments)

//protected Routes
router.post("/post/:postId", protectRoute, createComment)

router.delete("/:commentId", protectRoute, deleteComment)

export default router