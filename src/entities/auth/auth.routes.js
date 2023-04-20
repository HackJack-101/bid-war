import { Router } from 'express';

import AuthController from './auth.controller.js';

const router = Router();

router.get('/oauth', AuthController.oAuth);

export default router;
