import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import userRouter from './controllers/users.js';
import plansRouter from './controllers/plans.js';

router.use('/posts', postsRouter);
router.use('/users', userRouter);
router.use('/plans', plansRouter)

export default router;