import Link from 'next/link'

export default async function Home() {
  // صفحة ترحيب بسيطة بدون جلب بيانات

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-l from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
          مرحباً بك في هاسنديل
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">
          اكتشف أحدث المقالات وشارك أفكارك مع العالم
        </p>
      </div>

      <div className="text-center py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ابدأ رحلتك مع هاسنديل
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-lg font-semibold mb-2">اكتب مقالات</h3>
              <p className="text-gray-600 dark:text-gray-400">
                شارك أفكارك وآرائك مع العالم
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-lg font-semibold mb-2">تفاعل مع الآخرين</h3>
              <p className="text-gray-600 dark:text-gray-400">
                أعجب بالمقالات وعلّق عليها
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">تابع الكتّاب</h3>
              <p className="text-gray-600 dark:text-gray-400">
                تواصل مع المبدعين والمثقفين
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">اكتشف محتوى</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ابحث عن مقالات ومستخدمين
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn-primary"
            >
              إنشاء حساب
            </Link>
            <Link
              href="/auth/login"
              className="btn-secondary"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
