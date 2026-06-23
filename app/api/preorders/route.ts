import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '8', 10);
    const filter = searchParams.get('filter') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    // Build where clause based on filter
    const where: any = {};
    if (filter === 'active') {
      where.status = true;
    } else if (filter === 'inactive') {
      where.status = false;
    }

    // Build orderBy
    const orderBy: any = {};
    if (sortBy === 'name') {
      orderBy.name = order;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = order;
    } else if (sortBy === 'startsAt') {
      orderBy.startsAt = order;
    } else if (sortBy === 'endsAt') {
      orderBy.endsAt = order;
    }

    const [preorders, total] = await Promise.all([
      prisma.preorder.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.preorder.count({ where }),
    ]);

    return NextResponse.json({
      preorders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching preorders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, products, preorderWhen, startsAt, endsAt, status } = body;

    if (!name || !products || !preorderWhen || !startsAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const preorder = await prisma.preorder.create({
      data: {
        name,
        products: parseInt(products, 10),
        preorderWhen,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status: status !== undefined ? status : true,
      },
    });

    return NextResponse.json(preorder, { status: 201 });
  } catch (error) {
    console.error('Error creating preorder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
