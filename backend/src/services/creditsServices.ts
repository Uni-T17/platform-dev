import { prisma } from ".";

export const getCreditsByOwnerId = async (userId: number) => {
  return await prisma.credits.findUnique({
    where: {
      userId,
    },
  });
};

export const updateCredits = async (creditId: number, creditData: any) => {
  return await prisma.credits.update({
    where: {
      id: creditId,
    },
    data: creditData,
  });
};
