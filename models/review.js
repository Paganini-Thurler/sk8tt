const { number } = require("joi");
const mongoose = require("mongoose")


const reviewSchema = new mongoose.Schema({
    body: String,
    stars: Number
});

module.exports = mongoose.model("Review", reviewSchema);