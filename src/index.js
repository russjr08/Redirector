var express = require("express")
var app = express()

app.listen(9000, () => {
    console.log("Redirector server is running on port 9000!");
})

app.get("/api/test", (req, res, next) => {
    logRequest(req);
    res.json({"message": "You have successfully accessed Redirector!", "status": "OK"});
});

function logRequest(req) {
    console.log(`Incoming request to ${req.url} from ${req.ip}`);
}