import { prisma } from "../../lib/prisma";
import { IAddGear } from "./gear.interface";

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

const updateGear = async (
  payload: IAddGear,
  gearId: string,
  userId: string,
) => {
  const { title, description, brand, pricePerDay, stock, image, isAvailable } =
    payload;

  const gear = await prisma.gearItems.findUnique({
    where: {
      id: gearId,
    },
    select: {
      id: true,
      providerId: true,
    },
  });

  if (!gear) throw new Error("Gear not found!");

  if (gear.providerId !== userId) {
    throw new Error("You are not authorized to update this gear!");
  }

  const updatedGear = await prisma.gearItems.update({
    where: {
      id: gear.id,
    },
    data: {
      title: title,
      description: description,
      brand: brand,
      pricePerDay: pricePerDay,
      stock: stock,
      image: image,
      isAvailable: isAvailable,
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

  return updatedGear;
};

const deleteGear = async (gearId: string, userId: string) => {
  const gear = await prisma.gearItems.findUnique({
    where: {
      id: gearId,
    },
    select: {
      id: true,
      providerId: true,
    },
  });

  if (!gear) throw new Error("Gear not found!");

  if (gear.providerId !== userId) {
    throw new Error("You are not authorized to delete this gear!");
  }

  await prisma.gearItems.delete({
    where: {
      id: gear.id,
    },
  });
};

const getAllGears = async () => {
  const gears = await prisma.gearItems.findMany({
    include: {
      categories: true,
    },
  });

  return gears;
};

export const gearServices = {
  addGear,
  updateGear,
  deleteGear,
  getAllGears,
};
