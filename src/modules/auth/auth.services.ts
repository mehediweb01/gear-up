import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "./../../utils/jwt";
import { ICreateUser, ILoginUser } from "./auth.interface";

const userRegister = async (payload: ICreateUser) => {
  const { name, email, password, phone, address, role } = payload;
  const requiredRoles = [UserRole.CUSTOMER, UserRole.PROVIDER] as UserRole[];
  const roleCapitalized = role?.toUpperCase() as UserRole;

  if (!name || !email || !password || !phone)
    throw new Error("All fields are required. Please try again.");

  const isExistingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (isExistingUser) throw new Error("User already exists! please login");

  if (phone.length !== 11) throw new Error(`Phone number is not valid!`);

  if (!requiredRoles.includes(roleCapitalized)) {
    throw new Error(
      `Only ${requiredRoles.join(", ")} can register. Please try again.`,
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  if (roleCapitalized === "ADMIN") {
    throw new Error(`Only user can register. Please try again.`);
  }

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: `+88${phone}`,
      address,
      role: roleCapitalized,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const userLogin = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error("Invalid authorization!");

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) throw new Error("Invalid authorization!");

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  } as JwtPayload;

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const authServices = {
  userRegister,
  userLogin,
  getMe,
};
