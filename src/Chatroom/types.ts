import type { Member } from '~/db/entities/Member';
import type { Mentor } from '~/db/entities/Mentor';

export interface IChatroomModel {
  mentor: Mentor;
  member: Member;
}
