import type { Request, Response } from 'express';

import { getImageFromS3 } from '../utils/assetHelper';

type IApi = (req: Request, res: Response) => void;
export const getImage: IApi = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getImageFromS3(id);
    res.end(data);
  } catch (error) {
    res.status(500).send(error);
    throw error;
  }
};
