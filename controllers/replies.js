const Replies = require("../model/replies");
const Comments = require("../model/comments");
const User = require("../model/user");
const inputValidator = require("validator");

exports.replyToComment = async (req, res, next) => {
	try {
		const content = req.body.content;
		const { prodId, commentId } = req.params;

		if (
			inputValidator.isEmpty(content) ||
			!inputValidator.isLength(content, { min: 5 })
		) {
			return res
				.status(401)
				.json({ message: "Input is not valid", statusCode: 401 });
		}

		const comment = await Comments.findById(commentId);
		const user = await User.findById(req.userId);

		if (!comment) {
			return res
				.status(401)
				.json({ message: "Comment does not exist!", statusCode: 401 });
		}

		if (!user) {
			return res
				.status(401)
				.json({ message: "Not Authorized", statusCode: 401 });
		}

		const commenterId = comment.creator;

		const commentCreator = await User.findById(commenterId.toString());

		// console.log(commentCreator);

		// console.log(commenterId);

		const createReply = new Replies({
			content: content,
			replyingTo: commentCreator.userName,
			creatorName: user.name,
			creatorUsername: user.userName,
			creatorAvatar: user.avatar,
			creator: user._id.toString(),
			linkedComment: comment._id.toString(),
			productFeedback: prodId,
		});

		await createReply.save();

		comment.replies.push(createReply);
		await comment.save();

		return res.status(201).json({
			message: "Reply Successful",
			statusCode: 201,
			data: createReply,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.replyToReply = async (req, res, next) => {
	try {
		const content = req.body.content;

		const { prodId, replyId } = req.params;

		if (
			inputValidator.isEmpty(content) ||
			!inputValidator.isLength(content, { min: 5 })
		) {
			return res
				.status(401)
				.json({ message: "Input is not valid", statusCode: 401 });
		}

		const reply = await Replies.findById(replyId);
		const user = await User.findById(req.userId);

		if (!reply) {
			return res
				.status(401)
				.json({ message: "Comment does not exist!", statusCode: 401 });
		}

		if (!user) {
			return res
				.status(401)
				.json({ message: "Not Authorized", statusCode: 401 });
		}

		const replierId = reply.creator;

		const replierCreator = await User.findById(replierId.toString());
		const comment = await Comments.findById(reply.linkedComment.toString());

		if (!comment) {
			return res
				.status(400)
				.json({ message: "Comment does not exist!", statusCode: 400 });
		}

		const createReply = new Replies({
			content: content,
			replyingTo: replierCreator.userName,
			creatorName: user.name,
			creatorUsername: user.userName,
			creatorAvatar: user.avatar,
			creator: user._id.toString(),
			linkedComment: comment._id.toString(),
			productFeedback: prodId,
		});

		await createReply.save();

		comment.replies.push(createReply);
		await comment.save();

		return res.status(201).json({
			message: "Reply Successful",
			statusCode: 201,
			data: createReply,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getReplies = async (req, res, next) => {
	try {
		const commentId = await Comments.find();
		const paramId = req.params.prodId;

		if (!commentId) {
			return res
				.status(401)
				.json({ message: "Comment does not exist", statusCode: 401 });
		}

		const replies = await Replies.find({
			linkedComment: { $in: commentId.map((eachId) => eachId._id) },
		});

		if (!replies) {
			return res
				.status(401)
				.json({ message: "Replies does not exist", statusCode: 401 });
		}

		const filteredReplies = replies.filter(
			(reply) => reply.productFeedback.toString() === paramId.toString()
		);

		return res.status(200).json({ data: filteredReplies, statusCode: 200 });
	} catch (error) {
		console.log(error.message);
		return res.status(400).json({ message: error.message, statusCode: 400 });
	}
};
