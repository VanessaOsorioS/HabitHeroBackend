import express from 'express';

const missionRoutes = require('../modules/mission/mission.route');
const rewardRoutes = require('../modules/reward/reward.route');

const router = express.Router();

router.use('/mission', missionRoutes);
router.use('/reward', rewardRoutes);

module.exports = router;