import { AtSign, Link, Mail } from 'lucide-react'
import './styles.css'

function Rodape() {
  return (
    <footer className="rodape">
      <address className="rodape__contacts" aria-label="Contatos">
        <a href="https://instagram.com/luisnanddo" target="_blank" rel="noreferrer">
          <AtSign size={17} aria-hidden="true" />
          @luisnanddo
        </a>
        <a href="mailto:77luisnando@gmail.com">
          <Mail size={17} aria-hidden="true" />
          77luisnando@gmail.com
        </a>
        <a
          href="https://github.com/Luis-Fernando-R-Bueno"
          target="_blank"
          rel="noreferrer"
        >
          <Link size={17} aria-hidden="true" />
          Luis-Fernando-R-Bueno
        </a>
      </address>
    </footer>
  )
}

export default Rodape
