import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: true,
    },
  });

  return categories;
};

export const categoryServices = {
  getAllCategories,
};
