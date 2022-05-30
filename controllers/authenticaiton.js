const User = require("../model/user");
const validate = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
	const userName = req.body.userName;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	const existingUser = await User.findOne({ email: email });

	if (existingUser) {
		return res
			.status(401)
			.json({ message: "User already exists", stausCode: 401 });
	}

	if (!validate.isEmail(email)) {
		return res
			.status(401)
			.json({ message: "Enter a valide email address", statusCode: 401 });
	}

	if (validate.isEmpty(password) || !validate.isLength(password, { min: 5 })) {
		return res
			.status(401)
			.json({ message: "Invalid Password", statusCode: 401 });
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	const user = new User({
		name: name,
		email: email,
		userName: userName,
		password: hashedPassword,
	});

	await user.save();

	return res
		.status(201)
		.json({ message: "Registration Successful", statusCode: 201 });
};

exports.login = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const user = await User.findOne({ email: email });

	if (!user) {
		return res
			.status(401)
			.json({ message: "Username or Password is incorrect" });
	}

	if (!validate.isEmail(email)) {
		return res.status(401).json({ message: "Invalid Email", statusCode: 401 });
	}

	if (validate.isEmpty(password) || !validate.isLength(password, { min: 5 })) {
		return res
			.status(401)
			.json({ message: "Password is too short", statusCode: 401 });
	}

	const userPassword = await bcrypt.compare(password, user.password);

	if (!userPassword) {
		return res
			.status(401)
			.json({ message: "Username or Password is invalide", statusCode: 401 });
	}

	const token = jwt.sign(
		{
			userId: user._id.toString(),
			email: user.email,
		},
		"secret",
		{ expiresIn: "1h" }
	);

	return res.status(200).json({
		message: "Login Successful",
		statusCode: 200,
		token: token,
		fullName: user.name,
		userName: user.userName,
		userId: user._id.toString(),
	});
};

exports.forgotPassword = async (req, res, next) => {
	const email = req.body.email;

	const user = await User.findOne({ email: email });

	if (!user) {
		return res
			.status(401)
			.json({ message: "User does not exist!", statusCode: 401 });
	}

	const resetToken = jwt.sign({ _id: user._id }, "secret", {
		expiresIn: "1h",
	});

	const updateResetLink = await user.updateOne({ resetLink: resetToken });

	if (!updateResetLink) {
		return res.status(401).json({
			message: "Something went wrong, please try again!",
			statusCode: 401,
		});
	}

	return res.status(200).json({
		message: "Check your email for the reset link and follow the instructions",
		statusCode: 200,
	});
};
