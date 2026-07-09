import { RentalOrderStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

const createReview = async (customerId: string, payload: ICreateReview) => {
  const { comment, rating, gearId } = payload;

  const gear = await prisma.gearItems.findUnique({
    where: {
      id: gearId,
    },
    include: {
      rentals: true,
    },
  });

  if (!gear) throw new Error("Gear not found!");

  const hasPurchasedGear = await prisma.rentalOrder.findFirst({
    where: {
      customerId: customerId,
      gearId: gear.id,
      status: RentalOrderStatus.RETURNED,
    },
  });

  if (!hasPurchasedGear) throw new Error("You have not purchased this gear!");

  if (rating < 1 || rating > 5)
    throw new Error("Rating must be between 1 and 5!");

  const review = await prisma.review.create({
    data: {
      comment,
      rating,
      customerId,
      gearId: gear.id,
    },
    include: {
      customer: {
        omit: {
          password: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
      },
    },
  });

  return review;
};

export const reviewServices = {
  createReview,
};
