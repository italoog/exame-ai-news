'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Save, User as UserIcon } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { api } from '@/shared/lib/api'
import { toast } from '@/shared/ui/toast'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Administrador',
  EDITOR: 'Editor',
  REDATOR: 'Redator',
  USER: 'Leitor',
}

const profileSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  bio: z.string().max(300, 'Bio muito longa').optional(),
  avatar: z.string().url('URL inválida').optional().or(z.literal('')),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfileClient() {
  const { user, setUser, accessToken } = useAuthStore()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', bio: '', avatar: '' },
  })

  // Carrega o perfil completo (incluindo bio) do servidor
  useEffect(() => {
    if (!user) return
    api.get('/users/me').then((res) => {
      const profile = res.data?.data ?? res.data
      reset({
        name: profile.name ?? '',
        bio: profile.bio ?? '',
        avatar: profile.avatar ?? '',
      })
    }).catch(() => {
      reset({ name: user.name ?? '', bio: user.bio ?? '', avatar: user.avatar ?? '' })
    })
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const avatarValue = watch('avatar')

  async function onSubmit(data: ProfileForm) {
    try {
      const res = await api.patch('/users/me', data)
      const updated = res.data?.data ?? res.data
      setUser({ ...user!, ...updated }, accessToken ?? '')
      toast('Perfil atualizado com sucesso!', 'success')
    } catch {
      toast('Erro ao salvar. Tente novamente.', 'error')
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500">
          <a href="/auth/login" className="text-primary-600 hover:underline">Faça login</a>{' '}
          para acessar seu perfil
        </p>
      </div>
    )
  }

  const displayAvatar = avatarValue || user.avatar

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Meu Perfil</h1>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
        {/* Cabeçalho do perfil */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative shrink-0">
            {displayAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayAvatar}
                alt={user.name}
                width={72}
                height={72}
                className="rounded-full object-cover w-[72px] h-[72px]"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 p-1 bg-zinc-900 dark:bg-zinc-700 rounded-full text-white">
              <Camera className="h-3.5 w-3.5" />
            </span>
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Bio
              <span className="ml-1 text-xs text-zinc-400 font-normal">(máx. 300 caracteres)</span>
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Fale um pouco sobre você..."
              className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            {errors.bio && <p className="text-xs text-red-600 mt-1">{errors.bio.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              URL do Avatar
            </label>
            <input
              {...register('avatar')}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.avatar && <p className="text-xs text-red-600 mt-1">{errors.avatar.message}</p>}
            <p className="text-xs text-zinc-400 mt-1">A prévia do avatar acima atualiza em tempo real.</p>
          </div>

          {/* Info email (somente leitura) */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email
              <span className="ml-1 text-xs text-zinc-400 font-normal">(não editável)</span>
            </label>
            <div className="flex items-center gap-2 w-full border border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2 text-sm text-zinc-400">
              <UserIcon className="h-4 w-4 shrink-0" />
              {user.email}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E10600] text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </main>
  )
}
