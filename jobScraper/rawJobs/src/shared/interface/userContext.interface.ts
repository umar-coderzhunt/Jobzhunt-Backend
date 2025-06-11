import { UserRole } from '../enums/usersRoles.enum';

export interface CurrentUser {
  id: string;
  role: UserRole;
}
