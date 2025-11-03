import express from 'express';

const router = express.Router();
const {getAllMissions, completeMission} = require('../mission/mission.controller');

router.get('/', getAllMissions);
router.post('/complete/:id', completeMission);

module.exports = router;
