let express = require('express');
let mongoose = require('mongoose');

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen((process.env.APP_PORT || 9500), async () => {
    let { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE, MONGO_HOST } = process.env || {};

    console.log(`Redirector server is running on port ${process.env.APP_PORT}!`);
    let connectionString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/${MONGO_DATABASE}?authSource=admin`;
    console.log(`Using the following connection string: ${connectionString}`);
    await mongoose.connect(connectionString);
});

let db = mongoose.connection;

db.on('error', (error) => { 
    console.error.bind(console, "MongoDB connection error: ") 
    console.error(`MongoDB Connection Error: ${error}`)
    process.exit(-1);
});

db.on('connected', () => { 
    console.log("Database successfully connected!")
});

var Redirect = mongoose.model("Redirect", require('./RedirectSchema').redirectorSchema);

app.use(require('./api')(db, Redirect));

var subfolder = process.env.HOST_UNDER || ""
console.log(`Hosting under ${subfolder || "root domain"}`)

app.get(`${subfolder}/:key`, async function(req, res) {
    if(req.params.key === undefined) {
        res.status(400);
        res.json({ "message": "Please provide a destination!" });
        return;
    }

    let results = await Redirect.find({ redirect_from: req.params.key });

    if(results.length == 0) {
        res.status(404);
        res.json({ "message": "That Redirect does not exist!"});
        return;
    }

    res.redirect(results[0].redirect_to);

});