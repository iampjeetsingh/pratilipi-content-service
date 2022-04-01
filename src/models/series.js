// Series Model
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const seriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        chapter_count: {
            type: Number,
            default: 0
        },
        chapters: [{ type: ObjectId, ref: "Chapter" }],
        publishers: {
            type: Array,
            default: []
        },
        release_date: {
            type: Date,
            default: () => new Date()
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Series", seriesSchema);