let express = require('express');
let mongoose = require('mongoose');

let app = express();

app.use(express.json());


app.listen(process.env.APP_PORT, async () => {
    let { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE } = process.env || {};

    console.log(`Redirector server is running on port ${process.env.APP_PORT}!`);
    await mongoose.connect(`mongodb://localhost:27017/${MONGO_DATABASE}`);
});

let db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDB connection error: "));
db.on('connected', () => { console.log("Database successfully connected!" )});

var Redirect = mongoose.model("Redirect", require('./RedirectSchema'));

app.use(require('./api')(db, Redirect));