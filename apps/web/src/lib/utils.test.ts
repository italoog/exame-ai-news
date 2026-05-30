import { cn, formatDate, formatRelativeDate, slugify, truncate, estimateReadTime } from './utils'

describe('cn()', () => {
  it('combina classes normais', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('resolve conflitos tailwind (a última vence)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('ignora valores falsy', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })
})

describe('formatDate()', () => {
  it('formata data em pt-BR', () => {
    // Usa horário de meio-dia para evitar problemas de timezone offset
    const result = formatDate('2024-01-15T12:00:00')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2024/)
  })

  it('aceita objeto Date', () => {
    const result = formatDate(new Date('2024-06-01'))
    expect(result).toMatch(/2024/)
  })
})

describe('formatRelativeDate()', () => {
  it('retorna "Agora mesmo" para menos de 60 segundos atrás', () => {
    const recent = new Date(Date.now() - 30_000)
    expect(formatRelativeDate(recent)).toBe('Agora mesmo')
  })

  it('retorna minutos para menos de 1 hora atrás', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeDate(fiveMinutesAgo)).toMatch(/min atrás/)
  })

  it('retorna horas para menos de 1 dia atrás', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    expect(formatRelativeDate(twoHoursAgo)).toMatch(/h atrás/)
  })

  it('retorna dias para menos de 1 semana atrás', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(threeDaysAgo)).toMatch(/d atrás/)
  })

  it('retorna data formatada para mais de 1 semana atrás', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    const result = formatRelativeDate(twoWeeksAgo)
    // Não deve conter "atrás"
    expect(result).not.toMatch(/atrás/)
  })
})

describe('slugify()', () => {
  it('converte texto para slug lowercase com hífens', () => {
    expect(slugify('Olá Mundo')).toBe('ola-mundo')
  })

  it('remove acentos', () => {
    // & é removido, espaços colapsam em um único hífen
    expect(slugify('Tecnologia Inovação')).toBe('tecnologia-inovacao')
  })

  it('trata múltiplos espaços como único hífen', () => {
    expect(slugify('espaços   múltiplos')).toBe('espacos-multiplos')
  })

  it('texto sem espaços permanece igual', () => {
    expect(slugify('javascript')).toBe('javascript')
  })
})

describe('truncate()', () => {
  it('não trunca texto menor que o limite', () => {
    expect(truncate('curto', 10)).toBe('curto')
  })

  it('trunca e adiciona reticências quando excede o limite', () => {
    const result = truncate('Texto muito longo aqui', 10)
    expect(result).toMatch(/…$/)
    expect(result.length).toBeLessThanOrEqual(11) // 10 chars + …
  })

  it('texto exatamente no limite não é truncado', () => {
    expect(truncate('1234567890', 10)).toBe('1234567890')
  })
})

describe('estimateReadTime()', () => {
  it('retorna 1 minuto para texto curto', () => {
    expect(estimateReadTime('palavra '.repeat(50))).toBe(1)
  })

  it('retorna tempo proporcional para texto longo', () => {
    // 400 palavras → 2 minutos a 200 wpm
    expect(estimateReadTime('palavra '.repeat(400))).toBe(2)
  })

  it('arredonda para cima', () => {
    // 201 palavras → 2 minutos (ceil de 1.005)
    expect(estimateReadTime('palavra '.repeat(201))).toBe(2)
  })
})
