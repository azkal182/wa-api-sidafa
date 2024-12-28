import { Router } from 'express';
import { query } from 'express-validator';
import * as controller from '../controllers/group';
import requestValidator from '../middleware/request-validator';
import sessionValidator from '../middleware/session-validator';

const router = Router({ mergeParams: true });
router.get(
  '/',
  query('cursor').isNumeric().optional(),
  query('limit').isNumeric().optional(),
  requestValidator,
  controller.list
);
router.get('/:jid', sessionValidator, controller.find);
router.get('/:jid/photo', sessionValidator, controller.photo);

export default router;