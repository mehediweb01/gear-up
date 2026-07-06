import { prisma } from "../../lib/prisma";
import { IAddGear } from "./provider.interface";

const addGear = async (payload: IAddGear, userId: string) => {
  const {
    title,
    brand,
    description,
    image,
    pricePerDay,
    stock,
    isAvailable,
    categoryId,
  } = payload;

  if (!title || !brand || !image || !pricePerDay || !stock || !categoryId) {
    throw new Error("All fields are required");
  }

  const category = await prisma.category.findMany();

  const categoriesIds = category.map((cat) => cat.id);

  if (categoriesIds.indexOf(categoryId) === -1) {
    throw new Error("Category not found");
  }

  const createdGear = await prisma.gearItems.create({
    data: {
      title,
      brand,
      description,
      image,
      pricePerDay,
      stock,
      isAvailable,
      categoryId: categoryId,
      providerId: userId,
    },
    include: {
      categories: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return createdGear;
};

export const providerServices = {
  addGear,
};
