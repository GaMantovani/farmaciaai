// middleware.js — redirects 301 do site antigo para o novo
import { NextResponse } from 'next/server'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Redirect: /farmacias-e-drogarias/SP/SAO-PAULO/BAIRRO/NOME/CNPJ
  if (pathname.startsWith('/farmacias-e-drogarias/')) {
    const parts = pathname.replace('/farmacias-e-drogarias/', '').split('/')
    
    // Com CNPJ: /farmacias-e-drogarias/SP/CIDADE/BAIRRO/NOME/CNPJ
    if (parts.length >= 4) {
      const cidade = parts[1]
      const bairro = parts[2]
      const nome = parts[3]
      const cidadeNorm = norm(cidade)
      const bairroNorm = norm(bairro)
      const nomeNorm = norm(nome)
      const slug = bairroNorm && bairroNorm !== cidadeNorm
        ? `${bairroNorm}-${nomeNorm}`
        : nomeNorm
      const url = request.nextUrl.clone()
      url.pathname = `/farmacia/${cidadeNorm}/${slug}`
      return NextResponse.redirect(url, 301)
    }

    // Só estado/cidade: /farmacias-e-drogarias/SP/pagina/1 ou /farmacias-e-drogarias/SP
    if (parts.length <= 2) {
      const url = request.nextUrl.clone()
      url.pathname = '/cidades'
      return NextResponse.redirect(url, 301)
    }
  }

  // Redirect: /bula/NOME-EMPRESA/REGISTRO → /bula/slug
  if (pathname.startsWith('/bula/') && pathname.split('/').length === 4) {
    const parts = pathname.split('/')
    const slug = norm(parts[2])
    const url = request.nextUrl.clone()
    url.pathname = `/bula/${slug}`
    return NextResponse.redirect(url, 301)
  }

  // Redirect: /detalhes/NOME/EAN → /produto/slug
  if (pathname.startsWith('/detalhes/')) {
    const parts = pathname.split('/')
    const slug = norm(parts[2])
    const url = request.nextUrl.clone()
    url.pathname = `/produto/${slug}`
    return NextResponse.redirect(url, 301)
  }

  // Redirect páginas antigas → home
  const redirectToHome = [
    '/farmacia-online',
    '/medicamentos-de-A-a-Z',
    '/como-funciona',
    '/planos',
    '/saude-de-A-a-Z',
    '/produtos-de-A-a-Z',
  ]
  if (redirectToHome.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 301)
  }
}

export const config = {
  matcher: [
    '/farmacias-e-drogarias/:path*',
    '/bula/:path*',
    '/detalhes/:path*',
    '/farmacia-online/:path*',
    '/medicamentos-de-A-a-Z/:path*',
    '/como-funciona',
    '/planos',
    '/saude-de-A-a-Z/:path*',
    '/produtos-de-A-a-Z/:path*',
  ]
}
