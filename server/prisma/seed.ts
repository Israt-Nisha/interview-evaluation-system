import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma';

async function main() {
  const email = 'admin@gmail.com';
  const password = 'password123';

  // 1. Seed Admin User
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.user.create({
      data: { name: 'Super Admin', email, password: hashed, role: 'ADMIN' },
    });
    console.log('Admin created:', admin.email);
  } else {
    console.log('Admin already exists!');
  }

  // 2. Seed Default Rubric Criteria
  const defaultCriteria = [
    { key: 'TECHNICAL_KNOWLEDGE', label: 'Technical Knowledge', description: 'Assesses depth and breadth of technical skills.', displayOrder: 1 },
    { key: 'PROBLEM_SOLVING', label: 'Problem Solving', description: 'Assesses analytical thinking and approach to challenges.', displayOrder: 2 },
    { key: 'CODING_QUALITY', label: 'Coding Quality', description: 'Assesses code structure, readability, and best practices.', displayOrder: 3 },
    { key: 'COMMUNICATION', label: 'Communication', description: 'Assesses verbal and written expression and explanation of technical concepts.', displayOrder: 4 },
    { key: 'SYSTEM_DESIGN', label: 'System Design', description: 'Assesses architecture skills and understanding of distributed systems.', displayOrder: 5 },
    { key: 'CULTURAL_FIT', label: 'Cultural Fit', description: 'Assesses alignment with company values and collaboration style.', displayOrder: 6 },
  ];

  for (const criterion of defaultCriteria) {
    const existingCriterion = await prisma.rubricCriterion.findUnique({
      where: { key: criterion.key },
    });
    if (!existingCriterion) {
      await prisma.rubricCriterion.create({
        data: criterion,
      });
      console.log(`Seeded rubric criterion: ${criterion.label}`);
    }
  }

  console.log('Database seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());