import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CheckCircle, Calendar, Shield, User, Clock, Info } from 'lucide-react'
import { BackButton } from '@/components/BackButton'

interface VerificationPageProps {
  params: { id: string }
}

export default async function VerificationPage({ params }: VerificationPageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      verified: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">تفاصيل التوثيق</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'مستخدم'}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${user.verified ? 'text-green-500' : 'text-gray-400'}`} />
                <div>
                  <p className="font-medium">حالة التوثيق</p>
                  <p className={`text-sm ${user.verified ? 'text-green-600' : 'text-gray-600'}`}>
                    {user.verified ? 'موثق ✓' : 'غير موثق'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${user.role === 'ADMIN' ? 'text-red-500' : 'text-gray-400'}`} />
                <div>
                  <p className="font-medium">الدور</p>
                  <p className={`text-sm ${user.role === 'ADMIN' ? 'text-red-600' : 'text-gray-600'}`}>
                    {user.role === 'ADMIN' ? 'مشرف' : 'مستخدم عادي'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900">الجدول الزمني</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">تاريخ إنشاء الحساب</p>
                  <p className="text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {user.verified && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">تاريخ التوثيق</p>
                    <p className="text-sm text-gray-600">
                      {new Date(user.updatedAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">آخر تحديث</p>
                  <p className="text-sm text-gray-600">
                    {new Date(user.updatedAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Status Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">معلومات التوثيق</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID المستخدم:</span>
                  <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">البريد الإلكتروني:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مستوى الثقة:</span>
                  <span className={`font-medium ${user.verified ? 'text-green-600' : 'text-gray-600'}`}>
                    {user.verified ? 'عالي' : 'قياسي'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 pt-6 border-t">
          <BackButton />
        </div>
      </div>
    </div>
  )
}
