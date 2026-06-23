import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const preorder = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!preorder) {
      return NextResponse.json({ error: 'Preorder not found' }, { status: 404 });
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error('Error fetching preorder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, products, preorderWhen, startsAt, endsAt, status } = body;

    const preorder = await prisma.preorder.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(products !== undefined && { products: parseInt(products, 10) }),
        ...(preorderWhen && { preorderWhen }),
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt !== undefined && {
          endsAt: endsAt ? new Date(endsAt) : null,
        }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error('Error updating preorder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.preorder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting preorder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
