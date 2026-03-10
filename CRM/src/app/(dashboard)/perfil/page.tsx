'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api/client'
import { useRef } from 'react'
import {
  User,
  Lock,
  Phone,
  Mail,
  Shield,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Key,
  Camera,
} from 'lucide-react'
import { getRolLabel } from '@/lib/utils/format'

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  children,
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  iconColor: string
  children: React.ReactNode
}) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
    >
      <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-800">{title}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  icon: Icon,
  rightElement,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  rightElement?: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="h-4 w-4 text-zinc-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full py-2.5 text-sm text-zinc-800 bg-zinc-50 rounded-xl outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            paddingLeft: Icon ? '2.5rem' : '0.875rem',
            paddingRight: rightElement ? '3rem' : '0.875rem',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
          onFocus={(e) => {
            if (!disabled) {
              ;(e.currentTarget as HTMLElement).style.borderColor = '#2A79C2'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px rgba(42,121,194,0.1)'
              ;(e.currentTarget as HTMLElement).style.background = 'white'
            }
          }}
          onBlur={(e) => {
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.08)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = ''
            ;(e.currentTarget as HTMLElement).style.background = '#f9fafb'
          }}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  )
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
      style={
        type === 'success'
          ? { background: 'rgba(139,196,64,0.12)', color: '#4a7c1f', border: '1px solid rgba(139,196,64,0.3)' }
          : { background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }
      }
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
      )}
      {message}
    </div>
  )
}

