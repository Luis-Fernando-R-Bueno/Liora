/*
 * Tipo: hook de tela.
 * Funcao: concentra estado e dados usados pela tela inicial do Vite.
 * Importado em: tela Inicial.
 */

import { useMemo, useState } from 'react'

export function useInicialVite() {
  const [contador, setContador] = useState(0)

  const linksDocumentacao = useMemo(
    () => [
      {
        href: 'https://vite.dev/',
        icone: 'vite',
        texto: 'Explore Vite',
      },
      {
        href: 'https://react.dev/',
        icone: 'react',
        texto: 'Learn more',
      },
    ],
    [],
  )

  const linksComunidade = useMemo(
    () => [
      {
        href: 'https://github.com/vitejs/vite',
        simbolo: 'github-icon',
        texto: 'GitHub',
      },
      {
        href: 'https://chat.vite.dev/',
        simbolo: 'discord-icon',
        texto: 'Discord',
      },
      {
        href: 'https://x.com/vite_js',
        simbolo: 'x-icon',
        texto: 'X.com',
      },
      {
        href: 'https://bsky.app/profile/vite.dev',
        simbolo: 'bluesky-icon',
        texto: 'Bluesky',
      },
    ],
    [],
  )

  function incrementarContador() {
    setContador((atual) => atual + 1)
  }

  return {
    contador,
    linksComunidade,
    linksDocumentacao,
    incrementarContador,
  }
}
