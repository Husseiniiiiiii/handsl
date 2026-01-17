'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'حدث خطأ في إعدادات المصادقة'
      case 'AccessDenied':
        return 'تم رفض الوصول'
      case 'Verification':
        return 'رابط التحقق غير صالح أو منتهي الصلاحية'
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'OAuthAccountNotLinked':
        return 'حدث خطأ في تسجيل الدخول باستخدام Google'
      case 'CredentialsSignin':
        return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      default:
        return 'حدث خطأ غير متوقع'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            خطأ في المصادقة
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getErrorMessage(error)}
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/auth/login" className="btn-primary">
              العودة لتسجيل الدخول
            </Link>
            <Link href="/" className="btn-secondary">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
