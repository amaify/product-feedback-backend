const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback");
const commentController = require("../controllers/comment");

router.post("/new-feedback", feedbackController.newFeedback);
router.post("/new-comment", commentController.newComment);
router.get("/feedbacks", feedbackController.getProductFeedbacks);
router.get("/comments", commentController.getComments);

module.exports = router;
