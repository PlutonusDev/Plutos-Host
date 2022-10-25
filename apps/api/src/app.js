const crypto = require("node:crypto");
const express = require("express");
const app = express();
const { exec } = require("child_process");

const { secret } = require("./config");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true,
    verify: (req, res, buf, encoding) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || "utf8");
        }
    }
}));

function verifyGithubData(req, res, next) {
    if (!req.rawBody) {
        return next('Request body empty')
    }

    const sig = Buffer.from(req.get("X-Hub-Signature-256") || '', 'utf8')
    const hmac = crypto.createHmac("sha256", secret)
    const digest = Buffer.from("sha256" + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
        return next(`Request body digest (${digest}) did not match ${"X-Hub-Signature-256"} (${sig})`)
    }

    return next()
}

app.post("/deploy", verifyGithubData, (req, res) => {
	console.log("RECEIVED DEPLOYMENT INFORMATION FROM GITHUB");
	console.log();
    res.status(200).end();
	exec(`sh ${__dirname}/deploy.sh`, (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
	});
});

app.use((err, req, res, next) => {
    if (err) console.error(err)
    res.status(403).send("AUTHENTICATION FAILURE")
})

app.listen(9001, () => console.log("INTERNAL API AVAILABLE @ :9001"));
