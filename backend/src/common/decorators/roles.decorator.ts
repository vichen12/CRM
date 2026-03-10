import { SetMetadata } from '@nestjs/common';
import { RolTipo } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolTipo[]) => SetMetadata(ROLES_KEY, roles);
