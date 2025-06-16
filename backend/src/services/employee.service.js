import { prisma } from "../config/db.js";

function isValidDate(input) {
  const date = new Date(input);
  return (
    !isNaN(date.getTime()) &&
    date.getFullYear() > 1900 &&
    date.getFullYear() < 2100
  );
}

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
      coordinatorId,
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

    // Optional validation
    const department = departmentId
      ? await prisma.department.findUnique({ where: { id: departmentId } })
      : null;

    const coordinator = coordinatorId
      ? await prisma.user.findUnique({ where: { id: coordinatorId } })
      : null;

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        mobile,
        designation,
        sex,
        dob: dob && isValidDate(dob) ? new Date(dob) : null,
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
        coordinatorId: coordinator ? coordinator.id : null, // ✅ new line

        employeeCode,
        dateOfJoining:
          dateOfJoining && isValidDate(dateOfJoining)
            ? new Date(dateOfJoining)
            : null,
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
    console.error("Error creating employee:", error);
    throw new Error(error.message || "Failed to create employee");
  }
};

export const getAllEmployeesService = async () => {
  const employees = await prisma.employee.findMany({
    include: {
      department: true,
      coordinator: true, // ✅ include coordinator (User)
      qualifications: true,
      employments: true,
      references: true,
    },
    orderBy: {
      createdAt: "desc", // ✅ descending = newest first
    },
  });

  return { employees };
};

export const getEmployeeByIdService = async (id) => {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      coordinator: true,
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
    // ✅ Validate and convert DOB
    if (data.dob && !isValidDate(data.dob))
      throw new Error("Invalid date of birth");
    if (data.dob) data.dob = new Date(data.dob);

    if (data.dateOfJoining && !isValidDate(data.dateOfJoining))
      throw new Error("Invalid date of joining");
    if (data.dateOfJoining) data.dateOfJoining = new Date(data.dateOfJoining);

    // ✅ Validate coordinatorId
    if (data.coordinatorId) {
      const coordinatorExists = await prisma.user.findUnique({
        where: { id: data.coordinatorId },
      });
      if (!coordinatorExists) {
        throw new Error("Coordinator not found");
      }
    }

    // ✅ Validate departmentId
    if (data.departmentId) {
      const departmentExists = await prisma.department.findUnique({
        where: { id: data.departmentId },
      });
      if (!departmentExists) {
        throw new Error("Department not found");
      }
    }

    // ✅ Update the employee
    const employee = await prisma.employee.update({
      where: { id },
      data,
    });

    return { employee };
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error(error.message || "Failed to update employee");
  }
};
