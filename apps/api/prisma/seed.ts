import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bash.com' },
    update: {},
    create: {
      email: 'admin@bash.com',
      password: 'password123', // In a real app, hash this!
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log({ admin });

  // Create some products
  const products = [
    {
      name: 'Essential Watch No. 1',
      slug: 'essential-watch-no-1',
      description: 'A minimalist timepiece for the modern professional.',
      price: 240.00,
      stock: 12,
      category: 'Watches',
      image: 'https://picsum.photos/seed/prod1/800/1200',
      images: JSON.stringify(['https://picsum.photos/seed/prod1/800/1200']),
    },
    {
      name: 'Archival Backpack',
      slug: 'archival-backpack',
      description: 'Durable and stylish, perfect for daily use.',
      price: 180.00,
      stock: 4,
      category: 'Bags',
      image: 'https://picsum.photos/seed/prod2/800/1200',
      images: JSON.stringify(['https://picsum.photos/seed/prod2/800/1200']),
    },
    {
      name: 'Minimalist Wallet',
      slug: 'minimalist-wallet',
      description: 'Slim design, premium leather.',
      price: 85.00,
      stock: 0,
      category: 'Accessories',
      image: 'https://picsum.photos/seed/prod3/800/1200',
      images: JSON.stringify(['https://picsum.photos/seed/prod3/800/1200']),
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
