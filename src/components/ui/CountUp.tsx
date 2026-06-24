import { useEffect, useRef, useState } from 'react'

/**
 * Anima um número de 0 até `to` com easing easeOutCubic.
 * Dispara uma única vez na montagem do componente.
 */
export function CountUp({
  to,
  duration = 1300,
  formatter = (n: number) => Math.round(n).toLocaleString('pt-BR'),
}: {
  to: number
  duration?: number
  formatter?: (n: number) => string
}) {
  const [val, setVal] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - (1 - p) ** 3
      setVal(eased * to)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [to, duration])

  return <>{formatter(val)}</>
}
