const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/:userId/content', UserController.getUnlockedContent);

module.exports = router