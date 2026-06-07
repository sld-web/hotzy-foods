import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clear existing data (idempotent) ───
  await prisma.pageView.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ Cleared existing data');

  // ─── Admin User ───
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotzyfoods.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin.hotsy@cnl.com',
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
          create: [
            {
              url: '/products/product-1.webp',
              alt: 'Snake Bite Hot Sauce bottle',
              sortOrder: 1,
            },
          ],
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
          create: [
            {
              url: '/products/product-2.webp',
              alt: 'Scorpion Sting Hot Sauce bottle',
              sortOrder: 1,
            },
          ],
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
          create: [
            {
              url: '/products/product-3.webp',
              alt: "Dragon's Fury Hot Sauce bottle",
              sortOrder: 1,
            },
          ],
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
          create: [
            {
              url: '/products/product-4.webp',
              alt: 'Savvy Samurai Teriyaki Sauce bottle',
              sortOrder: 1,
            },
          ],
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
          create: [
            {
              url: '/products/product-5.webp',
              alt: 'Nak Muay Thai Sweet Chili Sauce bottle',
              sortOrder: 1,
            },
          ],
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
          create: [
            {
              url: '/products/product-6.webp',
              alt: 'Mango Tango Jam jar',
              sortOrder: 1,
            },
          ],
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
          create: [
            {
              url: '/products/product-7.webp',
              alt: 'Pineapple Bliss Jam jar',
              sortOrder: 1,
            },
          ],
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
          create: [
            {
              url: '/products/product-8.webp',
              alt: 'Passion Fashion Jam jar',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Papaya Twist Jam',
        slug: 'papaya-twist-jam',
        sku: 'HZ-PT-009',
        description: 'A unique papaya jam with a twist of tropical spices. An island classic.',
        price: 990,
        stockLevel: 55,
        dietaryTags: ['vegan', 'gluten-free', 'no-msg'],
        categoryId: jamsId,
        images: {
          create: [
            {
              url: '/products/product-9.webp',
              alt: 'Papaya Twist Jam jar',
              sortOrder: 1,
            },
          ],
        },
      },
    }),
  ]);
  console.log(`  ✓ ${products.length} products created`);

  // ─── Site Settings ───
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {
      heroTitle: 'Summer Heat Collection',
      heroDescription:
        "Sri Lanka's most flavorful hot sauce brand. Crafted with premium Scotch Bonnet peppers.",
      heroCtaText: 'Shop Now',
      heroCtaUrl: '/products',
    },
    create: {
      brandName: 'Hotzy Foods',
      tagline: 'Bold Flavor. Zero Limits.',
      heroTitle: 'Summer Heat Collection',
      heroDescription:
        "Sri Lanka's most flavorful hot sauce brand. Crafted with premium Scotch Bonnet peppers.",
      heroCtaText: 'Shop Now',
      heroCtaUrl: '/products',
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

  // ─── Sample Customers ───
  const customerPassword = await bcrypt.hash('password123', 12);

  interface CustomerSeed {
    email: string;
    name: string;
    phone: string;
    city: string;
    province: string;
    segment: string;
    totalOrders: number;
  }

  const customerSeeds: CustomerSeed[] = [
    {
      email: 'sarah@example.com',
      name: 'Sarah Jenkins',
      phone: '+94 77 123 4567',
      city: 'Colombo',
      province: 'Western',
      segment: 'VIP - High Spender',
      totalOrders: 8,
    },
    {
      email: 'ruwan@example.com',
      name: 'Ruwan Perera',
      phone: '+94 71 234 5678',
      city: 'Kandy',
      province: 'Central',
      segment: 'VIP - High Spender',
      totalOrders: 6,
    },
    {
      email: 'priya@example.com',
      name: 'Priya Sharma',
      phone: '+94 72 345 6789',
      city: 'Colombo',
      province: 'Western',
      segment: 'Regular',
      totalOrders: 4,
    },
    {
      email: 'kamal@example.com',
      name: 'Kamal Fernando',
      phone: '+94 76 456 7890',
      city: 'Galle',
      province: 'Southern',
      segment: 'Regular',
      totalOrders: 3,
    },
    {
      email: 'nimal@example.com',
      name: 'Nimal Silva',
      phone: '+94 70 567 8901',
      city: 'Jaffna',
      province: 'Northern',
      segment: 'Regular',
      totalOrders: 3,
    },
    {
      email: 'amaya@example.com',
      name: 'Amaya Dissanayake',
      phone: '+94 75 678 9012',
      city: 'Negombo',
      province: 'Western',
      segment: 'New',
      totalOrders: 1,
    },
    {
      email: 'chathura@example.com',
      name: 'Chathura Bandara',
      phone: '+94 77 789 0123',
      city: 'Batticaloa',
      province: 'Eastern',
      segment: 'New',
      totalOrders: 1,
    },
    {
      email: 'dilani@example.com',
      name: 'Dilani Jayawardena',
      phone: '+94 71 890 1234',
      city: 'Kurunegala',
      province: 'North Western',
      segment: 'Regular',
      totalOrders: 5,
    },
    {
      email: 'eranga@example.com',
      name: 'Eranga Wickramasinghe',
      phone: '+94 72 901 2345',
      city: 'Anuradhapura',
      province: 'North Central',
      segment: 'Regular',
      totalOrders: 2,
    },
    {
      email: 'fathima@example.com',
      name: 'Fathima Hassan',
      phone: '+94 76 012 3456',
      city: 'Colombo',
      province: 'Western',
      segment: 'VIP - High Spender',
      totalOrders: 7,
    },
    {
      email: 'gayan@example.com',
      name: 'Gayan Rathnayake',
      phone: '+94 70 111 2222',
      city: 'Kandy',
      province: 'Central',
      segment: 'At Risk',
      totalOrders: 2,
    },
    {
      email: 'harsha@example.com',
      name: 'Harsha de Silva',
      phone: '+94 75 222 3333',
      city: 'Galle',
      province: 'Southern',
      segment: 'At Risk',
      totalOrders: 1,
    },
    {
      email: 'indika@example.com',
      name: 'Indika Weerasinghe',
      phone: '+94 77 333 4444',
      city: 'Jaffna',
      province: 'Northern',
      segment: 'New',
      totalOrders: 1,
    },
    {
      email: 'jagath@example.com',
      name: 'Jagath Kumara',
      phone: '+94 71 444 5555',
      city: 'Negombo',
      province: 'Western',
      segment: 'Regular',
      totalOrders: 3,
    },
    {
      email: 'kavindi@example.com',
      name: 'Kavindi Senanayake',
      phone: '+94 72 555 6666',
      city: 'Colombo',
      province: 'Western',
      segment: 'Regular',
      totalOrders: 4,
    },
    {
      email: 'lasantha@example.com',
      name: 'Lasantha Perera',
      phone: '+94 76 666 7777',
      city: 'Batticaloa',
      province: 'Eastern',
      segment: 'Unassigned',
      totalOrders: 0,
    },
    {
      email: 'madhuka@example.com',
      name: 'Madhuka Liyanage',
      phone: '+94 70 777 8888',
      city: 'Kurunegala',
      province: 'North Western',
      segment: 'Unassigned',
      totalOrders: 0,
    },
    {
      email: 'nadeeka@example.com',
      name: 'Nadeeka Rathnayake',
      phone: '+94 75 888 9999',
      city: 'Colombo',
      province: 'Western',
      segment: 'New',
      totalOrders: 1,
    },
  ];

  const customers = await Promise.all(
    customerSeeds.map((s) =>
      prisma.customer.upsert({
        where: { email: s.email },
        update: {},
        create: {
          email: s.email,
          name: s.name,
          phone: s.phone,
          passwordHash: customerPassword,
          isGuest: false,
          totalOrders: s.totalOrders,
          totalSpent: s.totalOrders * (Math.floor(Math.random() * 2000) + 1000),
          segment: s.segment,
          loyaltyPoints: s.totalOrders * (Math.floor(Math.random() * 200) + 100),
        },
      }),
    ),
  );
  console.log(`  ✓ ${customers.length} customers created`);

  // ─── Sample Orders ───
  const cityProvinceMap: Record<string, string> = {
    Colombo: 'Western',
    Kandy: 'Central',
    Galle: 'Southern',
    Jaffna: 'Northern',
    Negombo: 'Western',
    Batticaloa: 'Eastern',
    Kurunegala: 'North Western',
    Anuradhapura: 'North Central',
  };
  const cities = Object.keys(cityProvinceMap);

  const orderUserAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
    'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/118.0.5993.80 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/118.0.5993.88 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
    'Mozilla/5.0 (Linux; Android 13; SM-T870) AppleWebKit/537.36 Chrome/118.0.5993.80 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Firefox/118.0',
    'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/117.0.5938.140 Mobile Safari/537.36',
  ];

  const orderData: {
    customerId: string;
    customerName: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    city: string;
    province: string;
    userAgent: string;
    paidAt: Date;
    productIds: string[];
  }[] = [];

  const now = new Date();
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - dayOffset);
    dayStart.setHours(0, 0, 0, 0);

    // 1-4 orders per day
    const ordersToday = Math.floor(Math.random() * 4) + 1;
    for (let o = 0; o < ordersToday; o++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const province = cityProvinceMap[city];
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const dt = new Date(dayStart);
      dt.setHours(hour, minute);

      const numItems = Math.floor(Math.random() * 3) + 1;
      const selectedIds: string[] = [];
      let subtotal = 0;
      for (let i = 0; i < numItems; i++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        selectedIds.push(prod.id);
        const qty = Math.floor(Math.random() * 3) + 1;
        subtotal += Number(prod.price) * qty;
      }

      const shippingCost = subtotal >= 5000 ? 0 : 350;
      const total = subtotal + shippingCost;

      orderData.push({
        customerId: customer.id,
        customerName: customer.name || 'Customer',
        subtotal,
        shippingCost,
        total,
        city,
        province,
        userAgent: orderUserAgents[Math.floor(Math.random() * orderUserAgents.length)],
        paidAt: dt,
        productIds: selectedIds,
      });
    }
  }

  // Bulk create orders with items
  for (const od of orderData) {
    await prisma.order.create({
      data: {
        orderNumber: `HZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        customerId: od.customerId,
        status: Math.random() > 0.15 ? 'COMPLETED' : 'CANCELLED',
        subtotal: od.subtotal,
        shippingCost: od.shippingCost,
        tax: 0,
        total: od.total,
        shippingName: od.customerName,
        shippingPhone:
          '+94 7' +
          Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(7, '0'),
        shippingAddress: `${Math.floor(Math.random() * 500) + 1} ${['Main St', 'Park Rd', 'Lake Rd', 'Temple Rd', 'Beach Rd'][Math.floor(Math.random() * 5)]}`,
        shippingCity: od.city,
        shippingProvince: od.province,
        userAgent: od.userAgent,
        paidAt: od.paidAt,
        items: {
          create: od.productIds.map((pid) => {
            const prod = products.find((p) => p.id === pid)!;
            const qty = Math.floor(Math.random() * 3) + 1;
            return {
              productId: pid,
              quantity: qty,
              unitPrice: Number(prod.price),
              subtotal: Number(prod.price) * qty,
            };
          }),
        },
      },
    });
  }
  console.log(`  ✓ ${orderData.length} sample orders created`);

  // ─── Sample PageView Data ───
  const paths = [
    '/',
    '/products',
    '/products/snake-bite-hot-sauce',
    '/products/scorpion-sting-hot-sauce',
    '/cart',
    '/about',
    '/orders',
    '/login',
  ];
  const referrers = [
    '',
    'https://google.com',
    'https://facebook.com',
    'https://instagram.com',
    'https://twitter.com',
  ];
  const userAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
    'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/118.0.5993.80 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/118.0.5993.88 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
    'Mozilla/5.0 (Linux; Android 13; SM-T870) AppleWebKit/537.36 Chrome/118.0.5993.80 Safari/537.36',
  ];

  const pageViewData: {
    path: string;
    referrer: string | null;
    userAgent: string;
    createdAt: Date;
  }[] = [];

  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - dayOffset);
    dayStart.setHours(0, 0, 0, 0);

    // Morning visits (6am-11am) — medium traffic
    const morningCount = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < morningCount; i++) {
      const hour = Math.floor(Math.random() * 6) + 6;
      const minute = Math.floor(Math.random() * 60);
      const dt = new Date(dayStart);
      dt.setHours(hour, minute);
      pageViewData.push({
        path: paths[Math.floor(Math.random() * paths.length)],
        referrer:
          Math.random() > 0.7 ? referrers[Math.floor(Math.random() * referrers.length)] : null,
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        createdAt: dt,
      });
    }

    // Afternoon visits (12pm-5pm) — highest traffic
    const afternoonCount = Math.floor(Math.random() * 12) + 5;
    for (let i = 0; i < afternoonCount; i++) {
      const hour = Math.floor(Math.random() * 6) + 12;
      const minute = Math.floor(Math.random() * 60);
      const dt = new Date(dayStart);
      dt.setHours(hour, minute);
      pageViewData.push({
        path: paths[Math.floor(Math.random() * paths.length)],
        referrer:
          Math.random() > 0.7 ? referrers[Math.floor(Math.random() * referrers.length)] : null,
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        createdAt: dt,
      });
    }

    // Evening visits (6pm-11pm) — medium traffic
    const eveningCount = Math.floor(Math.random() * 6) + 2;
    for (let i = 0; i < eveningCount; i++) {
      const hour = Math.floor(Math.random() * 6) + 18;
      const minute = Math.floor(Math.random() * 60);
      const dt = new Date(dayStart);
      dt.setHours(hour, minute);
      pageViewData.push({
        path: paths[Math.floor(Math.random() * paths.length)],
        referrer:
          Math.random() > 0.7 ? referrers[Math.floor(Math.random() * referrers.length)] : null,
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        createdAt: dt,
      });
    }
  }

  await prisma.pageView.createMany({ data: pageViewData });
  console.log(`  ✓ ${pageViewData.length} sample page views created`);

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
