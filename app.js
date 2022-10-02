const express = require("express");
const mongoose = require("mongoose");
const isAuth = require("./middleware/isAuth");

const authRoutes = require("./routes/authentication");
const feedbackRoutes = require("./routes/feedback");

const app = express();

const DBUsername = process.env.DB_USERNAME;
const DBPassword = process.env.DB_PASSWORD;
const DB = process.env.DEFAULT_DB;
const port = process.env.PORT;

const MONGODB_URI = `mongodb+srv://${DBUsername}:${DBPassword}@product-feedback.zh3f0.mongodb.net/${DB}?retryWrites=true&w=majority`;

app.use(express.json());

app.use(isAuth);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(isAuth);

app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes);

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => app.listen(port || 8080))
	.catch((err) => console.log(err.message));
