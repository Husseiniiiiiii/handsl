import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user?.email !== 'alshmryh972@gmail.com') {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 403 }
      )
    }

    const [totalUsers, totalArticles, totalLikes, totalComments] = await Promise.all([
      prisma.user.count(),
      prisma.article.count({ where: { published: true } }),
      prisma.like.count(),
      prisma.comment.count(),
    ])

    return NextResponse.json({
      totalUsers,
      totalArticles,
      totalLikes,
      totalComments,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
