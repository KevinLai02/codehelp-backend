import { type IApi, RESPONSE_CODE } from '~/types';
import errorHandler from '~/utils/errorHandler';
import FeatureError from '~/utils/FeatureError';
import { addMessage, getMessageRecords } from './message.feature';

export const newMessage: IApi = async (req, res) => {
  try {
    const { chatroomId } = req.params;
    const { userId, content } = req.body;

    const messageDetail = await addMessage({ chatroomId, userId, content });

    return res.status(200).send({
      message: messageDetail,
      status: 'ok',
    });
  } catch (error) {
    if (error instanceof FeatureError) {
      res.status(error.serverStatus).send({
        code: error.code,
        message: error.message,
      });
    } else {
      res.status(500).send({
        code: RESPONSE_CODE.UNKNOWN_ERROR,
        message: error,
      });
      throw error;
    }
  }
};

export const getMessageRecordsController: IApi = async (req, res) => {
  try {
    const { userId } = req.body;
    const { chatroomId } = req.params;
    const { page, count } = req.query;

    const [messages, total] = await getMessageRecords({
      userId,
      chatroomId,
      page: Number(page),
      count: Number(count),
    });

    res.status(200).send({
      status: 'ok',
      messages,
      total,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
