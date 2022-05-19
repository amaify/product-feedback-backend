const Feedback = require("../model/feedback");
const Comment = require("../model/comments");
const Users = require("../model/user");
const inputValidator = require("validator");

exports.newComment = async (req, res, next) => {
	const content = req.body.content;

	if (inputValidator.isEmpty(content)) {
		return res
			.status(401)
			.json({ message: "Comment can't be empty!", statusCode: 401 });
	}

	const user = await Users.findById(req.userId);
	const productFeedback = await Feedback.findById(req.params.productFeedbackId);

	if (!user) {
		return res.status(401).json({ message: "Not Authorized", statusCode: 401 });
	}

	if (!productFeedback) {
		return res
			.status(401)
			.json({ message: "Product does not exist", statusCode: 401 });
	}

	let id = 1;

	if (productFeedback.comments.length >= 1) {
		id = productFeedback.comments.length + 1;
	}

	const createdComment = new Comment({
		id: id,
		content: content,
		productFeedback: productFeedback._id.toString(),
		creator: user._id.toString(),
	});

	const savedComment = await createdComment.save();

	if (productFeedback) {
		productFeedback.comments.push(savedComment);
		await productFeedback.save();
	}

	return res.status(201).json({
		message: "Operation successful",
		data: createdComment,
		statusCode: 201,
	});
};

exports.getComments = async (req, res, next) => {
	const products = await Feedback.findById(req.params.productFeedbackId);
	const comments = await Comment.find({
		productFeedback: { $eq: products._id },
	});

	if (!comments.length > 0) {
		return res.status(200).json({ message: "No Comments!", statusCode: 200 });
	}

	return res.status(200).json({ data: comments, statusCode: 200 });
};
