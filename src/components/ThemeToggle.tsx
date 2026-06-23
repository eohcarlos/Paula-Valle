import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/store/theme'

/**
 * Botão de alternância de tema (Light/Dark) no estilo Z-API.
 * Layout horizontal dividido em duas áreas: ☀️ Light | 🌙  ou  ☀️ | 🌙 Dark
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Mudar para o tema ${isDark ? 'claro' : 'escuro'}`}
      title={isDark ? 'Tema escuro ativo' : 'Tema claro ativo'}
      className="flex h-9 cursor-pointer select-none items-center rounded-[12px] border px-3 backdrop-blur-md transition-all duration-300 hover:brightness-[1.04]"
      style={{
        backgroundColor: isDark ? 'rgba(27, 34, 48, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: isDark ? '#2F3645' : '#D9D9D9',
        boxShadow: isDark ? '0 2px 10px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Lado esquerdo — Sol / Light */}
      <span
        className="flex items-center gap-2 transition-all duration-300"
        style={{ opacity: isDark ? 0.5 : 1 }}
      >
        <Sun size={15} strokeWidth={2.2} style={{ color: isDark ? '#6B7280' : '#F5A623' }} />
        {!isDark && (
          <span className="text-xs font-semibold" style={{ color: '#4B5563' }}>
            Light
          </span>
        )}
      </span>

      {/* Divisória vertical */}
      <span
        className="mx-2 h-4 w-px transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#2F3645' : '#E5E7EB' }}
      />

      {/* Lado direito — Lua / Dark */}
      <span
        className="flex items-center gap-2 transition-all duration-300"
        style={{ opacity: isDark ? 1 : 0.5 }}
      >
        <Moon size={15} strokeWidth={2.2} style={{ color: isDark ? '#B6A4FF' : '#9CA3AF' }} />
        {isDark && (
          <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>
            Dark
          </span>
        )}
      </span>
    </button>
  )
}
