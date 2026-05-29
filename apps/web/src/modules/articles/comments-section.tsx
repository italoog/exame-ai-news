'use client'
import { useState } from 'react'
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  useComments,
  useCreateComment,
  useToggleCommentLike,
  type Comment,
} from '@/shared/hooks/use-comments'
import { useAuthStore } from '@/shared/stores/auth.store'

interface CommentItemProps {
  comment: Comment
  articleId: string
  depth?: number
}

function CommentItem({ comment, articleId, depth = 0 }: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [repliesVisible, setRepliesVisible] = useState(false)
  const [replyText, setReplyText] = useState('')
  const { user } = useAuthStore()
  const createComment = useCreateComment()
  const toggleLike = useToggleCommentLike()

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    await createComment.mutateAsync({
      articleId,
      content: replyText,
      parentId: comment.id,
    })
    setReplyText('')
    setReplyOpen(false)
  }

  const replyCount = comment._count?.replies ?? comment.replies?.length ?? 0

  return (
    <div className={`flex gap-3 ${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="flex-shrink-0">
        {comment.author.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
            {comment.author.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="bg-zinc-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-zinc-900">
              {comment.author.name}
            </span>
            <span className="text-xs text-zinc-400">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
          <p className="text-sm text-zinc-700">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
          <button
            onClick={() => user && toggleLike.mutate(comment.id)}
            className="flex items-center gap-1 hover:text-primary-600 transition-colors"
          >
            <Heart className="h-3.5 w-3.5" />
            {comment._count?.likes ?? 0}
          </button>
          {depth === 0 && user && (
            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="flex items-center gap-1 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Responder
            </button>
          )}
          {depth === 0 && replyCount > 0 && (
            <button
              onClick={() => setRepliesVisible(!repliesVisible)}
              className="flex items-center gap-1 hover:text-primary-600 transition-colors"
            >
              {repliesVisible ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              {replyCount} respostas
            </button>
          )}
        </div>
        {replyOpen && (
          <form onSubmit={handleReply} className="mt-3 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="flex-1 text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <button
              type="submit"
              disabled={createComment.isPending}
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              Responder
            </button>
          </form>
        )}
        {repliesVisible &&
          comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              depth={1}
            />
          ))}
      </div>
    </div>
  )
}

interface Props {
  articleId: string
}

export function CommentsSection({ articleId }: Props) {
  const { data, isLoading } = useComments(articleId)
  const { user } = useAuthStore()
  const createComment = useCreateComment()
  const [text, setText] = useState('')

  const comments = data?.data ?? []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    await createComment.mutateAsync({ articleId, content: text })
    setText('')
  }

  return (
    <section className="mt-10 pt-8 border-t border-zinc-200">
      <h2 className="text-xl font-bold text-zinc-900 mb-6">
        Comentários ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Deixe um comentário..."
              rows={3}
              className="w-full border border-zinc-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={createComment.isPending || !text.trim()}
                className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                Comentar
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-zinc-50 rounded-lg text-sm text-zinc-600 text-center">
          <a
            href="/auth/login"
            className="text-primary-600 hover:underline font-medium"
          >
            Faça login
          </a>{' '}
          para deixar um comentário
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-200 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-200 animate-pulse rounded w-1/4" />
                <div className="h-12 bg-zinc-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-zinc-400 text-center py-8">
          Seja o primeiro a comentar!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
            />
          ))}
        </div>
      )}
    </section>
  )
}
