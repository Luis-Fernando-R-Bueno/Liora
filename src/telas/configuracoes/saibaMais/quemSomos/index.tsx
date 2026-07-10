import {
  ArrowLeft,
  BarChart3,
  Database,
  FileSpreadsheet,
  History,
  ReceiptText,
  Save,
  Smartphone,
  Tags,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import '../../styles.css'
import './styles.css'

const LINHA_DO_TEMPO = [
  {
    periodo: 'Origem',
    titulo: 'Uma planilha precisava ganhar clareza',
    texto:
      'A Liora nasceu da necessidade de transformar controles manuais em uma rotina mais leve para registrar e compreender gastos pessoais.',
    Icone: FileSpreadsheet,
  },
  {
    periodo: 'Primeira base',
    titulo: 'Cadastro de gastos direto ao ponto',
    texto:
      'A primeira entrega organizou data, categoria, valor e descrição opcional em um fluxo rápido, com persistência local no navegador.',
    Icone: ReceiptText,
  },
  {
    periodo: 'Organização',
    titulo: 'Categorias ganharam gestão própria',
    texto:
      'As categorias passaram a poder ser criadas, editadas, inativadas ou removidas, mantendo o histórico de gastos organizado por tipo de despesa.',
    Icone: Tags,
  },
  {
    periodo: 'Painel',
    titulo: 'O mês começou a ficar mais claro',
    texto:
      'O dashboard passou a calcular totais, quantidade de lançamentos, maior categoria, gastos recentes e comparativos mensais automaticamente.',
    Icone: BarChart3,
  },
  {
    periodo: 'Histórico',
    titulo: 'Meses anteriores ficaram consultáveis',
    texto:
      'A tela de histórico passou a listar meses encerrados, permitindo abrir qualquer período no painel e revisar o comportamento financeiro passado.',
    Icone: History,
  },
  {
    periodo: 'Mobilidade',
    titulo: 'A Liora virou PWA',
    texto:
      'Com manifesto, ícones e service worker, a Liora pode ser instalada no celular e aberta novamente mesmo sem conexão após o primeiro acesso.',
    Icone: Smartphone,
  },
  {
    periodo: 'Proteção local',
    titulo: 'Backup e configurações entraram no fluxo',
    texto:
      'A área de configurações passou a reunir perfil, categorias, segurança, suporte, informações do projeto e backup em JSON dos registros locais.',
    Icone: Save,
  },
  {
    periodo: 'Próximos passos',
    titulo: 'Uma base pronta para evoluir',
    texto:
      'A arquitetura continua local no MVP, mas já deixa caminho para uma API futura, banco de dados e sincronização entre dispositivos se isso fizer sentido.',
    Icone: Database,
  },
]

function ConfiguracoesQuemSomos({ onBack }) {
  const linhaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameLeitura = 0
    let frameAnimacao = 0
    let progressoAtual = 0
    let progressoAlvo = 0

    function aplicarProgresso(valor) {
      linhaRef.current?.style.setProperty('--linha-progresso', `${valor * 100}%`)
    }

    function calcularProgresso() {
      const linha = linhaRef.current

      if (!linha) return progressoAlvo

      const rect = linha.getBoundingClientRect()
      const posicaoLeitura = window.innerHeight * 0.42
      const progresso = (posicaoLeitura - rect.top) / Math.max(rect.height, 1)

      return Math.min(1, Math.max(0, progresso))
    }

    function animarProgresso() {
      const diferenca = progressoAlvo - progressoAtual

      if (Math.abs(diferenca) < 0.0008) {
        progressoAtual = progressoAlvo
        aplicarProgresso(progressoAtual)
        frameAnimacao = 0
        return
      }

      progressoAtual += diferenca * 0.22
      aplicarProgresso(progressoAtual)
      frameAnimacao = window.requestAnimationFrame(animarProgresso)
    }

    function atualizarProgresso(imediato = false) {
      if (frameLeitura) return

      frameLeitura = window.requestAnimationFrame(() => {
        progressoAlvo = calcularProgresso()

        if (imediato === true) {
          progressoAtual = progressoAlvo
          aplicarProgresso(progressoAtual)
          frameLeitura = 0
          return
        }

        if (!frameAnimacao) {
          frameAnimacao = window.requestAnimationFrame(animarProgresso)
        }

        frameLeitura = 0
      })
    }

    const atualizarPorEvento = () => atualizarProgresso()

    atualizarProgresso(true)
    window.addEventListener('scroll', atualizarPorEvento, { passive: true })
    window.addEventListener('resize', atualizarPorEvento)

    return () => {
      if (frameLeitura) window.cancelAnimationFrame(frameLeitura)
      if (frameAnimacao) window.cancelAnimationFrame(frameAnimacao)
      window.removeEventListener('scroll', atualizarPorEvento)
      window.removeEventListener('resize', atualizarPorEvento)
    }
  }, [])

  return (
    <section className="configuracoes-subpagina quem-somos" aria-label="Quem somos">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <section className="configuracoes__section quem-somos__section">
        <div className="quem-somos__intro">
          <strong>Liora</strong>
          <span>
            Uma linha do tempo sobre como o app evoluiu de uma planilha manual
            para um espaço local de clareza financeira.
          </span>
        </div>

        <div
          className="quem-somos__linha"
          aria-label="Linha do tempo do projeto"
          ref={linhaRef}
        >
          <div className="quem-somos__cursor" aria-hidden="true" />

          {LINHA_DO_TEMPO.map((marco, indice) => {
            const Icone = marco.Icone
            const lado = indice % 2 === 0 ? 'esquerda' : 'direita'

            return (
              <article
                className={`quem-somos__marco quem-somos__marco--${lado}`}
                key={marco.titulo}
              >
                <div className="quem-somos__ponto" aria-hidden="true">
                  <Icone size={22} aria-hidden="true" />
                </div>

                <div className="quem-somos__card">
                  <span className="quem-somos__periodo">{marco.periodo}</span>
                  <h2>{marco.titulo}</h2>
                  <p>{marco.texto}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}

export default ConfiguracoesQuemSomos
