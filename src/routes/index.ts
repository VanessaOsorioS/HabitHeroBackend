import express from 'express';

const missionRoutes = require('../modules/mission/mission.route');

const router = express.Router();

router.use('/missions', missionRoutes);

module.exports = router;