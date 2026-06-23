import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, Leaf, Wind, Crown, Heart, Droplets,
  Star, Instagram, MapPin, MessageCircle, ArrowRight,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useStore } from '@/store/store'
import { whatsappLink, DEFAULT_WHATS_MESSAGE } from '@/lib/whatsapp'

const ESPECIALIDADES = [
  { icon: <Sparkles />, title: 'Cachos & Crespos', desc: 'Definição e valorização da sua textura natural, com leveza e movimento.' },
  { icon: <Wind />,     title: 'Curvaturas',       desc: 'Técnica certa para cada padrão de curvatura, do ondulado ao crespo.' },
  { icon: <Crown />,    title: 'Tranças & Penteados', desc: 'Tranças, penteados e estilos que são pura arte e identidade.' },
  { icon: <Leaf />,     title: 'Sem química',      desc: 'Tratamentos naturais que respeitam e fortalecem os seus fios.' },
  { icon: <Droplets />, title: 'Hidratação & Nutrição', desc: 'Cronograma capilar para cabelos saudáveis, fortes e brilhantes.' },
  { icon: <Heart />,    title: 'Transição capilar', desc: 'Acompanhamento carinhoso da transição ao seu cabelo natural.' },
]

export default function Landing() {
  const { settings, currentUser } = useStore()
  const homeLink = currentUser ? (currentUser.role === 'admin' ? '/admin' : '/app') : '/login'
  const wppHero = whatsappLink(settings.whatsapp, DEFAULT_WHATS_MESSAGE)

  /* Scroll reveal via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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

      {/* ── Hero full-bleed ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '88vh' }}>
        {/* Modelo como fundo */}
        <img
          src="/auth-model.jpg"
          alt="Paula Valle Studio"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '60% center' }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/80 to-stone-800/30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,163,94,0.22),transparent_60%)]" />

        {/* Copy */}
        <div
          className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 lg:px-16"
          style={{ minHeight: '88vh' }}
        >
          <div className="max-w-lg">

            <span
              className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400 backdrop-blur-sm"
              style={{ animationDelay: '0s' }}
            >
              <Sparkles size={11} /> Studio de Beleza • Itu / SP
            </span>

            <h1
              className="animate-slide-up mt-5 font-serif text-6xl font-bold leading-none text-white sm:text-7xl lg:text-8xl"
              style={{ animationDelay: '0.12s' }}
            >
              Paula<br />
              <span className="text-gold-400">Valle</span>
            </h1>

            <p
              className="animate-slide-up mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-stone-400"
              style={{ animationDelay: '0.24s' }}
            >
              Especialista em Curvaturas
            </p>

            <div
              className="animate-slide-up mt-6 flex items-center gap-4"
              style={{ animationDelay: '0.34s' }}
            >
              <div className="h-px w-8 bg-gold-500" />
              <p className="text-sm text-stone-300">Cachos · Crespos · Tranças · Sem química</p>
            </div>

            <p
              className="animate-slide-up mt-6 text-base leading-relaxed text-stone-300"
              style={{ animationDelay: '0.44s' }}
            >
              Te entrego cachos{' '}
              <span className="font-semibold text-white">saudáveis, definidos e sem frizz</span>,
              <br className="hidden sm:block" /> independente da curvatura.
            </p>

            <div
              className="animate-slide-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: '0.56s' }}
            >
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

            <div
              className="animate-slide-up mt-8 flex items-center gap-2"
              style={{ animationDelay: '0.68s' }}
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-xs text-stone-400">Excelência em cada curvatura</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── Diferenciais ── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="reveal mb-8 text-center text-xs font-bold uppercase tracking-widest text-gold-600">
          Por que Paula Valle
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: <Wind />,     title: 'Especialista em curvaturas', desc: 'Conhecimento técnico para cada tipo de cacho, crespo e transição.' },
            { icon: <Leaf />,     title: 'Tratamentos sem química',    desc: 'Cuidado natural que respeita e fortalece os seus fios.' },
            { icon: <Sparkles />, title: 'Cachos sem frizz',           desc: 'Definição e saúde, independente da sua curvatura.' },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`reveal reveal-delay-${i + 1} card p-7 text-center transition hover:-translate-y-1 hover:shadow-soft`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-200 to-gold-300 text-gold-700">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Especialidades ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="reveal mb-8 text-center">
          <h2 className="font-serif text-4xl font-semibold">O que fazemos</h2>
          <p className="mt-2 text-stone-500">Cuidado completo para cachos, crespos e tranças.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ESPECIALIDADES.map((s, i) => (
            <div
              key={s.title}
              className={`reveal reveal-delay-${(i % 4) + 1} card flex items-start gap-4 p-5 transition hover:shadow-soft`}
            >
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

      {/* ── Sobre / Beleza Negra ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid items-center gap-8 rounded-3xl border border-cream-200 bg-white/60 p-8 sm:p-12 lg:grid-cols-2">
          <div className="reveal">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">Nossa essência</span>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-snug">
              Um studio que celebra a <span className="gold-text">beleza negra</span>
            </h2>
            <p className="mt-4 text-stone-500">
              {settings.description ||
                'Acreditamos que cada curvatura conta uma história. Aqui você encontra técnica, acolhimento e produtos que valorizam o seu cabelo do jeitinho que ele é — sem química, com muito carinho e respeito à sua identidade.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {['Cachos saudáveis', 'Sem frizz', '100% sem química', 'Autoestima'].map((tag) => (
                <span key={tag} className="rounded-full bg-cream-100 px-4 py-1.5 text-stone-600">{tag}</span>
              ))}
            </div>
          </div>
          <div className="reveal reveal-delay-2 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-beige-500 p-8 text-white shadow-gold">
            {[
              { icon: <MapPin size={20} />,        label: 'Onde estamos', value: settings.address },
              { icon: <Instagram size={20} />,     label: 'Instagram',    value: settings.instagram },
              { icon: <MessageCircle size={20} />, label: 'WhatsApp',     value: settings.whatsapp },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                {row.icon}
                <div>
                  <p className="text-sm text-white/80">{row.label}</p>
                  <p className="font-semibold text-white">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="reveal overflow-hidden rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-beige-500 p-10 text-center text-white shadow-gold sm:p-14">
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

      {/* ── Footer ── */}
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

    </div>
  )
}
