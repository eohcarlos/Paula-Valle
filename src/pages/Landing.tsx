import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, Leaf, Wind, Crown, Heart, Droplets,
  Star, Instagram, MapPin, MessageCircle, ArrowRight,
  Phone, Clock, ChevronRight, Scissors, Award, Shield,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useStore } from '@/store/store'
import { whatsappLink, DEFAULT_WHATS_MESSAGE } from '@/lib/whatsapp'

const ESPECIALIDADES = [
  { icon: <Sparkles />, title: 'Cachos & Crespos',     desc: 'Definição e valorização da sua textura natural, com leveza e movimento.' },
  { icon: <Wind />,     title: 'Curvaturas',            desc: 'Técnica certa para cada padrão de curvatura, do ondulado ao crespo.' },
  { icon: <Crown />,    title: 'Tranças & Penteados',   desc: 'Tranças, penteados e estilos que são pura arte e identidade.' },
  { icon: <Leaf />,     title: 'Sem química',           desc: 'Tratamentos naturais que respeitam e fortalecem os seus fios.' },
  { icon: <Droplets />, title: 'Hidratação & Nutrição', desc: 'Cronograma capilar para cabelos saudáveis, fortes e brilhantes.' },
  { icon: <Heart />,    title: 'Transição capilar',     desc: 'Acompanhamento carinhoso da transição ao seu cabelo natural.' },
]

const DEPOIMENTOS = [
  { name: 'Mariana S.',   text: 'Meus cachos nunca ficaram tão definidos! Paula é incrível, cuida de cada detalhe com muito carinho.', stars: 5 },
  { name: 'Camila R.',    text: 'Finalmente encontrei uma profissional que entende de verdade o meu tipo de cabelo. Super recomendo!', stars: 5 },
  { name: 'Thaís O.',     text: 'Ambiente acolhedor, atendimento premium e resultado surpreendente. Saí do studio me sentindo linda.', stars: 5 },
]

