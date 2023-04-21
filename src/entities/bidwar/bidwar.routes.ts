import { Router } from 'express';

import BidWarController from './bidwar.controller';
const router = Router();

router.get('/:username/:firstHashtag/:secondHashtag', BidWarController.get);

export default router;
