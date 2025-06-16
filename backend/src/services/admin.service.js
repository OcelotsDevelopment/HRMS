import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";

function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Create User
export const createUserService = async ({ name, email, departmentId }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const password = generateSixDigitNumber();
  console.log(password);

  const hashedPassword = await bcrypt.hash(password.toString(), 10);

  const departmentFind = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: departmentFind?.name,
      departmentId: departmentFind?.id,
      headOf: {
        connect: {
          id: departmentId,
        },
      },
    },
  });

  return user;
};

// List Users
export const listUsersService = async () => {
  return await prisma.user.findMany({
    include: {
      headOf: true, // includes department if user is a department head
    },
    orderBy: {
      createdAt: "desc", // sort by 'createdAt' in ascending order
    },
  });
};

// Find By Id
export const findUserByIdService = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      headOf: true, // Include department info if applicable
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Edit User
export const editUserService = async (id, { name, email, departmentId }) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) throw new Error("User not found");

  const departmentFind = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      name,
      email,
      role: departmentFind?.name,
      departmentId: departmentFind?.id,
      headOf: departmentId
        ? {
            connect: { id: departmentId },
          }
        : undefined,
    },
  });

  return updatedUser;
};
