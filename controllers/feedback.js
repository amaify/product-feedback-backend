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
		return res.status(401).json({ message: "Invalid input", statusCode: 401 });
	}

	const productReqs = await Feedback.find();

	let id = 1;

	if (productReqs.length >= 1) {
		id = productReqs.length + 1;
	}

	const user = await User.findById("62854811f0688cad42853587");

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

exports.getProductFeedbacks = async (req, res, next) => {
	const products = await Feedback.find();
	const user = await User.findById("62851fa373514ba95bcde021");

	const filterinvoice = await Feedback.findOne({ creator: { $eq: user } });

	console.log(filterinvoice);

	if (!products) {
		return res.status(200).json({
			message: "No Product Feedbacks, please add a feedback!",
			statusCode: 200,
		});
	}

	return res.status(200).json({ data: products, statusCode: 200 });
};
