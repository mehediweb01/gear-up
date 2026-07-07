import slugify from "slugify";
import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: true,
    },
  });

  return categories;
};

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

export const categoryServices = {
  getAllCategories,
  createCategory,
};
