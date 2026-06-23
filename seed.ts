import { prisma } from './lib/db';

async function main() {
  try {
    // Create sample preorders
    await prisma.preorder.createMany({
      data: [
        {
          name: 'Multi variant 3',
          products: 1,
          preorderWhen: 'out-of-stock',
          startsAt: new Date('2025-12-15T08:24:00'),
          endsAt: null,
          status: false,
        },
        {
          name: 'Multi variant 2',
          products: 1,
          preorderWhen: 'regardless-of-stock',
          startsAt: new Date('2025-12-15T08:24:00'),
          endsAt: new Date('2025-12-15T08:27:00'),
          status: true,
        },
        {
          name: 'Multi variants 1',
          products: 1,
          preorderWhen: 'regardless-of-stock',
          startsAt: new Date('2025-12-15T08:24:00'),
          endsAt: null,
          status: true,
        },
        {
          name: 'Partial payment',
          products: 1,
          preorderWhen: 'regardless-of-stock',
          startsAt: new Date('2025-08-17T04:56:00'),
          endsAt: null,
          status: true,
        },
        {
          name: 'Shipping not sure',
          products: 1,
          preorderWhen: 'regardless-of-stock',
          startsAt: new Date('2025-08-17T04:56:00'),
          endsAt: null,
          status: true,
        },
        {
          name: 'Full payment',
          products: 1,
          preorderWhen: 'regardless-of-stock',
          startsAt: new Date('2025-08-17T04:56:00'),
          endsAt: null,
          status: true,
        },
        {
          name: 'Coming soon',
          products: 1,
          preorderWhen: 'regardless-of-stock',
          startsAt: new Date('2025-12-11T04:42:00'),
          endsAt: null,
          status: true,
        },
        {
          name: 'With ends',
          products: 1,
          preorderWhen: 'regardless-of-stock',
          startsAt: new Date('2025-08-14T03:59:00'),
          endsAt: null,
          status: true,
        },
      ],
    });

    console.log('Sample data created');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
