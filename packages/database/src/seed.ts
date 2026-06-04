import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin User ───
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotzyfoods.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@hotzyfoods.com',
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // ─── Categories ───
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Hot Sauces',
        slug: 'hot-sauces',
        icon: 'local_fire_department',
        description: 'Our signature hot sauces made with premium Scotch Bonnet peppers',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Asian Inspired Sauces',
        slug: 'asian-inspired-sauces',
        icon: 'ramen_dining',
        description: 'Teriyaki, sweet chili, and more Asian-inspired flavors',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Jams',
        slug: 'jams',
        icon: 'breakfast_dining',
        description: 'Natural fruit jams with a tropical twist',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bundle Offers',
        slug: 'bundle-offers',
        icon: 'inventory_2',
        description: 'Save big with our curated combo packs',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Gift Packs',
        slug: 'gift-packs',
        icon: 'card_giftcard',
        description: 'Perfect gifts for spice lovers',
        sortOrder: 5,
      },
    }),
  ]);
  console.log(`  ✓ ${categories.length} categories created`);

  // ─── Products ───
  const hotSaucesId = categories[0].id;
  const asianId = categories[1].id;
  const jamsId = categories[2].id;

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Snake Bite Hot Sauce',
        slug: 'snake-bite-hot-sauce',
        sku: 'HZ-SB-001',
        description:
          'A pineapple-based hot sauce with a perfect balance of sweet and heat. Our original creation that started it all.',
        price: 1850,
        compareAtPrice: 2200,
        stockLevel: 200,
        heatLevel: 'MEDIUM',
        shuMin: 10000,
        shuMax: 30000,
        isFeatured: true,
        isBestseller: true,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: hotSaucesId,
        images: {
          create: [{ url: '/images/products/snake-bite.jpg', alt: 'Snake Bite Hot Sauce bottle', sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Scorpion Sting Hot Sauce',
        slug: 'scorpion-sting-hot-sauce',
        sku: 'HZ-SS-002',
        description:
          'A mango-based hot sauce with a milder heat profile. Sweet, tangy, and dangerously delicious.',
        price: 1850,
        stockLevel: 180,
        heatLevel: 'MILD',
        shuMin: 1000,
        shuMax: 5000,
        isFeatured: true,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: hotSaucesId,
        images: {
          create: [{ url: '/images/products/scorpion-sting.jpg', alt: 'Scorpion Sting Hot Sauce bottle', sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Dragon's Fury Hot Sauce",
        slug: 'dragons-fury-hot-sauce',
        sku: 'HZ-DF-003',
        description:
          'A passion fruit-based hot sauce with intense heat. Not for the faint of heart.',
        price: 1950,
        stockLevel: 150,
        heatLevel: 'HOT',
        shuMin: 50000,
        shuMax: 100000,
        isFeatured: true,
        isNew: true,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: hotSaucesId,
        images: {
          create: [{ url: '/images/products/dragons-fury.jpg', alt: "Dragon's Fury Hot Sauce bottle", sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Savvy Samurai Teriyaki Sauce',
        slug: 'savvy-samurai-teriyaki-sauce',
        sku: 'HZ-SS-004',
        description:
          'A rich and savory teriyaki sauce with a subtle spicy kick. Perfect for stir-fries, marinades, and dipping.',
        price: 1650,
        stockLevel: 120,
        heatLevel: 'MILD',
        shuMin: 500,
        shuMax: 2000,
        isFeatured: true,
        dietaryTags: ['vegan', 'no-msg'],
        categoryId: asianId,
        images: {
          create: [{ url: '/images/products/samurai-teriyaki.jpg', alt: 'Savvy Samurai Teriyaki Sauce bottle', sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Nak Muay Thai Sweet Chili Sauce',
        slug: 'nak-muay-thai-sweet-chili-sauce',
        sku: 'HZ-NM-005',
        description:
          'An authentic Thai sweet chili sauce with the perfect balance of sweetness and heat.',
        price: 1650,
        stockLevel: 90,
        heatLevel: 'MILD',
        shuMin: 500,
        shuMax: 3000,
        isNew: true,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: asianId,
        images: {
          create: [{ url: '/images/products/nak-muay.jpg', alt: 'Nak Muay Thai Sweet Chili Sauce bottle', sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mango Tango Jam',
        slug: 'mango-tango-jam',
        sku: 'HZ-MT-006',
        description:
          'A tropical mango jam bursting with sunshine flavor. Perfect on toast, pastries, or with cheese.',
        price: 990,
        compareAtPrice: 1200,
        stockLevel: 75,
        isFeatured: true,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: jamsId,
        images: {
          create: [{ url: '/images/products/mango-tango.jpg', alt: 'Mango Tango Jam jar', sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pineapple Bliss Jam',
        slug: 'pineapple-bliss-jam',
        sku: 'HZ-PB-007',
        description:
          'A sweet and tangy pineapple jam that brings tropical vibes to your breakfast table.',
        price: 990,
        stockLevel: 80,
        isNew: true,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: jamsId,
        images: {
          create: [{ url: '/images/products/pineapple-bliss.jpg', alt: 'Pineapple Bliss Jam jar', sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Passion Fashion Jam',
        slug: 'passion-fashion-jam',
        sku: 'HZ-PF-008',
        description:
          'An exotic passion fruit jam with the perfect balance of sweet and tart flavors.',
        price: 990,
        stockLevel: 65,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: jamsId,
        images: {
          create: [{ url: '/images/products/passion-fashion.jpg', alt: 'Passion Fashion Jam jar', sortOrder: 1 }],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Papaya Twist Jam',
        slug: 'papaya-twist-jam',
        sku: 'HZ-PT-009',
        description:
          'A unique papaya jam with a twist of tropical spices. An island classic.',
        price: 990,
        stockLevel: 55,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: jamsId,
        images: {
          create: [{ url: '/images/products/papaya-twist.jpg', alt: 'Papaya Twist Jam jar', sortOrder: 1 }],
        },
      },
    }),
  ]);
  console.log(`  ✓ ${products.length} products created`);

  // ─── Site Settings ───
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      brandName: 'Hotzy Foods',
      tagline: 'Bold Flavor. Zero Limits.',
      currency: 'LKR',
      currencySymbol: 'Rs.',
      taxRate: 0,
      shippingBase: 350,
      freeShippingThreshold: 5000,
      contactEmail: 'info@hotzyfoods.com',
      contactPhone: '(+94) 76 330 53 88',
      contactWhatsApp: '(+94) 710 566 570',
      address: 'No. 872, Wadichchalaya, Polonnaruwa, Sri Lanka',
      socialLinks: {
        tiktok: 'https://tiktok.com/@hotzyfoods',
        facebook: 'https://facebook.com/hotzyfoods',
        instagram: 'https://instagram.com/hotzyfoods',
      },
    },
  });
  console.log('  ✓ Site settings created');

  // ─── Team Members ───
  await Promise.all([
    prisma.teamMember.create({
      data: {
        name: 'Amali',
        role: 'Co-Founder & Flavor Architect',
        bio: 'Co-creator of Hotzy Foods. Passionate about bringing bold Sri Lankan flavors to the world.',
        sortOrder: 1,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Chamath',
        role: 'Co-Founder & Heat Engineer',
        bio: 'Co-creator of Hotzy Foods. Dedicated to crafting the perfect balance of heat and flavor.',
        sortOrder: 2,
      },
    }),
  ]);
  console.log('  ✓ Team members created');

  // ─── Sample Orders ───
  const customer = await prisma.customer.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Jenkins',
      phone: '+94 77 123 4567',
      isGuest: false,
      totalOrders: 3,
      totalSpent: 5550,
      segment: 'VIP - High Spender',
      loyaltyPoints: 2340,
    },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: 'HZ-8892',
      customerId: customer.id,
      status: 'COMPLETED',
      subtotal: 2800,
      shippingCost: 350,
      tax: 0,
      total: 3150,
      shippingName: 'Sarah Jenkins',
      shippingPhone: '+94 77 123 4567',
      shippingAddress: '42 Galle Road, Colombo 03',
      shippingCity: 'Colombo',
      shippingProvince: 'Western',
      paidAt: new Date('2024-10-24'),
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: 1850,
            subtotal: 3700,
          },
        ],
      },
    },
  });
  console.log(`  ✓ Sample order created: ${order.orderNumber}`);

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
