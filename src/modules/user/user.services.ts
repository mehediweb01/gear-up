import bcrypt from "bcryptjs";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ICreateUser } from "./user.interface";

const registerUser = async (payload: ICreateUser) => {
  const { name, email, password, phone, address, role } = payload;

  if (!name || !email || !password || !phone)
    throw new Error("All fields are required. Please try again.");

  const isExistingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (isExistingUser) throw new Error("User already exists! please login");

  if (phone.length !== 11) throw new Error(`Phone number is not valid!`);

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  const roleCapitalized = role?.toUpperCase() as UserRole;

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

export const userServices = {
  registerUser,
};
