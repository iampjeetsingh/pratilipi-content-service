const express = require("express");
const router = express.Router();
const SeriesController = require('../controllers/series.controller');

router.post('/bulk-upload', SeriesController.bulkUpload);

router.get('/all', SeriesController.readAll);

module.exports = router
