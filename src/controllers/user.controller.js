const Series = require('../models/series');
const Chapter = require('../models/chapter');
const AppError = require('../lib/app-error');
const HttpStatus = require('../lib/http-status-codes');
const {attachBigPromise} = require('../lib/big-promise');
const mongoose = require("mongoose");
const axios = require("axios");

const getUnlockedChapters = async (userId)=>{
    const host = process.env.DAILY_PASS_HOST;
    const url = `${host}/daily-pass/${userId}/chapters`;
    let response = await axios.get(url);
    response = response.data;
    console.log(response);
    return response;
}

const getUnlockedContent = async (req, res)=>{
    const unlockedChapters = await getUnlockedChapters(req.params.userId);
    unlockedChapters.map(id=>{
        return mongoose.Types.ObjectId(id);
    })
    const allSeries = await Series.find().select('_id name chapter_count release_date publishers')
    const chapters = await Chapter.find({
        '_id': { $in: unlockedChapters }
    }).select('_id index name series').sort('index');
    if(!chapters){
        throw new AppError(HttpStatus.INTERNAL_SERVER, "Couldn't find chapters for you!!!");
    }
    const chapterMap = {}
    for(const chapter of chapters){
        if(!chapterMap[chapter.series]){
            chapterMap[chapter.series] = [chapter]
        }else {
            chapterMap[chapter.series].push(chapter);
        }
    }
    const result = []
    for(const series of allSeries){
        const {_id, chapter_count, name, publishers} = series
        const chapters = chapterMap[series._id];
        if(!chapters) continue
        result.push({
            total_chapters: chapter_count,
            unlocked_chapters: chapters.length,
            chapters,
            name, publishers, _id
        });
    }
    return res.json(result);
}

const UserController = {
    getUnlockedContent
};
attachBigPromise(UserController);
module.exports = UserController;
