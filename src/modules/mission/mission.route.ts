const express = require('express');
const router = express.Router();
const {getAllMissions} = require('../mission/mission.controller');

router.get('/mission', getAllMissions);

module.exports = router;
