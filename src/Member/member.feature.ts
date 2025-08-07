import bcrypt from 'bcrypt';
import type { Member } from '~/db/entities/Member';
import type { IMemberInfo, IMemberRequestBody } from '~/Member/types';
import { RESPONSE_CODE } from '~/types';
import { generateToken } from '~/utils/account';
import { parseImageUrl, uploadFiles } from '~/utils/assetHelper';
import FeatureError from '~/utils/FeatureError';
import { addMember, findMemberBy, updateMember } from './member.model';

export const save = async (
  data: IMemberRequestBody
): Promise<{ newMember: Member; token: string }> => {
  const { email, password, avatar } = data;
  const isEmailExist = await findMemberBy({ email });
  if (isEmailExist) {
    throw new FeatureError(
      403,
      RESPONSE_CODE.DATA_DUPLICATE,
      `Email: ${email} has been created`
    );
  }

  const result = await uploadFiles([avatar[0]]);
  const [avatarImageId] = result;

  const encryptedPassword = await bcrypt.hash(password, 10);
  const newMember = await addMember({
    ...data,
    avatar: parseImageUrl(avatarImageId),
    password: encryptedPassword,
  });

  const token = generateToken(newMember);
  newMember.password = undefined;

  return { newMember, token };
};

export const getMember = async (memberId: string) => {
  const member = await findMemberBy({ id: memberId });
  if (!member) {
    throw new FeatureError(
      403,
      RESPONSE_CODE.TARGET_NOT_EXISTS,
      'Member not found.'
    );
  }
  return member;
};

export const updateMemberInfo = async ({
  userId,
  data,
}: {
  userId: string;
  data: IMemberInfo;
}) => {
  const res = await updateMember({ userId, data });

  return res;
};
