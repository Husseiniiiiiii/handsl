'use client'

import { ArrowRight } from 'lucide-react'

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="btn-secondary flex items-center gap-2"
    >
      <ArrowRight className="w-4 h-4" />
      العودة للملف الشخصي
    </button>
  )
}
