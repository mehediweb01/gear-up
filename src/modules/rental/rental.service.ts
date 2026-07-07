import { prisma } from "../../lib/prisma";
import { IRentalOrder } from "./rental.interface";

const createOrder = async (payload: IRentalOrder) => {
  const { customerId, startDate, rentalDays, gearId, quantity } = payload;

  if (!customerId) throw new Error("customerId is required!");
  if (!startDate) throw new Error("startDate is required!");
  if (!rentalDays) throw new Error("rentalDays is required!");
  if (!gearId) throw new Error("gearId is required!");
  if (!quantity) throw new Error("quantity is required!");

  const gear = await prisma.gearItems.findUnique({
    where: {
      id: gearId,
    },
  });

  if (!gear) throw new Error("gear not found!");

  if (gear.isAvailable === false) {
    throw new Error("Gear is not available!");
  }

  if (gear.stock < quantity) {
    throw new Error("Gear stock is not enough!");
  }

  const totalPrice = quantity * gear.pricePerDay;
  const start = new Date(startDate);
  let end = new Date(start);
  end.setDate(end.getDate() + Number(rentalDays));

  const createdOrder = await prisma.rentalOrder.create({
    data: {
      customerId,
      gearId,
      quantity,
      totalPrice,
      startDate: start,
      endDate: end,
      status: "PLACED",
    },
    include: {
      gear: {
        select: {
          id: true,
          pricePerDay: true,
          title: true,
          brand: true,
          image: true,
        },
      },
    },
  });

  const stock = gear.stock - quantity;
  const isAvailable = stock > 0 ? true : false;

  await prisma.gearItems.update({
    where: {
      id: gear.id,
    },
    data: {
      stock,
      isAvailable,
    },
  });

  return createdOrder;
};

export const rentalServices = {
  createOrder,
};
