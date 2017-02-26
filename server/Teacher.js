/**
 * Created by Onur on 26.2.2017.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TeacherSchema = new Schema({
    name: String,
    image: String,
    positiveVoteCounter: {
        type: String,
        default : 0
    },
    negativeVoteCounter: {
        type: String,
        default : 0
    },
    votes: [{
        ipAddress: String,
        isPositive: Boolean
    }]
});

module.exports = TeacherSchema;
