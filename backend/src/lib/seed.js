require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const org = await prisma.organization.create({
    data: {
      name: 'wexa store (demo)',
      defaultLowStockThreshold: 5,
    },
  });

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'demo@stockflow.com',
      passwordHash,
      organizationId: org.id,
    },
  });

  const products = [
    { name: 'Wireless Headphones', sku: 'WH-001', quantityOnHand: 25, costPrice: 40, sellingPrice: 99, lowStockThreshold: 10, description: 'Premium noise-cancelling headphones' },
    { name: 'USB-C Cable', sku: 'USB-002', quantityOnHand: 3, costPrice: 5, sellingPrice: 15, lowStockThreshold: 10, description: '2m braided USB-C cable' },
    { name: 'Laptop Stand', sku: 'LS-003', quantityOnHand: 8, costPrice: 20, sellingPrice: 49, lowStockThreshold: 10, description: 'Adjustable aluminum laptop stand' },
    { name: 'Mechanical Keyboard', sku: 'KB-004', quantityOnHand: 2, costPrice: 60, sellingPrice: 149, lowStockThreshold: 5, description: 'TKL mechanical keyboard' },
    { name: 'Webcam HD', sku: 'WC-005', quantityOnHand: 12, costPrice: 35, sellingPrice: 79, lowStockThreshold: 5, description: '1080p USB webcam' },
    { name: 'Mouse Pad XL', sku: 'MP-006', quantityOnHand: 4, costPrice: 10, sellingPrice: 25, lowStockThreshold: 8, description: 'Extended gaming mouse pad' },
  ];

  for (const p of products) {
    await prisma.product.create({ data: { ...p, organizationId: org.id } });
  }

  console.log('✅ Seed complete!');
  console.log('Login: demo@stockflow.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
