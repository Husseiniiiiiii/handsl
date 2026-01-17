import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'لا يمكنك متابعة نفسك' },
        { status: 400 }
      )
    }

    const userToFollow = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!userToFollow) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: params.id,
        },
      },
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      })
      return NextResponse.json({ following: false, message: 'تم إلغاء المتابعة' })
    }

    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: params.id,
      },
    })

    return NextResponse.json({ following: true, message: 'تمت المتابعة بنجاح' })
  } catch (error) {
    console.error('Toggle follow error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    )
  }
}
