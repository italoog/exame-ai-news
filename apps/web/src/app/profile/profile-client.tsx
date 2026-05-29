'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Save } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { api } from '@/shared/lib/api'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  bio: z.string().max(300, 'Bio muito longa').optional(),
  avatar: z.string().url('URL inválida').optional().or(z.literal('')),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfileClient() {
  const { user, setUser, accessToken } = useAuthStore()
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      bio: '',
      avatar: user?.avatar ?? '',
    },
  })

  async function onSubmit(data: ProfileForm) {
    const res = await api.patch('/users/me', data)
    setUser({ ...user!, ...res.data.data }, accessToken ?? '')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500">
          <a href="/auth/login" className="text-primary-600 hover:underline">
            Faça login
          </a>{' '}
          para acessar seu perfil
        </p>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Meu Perfil</h1>

      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100">
          <div className="relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={72}
                height={72}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              className="absolute -bottom-1 -right-1 p-1 bg-zinc-900 rounded-full text-white hover:bg-zinc-700 transition-colors"
              aria-label="Alterar foto"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-zinc-900">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nome
            </label>
            <input
              {...register('name')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Bio
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Fale um pouco sobre você..."
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
            />
            {errors.bio && (
              <p className="text-xs text-red-600 mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              URL do Avatar
            </label>
            <input
              {...register('avatar')}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            {errors.avatar && (
              <p className="text-xs text-red-600 mt-1">
                {errors.avatar.message}
              </p>
            )}
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Perfil atualizado com sucesso!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </main>
  )
}
