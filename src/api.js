let express = require('express');
const { isValidObjectId } = require('mongoose');

module.exports = function(db,  Redirect) {

    let router = express.Router();

    let subfolder = process.env.HOST_UNDER || ""


    let missingParamsError = { "error": "You are missing the required parameters.", "errorCode": "INVALID_PARAMETERS" };
    let redirectNotFoundError = { "error": "The redirect with the provided key was not found", "errorCode": "REDIRECT_NOT_FOUND" };

    
    var validateAuth = function(req, res, next) {
        if(req.headers['x-api-key'] === undefined || req.headers['x-api-key'] !== process.env.API_KEY) {
            res.status(401);
            res.json({ error: "You are not authorized to use this endpoint.", errorCode: "INVALID_AUTH" });
        } else {
            next();
        }
    }

    router.get(`${subfolder}/api/`, function(req, res) {
        res.json({"message": "You have successfully accessed Redirector!", "status": "OK"});
    });

    router.get(`${subfolder}/api/redirects/:key`, async function(req, res) {

        if(req.params.key === undefined) {
            res.status(400);
            res.json(missingParamsError);
            return;
        }

        let results = await Redirect.find({ redirect_from: req.params.key });

        if(results.length == 0) {
            res.status(404);
            res.json(redirectNotFoundError);
            return;
        } else {
            res.json(results[0]);
        }

    });

    router.post(`${subfolder}/api/redirects/new`, validateAuth, async function(req, res) {
        
        if(req.body.redirect_from === undefined || req.body.redirect_to === undefined) {
            res.status(400);
            res.json(missingParamsError);
            return;
        }

        let { redirect_from, redirect_to } = req.body;

        // We don't necessarily care about case sensitivity, so everything will be stored lowercase
        redirect_from = redirect_from.toLowerCase();
        redirect_to = redirect_to.toLowerCase();

        console.log(`New redirect request received with ${redirect_from} // ${redirect_to}`);

        var existingResults = await Redirect.find({ redirect_from });

        if(existingResults.length > 0) {
            res.status(400);
            res.json({ error: "That Redirection already exists!", errorCode: "REDIRECT_ALREADY_EXISTS" });
            return;
        }

        var redirect = new Redirect({ redirect_from, redirect_to });
        console.log(redirect);

        await redirect.save();
        
        res.json({"message": "Success!", redirect});
    });

    router.patch(`${subfolder}/api/redirects/:key`, validateAuth, async function(req, res) {
        if(req.params.key === undefined || req.body.redirect_to === undefined) {
            res.status(400);
            res.json(missingParamsError);
            return;
        }

        let results = await Redirect.find({ redirect_from: req.params.key });

        if(results.length == 0) {
            res.status(404);
            res.json(redirectNotFoundError);
            return;
        } else {
            let redirect = results[0];
            redirect.redirect_to = req.body.redirect_to;
            await redirect.save();
            res.json({"message": "Updated!", "redirect": redirect});
        }
    });

    router.delete(`${subfolder}/api/redirects/:key`, validateAuth, async function(req, res) {
        if(req.params.key === undefined) {
            res.status(400);
            res.json(missingParamsError);
            return;
        }

        let results = await Redirect.find({ redirect_from: req.params.key });

        if(results.length == 0) {
            res.status(404);
            res.json(redirectNotFoundError);
            return;
        } else {
            let redirect = results[0];
            await redirect.delete();
            res.json({"message": "Redirect removed!"});
        }

    });
    
    return router;
};