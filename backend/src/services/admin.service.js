import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";

function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

// utils/generateUserUniqueId.js
export const generateUserUniqueId = async () => {
  for (let i = 0; i < 1000; i++) {
    const id = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

    const existing = await prisma.user.findUnique({
      where: { userUniqueId: id },
    });

    if (!existing) {
      return id;
    }
  }

  throw new Error("Unable to generate unique 3-digit ID");
};

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

  const userUniqueId = await generateUserUniqueId();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: departmentFind?.name,
      departmentId: departmentFind?.id,
      userUniqueId,
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
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        role: { in: ["admin", "superAdmin"] },
      },
    },
    include: {
      headOf: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

// Find By Id
export const findUserByIdService = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      headOf: true,
      employees: true,
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


// employement

// get user employment
export const getUserEmployments = async (userId) => {
  return prisma.employment.findMany({
    where: { userId },
    orderBy: { workedFrom: "desc" },
  });
};


// add user employment
export const addUserEmployment = async (data) => {
  return prisma.employment.create({
    data: {
      ...data,
      userId: data.userId,
      workedFrom: new Date(data.workedFrom),
      workedTill: new Date(data.workedTill),
    },
  });
};


// Qualifications
export const getUserQualifications = async (userId) => {
  return prisma.qualification.findMany({
    where: { userId },
    orderBy: { fromYear: "desc" },
  });
};

export const addUserQualification = async (data) => {
  return prisma.qualification.create({
    data: {
      ...data,
      fromYear: new Date(data.fromYear),
      toYear: new Date(data.toYear),
    },
  });
};

// Payrolls
export const getUserPayrolls = async (userId) => {
  return prisma.payroll.findMany({
    where: { userId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
};

export const addUserPayroll = async (data) => {
  return prisma.payroll.create({
    data: {
      ...data,
      paymentDate: new Date(data.paymentDate),
    },
  });
};

// BankDetails
export const getUserBankDetails = async (userId) => {
  return prisma.bankDetail.findMany({
    where: { userId },
  });
};

export const addUserBankDetail = async (data) => {
  return prisma.bankDetail.create({
    data,
  });
};

// EarningsSummary
export const getUserEarningsSummary = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.dateOfJoining) {
    throw new Error("User or joining date not found");
  }

  const summaries = [];
  const today = new Date();
  const joinDate = new Date(user.dateOfJoining);

  let cycleStart = new Date(joinDate);
  while (cycleStart <= today) {
    const cycleEnd = new Date(cycleStart);
    cycleEnd.setMonth(cycleStart.getMonth() + 1);
    cycleEnd.setDate(3); // Cycle: 4th to 3rd

    const payroll = await prisma.payroll.findFirst({
      where: {
        userId,
        paymentDate: {
          gte: cycleStart,
          lte: cycleEnd,
        },
      },
    });

    summaries.push({
      cycle: `${cycleStart.toDateString()} - ${cycleEnd.toDateString()}`,
      payroll: payroll || null,
    });

    cycleStart.setMonth(cycleStart.getMonth() + 1);
    cycleStart.setDate(4);
  }

  return summaries;
};

