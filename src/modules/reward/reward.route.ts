import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const {getAllRewards, getCoinAndXpRewards} = require('../reward/reward.controller');

router.get('/', authMiddleware, getAllRewards);
router.get('/coin-xp', authMiddleware, getCoinAndXpRewards);

export default router;
