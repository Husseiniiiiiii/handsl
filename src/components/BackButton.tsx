'use client'

import { ArrowRight } from 'lucide-react'

export function BackButton({ href = "/" }: { href?: string }) {
  return (
    <button
      onClick={() => href ? window.location.href = href : window.history.back()}
      className="btn-secondary flex items-center gap-2"
    >
      <ArrowRight className="w-4 h-4 rotate-180" />
      رجوع
    </button>
  )
}
