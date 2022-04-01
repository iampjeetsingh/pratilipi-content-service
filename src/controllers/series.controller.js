const Series = require('../models/series');
const Chapter = require('../models/chapter');
const AppError = require('../lib/app-error');
const HttpStatus = require('../lib/http-status-codes');
const axios = require('axios');
const {attachBigPromise} = require('../lib/big-promise');

const notifyDailyPassService = async (series, chapters)=>{
    const data = [];
    for(const chapter of chapters){
        const {_id: series_id, release_date} = series;
        const {_id: chapter_id, index} = chapter
        data.push({release_date, series_id, chapter_id, index});
    }
    const host = process.env.DAILY_PASS_HOST;
    const url = `${host}/daily-pass/create-chapters`;
    await axios.post(url, data);
}

const bulkUpload = async (req, res)=>{
    // Validating Request
    for(const [seriesIndex, series] of Object.entries(req.body)){
        const {name, publishers, chapters} = series;
        if(!name){
            throw new AppError(HttpStatus.BAD_REQUEST, `Series name is required!!! Error on Series #${seriesIndex+1}`);
        }
        if(!publishers){
            throw new AppError(HttpStatus.BAD_REQUEST, `Series publishers is required!!! Error on Series #${seriesIndex+1}`);
        }
        if(!chapters){
            throw new AppError(HttpStatus.BAD_REQUEST, `Chapters missing!!! Error on Series #${seriesIndex+1}`);
        }
        for(const [chapterIndex, chapter] of Object.entries(chapters)){
            const {name, content} = chapter
            if(!name){
                throw new AppError(HttpStatus.BAD_REQUEST, `Chapter name is required!!! Error on Series #${seriesIndex} Chapter #${chapterIndex}`)
            }
            if(!content){
                throw new AppError(HttpStatus.BAD_REQUEST, `Chapter content missing!!! Error on Series #${seriesIndex} Chapter #${chapterIndex}`)
            }
        }
    }
    // Performing Insert
    for(const seriesObj of req.body){
        const {name, publishers, chapters, release_date} = seriesObj;
        const series = new Series({
            name, publishers,
            chapter_count: chapters.length,
            release_date: release_date || new Date()
        })
        await series.save()
        for(const [index, chapter] of Object.entries(chapters)){
            chapter.series = series._id;
            if(!chapter['index']){
                chapter.index = index
            }
        }
        const chaptersCreated = await Chapter.insertMany(chapters);
        const chapterIds = [];
        for(const chapter of chaptersCreated){
            chapterIds.push(chapter._id);
        }
        await series.updateOne({
            $push: {
                chapters: chaptersCreated
            }
        })
        await notifyDailyPassService(series, chaptersCreated);
    }
    res.json({message: "Upload successfull!!!"});
}

const readAll = async (req, res)=>{
    const allSeries = await Series.find().populate('chapters', '_id index name content').select('_id name chapter_count chapters release_date publishers')
    return res.json(allSeries);
}

const SeriesController = {
    bulkUpload,
    readAll
};
attachBigPromise(SeriesController);
module.exports = SeriesController;
