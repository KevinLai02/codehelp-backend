import express from 'express';

import auth from '~/middleware/auth';
import { uploadFiles } from '~/middleware/file';
import { validation } from '~/middleware/validation';
import {
  getMentorInfo,
  getMentorList,
  modifyAvailableTime,
  signUp,
  updateDisciplinesController,
  updateMentorInfoController,
  updateSkillsController,
  updateToolsController,
} from './mentor.controller';
import {
  getMentorInfoSchema,
  searchSchema,
  signUpSchema,
  updateAvailableTimeSchema,
  updateDisciplineSchema,
  updateMentorInfoSchema,
  updateSkillSchema,
  updateToolSchema,
} from './param-validation';

const router = express.Router();

router
  .route('/signUp')
  .post(
    uploadFiles.fields([{ name: 'avatar', maxCount: 1 }]),
    validation(signUpSchema),
    signUp
  );

router.route('/info/:id').get(validation(getMentorInfoSchema), getMentorInfo);

router.route('/list').get(validation(searchSchema), getMentorList);

router
  .route('/updateAvailableTime')
  .put(validation(updateAvailableTimeSchema), auth, modifyAvailableTime);

router
  .route('/update/info')
  .put(validation(updateMentorInfoSchema), auth, updateMentorInfoController);

router
  .route('/update/disciplines')
  .put(validation(updateDisciplineSchema), auth, updateDisciplinesController);

router
  .route('/update/skills')
  .put(validation(updateSkillSchema), auth, updateSkillsController);

router
  .route('/update/tools')
  .put(validation(updateToolSchema), auth, updateToolsController);
export default router;
