'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react'
import { getCoverImage } from '@/shared/lib/cover-image'
import { CategoryBadge } from './category-badge'

interface CarouselArticle {
  id: string
  title: string
  slug: string
  summary: string | null
  coverImage: string | null
  publishedAt: string | null
  readTime: number | null
  viewCount: number
  author: { name: string }
  category: { name: string; slug: string; color: string | null }
}

interface Props {
  articles: CarouselArticle[]
}

const variants = {
  enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
}

export function NewsCarousel({ articles }: Props) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const total = articles.length

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current],
  )

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  if (!total) return null

  const article = articles[current]

  return (
    <section className="relative overflow-hidden rounded-2xl shadow-exame-lg h-[480px]">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src={article.coverImage ?? getCoverImage(article.slug, article.category.slug)}
              alt={article.title}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6 md:p-10 lg:p-12">
            <div className="max-w-3xl">
              <CategoryBadge
                name={article.category.name}
                slug={article.category.slug}
                className="mb-3"
              />
              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight hover:text-red-300 transition-colors line-clamp-3 mb-3">
                  {article.title}
                </h2>
              </Link>
              {article.summary && (
                <p className="text-zinc-300 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
                  {article.summary}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="font-medium text-zinc-300">{article.author.name}</span>
                {article.readTime != null && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime} min
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.viewCount.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>



      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2" role="tablist">
        {articles.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-2 bg-red-500'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-10">
        <motion.div
          key={current}
          className="h-full bg-red-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
        />
      </div>
    </section>
  )
}
