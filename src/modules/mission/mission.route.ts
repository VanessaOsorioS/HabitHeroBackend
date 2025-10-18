const express = require('express');
const router = express.Router();
const {getAllMissions} = require('../mission/mission.controller');

router.get('/', getAllMissions);

module.exports = router;
