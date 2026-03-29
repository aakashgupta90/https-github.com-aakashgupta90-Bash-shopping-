import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Categories
  const watches = await prisma.category.upsert({
    where: { slug: 'watches' },
    update: {},
    create: { name: 'Watches', slug: 'watches' },
  });

  const bags = await prisma.category.upsert({
    where: { slug: 'bags' },
    update: {},
    create: { name: 'Bags', slug: 'bags' },
  });

  // 2. Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@bash.com' },
    update: {},
    create: {
      email: 'admin@bash.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // 3. Create Products
  const p1 = await prisma.product.create({
    data: {
      name: 'Essential Watch No. 1',
      slug: 'essential-watch-no-1',
      description: 'A minimalist timepiece for the modern professional.',
      basePrice: 240.00,
      categoryId: watches.id,
      attributes: JSON.stringify({ material: 'Stainless Steel', movement: 'Quartz' }),
      variants: {
        create: [
          { sku: 'W1-BLK', name: 'Black / Silver', stock: 10, attributes: JSON.stringify({ color: 'Black' }) },
          { sku: 'W1-SLV', name: 'Silver / White', stock: 5, attributes: JSON.stringify({ color: 'Silver' }) },
        ]
      }
    }
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
