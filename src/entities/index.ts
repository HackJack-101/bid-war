import { Router } from 'express';

import userRoutes from './user/user.routes';
import bidwarRoutes from './bidwar/bidwar.routes';

const router = Router();

router.get('/health', (req, res) =>
    res.status(200).json({
        version: process.env.npm_package_version,
        status: 'OK',
    }),
);

router.use('/user', userRoutes);
router.use('/bidwar', bidwarRoutes);
router.use('*', (req, res) => res.sendStatus(404));

export default router;
