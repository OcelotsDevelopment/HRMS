import { prisma } from "../config/db.js";
export const createEmployeeService = async (data) => {
  try {
    let {
      // 1. Basic Info
      name,
      email,
      mobile,
      designation,
      sex,
      dob,
      age,
      placeOfBirth,
      height,
      weight,
      bloodGroup,
      nationality,
      maritalStatus,

      // 2. Address
      currentAddress,
      permanentAddress,

      // 3. Job Details
      departmentId,
      employeeCode,
      dateOfJoining,
      position,
      salaryOnJoining,
      reportingTo,
      hiredBy,
      replacementOf,
      isRehire,

      // 4. Qualification Details
      qualifications = [],

      // 5. Employment History
      employments = [],

      // 6. References
      references = [],

      // 7. Legal & Health Info
      liabilitiesDetails,
      familyBackground,
      hasFamilyBusiness,
      familyBusinessDetails,
      isPhysicallyImpaired,
      impairmentDetails,
    } = data;

    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });
    if (existingEmployee) {
      throw new Error("Employee already exists");
    }


    const department = await prisma.department.findUnique({
  where: { id: departmentId },
});




    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        mobile,
        designation,
        sex,
        dob: dob ? new Date(dob) : null,
        age,
        placeOfBirth,
        height,
        weight,
        bloodGroup,
        nationality,
        maritalStatus,

        currentAddress,
        permanentAddress,

        departmentId: department ? department.id : null,
        employeeCode,
        dateOfJoining,
        position,
        salaryOnJoining,
        reportingTo,
        hiredBy,
        replacementOf,
        isRehire,

        liabilitiesDetails,
        familyBackground,
        hasFamilyBusiness,
        familyBusinessDetails,
        isPhysicallyImpaired,
        impairmentDetails,

        qualifications: {
          create: qualifications,
        },
        employments: {
          create: employments,
        },
        references: {
          create: references,
        },
      },
    });

    return { employee };
  } catch (error) {
    console.log(error, "ererorereorererererldjof");
    throw new Error(error);
  }
};

export const getAllEmployeesService = async () => {
  const employees = await prisma.employee.findMany({
    include: {
      department: {
        include: {
          head: true, // include the department's head (User)
        },
      },
      qualifications: true,
      employments: true,
      references: true,
    },

    orderBy: {
    createdAt: 'desc', // sort by 'createdAt' in ascending order
  },
  });

  return { employees };
};


export const getEmployeeByIdService = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      qualifications: true,
      employments: true,
      references: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return { employee };
};

export const updateEmployeeService = async (id, data) => {
  try {
    if (data.dob) {
      data.dob = new Date(data.dob);
    }

    const employee = await prisma.employee.update({
      where: { id },
      data,
    });

    return { employee };
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Failed to update employee");
  }
};

