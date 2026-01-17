export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
    />
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="w-full sm:w-32 h-24 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-4 text-center md:text-right">
          <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
          <div className="flex justify-center md:justify-start gap-6">
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CommentSkeleton() {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}
