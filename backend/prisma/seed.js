const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@aaramba.com',
      password: adminPassword,
      role: 'admin',
      phone: '9876543210',
    },
  });

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'customer@aaramba.com',
      password: customerPassword,
      role: 'customer',
      phone: '9123456789',
    },
  });

  // Create categories
  const ringCategory = await prisma.category.create({
    data: {
      name: 'Rings',
      slug: 'rings',
    },
  });

  const necklaceCategory = await prisma.category.create({
    data: {
      name: 'Necklaces',
      slug: 'necklaces',
    },
  });

  const earringCategory = await prisma.category.create({
    data: {
      name: 'Earrings',
      slug: 'earrings',
    },
  });

  const braceletCategory = await prisma.category.create({
    data: {
      name: 'Bracelets',
      slug: 'bracelets',
    },
  });

  // Create products
  const products = [
    {
      name: 'Gold Diamond Ring',
      description: 'Beautiful 18K gold ring with premium diamond stone',
      price: 15000,
      discount: 10,
      stock: 50,
      categoryId: ringCategory.id,
      sku: 'RING-001',
      featured: true,
      images: ['https://via.placeholder.com/300?text=Gold+Diamond+Ring'],
    },
    {
      name: 'Silver Pearl Necklace',
      description: 'Elegant silver necklace with natural pearl pendant',
      price: 8000,
      discount: 5,
      stock: 30,
      categoryId: necklaceCategory.id,
      sku: 'NECK-001',
      featured: true,
      images: ['https://via.placeholder.com/300?text=Silver+Pearl+Necklace'],
    },
    {
      name: 'Diamond Stud Earrings',
      description: 'Classic diamond stud earrings in white gold',
      price: 12000,
      discount: 15,
      stock: 40,
      categoryId: earringCategory.id,
      sku: 'EAR-001',
      featured: true,
      images: ['https://via.placeholder.com/300?text=Diamond+Stud+Earrings'],
    },
    {
      name: 'Gold Bangle Bracelet',
      description: 'Traditional gold bangle bracelet with intricate design',
      price: 10000,
      discount: 0,
      stock: 25,
      categoryId: braceletCategory.id,
      sku: 'BRAC-001',
      featured: false,
      images: ['https://via.placeholder.com/300?text=Gold+Bangle+Bracelet'],
    },
    {
      name: 'Emerald Ring',
      description: 'Stunning emerald ring with diamond accents',
      price: 20000,
      discount: 20,
      stock: 15,
      categoryId: ringCategory.id,
      sku: 'RING-002',
      featured: true,
      images: ['https://via.placeholder.com/300?text=Emerald+Ring'],
    },
    {
      name: 'Ruby Necklace',
      description: 'Luxurious ruby pendant necklace in platinum',
      price: 25000,
      discount: 10,
      stock: 10,
      categoryId: necklaceCategory.id,
      sku: 'NECK-002',
      featured: true,
      images: ['https://via.placeholder.com/300?text=Ruby+Necklace'],
    },
  ];

  for (const product of products) {
    const finalPrice = product.price - (product.price * product.discount) / 100;
    await prisma.product.create({
      data: {
        ...product,
        finalPrice,
      },
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