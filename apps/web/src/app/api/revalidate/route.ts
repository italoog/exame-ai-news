import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { slug } = (await req.json()) as { slug?: string }

  revalidatePath('/')
  revalidatePath('/feed')
  if (slug) {
    revalidatePath(`/articles/${slug}`)
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? null })
}
