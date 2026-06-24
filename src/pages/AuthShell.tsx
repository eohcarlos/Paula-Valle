import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2">

        {/* Lado esquerdo — imagem da modelo */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
          {/* Imagem de fundo */}
          <img
            src="/auth-model.jpg"
            alt="Paula Valle Studio"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Overlay gradiente para legibilidade do texto */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stone-900/80 via-stone-900/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />

          {/* Conteúdo sobre a imagem */}
          <div className="relative">
            <Link to="/">
              <Logo className="[&_p]:text-white [&_span]:text-white" />
            </Link>
          </div>

          <div className="relative">
            <h2 className="font-serif text-4xl font-semibold leading-tight text-white drop-shadow-lg">
              Beleza, cuidado e elegância em cada detalhe.
            </h2>
            <p className="mt-4 text-white/90 drop-shadow">
              Agende seus serviços, acompanhe seu histórico e aproveite recompensas exclusivas.
            </p>
          </div>

          <p className="relative text-sm text-white/70">Salão Paula Valle • @paulavalle_e</p>
        </div>

        {/* Formulário */}
        <div className="p-8 sm:p-12">
          {/* Botão voltar */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-400 transition hover:text-stone-700"
          >
            <ChevronLeft size={16} /> Voltar
          </Link>

          <div className="mb-6 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-3xl font-semibold text-stone-800">{title}</h1>
          <p className="mt-2 text-stone-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-stone-500">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
