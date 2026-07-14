import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react'
import '../../styles.css'
import './styles.css'

function ConfiguracoesTermosDeUso({ onBack }) {
  return (
      'Ao utilizar este sistema, o usuário declara estar ciente e de acordo com os presentes Termos de Uso e Política de Privacidade. Caso não concorde com qualquer parte destes termos, recomenda-se que não utilize a aplicação.',
  },
  {
    titulo: 'Finalidade da aplicação',
    texto:
      'A ferramenta permite o registro de gastos com informações como data, categoria, valor e descrição opcional, além do gerenciamento de categorias, visualização de histórico completo, aplicação de filtros e pesquisas, e acompanhamento de um dashboard com resumo financeiro mensal. O sistema é fornecido como um recurso de apoio à organização financeira pessoal, não substituindo orientação financeira profissional.',
  },
  {
    titulo: 'Armazenamento local',
    texto:
      'Todos os dados inseridos pelo usuário são armazenados exclusivamente no navegador utilizado, por meio do localStorage. Isso significa que nenhuma informação é enviada para servidores externos, e o desenvolvedor não possui acesso aos dados registrados. As informações permanecem restritas ao dispositivo e navegador em uso.',
  },
  {
    titulo: 'Responsabilidade do usuário',
    texto:
      'O usuário é integralmente responsável pelos dados inseridos no sistema, incluindo sua veracidade, organização e manutenção. É de responsabilidade do usuário realizar backups, caso julgue necessário, bem como estar ciente de que a limpeza de dados do navegador, uso em outro dispositivo ou troca de navegador pode resultar na perda permanente das informações.',
  },
  {
    titulo: 'Limitações da versão inicial',
    texto:
      'Por se tratar de uma versão inicial do sistema, algumas limitações estão presentes, como a ausência de sincronização em nuvem, inexistência de autenticação de usuários e dependência exclusiva do armazenamento local. O sistema pode ser atualizado, modificado ou descontinuado a qualquer momento, sem aviso prévio, conforme a evolução do projeto.',
  },
  {
    titulo: 'Garantias e responsabilidade',
    texto:
      'O sistema é fornecido “como está”, sem garantias de funcionamento contínuo ou livre de erros. O desenvolvedor não se responsabiliza por eventuais perdas de dados, falhas decorrentes do ambiente do usuário, uso indevido da aplicação ou decisões financeiras tomadas com base nas informações registradas.',
  },
  {
    titulo: 'Privacidade',
    texto:
      'No que diz respeito à privacidade, o sistema foi projetado para não coletar, armazenar ou compartilhar dados pessoais do usuário. Não há integração com serviços de terceiros, não são utilizados cookies de rastreamento, nem ferramentas de análise de comportamento nesta versão. Todas as informações permanecem exclusivamente sob controle do usuário, armazenadas localmente.',
  },
  {
    titulo: 'Segurança do ambiente',
    texto:
      'A segurança dos dados depende diretamente do ambiente em que o sistema é utilizado, incluindo o navegador, o dispositivo e as práticas de uso adotadas pelo usuário. Recomenda-se o uso em ambientes seguros e a manutenção adequada do dispositivo.',
  },
  {
    titulo: 'Funcionalidades futuras',
    texto:
      'Futuras versões do sistema poderão incluir funcionalidades como autenticação de usuários, integração com back-end, armazenamento em banco de dados e sincronização entre dispositivos. Caso essas funcionalidades sejam implementadas, este documento será atualizado para refletir possíveis mudanças na forma de coleta, uso e armazenamento de dados.',
  },
  {
    titulo: 'Atualizações deste documento',
    texto:
      'Este documento pode ser atualizado a qualquer momento. O uso contínuo da aplicação após eventuais alterações será considerado como aceitação dos novos termos.',
  },
]

