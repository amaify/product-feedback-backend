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

	const comment = await Comments.findById("62861f38226882c1ed61fca1");
	const user = await User.findById(req.userId);
	const commenterId = comment.creator;

	const commentCreator = await User.findById(commenterId.toString());

	console.log(commentCreator);

	console.log(commenterId);

	if (!comment) {
		return res
			.status(401)
			.json({ message: "Comment does not exist!", statusCode: 401 });
	}

	if (!user) {
		return res.status(401).json({ message: "Not Authorized", statusCode: 401 });
	}

	const createReply = new Replies({
		content: content,
		replyingTo: commentCreator.userName,
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
