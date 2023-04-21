import { Router } from 'express';

import UserController from './user.controller';

const router = Router();

router.get('/', UserController.getAll);
router.post('/', UserController.create);
router.get('/:username/', UserController.getOne);

export default router;
