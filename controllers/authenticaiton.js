const User = require("../model/user");
const validate = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
	try {
		const { userName, name, email, password } = req.body;
		const existingUser = await User.findOne({ email: email });
		const existingUsername = await User.findOne({ userName: userName });

		const avatar = `https://avatars.dicebear.com/api/micah/${userName}.svg?background=%231B8968`;

		if (existingUsername) {
			return res
				.status(400)
				.json({ message: "Username is already taken", statusCode: 400 });
		}

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists", stausCode: 400 });
		}

		if (!validate.isEmail(email)) {
			return res
				.status(400)
				.json({ message: "Enter a valid email address", statusCode: 400 });
		}

		if (
			validate.isEmpty(password) ||
			!validate.isLength(password, { min: 5 })
		) {
			return res
				.status(400)
				.json({ message: "Invalid Password", statusCode: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			name: name,
			email: email,
			userName: userName,
			avatar: avatar,
			password: hashedPassword,
		});

		await user.save();

		return res
			.status(201)
			.json({ message: "Registration Successful", statusCode: 201 });
	} catch (error) {
		return res.status(400).json({ message: error.message, statusCode: 400 });
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(401).json({ message: "User does not exist!" });
		}

		if (!validate.isEmail(email)) {
			return res
				.status(400)
				.json({ message: "Invalid Email", statusCode: 400 });
		}

		if (
			validate.isEmpty(password) ||
			!validate.isLength(password, { min: 5 })
		) {
			return res
				.status(400)
				.json({ message: "Password is too short", statusCode: 400 });
		}

		const userPassword = await bcrypt.compare(password, user.password);

		if (!userPassword) {
			return res
				.status(400)
				.json({ message: "Username or Password is invalid", statusCode: 400 });
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
			avatar: user.avatar,
			userId: user._id.toString(),
		});
	} catch (error) {
		return res.status(400).json({ message: error.message, statusCode: 400 });
	}
};

exports.forgotPassword = async (req, res, next) => {
	try {
		const email = req.body.email;

		const user = await User.findOne({ email: email });

		if (!user) {
			return res
				.status(400)
				.json({ message: "User does not exist!", statusCode: 400 });
		}

		const resetToken = jwt.sign({ _id: user._id }, "secret", {
			expiresIn: "1h",
		});

		const updateResetLink = await user.updateOne({ resetLink: resetToken });

		if (!updateResetLink) {
			return res.status(400).json({
				message: "Something went wrong, please try again!",
				statusCode: 400,
			});
		}

		return res.status(200).json({
			message:
				"Please check your email for the reset link and follow the instructions",
			statusCode: 200,
		});
	} catch (error) {
		return res.status(400).json({ message: error.message, statusCode: 400 });
	}
};
