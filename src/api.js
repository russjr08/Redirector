let express = require('express');

module.exports = function(db,  Redirect) {

    let router = express.Router();

    var validateAuth = function(req, res, next) {
        if(req.headers['apiKey'] != undefined || req.headers['apiKey'] !== process.env.API_KEY) {
            res.status(401);
            res.json({ error: "You are not authorized to use this endpoint.", errorCode: "INVALID_AUTH" });
        } else {
            next();
        }
    }

    router.get('/api/', function(req, res) {
        res.json({"message": "You have successfully accessed Redirector!", "status": "OK"});
    });
    
    return router;
};