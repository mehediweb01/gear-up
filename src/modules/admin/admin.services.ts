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

export const adminServices = {
  createCategory,
};
