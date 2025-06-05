import {prisma} from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from '../utils/generateToken.js';

export const registerService = async ({ name, email, password, role }) => {
  const hash = await bcrypt.hash(password, 10);
  const userFind = await prisma.user.findUnique({ where: { email } });
  console.log(userFind);
  if (userFind) {
    throw new Error('User Already Exist');
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      role,
    },
  });

  return { id: user.id, email: user.email, name: user.name, role: user.role };
};


export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  const token = jwt(user.id);
  return { token,user:{id:user.id,name:user.name,email:user.email} };
};