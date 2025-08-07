import jwt from 'jsonwebtoken';
import { NOT_EXISTS_ID } from './constant';

export const generateNotExistsToken = () =>
  'Bearer ' +
  jwt.sign(
    {
      userName: 'none',
      email: 'none',
      id: NOT_EXISTS_ID,
    },
    String(process.env.TOKEN),
    { expiresIn: '30 day' }
  );
