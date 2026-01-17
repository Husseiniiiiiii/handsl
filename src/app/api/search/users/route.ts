import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query.trim()
            }
          },
          {
            handle: {
              contains: query.trim()
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        handle: true,
        image: true,
        verified: true,
        _count: {
          select: {
            followers: true,
            articles: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      take: 20
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Search users error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء البحث' },
      { status: 500 }
    )
  }
}
