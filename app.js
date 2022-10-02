const express = require("express");
const mongoose = require("mongoose");
const isAuth = require("./middleware/isAuth");

const authRoutes = require("./routes/authentication");
const feedbackRoutes = require("./routes/feedback");

const app = express();

const MONGODB_URI = process.env.MONGO_CONNECTION_STRING;

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
	.then(() => app.listen(process.env.PORT || 8080))
	.catch((err) => console.log(err.message));
