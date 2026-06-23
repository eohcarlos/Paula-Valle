import { Link } from 'react-router-dom'
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
        {/* Lado decorativo */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-gold-400 via-gold-500 to-beige-500 p-10 text-white lg:flex">
          <Link to="/">
            <Logo className="[&_p]:text-white [&_span]:text-white" />
          </Link>
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight text-white">
              Beleza, cuidado e elegância em cada detalhe.
            </h2>
            <p className="mt-4 text-white/90">
              Agende seus serviços, acompanhe seu histórico e aproveite recompensas exclusivas.
            </p>
          </div>
          <p className="text-sm text-white/70">Salão Paula Valle • @paulavalle_e</p>
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 right-12 h-32 w-32 rounded-full bg-white/10" />
        </div>

        {/* Formulário */}
        <div className="p-8 sm:p-12">
          <div className="mb-8 lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
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
