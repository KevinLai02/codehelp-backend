import express from 'express';
import auth from '~/middleware/auth';
import { uploadFiles } from '~/middleware/file';
import { validation } from '~/middleware/validation';
import { accountSchema } from '~/utils/common-param-validation';
import { updateAvatarSchema } from './param-validation';
import {
  getUserInfoController,
  loginController,
  updateAvatarController,
} from './user.controller';

const router = express.Router();

router.route('/login').post(validation(accountSchema), loginController);

router.route('/info').get(auth, getUserInfoController);

router
  .route('/update/avatar')
  .put(
    uploadFiles.fields([{ name: 'avatar', maxCount: 1 }]),
    validation(updateAvatarSchema),
    auth,
    updateAvatarController
  );
export default router;
