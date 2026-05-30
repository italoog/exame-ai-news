'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Heart, Trash2, Reply, Send, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuthStore } from '@/shared/stores/auth.store'
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  type Comment,
} from '@/shared/hooks/use-comments'

interface CommentItemProps {
  comment: Comment
  articleId: string
  currentUserId?: string
  isAdmin?: boolean
  depth?: number
}

function CommentItem({ comment, articleId, currentUserId, isAdmin, depth = 0 }: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const createComment = useCreateComment(articleId)
  const deleteComment = useDeleteComment(articleId)
  const likeComment = useLikeComment(articleId)

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  async function handleReply() {
    if (!replyText.trim()) return
    await createComment.mutateAsync({ content: replyText.trim(), parentId: comment.id })
    setReplyText('')
    setReplyOpen(false)
  }

  const canDelete = currentUserId === comment.user.id || isAdmin

  return (
    <div className={depth > 0 ? 'ml-8 mt-3' : ''}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
          {comment.user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
              {comment.user.name[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {comment.user.name}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">{timeAgo}</span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1.5 px-1">
            <button
              onClick={() => likeComment.mutate(comment.id)}
              disabled={likeComment.isPending}
              className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
            </button>

            {currentUserId && depth === 0 && (
              <button
                onClick={() => setReplyOpen((v) => !v)}
                className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                Responder
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
                className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {replyOpen && (
            <div className="mt-2 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escreva uma resposta..."
                rows={2}
                className="flex-1 text-sm px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
              />
              <button
                onClick={handleReply}
                disabled={createComment.isPending || !replyText.trim()}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 self-end"
              >
                {createComment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          articleId={articleId}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

interface CommentsSectionProps {
  articleId: string
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [text, setText] = useState('')
  const { data: comments, isLoading } = useComments(articleId)
  const createComment = useCreateComment(articleId)

  const count = comments?.length ?? 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    await createComment.mutateAsync({ content: text.trim() })
    setText('')
  }

  return (
    <section className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
      <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        <MessageCircle className="w-5 h-5" />
        Comentários
        {count > 0 && (
          <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500">({count})</span>
        )}
      </h2>

      {/* Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name ?? ''} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                {user.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 flex gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva um comentário..."
              rows={3}
              className="flex-1 text-sm px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
            />
            <button
              type="submit"
              disabled={createComment.isPending || !text.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 self-end"
            >
              {createComment.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Publicar'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-500 dark:text-zinc-400">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-red-600 hover:underline font-medium"
          >
            Faça login
          </button>{' '}
          para deixar um comentário.
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
        </div>
      ) : count === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-6">
          Nenhum comentário ainda. Seja o primeiro!
        </p>
      ) : (
        <div className="space-y-4">
          {comments!.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              currentUserId={user?.id}
              isAdmin={user?.role === 'ADMIN'}
            />
          ))}
        </div>
      )}
    </section>
  )
}
