import { Router } from 'express';
import authRoutes from './auth/auth.routes.js';

const router = Router();

router.get('/health', (req, res) =>
    res.status(200).json({
        version: process.env.npm_package_version,
        status: 'OK',
    }),
);

router.use('/auth', authRoutes);
router.use('*', (req, res) => res.sendStatus(404));

export default router;
