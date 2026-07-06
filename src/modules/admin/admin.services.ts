import slugify from "slugify";
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

  if (users.length === 0) throw new Error("No users found!");

  return users;
};

export const adminServices = {
  createCategory,
  getAllUsers,
};
