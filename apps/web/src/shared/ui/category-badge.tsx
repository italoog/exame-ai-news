import Link from 'next/link'
import { cn } from '@/shared/lib/utils'

interface CategoryBadgeProps {
  name: string
  slug: string
  className?: string
}

export function CategoryBadge({ name, slug, className }: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        'bg-red-50 text-red-700 hover:bg-red-100 transition-colors',
        className,
      )}
    >
      {name}
    </Link>
  )
}
