// Chapter Model
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const chapterSchema = new mongoose.Schema(
    {
        index: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        series: {
            type: ObjectId,
            ref: "Chapter",
            required: true
        },
        content: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chapter", chapterSchema);