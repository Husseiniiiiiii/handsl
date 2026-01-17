import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        articles: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            articles: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    let isFollowing = false
    if (session?.user?.id && session.user.id !== params.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: params.id,
          },
        },
      })
      isFollowing = !!follow
    }

    return NextResponse.json({ ...user, isFollowing })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات المستخدم' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بتعديل هذا الملف الشخصي' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    const validatedData = profileSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, bio, handle, image } = validatedData.data

    // Check if handle is already taken by another user
    if (handle) {
      const existingUser = await prisma.user.findFirst({
        where: {
          handle,
          NOT: { id: params.id },
        },
      })
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'اسم المستخدم هذا مستخدم بالفعل' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { name, bio, handle: handle || null, image: image || null },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        handle: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الملف الشخصي' },
      { status: 500 }
    )
  }
}
