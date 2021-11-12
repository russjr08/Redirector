let mongoose = require('mongoose');

module.exports = {
    redirectorSchema: new mongoose.Schema({
        redirect_from: String,
        redirect_to: String
    })
}