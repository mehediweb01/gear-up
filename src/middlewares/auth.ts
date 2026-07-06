import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../prisma/generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import catchAsync from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        role: UserRole;
      };
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) throw new Error("You're not authorized! please login.");

    const verifiedUser = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret as string,
    );

    if (!verifiedUser.success) {
      throw new Error(verifiedUser.error);
    }

    const { id, name, email, phone, role } = verifiedUser.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("Forbidden! you're not allowed to access this resource.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        name,
        email,
        phone,
      },
    });

    if (!user) {
      throw new Error("user not found! please login again.");
    }

    if (user.status === "SUSPENDS") {
      throw new Error("Your account has been suspended! please contact admin.");
    }

    req.user = {
      id,
      name,
      email,
      phone,
      role,
    };

    next();
  });
};
