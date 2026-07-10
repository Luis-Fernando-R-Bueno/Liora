/*
 * Tipo: componente visual.
 * Funcao: renderiza a imagem principal composta pelos assets do template Vite.
 * Importado em: tela Inicial.
 */

import heroImg from '../../../assets/hero.png'
import reactLogo from '../../../assets/react.svg'
import viteLogo from '../../../assets/vite.svg'
import './styles.css'

function HeroVite() {
  return (
    <div className="hero-vite">
      <img src={heroImg} className="hero-vite__base" width="170" height="179" alt="" />
      <img src={reactLogo} className="hero-vite__framework" alt="React logo" />
      <img src={viteLogo} className="hero-vite__vite" alt="Vite logo" />
    </div>
  )
}

export default HeroVite