export default function Landing() {
  const { settings, currentUser } = useStore()
  const homeLink  = currentUser ? (currentUser.role === 'admin' ? '/admin' : '/app') : '/login'
  const wppHero   = whatsappLink(settings.whatsapp, DEFAULT_WHATS_MESSAGE)
  const wppFooter = whatsappLink(settings.whatsapp, 'Olá, gostaria de mais informações sobre os serviços!')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-0">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 py-3">
            <Logo />
          </Link>

          {/* Links centrais — desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: '#servicos', label: 'Serviços' },
              { href: '#sobre',    label: 'Sobre' },
              { href: '#contato',  label: 'Contato' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-cream-100 hover:text-stone-900"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <a
              href={wppHero}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border border-beige-300 px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-gold-400 hover:text-gold-700 sm:flex"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>

            <Link
              to={homeLink}
              className="hidden items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-stone-600 transition hover:text-stone-900 sm:flex"
            >
              {currentUser ? 'Meu Painel' : 'Entrar'}
            </Link>

            <Link
              to="/cadastro"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-2.5 text-sm font-bold text-white shadow-gold transition hover:scale-105 hover:brightness-105 active:scale-100"
            >
              Agendar agora <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh' }}>
        <img
          src="/auth-model.jpg"
          alt="Paula Valle Studio"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '60% center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/96 via-stone-900/80 to-stone-800/25" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_55%,rgba(201,163,94,0.20),transparent_58%)]" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-28 sm:px-10 lg:px-16" style={{ minHeight: '90vh' }}>
          <div className="max-w-xl">

            <span className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400" style={{ animationDelay: '0s' }}>
              <Sparkles size={11} /> Studio de Beleza • Itu / SP
            </span>

            <h1 className="animate-slide-up mt-6 font-serif text-6xl font-bold leading-none text-white sm:text-7xl lg:text-[5.5rem]" style={{ animationDelay: '0.12s' }}>
              Paula<br /><span className="text-gold-400">Valle</span>
            </h1>

            <p className="animate-slide-up mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-stone-400" style={{ animationDelay: '0.22s' }}>
              Especialista em Curvaturas
            </p>

            <div className="animate-slide-up mt-6 flex items-center gap-4" style={{ animationDelay: '0.32s' }}>
              <div className="h-px w-8 bg-gold-500" />
              <p className="text-sm text-stone-300">Cachos · Crespos · Tranças · Sem química</p>
            </div>

            <p className="animate-slide-up mt-6 text-base leading-relaxed text-stone-300" style={{ animationDelay: '0.42s' }}>
              Te entrego cachos <span className="font-semibold text-white">saudáveis, definidos e sem frizz</span>,
              independente da curvatura.
            </p>

            <div className="animate-slide-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: '0.54s' }}>
              <Link to="/cadastro">
                <button className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-4 text-sm font-bold text-white shadow-gold transition hover:scale-105 active:scale-100">
                  Fazer meu agendamento <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <a href={wppHero} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                  <MessageCircle size={16} /> WhatsApp
                </button>
              </a>
            </div>

            <div className="animate-slide-up mt-8 flex items-center gap-2" style={{ animationDelay: '0.66s' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-gold-400 text-gold-400" />)}
              <span className="ml-1 text-xs text-stone-400">Excelência em cada curvatura</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── Números ── */}
      <section className="border-b border-cream-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '500+', label: 'Clientes atendidas' },
              { value: '8+',   label: 'Anos de experiência' },
              { value: '100%', label: 'Sem química' },
              { value: '5★',   label: 'Avaliação média' },
            ].map((s, i) => (
              <div key={s.label} className={`reveal reveal-delay-${i + 1} text-center`}>
                <p className="font-serif text-4xl font-bold text-gold-600">{s.value}</p>
                <p className="mt-1 text-sm text-stone-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que escolher ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="reveal mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Por que nos escolher</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-stone-800">O cuidado que seus cachos merecem</h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-500">Técnica, acolhimento e produtos que respeitam e valorizam a sua beleza natural.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: <Award size={22} />,    title: 'Especialista certificada',  desc: 'Formação especializada em todas as curvaturas, do ondulado ao crespo.' },
            { icon: <Shield size={22} />,   title: '100% sem química',          desc: 'Protocolos naturais que fortalecem e respeitam a estrutura dos seus fios.' },
            { icon: <Scissors size={22} />, title: 'Atendimento personalizado', desc: 'Cada cliente recebe um diagnóstico e tratamento único para seus cachos.' },
          ].map((f, i) => (
            <div key={f.title} className={`reveal reveal-delay-${i + 1} group rounded-3xl border border-cream-200 bg-white p-8 shadow-card transition hover:-translate-y-1 hover:border-gold-300/60 hover:shadow-soft`}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300/30 to-blush-200/40 text-gold-600 transition group-hover:from-gold-300/50">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-stone-800">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Serviços ── */}
      <section id="servicos" className="bg-cream-50/70 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="reveal mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Nossos serviços</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-stone-800">O que fazemos</h2>
            <p className="mt-3 text-stone-500">Cuidado completo para cachos, crespos e tranças.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ESPECIALIDADES.map((s, i) => (
              <div key={s.title} className={`reveal reveal-delay-${(i % 3) + 1} group flex items-start gap-4 rounded-3xl border border-cream-200 bg-white p-6 transition hover:border-gold-300/50 hover:shadow-soft`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300/40 to-blush-200/50 text-gold-700 transition group-hover:scale-110">
                  {s.icon}
                </div>
                <div>
                  <p className="font-semibold text-stone-800">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal mt-10 text-center">
            <Link to="/cadastro">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-gold-400 px-7 py-3.5 text-sm font-semibold text-gold-700 transition hover:bg-gold-400 hover:text-white">
                Ver todos os serviços e agendar <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="reveal mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Depoimentos</span>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-stone-800">O que dizem nossas clientes</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {DEPOIMENTOS.map((d, i) => (
            <div key={d.name} className={`reveal reveal-delay-${i + 1} flex flex-col gap-4 rounded-3xl border border-cream-200 bg-white p-7 shadow-card`}>
              <div className="flex gap-1">
                {[...Array(d.stars)].map((_, j) => <Star key={j} size={14} className="fill-gold-400 text-gold-400" />)}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-stone-600">"{d.text}"</p>
              <div className="flex items-center gap-3 border-t border-cream-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-blush-300 text-xs font-bold text-white">
                  {d.name[0]}
                </div>
                <p className="text-sm font-semibold text-stone-700">{d.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sobre ── */}
      <section id="sobre" className="bg-cream-50/70 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600">Nossa essência</span>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-snug text-stone-800">
                Um studio que celebra a{' '}
                <span className="bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">beleza negra</span>
              </h2>
              <p className="mt-5 leading-relaxed text-stone-500">
                {settings.description ||
                  'Acreditamos que cada curvatura conta uma história. Aqui você encontra técnica, acolhimento e produtos que valorizam o seu cabelo do jeitinho que ele é — sem química, com muito carinho e respeito à sua identidade.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Cachos saudáveis', 'Sem frizz', '100% sem química', 'Autoestima', 'Beleza negra'].map((tag) => (
                  <span key={tag} className="rounded-full border border-cream-300 bg-white px-4 py-1.5 text-xs font-medium text-stone-600">{tag}</span>
                ))}
              </div>
              <Link to="/cadastro" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-7 py-3.5 text-sm font-bold text-white shadow-gold transition hover:scale-105">
                Agendar meu horário <ArrowRight size={15} />
              </Link>
            </div>
            <div className="reveal reveal-delay-2 overflow-hidden rounded-3xl shadow-2xl" style={{ maxHeight: 420 }}>
              <img
                src="/auth-model.jpg"
                alt="Paula Valle Studio"
                className="h-full w-full object-cover"
                style={{ objectPosition: '40% 20%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-12 text-center shadow-2xl sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,163,94,0.30),transparent_60%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400">
              <Sparkles size={11} /> Agende agora
            </span>
            <h2 className="mt-5 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Pronta para amar<br />os seus cachos?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-stone-400">
              Crie sua conta gratuitamente e agende o seu horário no studio. Cachos saudáveis começam aqui.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/cadastro">
                <button className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-8 py-4 font-bold text-white shadow-gold transition hover:scale-105">
                  Criar minha conta grátis
                </button>
              </Link>
              <a href={wppHero} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/20">
                  <MessageCircle size={16} /> Falar no WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contato" className="border-t border-cream-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Coluna 1 — marca */}
            <div className="lg:col-span-1">
              <Logo />
              <p className="mt-4 text-sm leading-relaxed text-stone-500">
                Studio especialista em cachos, crespos e tranças. Cuidamos da sua beleza natural com técnica e carinho.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-200 text-stone-500 transition hover:border-gold-400 hover:text-gold-600"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href={wppFooter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-cream-200 text-stone-500 transition hover:border-gold-400 hover:text-gold-600"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Coluna 2 — Links */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">Links</p>
              <ul className="space-y-2.5">
                {[
                  { to: '/cadastro', label: 'Criar conta' },
                  { to: '/login',    label: 'Entrar' },
                  { to: '#servicos', label: 'Serviços', anchor: true },
                  { to: '#sobre',    label: 'Sobre nós', anchor: true },
                ].map((l) => (
                  <li key={l.label}>
                    {l.anchor
                      ? <a href={l.to} className="text-sm text-stone-500 transition hover:text-gold-600">{l.label}</a>
                      : <Link to={l.to} className="text-sm text-stone-500 transition hover:text-gold-600">{l.label}</Link>
                    }
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3 — Serviços */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">Serviços</p>
              <ul className="space-y-2.5">
                {['Cachos & Crespos', 'Tranças', 'Tratamento capilar', 'Hidratação', 'Transição capilar'].map((s) => (
                  <li key={s}>
                    <Link to="/cadastro" className="text-sm text-stone-500 transition hover:text-gold-600">{s}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 4 — Contato */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">Contato</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-stone-500">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-gold-500" />
                  {settings.address}
                </li>
                <li>
                  <a href={wppFooter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-stone-500 transition hover:text-gold-600">
                    <Phone size={15} className="shrink-0 text-gold-500" />
                    {settings.whatsapp}
                  </a>
                </li>
                <li>
                  <a href={`https://instagram.com/${settings.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-stone-500 transition hover:text-gold-600">
                    <Instagram size={15} className="shrink-0 text-gold-500" />
                    {settings.instagram}
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-stone-500">
                  <Clock size={15} className="mt-0.5 shrink-0 text-gold-500" />
                  <span>Seg–Sáb: 9h às 19h</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-cream-200">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 sm:flex-row">
            <p className="text-xs text-stone-400">
              © {new Date().getFullYear()} Paula Valle Studio. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-xs text-stone-400">
              <span className="cursor-default transition hover:text-stone-600">Privacidade</span>
              <span className="cursor-default transition hover:text-stone-600">Termos de uso</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
