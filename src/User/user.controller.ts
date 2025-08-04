import type { IApi } from '~/types';
import errorHandler from '~/utils/errorHandler';
import { getUserInfo, login, updateAvatar } from './user.feature';

export const loginController: IApi = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { identity, user, token } = await login({ email, password });

    return res.status(200).send({
      status: 'ok',
      msg: 'Login successful',
      identity,
      token,
      user,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getUserInfoController: IApi = async (req, res) => {
  try {
    const { userId } = req.body;
    const { identity, user } = await getUserInfo({ userId });

    return res.status(200).send({
      status: 'ok',
      identity,
      user,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateAvatarController: IApi = async (req, res) => {
  try {
    const { userId, identity } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { avatar } = files;

    const _result = await updateAvatar({ userId, identity, avatar });

    return res.status(200).send({
      status: 'ok',
      message: 'Update successfully',
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
