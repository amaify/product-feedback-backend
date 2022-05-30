const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback");
const commentController = require("../controllers/comment");
const replyController = require("../controllers/replies");

router.post("/new-feedback", feedbackController.newFeedback);
router.post("/new-comment/:productFeedbackId", commentController.newComment);
router.post("/replies", replyController.replyToComment);
router.get("/feedbacks", feedbackController.getAllFeedback);
router.get(
	"/product-feedback/:productFeedbackId",
	feedbackController.getOneFeedback
);
router.put("/edit-feedback/:editFeedbackId", feedbackController.editFeedback);
router.get("/comments/:productFeedbackId", commentController.getComments);
router.get("/commentReply", replyController.getReplies);

router.put("/upvoting/:productFeedbackId", feedbackController.incrementUpvotes);

module.exports = router;
