import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول' },
        { status: 401 }
      )
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Check if current user is following the target user
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: params.id
        }
      }
    })

    return NextResponse.json({
      isFollowing: !!follow
    })
  } catch (error) {
    console.error('Check follow status error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق من حالة المتابعة' },
      { status: 500 }
    )
  }
}
