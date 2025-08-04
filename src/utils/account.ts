import jwt from 'jsonwebtoken';
import type { Member } from '~/db/entities/Member';
import type { Mentor } from '~/db/entities/Mentor';

export const generateToken = (user: Member | Mentor) => {
  return (
    'Bearer ' +
    jwt.sign(
      { userName: user.userName, email: user.email, id: user.id },
      String(process.env.TOKEN),
      { expiresIn: '30 day' }
    )
  );
};
