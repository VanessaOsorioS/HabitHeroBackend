import express from 'express';

const router = express.Router();
const {getAllRewards, getCoinAndXpRewards} = require('../reward/reward.controller');

router.get('/', getAllRewards);
router.get('/coin-xp', getCoinAndXpRewards);

module.exports = router;
