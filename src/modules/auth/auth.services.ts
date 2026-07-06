import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "./../../utils/jwt";
import { ILoginUser } from "./auth.interface";

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

const getMe = async (token: string, secret: string) => {
  const verifiedUser = jwtUtils.verifyToken(token, secret);

  const { id } = verifiedUser.data as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const authServices = {
  userLogin,
  getMe,
};
