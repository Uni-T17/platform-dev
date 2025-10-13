import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email: email },
  });
};

export const getOtpByEmail = async (email: string) => {
  return await prisma.otp.findUnique({
    where: { email: email },
  });
};

export const createOtp = async (otpData: any) => {
  return await prisma.otp.create({
    data: otpData,
  });
};

export const updateOtp = async (id: number, otpData: any) => {
  return await prisma.otp.update({
    where: { id },
    data: otpData,
  });
};
