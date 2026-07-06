import slugify from "slugify";
import { UserStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./admin.interface";

const createCategory = async (payload: ICreateCategory) => {
  const { name, description } = payload;

  if (!name) throw new Error("Category name is required.");

  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  return category;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
    include: {
      gears: true,
      _count: true,
    },
  });

  return users;
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  if (!id) throw new Error("User id is required.");

  const requiredStatus = [
    UserStatus.ACTIVE.toLowerCase(),
    UserStatus.SUSPENDS.toLowerCase(),
  ] as UserStatus[];

  if (!requiredStatus.includes(status.toLowerCase() as UserStatus)) {
    throw new Error(`Only ${requiredStatus.join(",")} can be updated.`);
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) throw new Error("User not found.");

  if (user.status.toLowerCase() === status.toLowerCase()) {
    throw new Error("User status is already updated.");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      status: status.toUpperCase() as UserStatus,
    },
  });

  return updatedUser;
};

const getAllGears = async () => {
  const gears = await prisma.gearItems.findMany({
    include: {
      provider: {
        omit: {
          password: true,
        },
      },
      categories: true,
    },
  });

  return gears;
};

export const adminServices = {
  createCategory,
  getAllUsers,
  updateUserStatus,
  getAllGears,
};
