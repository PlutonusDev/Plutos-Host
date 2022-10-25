const express = require("express");
const app = express();

app.use("*", (req, res, next) => {
	if(req.method !== "get") {
		return res.status(403).sendFile("./403.html")
	}
	next();
});

app.get("/test2.jpg", (req, res) => {
	res.sendFile(__dirname + "/test.jpg");
});

app.use("*", (req, res) => {
	res.status(404).sendFile(__dirname + "/404.html");
});

app.listen(9002, () => console.log("CONTENT LIVE @ :9002"));