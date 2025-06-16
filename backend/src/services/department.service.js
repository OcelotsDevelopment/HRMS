import { prisma } from "../config/db.js";

export const addDepartmentService = async ({ name, headId }) => {
  // try {
  const departmentFind = await prisma.department.findUnique({
    where: { name },
  });

  if (departmentFind) {
    throw new Error("Department Already Exists");
  }

  const department = await prisma.department.create({
    data: {
      name,
      ...(headId && { headId }),
    },
  });

  return { department };
  // } catch (error) {
  //   console.error("Error creating department:", error);
  //   throw new Error("Failed to create department");
  // }
};

export const getAllDepartmentsService = async () => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        head: true,
        _count: {
          select: { employees: true },
        },
      },
    });
    return { departments };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch departments");
  }
};

export const getAllUsersWithDepartmentService = async (id) => {
  try {
    const departmentId = Number(id); 
    const users = await prisma.user.findMany({
     where: { departmentId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true, // ✅ include only departmentId
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { users };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch users with departments");
  }
};


export const getDepartmentByIdService = async (id) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        head: {
          include: {
            department: true,
          },
        },
        employees: true,
        users: true, // ✅ fetch all users under this department
      },
    });

    if (!department) {
      throw new Error("Department not found");
    }

    return { department };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch department");
  }
};

export const updateDepartmentService = async (id, { name, headId }) => {
  try {
    const data = {
      name,
      ...(headId
        ? {
            head: {
              connect: { id: headId },
            },
          }
        : {
            head: {
              disconnect: true,
            },
          }),
    };
    const department = await prisma.department.update({
      where: { id },
      data,
    });

    return { department };
  } catch (error) {
    throw new Error(error.message || "Failed to update department");
  }
};