export default function PerfilPage() {
  const { profile, loading: authLoading } = useAuth()

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [savingAvatar, setSavingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Personal info
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [savingInfo, setSavingInfo] = useState(false)
  const [infoMsg, setInfoMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Password
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [savingPass, setSavingPass] = useState(false)
  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre)
      setApellido(profile.apellido)
      setTelefono(profile.telefono ?? '')
    }
  }, [profile])

  if (authLoading || !profile) return <PageSpinner />

  const handleSaveInfo = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      setInfoMsg({ text: 'Nombre y apellido son obligatorios', type: 'error' })
      return
    }
    setSavingInfo(true)
    setInfoMsg(null)
    try {
      await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ nombre: nombre.trim(), apellido: apellido.trim(), telefono: telefono.trim() }),
      })
      setInfoMsg({ text: 'Datos actualizados correctamente', type: 'success' })
      setTimeout(() => setInfoMsg(null), 4000)
    } catch {
      setInfoMsg({ text: 'Error al guardar los cambios', type: 'error' })
    } finally {
      setSavingInfo(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      setPassMsg({ text: 'Completá todos los campos', type: 'error' })
      return
    }
    if (newPass.length < 8) {
      setPassMsg({ text: 'La contraseña nueva debe tener al menos 8 caracteres', type: 'error' })
      return
    }
    if (newPass !== confirmPass) {
      setPassMsg({ text: 'Las contraseñas nuevas no coinciden', type: 'error' })
      return
    }
    setSavingPass(true)
    setPassMsg(null)
    try {
      await apiFetch('/users/me/change-password', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPass, new_password: newPass }),
      })
      setPassMsg({ text: 'Contraseña actualizada correctamente', type: 'success' })
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
      setTimeout(() => setPassMsg(null), 4000)
    } catch (err: any) {
      const msg = err?.message ?? 'Error al cambiar la contraseña'
      setPassMsg({ text: msg, type: 'error' })
    } finally {
      setSavingPass(false)
    }
  }

  const currentAvatar = avatarPreview || (profile as any).avatar_url || ''
  const initials = `${profile.nombre[0]}${profile.apellido[0]}`.toUpperCase()

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      setInfoMsg({ text: 'La imagen no puede superar 3MB', type: 'error' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSaveAvatar = async () => {
    if (!avatarPreview) return
    setSavingAvatar(true)
    try {
      await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ avatar_url: avatarPreview }),
      })
      setInfoMsg({ text: 'Foto actualizada correctamente', type: 'success' })
      setTimeout(() => setInfoMsg(null), 4000)
    } catch {
      setInfoMsg({ text: 'Error al guardar la foto', type: 'error' })
    } finally {
      setSavingAvatar(false)
    }
  }

  return (
    <DashboardLayout profile={profile} title="Mi Perfil">
      <div className="max-w-3xl space-y-6">

        {/* Avatar + resumen */}
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #131314 0%, #1e2a3a 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-5">
            {/* Avatar editable */}
            <div className="relative flex-shrink-0 group">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover"
                  style={{ border: '2px solid rgba(42,121,194,0.3)' }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #2A79C2, #8BC440)' }}
                >
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.5)' }}
                title="Cambiar foto"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFile}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">
                {profile.nombre} {profile.apellido}
              </h2>
              <p className="text-zinc-400 text-sm mt-0.5">{getRolLabel(profile.rol)}</p>
              {profile.zona && (
                <p className="text-zinc-500 text-xs mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {profile.zona.nombre}, {profile.zona.provincia}
                </p>
              )}
              {avatarPreview && (
                <button
                  onClick={handleSaveAvatar}
                  disabled={savingAvatar}
                  className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-60"
                  style={{ background: '#8BC440', boxShadow: '0 2px 8px rgba(139,196,64,0.4)' }}
                >
                  {savingAvatar ? (
                    <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  Guardar foto nueva
                </button>
              )}
            </div>
          </div>
          <div
            className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10"
            style={{ background: '#2A79C2' }}
          />
        </div>

        {/* Información de cuenta (read-only) */}
        <SectionCard
          title="Información de cuenta"
          subtitle="Datos del sistema — solo lectura"
          icon={Shield}
          iconColor="#64748b"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Email" value={(profile as any).email ?? ''} disabled icon={Mail} />
            <InputField label="Rol" value={getRolLabel(profile.rol)} disabled icon={Shield} />
            {profile.matricula && (
              <InputField label="Matrícula" value={profile.matricula} disabled icon={Key} />
            )}
            {profile.zona && (
              <InputField label="Zona asignada" value={`${profile.zona.nombre} — ${profile.zona.provincia}`} disabled icon={MapPin} />
            )}
          </div>
        </SectionCard>

        {/* Datos personales editables */}
        <SectionCard
          title="Datos personales"
          subtitle="Podés editar tu nombre y teléfono"
          icon={User}
          iconColor="#2A79C2"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Nombre"
                value={nombre}
                onChange={setNombre}
                placeholder="Tu nombre"
                icon={User}
              />
              <InputField
                label="Apellido"
                value={apellido}
                onChange={setApellido}
                placeholder="Tu apellido"
                icon={User}
              />
            </div>
            <InputField
              label="Teléfono"
              value={telefono}
              onChange={setTelefono}
              placeholder="+54 11 1234-5678"
              icon={Phone}
            />

            {infoMsg && <Toast message={infoMsg.text} type={infoMsg.type} />}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveInfo}
                disabled={savingInfo}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
                style={{
                  background: savingInfo ? '#1a5fa0' : '#2A79C2',
                  boxShadow: '0 4px 12px rgba(42,121,194,0.3)',
                }}
              >
                {savingInfo ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Guardar cambios
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Cambiar contraseña */}
        <SectionCard
          title="Cambiar contraseña"
          subtitle="Usá una contraseña segura de al menos 8 caracteres"
          icon={Lock}
          iconColor="#8BC440"
        >
          <div className="space-y-4">
            <InputField
              label="Contraseña actual"
              value={currentPass}
              onChange={setCurrentPass}
              type={showCurrent ? 'text' : 'password'}
              placeholder="Tu contraseña actual"
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Nueva contraseña"
                value={newPass}
                onChange={setNewPass}
                type={showNew ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                icon={Key}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <InputField
                label="Confirmar nueva contraseña"
                value={confirmPass}
                onChange={setConfirmPass}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repetí la contraseña"
                icon={Key}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            {/* Indicador de fortaleza */}
            {newPass.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          newPass.length >= i * 2
                            ? i <= 1
                              ? '#ef4444'
                              : i <= 2
                              ? '#f59e0b'
                              : i <= 3
                              ? '#8BC440'
                              : '#2A79C2'
                            : 'rgba(0,0,0,0.08)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400">
                  {newPass.length < 4
                    ? 'Muy corta'
                    : newPass.length < 6
                    ? 'Débil'
                    : newPass.length < 8
                    ? 'Regular'
                    : 'Segura'}
                </p>
              </div>
            )}

            {passMsg && <Toast message={passMsg.text} type={passMsg.type} />}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleChangePassword}
                disabled={savingPass}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
                style={{
                  background: savingPass ? '#6fa832' : '#8BC440',
                  boxShadow: '0 4px 12px rgba(139,196,64,0.3)',
                }}
              >
                {savingPass ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Cambiar contraseña
              </button>
            </div>
          </div>
        </SectionCard>

      </div>
    </DashboardLayout>
  )
}
