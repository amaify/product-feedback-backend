const Replies = require("../model/replies");
const Comments = require("../model/comments");
const User = require("../model/user");
const inputValidator = require("validator");

exports.replyToComment = async (req, res, next) => {
	const content = req.body.content;

	if (
		inputValidator.isEmpty(content) ||
		!inputValidator.isLength(content, { min: 5 })
	) {
		return res
			.status(401)
			.json({ message: "Input is not valid", statusCode: 401 });
	}

	const comment = await Comments.findById("6288a85652ba47b894ed69f4");
	const user = await User.findById(req.userId);

	if (!comment) {
		return res
			.status(401)
			.json({ message: "Comment does not exist!", statusCode: 401 });
	}

	if (!user) {
		return res.status(401).json({ message: "Not Authorized", statusCode: 401 });
	}

	const commenterId = comment.creator;

	const commentCreator = await User.findById(commenterId.toString());

	console.log(commentCreator);

	console.log(commenterId);

	const createReply = new Replies({
		content: content,
		replyingTo: commentCreator.userName,
		creatorName: user.name,
		creatorUsername: user.userName,
		creator: user._id.toString(),
		linkedComment: comment._id.toString(),
	});

	await createReply.save();

	comment.replies.push(createReply);
	await comment.save();

	return res
		.status(201)
		.json({ message: "Reply Successful", statusCode: 201, data: createReply });
};

exports.getReplies = async (req, res, next) => {
	const commentId = await Comments.find();

	// let y = commentId.map((x) => x._id);

	// console.log(y.toString());

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

	return res.status(200).json({ data: replies, statusCode: 200 });
};
