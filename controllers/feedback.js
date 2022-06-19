const Feedback = require("../model/feedback");
const User = require("../model/user");
const inputValidator = require("validator");

exports.newFeedback = async (req, res, next) => {
	const title = req.body.title;
	const category = req.body.category;
	const status = "suggestion";
	const description = req.body.description;
	const upvotes = 0;

	if (
		inputValidator.isEmpty(title) ||
		inputValidator.isEmpty(category) ||
		inputValidator.isEmpty(description)
	) {
		return res.status(400).json({ message: "Invalid input", statusCode: 400 });
	}

	const productReqs = await Feedback.find();

	let id = 1;

	if (productReqs.length >= 1) {
		id = productReqs.length + 1;
	}

	const user = await User.findById(req.userId);

	if (!user) {
		return res.status(401).json({ message: "Not Authorized", statusCode: 401 });
	}

	const createdFeedback = new Feedback({
		id: id,
		title: title,
		category: category,
		status: status,
		description: description,
		upvotes: upvotes,
		creator: user._id.toString(),
	});

	const savedFeedback = await createdFeedback.save();

	user.feedback.push(savedFeedback);
	await user.save();

	// if (!savedFeedback) {
	// 	return res.status(401).json({
	// 		message: "Operation failed, please try again!",
	// 		statusCode: 401,
	// 	});
	// }

	return res.status(201).json({
		message: "Operation successful",
		statusCode: 201,
		data: createdFeedback,
	});
};

exports.getAllFeedback = async (req, res, next) => {
	const products = await Feedback.find();
	// const user = await User.findById(req.userId);

	// const filteredFeedbacks = await Feedback.findOne({ creator: { $eq: user } });

	// console.log(filteredFeedbacks);

	if (!products) {
		return res.status(200).json({
			message: "No Product Feedbacks, please add a feedback!",
			statusCode: 200,
		});
	}

	return res.status(200).json({ data: products, statusCode: 200 });
};

exports.getOneFeedback = async (req, res, next) => {
	try {
		const product = await Feedback.findOne({
			_id: req.params.productFeedbackId,
		});

		if (!product) {
			return res
				.status(401)
				.json({ message: "Product Feedback does not exist!", statusCode: 401 });
		}

		return res.status(200).json({ data: product, statusCode: 200 });
	} catch (error) {
		console.log(error.message);
		return res.status(400).json({ message: error.message, statusCode: 400 });
	}
};

exports.incrementUpvotes = async (req, res, next) => {
	try {
		if (!req.isAuth) {
			return res
				.status(401)
				.json({ message: "Not Authorized", statusCode: 401 });
		}

		const productFeedbackId = req.params.productFeedbackId;
		const product = await Feedback.find({ _id: { $eq: productFeedbackId } });

		if (Array.isArray(product) && !product.length) {
			return res
				.status(400)
				.json({ message: "Product Feedback does not exist", statusCode: 400 });
		}

		const upvoteCount = product[0].upvotes + 1;

		let updatedFeedbackUpvote = new Feedback({
			_id: productFeedbackId,
			upvotes: upvoteCount,
		});

		const upvoteUpdate = await Feedback.updateOne(
			{ _id: productFeedbackId },
			updatedFeedbackUpvote
		);

		if (!upvoteUpdate) {
			return res
				.status(400)
				.json({ message: "Upvoting failed!", statusCode: 400 });
		}

		return res
			.status(201)
			.json({ data: updatedFeedbackUpvote, statusCode: 201 });
	} catch (error) {
		console.log(error.message);
		return res.status(400).json({ message: error.message, statusCode: 400 });
	}
};

exports.editFeedback = async (req, res, next) => {
	const user = await User.findById(req.userId);
	const editFeedbackId = await Feedback.find({
		_id: req.params.editFeedbackId,
	});

	if (!user) {
		return res
			.status(401)
			.json({ message: "Not Authorized, must be logged in", statusCode: 401 });
	}

	if (!editFeedbackId) {
		return res
			.status(400)
			.json({ message: "Product feedback does not exist!", statusCode: 400 });
	}

	if (user._id.toString() !== editFeedbackId[0].creator.toString()) {
		return res.status(401).json({
			message: "This feedback can only be edited by the creator!",
			statusCode: 401,
		});
	}

	const title = req.body.title;
	const category = req.body.category;
	const status = req.body.updateStatus;
	const description = req.body.description;
	const upvotes = req.body.upvotes;

	if (
		inputValidator.isEmpty(title) ||
		inputValidator.isEmpty(category) ||
		inputValidator.isEmpty(description)
	) {
		return res.status(401).json({ message: "Invalid input", statusCode: 401 });
	}

	const editedFeedback = new Feedback({
		_id: editFeedbackId[0]._id,
		title: title,
		category: category,
		status: status,
		description: description,
		upvotes: upvotes,
		comments: editFeedbackId[0].comments,
	});

	const saveEditedFeedback = await Feedback.updateOne(
		{ _id: editFeedbackId[0]._id.toString() },
		editedFeedback
	);

	if (!saveEditedFeedback) {
		return res
			.status(400)
			.json({ message: "Updated Failed!", statusCode: 400 });
	}

	return res
		.status(201)
		.json({ message: "Update Successful!", statusCode: 201 });
};

exports.deleteFeedback = async (req, res, next) => {
	if (!req.isAuth) {
		return res.status(400).json({ message: "Not Authorized", statusCode: 400 });
	}

	const productFeedback = await Feedback.findById(req.params.feedbackId);
	const user = await User.findById(req.userId);

	if (!productFeedback) {
		return res
			.status(400)
			.json({ message: "Feedback does not exist!", statusCode: 400 });
	}

	if (!user) {
		return res
			.status(400)
			.json({ message: "Not Authorized to do this!", statusCode: 400 });
	}

	if (productFeedback.creator.toString() !== user._id.toString()) {
		return res.status(400).json({
			message: "Only the creator of this feedback can perform this operation",
			statusCode: 400,
		});
	}

	await Feedback.deleteOne({ _id: productFeedback._id });
	await user.feedback.pull(productFeedback._id);
	await user.save();

	return res.status(201).json({
		message: "Product feedback successfully deleted",
		statusCode: 201,
	});
};
