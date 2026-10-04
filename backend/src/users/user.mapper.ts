import type { User } from '../generated/prisma/client.js';

/** Never return password hashes: map every user through this function. */
export function toUserDto(user: Pick<User, 'id' | 'email' | 'fullName' | 'phone' | 'role' | 'createdAt'>) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}
