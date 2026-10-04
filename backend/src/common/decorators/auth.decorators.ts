import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

import type { Role } from '../../generated/prisma/client.js';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

/** Opt a route out of the global authentication guard. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Restrict a controller or route to the given roles. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser =>
    context.switchToHttp().getRequest<{ user: AuthUser }>().user,
);
