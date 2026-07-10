/*
 * Tipo: componente visual.
 * Funcao: renderiza os links de documentacao e comunidade do template Vite.
 * Importado em: tela Inicial.
 */

import reactLogo from '../../../assets/react.svg'
import viteLogo from '../../../assets/vite.svg'
import './styles.css'

const LOGOS = {
  react: reactLogo,
  vite: viteLogo,
}

function LinksVite({ linksComunidade, linksDocumentacao }) {
  return (
    <section className="links-vite" id="next-steps">
      <div className="links-vite__grupo links-vite__grupo--docs" id="docs">
        <svg className="links-vite__icone" role="presentation" aria-hidden="true">
          <use href="/icons.svg#documentation-icon" />
        </svg>
        <h2>Documentation</h2>
        <p>Your questions, answered</p>
        <ul className="links-vite__lista">
          {linksDocumentacao.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                <img className="links-vite__logo" src={LOGOS[link.icone]} alt="" />
                {link.texto}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="links-vite__grupo" id="social">
        <svg className="links-vite__icone" role="presentation" aria-hidden="true">
          <use href="/icons.svg#social-icon" />
        </svg>
        <h2>Connect with us</h2>
        <p>Join the Vite community</p>
        <ul className="links-vite__lista">
          {linksComunidade.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                <svg
                  className="links-vite__button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href={`/icons.svg#${link.simbolo}`} />
                </svg>
                {link.texto}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default LinksVite
