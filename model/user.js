const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
	},

	userName: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},

	resetLink: {
		type: String,
		default: "",
	},

	feedback: [
		{
			type: Schema.Types.ObjectId,
			ref: "productFeedback",
		},
	],
});

module.exports = mongoose.model("User", userSchema);
