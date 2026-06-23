import { Link } from 'react-router-dom'
import {
  Sparkles,
  Leaf,
  Wind,
  Crown,
  Heart,
  Droplets,
  Star,
  Instagram,
  MapPin,
  MessageCircle,
  ArrowRight,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { useStore } from '@/store/store'
import { whatsappLink, DEFAULT_WHATS_MESSAGE } from '@/lib/whatsapp'

const ESPECIALIDADES = [
  { icon: <Sparkles />, title: 'Cachos & Crespos', desc: 'Definição e valorização da sua textura natural, com leveza e movimento.' },
  { icon: <Wind />, title: 'Curvaturas', desc: 'Técnica certa para cada padrão de curvatura, do ondulado ao crespo.' },
  { icon: <Crown />, title: 'Tranças & Penteados', desc: 'Tranças, penteados e estilos que são pura arte e identidade.' },
  { icon: <Leaf />, title: 'Sem química', desc: 'Tratamentos naturais que respeitam e fortalecem os seus fios.' },
  { icon: <Droplets />, title: 'Hidratação & Nutrição', desc: 'Cronograma capilar para cabelos saudáveis, fortes e brilhantes.' },
  { icon: <Heart />, title: 'Transição capilar', desc: 'Acompanhamento carinhoso da transição ao seu cabelo natural.' },
]

export default function Landing() {
  const { settings, currentUser } = useStore()
  const homeLink = currentUser ? (currentUser.role === 'admin' ? '/admin' : '/app') : '/login'
  const wppHero = whatsappLink(settings.whatsapp, DEFAULT_WHATS_MESSAGE)

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-30 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Logo />
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Link to={homeLink} className="btn-ghost hidden sm:inline-flex px-4 py-2 text-sm">
              {currentUser ? 'Meu Painel' : 'Entrar'}
            </Link>
            <Link to="/cadastro">
              <Button size="sm">Agendar agora</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — full bleed */}
      <section className="relative animate-fade-in overflow-hidden" style={{ minHeight: '88vh' }}>

        {/* Modelo como fundo full */}
        <img
          src="/auth-model.jpg"
          alt="Paula Valle Studio"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '60% center' }}
        />

        {/* Overlay: esquerda opaca em stone/escuro, direita transparente para revelar modelo */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/80 to-stone-800/30" />
        {/* Overlay radial dourado */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,163,94,0.22),transparent_60%)]" />
        {/* Linha dourada decorativa vertical */}
        <div className="pointer-events-none absolute left-[42%] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent lg:block" />

        {/* Conteúdo */}
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 lg:px-16" style={{ minHeight: '88vh' }}>
          <div className="max-w-lg">
            {/* Chip */}
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 backdrop-blur-sm">
              <Sparkles size={11} /> Studio de Beleza • Itu / SP
            </span>

            {/* Título */}
            <h1 className="mt-5 font-serif text-6xl font-bold leading-none text-white sm:text-7xl lg:text-8xl">
              Paula<br />
              <span className="text-gold-400">Valle</span>
            </h1>

            {/* Subtítulo */}
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-stone-400">
              Especialista em Curvaturas
            </p>

            {/* Divisor */}
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px w-8 bg-gold-500" />
              <p className="text-sm text-stone-300">Cachos · Crespos · Tranças · Sem química</p>
            </div>

            {/* Frase */}
            <p className="mt-6 text-base leading-relaxed text-stone-300">
              Te entrego cachos{' '}
              <span className="font-semibold text-white">saudáveis, definidos e sem frizz</span>,
              <br className="hidden sm:block" /> independente da curvatura.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cadastro">
                <button className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-4 text-sm font-bold text-white shadow-gold transition hover:scale-105 active:scale-100">
                  Fazer meu agendamento
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <a href={wppHero} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                  <MessageCircle size={16} /> WhatsApp
                </button>
              </a>
            </div>

            {/* Stars */}
            <div className="mt-8 flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-xs text-stone-400">Excelência em cada curvatura</span>
            </div>
          </div>
        </div>

        {/* Gradiente inferior para transição suave */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF6F0] to-transparent" />
      </section>

      {/* Diferenciais */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: <Wind />, title: 'Especialista em curvaturas', desc: 'Conhecimento técnico para cada tipo de cacho, crespo e transição.' },
            { icon: <Leaf />, title: 'Tratamentos sem química', desc: 'Cuidado natural que respeita e fortalece os seus fios.' },
            { icon: <Sparkles />, title: 'Cachos sem frizz', desc: 'Definição e saúde, independente da sua curvatura.' },
          ].map((f) => (
            <div key={f.title} className="card p-7 text-center transition hover:-translate-y-1 hover:shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-200 to-gold-300 text-gold-700">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Especialidades */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-4xl font-semibold">O que fazemos</h2>
          <p className="mt-2 text-stone-500">Cuidado completo para cachos, crespos e tranças.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ESPECIALIDADES.map((s) => (
            <div key={s.title} className="card flex items-start gap-4 p-5 transition hover:shadow-soft">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300/40 to-blush-200/50 text-gold-700">
                {s.icon}
              </div>
              <div>
                <p className="font-semibold text-stone-800">{s.title}</p>
                <p className="mt-0.5 text-sm text-stone-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre / Beleza Negra */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid items-center gap-8 rounded-3xl border border-cream-200 bg-white/60 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Nossa essência</span>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-snug">
              Um studio que celebra a <span className="gold-text">beleza negra</span>
            </h2>
            <p className="mt-4 text-stone-500">
              {settings.description ||
                'Acreditamos que cada curvatura conta uma história. Aqui você encontra técnica, acolhimento e produtos que valorizam o seu cabelo do jeitinho que ele é — sem química, com muito carinho e respeito à sua identidade.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-cream-100 px-4 py-1.5 text-stone-600">Cachos saudáveis</span>
              <span className="rounded-full bg-cream-100 px-4 py-1.5 text-stone-600">Sem frizz</span>
              <span className="rounded-full bg-cream-100 px-4 py-1.5 text-stone-600">100% sem química</span>
              <span className="rounded-full bg-cream-100 px-4 py-1.5 text-stone-600">Autoestima</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-beige-500 p-8 text-white shadow-gold">
            <div className="flex items-center gap-3">
              <MapPin size={20} />
              <div>
                <p className="text-sm text-white/80">Onde estamos</p>
                <p className="font-semibold text-white">{settings.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Instagram size={20} />
              <div>
                <p className="text-sm text-white/80">Instagram</p>
                <p className="font-semibold text-white">{settings.instagram}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle size={20} />
              <div>
                <p className="text-sm text-white/80">WhatsApp</p>
                <p className="font-semibold text-white">{settings.whatsapp}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-beige-500 p-10 text-center text-white shadow-gold sm:p-14">
          <h2 className="font-serif text-4xl font-semibold text-white">Pronta para amar os seus cachos?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">
            Crie sua conta gratuitamente e agende o seu horário no studio.
          </p>
          <Link to="/cadastro" className="mt-7 inline-block">
            <button className="rounded-2xl bg-white px-8 py-3.5 font-semibold text-gold-700 shadow-lg transition hover:scale-105">
              Começar agora
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream-200 bg-white/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <Logo />
          <div className="flex flex-col items-center gap-1 text-sm text-stone-500 sm:items-end">
            <a
              href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-gold-600"
            >
              <Instagram size={16} /> {settings.instagram}
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} /> {settings.address}
            </span>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  )
}
