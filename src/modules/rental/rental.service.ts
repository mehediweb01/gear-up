import { RentalOrderStatus } from "../../../prisma/generated/prisma/enums";
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

const getUserOrders = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found!");

  const orders = await prisma.rentalOrder.findMany({
    where: {
      customerId: userId,
    },
    include: {
      gear: {
        include: {
          provider: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });

  return orders;
};

const getOrderDetails = async (orderId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      gear: {
        include: {
          provider: {
            omit: {
              password: true,
              role: true,
              createdAt: true,
              updatedAt: true,
              status: true,
            },
          },
          categories: {
            omit: {
              createdAt: true,
              updatedAt: true,
            },
          },
          reviews: {
            omit: {
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        omit: {
          stock: true,
          isAvailable: true,
          providerId: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return order;
};

const getIncomingOrders = async (userId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: {
      gear: {
        providerId: userId,
      },
    },
    include: {
      gear: true,
      customer: {
        omit: {
          password: true,
        },
      },
    },
  });

  return orders;
};

const updateOrderStatus = async (
  userId: string,
  orderId: string,
  status: RentalOrderStatus,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found!");

  const requiredOrderStatus = [
    RentalOrderStatus.PLACED.toLowerCase(),
    RentalOrderStatus.CANCELLED.toLowerCase(),
    RentalOrderStatus.CONFIRMED.toLowerCase(),
    RentalOrderStatus.PAID.toLowerCase(),
    RentalOrderStatus.PICKED_UP.toLowerCase(),
    RentalOrderStatus.RETURNED.toLowerCase(),
  ];

  if (
    !requiredOrderStatus.includes(status.toLowerCase() as RentalOrderStatus)
  ) {
    throw new Error(`Only ${requiredOrderStatus.join(",")} can be updated.`);
  }

  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: orderId,
    },
    include: {
      gear: {
        select: {
          providerId: true,
        },
      },
    },
  });

  if (!order) throw new Error("Order not found!");

  if (order?.gear.providerId !== userId) {
    throw new Error("You are not authorized to update this order!");
  }

  if (order.status.toLowerCase() === status.toLowerCase()) {
    throw new Error("Order status is already updated.");
  }

  const updatedOrderStatus = await prisma.rentalOrder.update({
    where: {
      id: order.id,
    },
    data: {
      status: status.toUpperCase() as RentalOrderStatus,
    },
  });

  return updatedOrderStatus;
};

const getAllOrders = async () => {
  const orders = await prisma.rentalOrder.findMany({
    include: {
      gear: {
        include: {
          reviews: true,
          categories: true,
          provider: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });

  return orders;
};

export const rentalServices = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getIncomingOrders,
  updateOrderStatus,
  getAllOrders,
};
