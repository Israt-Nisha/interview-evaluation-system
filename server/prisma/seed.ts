import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma';

async function main() {
  const email = 'admin@gmail.com';
  const password = 'password123';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return console.log('Admin already exists!');

  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.user.create({
    data: { name: 'Super Admin', email, password: hashed, role: 'ADMIN' },
  });

  console.log('Admin created:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());