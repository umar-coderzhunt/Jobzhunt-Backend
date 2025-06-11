import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/usersRoles.enum';

export const Roles = Reflector.createDecorator<UserRole[]>();
