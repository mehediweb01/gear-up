import { prisma } from "../../lib/prisma";
import { IAddGear, IQuery } from "./gear.interface";

const getAllGears = async (query: IQuery) => {
  const { category, brand, minPrice, maxPrice } = query;

  const gears = await prisma.gearItems.findMany({
    where: {
      ...(brand && {
        brand: {
          equals: brand,
          mode: "insensitive",
        },
      }),

      ...(category && {
        categories: {
          slug: category,
        },
      }),

      ...((minPrice || maxPrice) && {
        pricePerDay: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) }),
        },
      }),
    },

    include: {
      categories: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
      provider: {
        omit: {
          password: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return gears;
};

const getGearDetails = async (gearId: string) => {
  const gear = await prisma.gearItems.findUnique({
    where: {
      id: gearId,
    },
    include: {
      provider: {
        omit: {
          password: true,
        },
      },
      categories: true,
      rentals: true,
      reviews: true,
      _count: {
        select: {
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  if (!gear) throw new Error("Gear not found!");

  return gear;
};

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

export const gearServices = {
  getAllGears,
  getGearDetails,
  addGear,
  updateGear,
  deleteGear,
};
