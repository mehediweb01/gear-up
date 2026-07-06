import { UserRole } from "../../../prisma/generated/prisma/enums";
export interface ILoginUser {
  email: string;
  password: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  role?: UserRole;
}
