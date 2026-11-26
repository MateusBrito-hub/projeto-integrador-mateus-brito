# SkillMatch Vagas — Portal Inteligente de Empregos

O **SkillMatch Vagas** é um portal web de vagas de emprego voltado para conectar **profissionais e estudantes da área de tecnologia** a **empresas e recrutadores**. A plataforma permite o cadastro de oportunidades com suas habilidades técnicas (*skills*) exigidas e o cadastro de perfis de candidatos, realizando a comparação automática entre ambos e destacando como **Vaga Recomendada** toda oportunidade com compatibilidade superior a **70%**.

- **Repositório no GitHub:** [https://github.com/MateusBrito-hub/projeto-integrador-mateus-brito](https://github.com/MateusBrito-hub/projeto-integrador-mateus-brito)
- **Relatório Completo (Análise Ética, Técnica e Profissional):** [relatorio-skillmatch-vagas.pdf](./relatorio-skillmatch-vagas.pdf)

---

## Objetivo e Público-Alvo

- **Objetivo:** Tornar o processo de busca e triagem inicial de vagas de tecnologia mais transparente e objetivo, permitindo que a pessoa candidata visualize imediatamente seu percentual de aderência técnica, quais *skills* já domina e quais precisa desenvolver para atingir a meta de recomendação (> 70%).
- **Público-alvo:** Estudantes, estagiários, desenvolvedores(as) e profissionais de tecnologia em busca de oportunidades, bem como recrutadores e empresas que desejam divulgar vagas com critérios técnicos claros.

---

## Funcionalidades Principais

- **Grade e Tabela de Vagas Abertas:** Exibição responsiva em CSS Grid das oportunidades disponíveis e tabela sincronizada com a meta mínima de *skills* para recomendação (> 70%).
- **Cadastro de Novas Vagas:** Formulário com validação HTML5 (título, empresa, e-mail do recrutador, remuneração, senioridade, modalidade e *skills* exigidas) que adiciona a vaga dinamicamente ao painel.
- **Cadastro de Candidato e Match Automático (> 70%):** Seleção de perfil e *skills* técnicas com recálculo instantâneo do percentual de compatibilidade e destaque automático das vagas recomendadas.
- **Painel Interativo de Vagas:** Busca em tempo real (com atalho de teclado `/`), filtro por modalidade (Remoto, Híbrido, Presencial), filtro rápido *"Somente Recomendadas (> 70%)"*, ações de candidatar-se, salvar e remover vaga, além de resumo estatístico agrupado por modalidade.
- **Recursos Multimídia e Gráficos:** Tour guiado em vídeo HTML5 (formatos WebM e MP4 com legendas em Português via WebVTT e `preload="none"`), logotipo e selo de recomendação em SVG inline e gráfico animado de compatibilidade em Canvas 2D.
- **Analisador Lógico no Console:** Módulo auxiliar (`js/logica.js`) com relatório estruturado em `console.table()` e menu interativo opcional.

---

## Como Visualizar o Projeto

O projeto foi construído com **HTML5, CSS3 e JavaScript puro (Vanilla JS)**, sem necessidade de instalação de dependências ou etapas de build.

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/MateusBrito-hub/projeto-integrador-mateus-brito.git
   cd projeto-integrador-mateus-brito
   ```
2. **Abrir no navegador:**
   - Abra o arquivo `index.html` diretamente no navegador (Chrome, Edge, Firefox ou Safari); **ou**
   - Utilize um servidor local (recomendado para o carregamento completo das legendas `.vtt` em alguns navegadores), como a extensão **Live Server** no VS Code ou:
     ```bash
     python -m http.server 8000
     ```
     Em seguida, acesse `http://localhost:8000` no navegador.

---

## Síntese das Principais Decisões Éticas e Profissionais

A análise aprofundada de cada aspecto está documentada no relatório em PDF ([relatorio-skillmatch-vagas.pdf](./relatorio-skillmatch-vagas.pdf)). Em resumo, o projeto adotou as seguintes diretrizes:

- **Privacidade e Proteção de Dados (LGPD):** Embora apresente formulários simulando cadastro de vaga e candidato, o portal opera 100% no cliente em memória volátil, **sem coletar, transmitir ou armazenar dados pessoais em servidores ou bancos de dados**. Todos os exemplos iniciais utilizam dados fictícios.
- **Acessibilidade e Inclusão (LBI / WCAG):** Uso de HTML5 semântico, fontes em unidades relativas (`rem`), foco visível de alto contraste (`:focus-visible`), navegação por teclado (`Tab`, `Enter`, `Escape`, `/`), atributos ARIA (`aria-live`, `aria-pressed`, `aria-expanded`, `aria-current`), textos alternativos em imagens/SVGs/Canvas e legendas em português (`.vtt`) no vídeo.
- **Sustentabilidade Digital:** Zero bibliotecas ou requisições externas em tempo de execução, gráficos vetoriais SVG ultraleves (< 1,5 KB), `preload="none"` no vídeo com priorização do formato WebM mais compacto, delegação de eventos no DOM e animações baseadas apenas em `transform`.
- **Segurança no DOM e Transparência:** Construção de elementos dinâmicos exclusivamente com `createElement()` e `textContent` (sem `innerHTML`, prevenindo XSS) e exibição clara das *skills* compatíveis e faltantes para explicar o critério de recomendação (> 70%).
- **Uso Transparente de Inteligência Artificial:** Ferramentas de IA foram utilizadas como apoio na revisão de código, acessibilidade e organização documental, com verificação e validação manual integral pelo autor.

---

## Autoria e Créditos de Materiais Externos

- **Produção Própria:** Todo o código-fonte (`index.html`, `sobre.html`, `css/reset.css`, `css/style.css`, `js/script.js`, `js/logica.js`), gráficos vetoriais (`assets/images/banner-vagas.svg`, `assets/images/poster-video-match.svg`), legendas (`assets/media/legendas-match.vtt`) e vídeos demonstrativos (`assets/media/guia-skillmatch.webm` e `.mp4`) foram produzidos para este projeto integrador.
- **Materiais Externos:**
  - **MDN Web Docs:** Referenciada no rodapé do site (`https://developer.mozilla.org/pt-BR/docs/Learn`) como fonte educacional aberta sobre tecnologias web (documentação sob licença CC-BY-SA 2.5).
  - **Fontes Tipográficas:** Pilha de fontes nativas do sistema operacional (`"Segoe UI", Roboto, Helvetica, Arial, sans-serif`), sem carregamento de fontes externas.
  - **Bibliotecas e APIs Externas:** Não utiliza frameworks, bibliotecas de terceiros ou APIs externas.

---

## Comparativo de Performance de Layout (Desafio Extra — Aula 07)

Ao inspecionar o redimensionamento da janela na aba **Performance** do DevTools:
- **CSS Grid (`repeat(auto-fit, minmax(250px, 1fr))`)**: o motor de layout do navegador redistribui as *tracks* nativamente em um único passe de *Layout*, mantendo o tempo de *Recalculate Style + Layout* abaixo de **1,2 ms** por quadro e sem exigir regras de *clearfix* ou recálculo manual de coordenadas.
- **Abordagem legada (`float` + `position: absolute`)**: exige cálculos extras de empilhamento, quebra de linha dependente de alturas fixas e *reflows* sucessivos dos elementos irmãos quando a largura da *viewport* varia.
