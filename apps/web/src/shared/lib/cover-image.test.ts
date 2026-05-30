import { getCoverImage, getCoverImageThumb } from './cover-image'

describe('getCoverImage()', () => {
  it('deve retornar URL picsum com seed da categoria mapeada', () => {
    const url = getCoverImage('artigo-tech', 'tecnologia')
    expect(url).toBe('https://picsum.photos/seed/technology-digital/1200/630')
  })

  it('deve usar o slug da categoria quando não há mapeamento', () => {
    const url = getCoverImage('artigo', 'categoria-desconhecida')
    expect(url).toBe('https://picsum.photos/seed/categoria-desconhecida/1200/630')
  })

  it('deve usar o slug do artigo quando categorySlug não for fornecido', () => {
    const url = getCoverImage('meu-artigo')
    expect(url).toBe('https://picsum.photos/seed/meu-artigo/1200/630')
  })

  it('deve encodar URI corretamente para slugs com espaços', () => {
    const url = getCoverImage('artigo com espaços')
    expect(url).toContain(encodeURIComponent('artigo com espaços'))
  })
})

describe('getCoverImageThumb()', () => {
  it('deve retornar URL com dimensões 600x400', () => {
    const url = getCoverImageThumb('artigo-tech', 'tecnologia')
    expect(url).toBe('https://picsum.photos/seed/technology-digital/600/400')
  })

  it('deve usar slug do artigo quando categorySlug não for fornecido', () => {
    const url = getCoverImageThumb('meu-artigo')
    expect(url).toBe('https://picsum.photos/seed/meu-artigo/600/400')
  })
})
