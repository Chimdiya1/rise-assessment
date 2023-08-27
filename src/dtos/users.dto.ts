import { UserRole } from "../utils/enum/userRole.enum";

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface AuthUserDto {
  email: string;
  password: string;
}
