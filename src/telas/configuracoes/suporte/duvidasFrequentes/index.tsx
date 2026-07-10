import { ArrowLeft, Database, Download, LockKeyhole, MessageCircleQuestion, WifiOff } from 'lucide-react'
import '../../styles.css'
import './styles.css'

const FAQ_ITEMS = [
  {
    tag: 'Dados locais',
    question: 'Os dados ficam online?',
    answer:
      'Não. Nesta versão, gastos, categorias e preferências ficam salvos no navegador do dispositivo por localStorage. Nenhum registro é enviado para servidor externo.',
    detail:
      'Isso deixa o uso simples e privado, mas também significa que os dados dependem do navegador usado.',
    Icon: Database,
  },
  {
    tag: 'Offline',
    question: 'Funciona sem internet?',
    answer:
      'Sim, depois que o PWA for aberto pelo menos uma vez com internet. O service worker salva a interface no cache para permitir abertura offline.',
    detail:
      'O cadastro e a consulta continuam funcionando localmente, porque os dados também ficam no dispositivo.',
    Icon: WifiOff,
  },
  {
    tag: 'Backup',
    question: 'Como trocar de celular sem perder os registros?',
    answer:
      'Antes de trocar de aparelho, exporte um backup JSON em Configurações > Backup e importe esse arquivo no novo dispositivo.',
    detail:
      'A limpeza de dados do navegador, troca de navegador ou reinstalação do PWA pode apagar os registros se não houver backup.',
    Icon: Download,
  },
  {
    tag: 'Acesso',
    question: 'A senha protege os dados como um banco online?',
    answer:
      'Não. A senha atual é uma trava local simples para uso pessoal. Ela não substitui criptografia, conta remota ou autenticação com servidor.',
    detail:
      'Para segurança real entre dispositivos, o projeto precisaria evoluir para back-end, banco de dados e regras de autenticação mais fortes.',
    Icon: LockKeyhole,
  },
]

function ConfiguracoesDuvidasFrequentes({ onBack }) {
  return (
    <section className="configuracoes-subpagina faq-config" aria-label="Dúvidas frequentes">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="configuracoes__section faq-config__section">
        <div className="section-heading">
          <div>
            <span>Suporte</span>
            <h2>Dúvidas frequentes</h2>
          </div>
          <MessageCircleQuestion size={22} aria-hidden="true" />
        </div>

        <div className="faq-config__list">
          {FAQ_ITEMS.map(({ tag, question, answer, detail, Icon }) => (
            <article className="faq-config__item" key={question}>
              <span className="faq-config__icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <div className="faq-config__content">
                <span>{tag}</span>
                <h3>{question}</h3>
                <p>{answer}</p>
                <small>{detail}</small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default ConfiguracoesDuvidasFrequentes
