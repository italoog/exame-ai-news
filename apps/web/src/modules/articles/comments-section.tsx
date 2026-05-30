'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Heart, Trash2, Reply, Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '@/shared/stores/auth.store';
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  type Comment,
} from '@/shared/hooks/use-comments';

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  currentUserId?: string;
  isAdmin?: boolean;
  depth?: number;
}

function CommentItem({ comment, articleId, currentUserId, isAdmin, depth = 0 }: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const createComment = useCreateComment(articleId);
  const deleteComment = useDeleteComment(articleId);
  const likeComment = useLikeComment(articleId);

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  async function handleReply() {
    if (!replyText.trim()) return;
    await createComment.mutateAsync({ content: replyText.trim(), parentId: comment.id });
    setReplyText('');
    setReplyOpen(false);
  }

  const canDelete = currentUserId === comment.user.id || isAdmin;

  return (
    <div className={depth > 0 ? 'ml-8 mt-3' : ''}>
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          {comment.user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
              {comment.user.name[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/60">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {comment.user.name}
              </span>
              <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">{timeAgo}</span>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {comment.content}
            </p>
          </div>

          <div className="mt-1.5 flex items-center gap-3 px-1">
            <button
              onClick={() => likeComment.mutate(comment.id)}
              disabled={likeComment.isPending}
              className="flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400"
            >
              <Heart className="h-3.5 w-3.5" />
              {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
            </button>

            {currentUserId && depth === 0 && (
              <button
                onClick={() => setReplyOpen((v) => !v)}
                className="flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                <Reply className="h-3.5 w-3.5" />
                Responder
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
                className="ml-auto flex items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
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
                className="flex-1 resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <button
                onClick={handleReply}
                disabled={createComment.isPending || !replyText.trim()}
                className="self-end rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {createComment.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
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
  );
}

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const { data: comments, isLoading } = useComments(articleId);
  const createComment = useCreateComment(articleId);

  const count = comments?.length ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await createComment.mutateAsync({ content: text.trim() });
    setText('');
  }

  return (
    <section className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-800">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
        <MessageCircle className="h-5 w-5" />
        ComentÃ¡rios
        {count > 0 && (
          <span className="text-sm font-normal text-zinc-400 dark:text-zinc-500">({count})</span>
        )}
      </h2>

      {/* Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name ?? ''} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                {user.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-1 gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva um comentÃ¡rio..."
              rows={3}
              className="flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={createComment.isPending || !text.trim()}
              className="self-end rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {createComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publicar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400">
          <button
            onClick={() => router.push('/auth/login')}
            className="font-medium text-red-600 hover:underline"
          >
            FaÃ§a login
          </button>{' '}
          para deixar um comentÃ¡rio.
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
        </div>
      ) : count === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          Nenhum comentÃ¡rio ainda. Seja o primeiro!
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
  );
}
