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

export const createNewUser = async (userData: any) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const updateUser = async (id: number, userData: any) => {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};
