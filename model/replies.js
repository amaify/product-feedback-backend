const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new Schema({
	content: {
		type: String,
	},

	replyingTo: {
		type: String,
	},

	linkedComment: {
		type: Schema.Types.ObjectId,
		ref: "Comments",
	},

	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Replies", replySchema);
