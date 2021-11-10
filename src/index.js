var express = require("express")
var app = express()

app.listen(9000, () => {
    console.log("Redirector server is running on port 9000!");
    console.log(`Using the following database credentials ${process.env.MONGO_USERNAME},
     ${process.env.MONGO_PASSWORD}, ${process.env.MONGO_DATABASE}`);
})

app.get("/api/test", (req, res, next) => {
    logRequest(req);
    res.json({"message": "You have successfully accessed Redirector!", "status": "OK"});
});

function logRequest(req) {
    console.log(`Incoming request to ${req.url} from ${req.ip}`);
}