function ConfiguracoesTermosDeUso({ onBack }) {
  return (
    <section className="configuracoes-subpagina termos-config" aria-label="Termos de uso e privacidade">
      <div className="configuracoes__subnav">
        <button className="configuracoes__voltar" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <article className="termos-config__article">
        <header className="termos-config__hero">
          <span className="termos-config__icon" aria-hidden="true">
            <FileText size={28} />
          </span>
          <div>
            <span>Última atualização em 22 de junho de 2026</span>
            <h1>Termos de Uso e Política de Privacidade da Liora</h1>
          </div>
        </header>

        <section className="termos-config__lead">
          <ShieldCheck size={22} aria-hidden="true" />
          <p>
            A Liora é uma aplicação web desenvolvida para auxiliar na
            organização, no registro e na leitura dos gastos financeiros
            pessoais. O sistema funciona diretamente no navegador, sem
            necessidade de criação de conta, autenticação ou conexão com
            servidores externos nesta versão, utilizando armazenamento local por
            meio da tecnologia localStorage.
          </p>
        </section>

        <div className="termos-config__content">
          <section className="termos-config__section">
            <h2>Aceitação dos Termos</h2>
            <p>
              Ao utilizar este sistema, o usuário declara estar ciente e de acordo com os presentes Termos de Uso e Política de Privacidade. Caso não concorde com qualquer parte destes termos, recomenda-se que não utilize a aplicação.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Finalidade da Aplicação</h2>
            <p>
              A ferramenta permite o registro de gastos com informações como data, categoria, valor e descrição opcional, além do gerenciamento de categorias, visualização de histórico completo, aplicação de filtros e pesquisas, e acompanhamento de um dashboard com resumo financeiro mensal. O sistema é fornecido como um recurso de apoio à organização financeira pessoal, não substituindo orientação financeira profissional.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Armazenamento Local</h2>
            <p>
              Todos os dados inseridos pelo usuário são armazenados exclusivamente no navegador utilizado, por meio do localStorage. Isso significa que nenhuma informação é enviada para servidores externos, e o desenvolvedor não possui acesso aos dados registrados. As informações permanecem restritas ao dispositivo e navegador em uso.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Responsabilidade do Usuário</h2>
            <p>
              O usuário é integralmente responsável pelos dados inseridos no sistema, incluindo sua veracidade, organização e manutenção. É de responsabilidade do usuário realizar backups, caso julgue necessário, bem como estar ciente de que a limpeza de dados do navegador, uso em outro dispositivo ou troca de navegador pode resultar na perda permanente das informações.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Limitações da Versão Inicial</h2>
            <p>
              Por se tratar de uma versão inicial do sistema, algumas limitações estão presentes, como a ausência de sincronização em nuvem, inexistência de autenticação de usuários e dependência exclusiva do armazenamento local. O sistema pode ser atualizado, modificado ou descontinuado a qualquer momento, sem aviso prévio, conforme a evolução do projeto.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Garantias e Responsabilidade</h2>
            <p>
              O sistema é fornecido "como está", sem garantias de funcionamento contínuo ou livre de erros. O desenvolvedor não se responsabiliza por eventuais perdas de dados, falhas decorrentes do ambiente do usuário, uso indevido da aplicação ou decisões financeiras tomadas com base nas informações registradas.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Privacidade</h2>
            <p>
              No que diz respeito à privacidade, o sistema foi projetado para não coletar, armazenar ou compartilhar dados pessoais do usuário. Não há integração com serviços de terceiros, não são utilizados cookies de rastreamento, nem ferramentas de análise de comportamento nesta versão. Todas as informações permanecem exclusivamente sob controle do usuário, armazenadas localmente.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Segurança do Ambiente</h2>
            <p>
              A segurança dos dados depende diretamente do ambiente em que o sistema é utilizado, incluindo o navegador, o dispositivo e as práticas de uso adotadas pelo usuário. Recomenda-se o uso em ambientes seguros e a manutenção adequada do dispositivo.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Funcionalidades Futuras</h2>
            <p>
              Futuras versões do sistema poderão incluir funcionalidades como autenticação de usuários, integração com back-end, armazenamento em banco de dados e sincronização entre dispositivos. Caso essas funcionalidades sejam implementadas, este documento será atualizado para refletir possíveis mudanças na forma de coleta, uso e armazenamento de dados.
            </p>
          </section>

          <section className="termos-config__section">
            <h2>Atualizações deste Documento</h2>
            <p>
              Este documento pode ser atualizado a qualquer momento. O uso contínuo da aplicação após eventuais alterações será considerado como aceitação dos novos termos.
            </p>
          </section>
        </div>
      </article>
    </section>
  )
}

export default ConfiguracoesTermosDeUso
