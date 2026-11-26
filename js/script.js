/* ==========================================================================
   Análise de Compatibilidade (> 70%), DOM Aprofundado e Eventos
   SkillMatch Vagas — Aulas 11 e 12 (js/script.js)
   ========================================================================== */

// Passo 1 (Aula 12): Array como fonte de verdade (mínimo 5 objetos, 3+ propriedades e id único)
const vagasPortalDom = [
  {
    id: 101,
    titulo: 'Desenvolvedor(a) Front-end Júnior',
    empresa: 'TechNova Solutions',
    modalidade: 'Remoto',
    nivel: 'Junior',
    salario: 4200,
    skillsSolicitadas: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Acessibilidade'],
    aplicada: false,
    salva: false
  },
  {
    id: 102,
    titulo: 'Engenheiro(a) Front-end Pleno',
    empresa: 'InovaWeb Brasil',
    modalidade: 'Hibrido',
    nivel: 'Pleno',
    salario: 7500,
    skillsSolicitadas: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Acessibilidade', 'React'],
    aplicada: false,
    salva: false
  },
  {
    id: 103,
    titulo: 'Especialista em Interfaces Acessíveis',
    empresa: 'Portal Inclusivo Tech',
    modalidade: 'Remoto',
    nivel: 'Senior',
    salario: 8200,
    skillsSolicitadas: ['HTML5', 'CSS3', 'Acessibilidade', 'Git'],
    aplicada: false,
    salva: false
  },
  {
    id: 104,
    titulo: 'Analista de UI/UX & Front-end',
    empresa: 'Studio Digital Pulse',
    modalidade: 'Remoto',
    nivel: 'Pleno',
    salario: 5800,
    skillsSolicitadas: ['HTML5', 'CSS3', 'Acessibilidade', 'TypeScript', 'React'],
    aplicada: false,
    salva: false
  },
  {
    id: 105,
    titulo: 'Desenvolvedor(a) Full Stack Web',
    empresa: 'DataCore Sistemas',
    modalidade: 'Presencial',
    nivel: 'Pleno',
    salario: 9000,
    skillsSolicitadas: ['JavaScript', 'React', 'TypeScript', 'SQL', 'Git'],
    aplicada: false,
    salva: false
  },
  {
    id: 106,
    titulo: 'Desenvolvedor(a) Web Estágio / Trainee',
    empresa: 'StartUp Impulso',
    modalidade: 'Hibrido',
    nivel: 'Estagio',
    salario: 2800,
    skillsSolicitadas: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
    aplicada: false,
    salva: false
  }
];

const estadoPortal = {
  candidatoAtual: {
    nome: 'Candidato(a) Demonstracao',
    email: 'candidato@skillmatch.com.br',
    area: 'frontend',
    regime: 'CLT',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Acessibilidade']
  },
  filtros: {
    termoBusca: '',
    modalidade: 'todas',
    somenteRecomendadas: false
  }
};

/* ==========================================================================
   BLOCO 1: Funções Puras de Cálculo, Classificação, Filtro e Resumo
   ========================================================================== */

function calcularCompatibilidadeSkills(
  vaga,
  skillsCandidato = ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Acessibilidade']
) {
  const listaSolicitadas = Array.isArray(vaga.skillsSolicitadas)
    ? [...vaga.skillsSolicitadas]
    : [];
  const listaCandidatoNormalizada = skillsCandidato.map((skill) =>
    skill.trim().toLowerCase()
  );

  const skillsCompativeis = listaSolicitadas.filter((skillVaga) =>
    listaCandidatoNormalizada.includes(skillVaga.trim().toLowerCase())
  );

  const skillsFaltantes = listaSolicitadas.filter(
    (skillVaga) => !listaCandidatoNormalizada.includes(skillVaga.trim().toLowerCase())
  );

  const totalSolicitadas = listaSolicitadas.length;
  const percentualBruto =
    totalSolicitadas > 0 ? (skillsCompativeis.length / totalSolicitadas) * 100 : 0;
  const percentualMatch = Number(percentualBruto.toFixed(1));

  return {
    percentualMatch,
    skillsCompativeis,
    skillsFaltantes,
    totalSolicitadas
  };
}

function criarClassificadorPorMeta(limiteRecomendacao = 70) {
  return function classificarPorPercentual(percentualMatch) {
    if (percentualMatch > limiteRecomendacao) {
      return {
        rotulo: `Vaga Recomendada (${percentualMatch}% de Match — Acima de ${limiteRecomendacao}%)`,
        classeCss: 'faixa-recomendada',
        recomendada: true
      };
    } else if (percentualMatch >= 50) {
      return {
        rotulo: `Compatibilidade Parcial (${percentualMatch}% de Match — Meta > ${limiteRecomendacao}%)`,
        classeCss: 'faixa-parcial',
        recomendada: false
      };
    } else {
      return {
        rotulo: `Baixa Compatibilidade (${percentualMatch}% de Match — Abaixo de 50%)`,
        classeCss: 'faixa-baixa',
        recomendada: false
      };
    }
  };
}

const classificarCompatibilidadeSetentaPorcento = criarClassificadorPorMeta(70);

function classificarFaixaCompatibilidade(percentualMatch, metaMinima = 70) {
  const classificador = criarClassificadorPorMeta(metaMinima);
  return classificador(percentualMatch);
}

function analisarListaDeVagas(listaVagas, skillsCandidato) {
  const vagasProcessadas = listaVagas.map((vaga) => {
    const calculo = calcularCompatibilidadeSkills(vaga, skillsCandidato);
    const classificacao = classificarCompatibilidadeSetentaPorcento(
      calculo.percentualMatch
    );

    return {
      ...vaga,
      skillsSolicitadas: [...vaga.skillsSolicitadas],
      percentualMatch: calculo.percentualMatch,
      skillsCompativeis: calculo.skillsCompativeis,
      skillsFaltantes: calculo.skillsFaltantes,
      rotuloClassificacao: classificacao.rotulo,
      classeFaixa: classificacao.classeCss,
      recomendada: classificacao.recomendada
    };
  });

  const vagasOrdenadasPorMatch = [...vagasProcessadas].sort(
    (a, b) => b.percentualMatch - a.percentualMatch
  );

  const vagasRecomendadas = vagasOrdenadasPorMatch.filter(
    (item) => item.recomendada === true
  );

  const estatisticas = vagasOrdenadasPorMatch.reduce(
    (acumulador, item) => {
      acumulador.somaPercentuais += item.percentualMatch;
      if (item.recomendada === true) {
        acumulador.totalRecomendadas += 1;
      }
      if (item.percentualMatch > acumulador.maiorMatch) {
        acumulador.maiorMatch = item.percentualMatch;
        acumulador.melhorVagaTitulo = item.titulo;
      }
      return acumulador;
    },
    {
      somaPercentuais: 0,
      totalRecomendadas: 0,
      maiorMatch: 0,
      melhorVagaTitulo: ''
    }
  );

  const totalVagas = vagasOrdenadasPorMatch.length;
  const mediaMatch =
    totalVagas > 0
      ? Number((estatisticas.somaPercentuais / totalVagas).toFixed(1))
      : 0;

  const agrupadasPorModalidade = vagasOrdenadasPorMatch.reduce(
    (grupos, item) => {
      const chave = item.modalidade;
      if (!grupos[chave]) {
        grupos[chave] = {
          modalidade: chave,
          totalVagas: 0,
          recomendadasCount: 0,
          itens: []
        };
      }
      grupos[chave].totalVagas += 1;
      if (item.recomendada === true) {
        grupos[chave].recomendadasCount += 1;
      }
      grupos[chave].itens.push(item);
      return grupos;
    },
    {}
  );

  return {
    vagasOrdenadasPorMatch,
    vagasRecomendadas,
    totalVagas,
    totalRecomendadas: estatisticas.totalRecomendadas,
    mediaMatch,
    maiorMatch: estatisticas.maiorMatch,
    melhorVagaTitulo: estatisticas.melhorVagaTitulo,
    agrupadasPorModalidade
  };
}

// Função pura de filtragem lida por desenhar() (Passo 6)
function filtrarVagasAnalisadas(vagasOrdenadas, filtros) {
  const termoNormalizado = filtros.termoBusca.trim().toLowerCase();

  return vagasOrdenadas.filter((vaga) => {
    if (filtros.somenteRecomendadas && !vaga.recomendada) {
      return false;
    }

    if (filtros.modalidade !== 'todas' && vaga.modalidade !== filtros.modalidade) {
      return false;
    }

    if (termoNormalizado !== '') {
      const textoPesquisavel = [
        vaga.titulo,
        vaga.empresa,
        vaga.modalidade,
        vaga.nivel,
        vaga.skillsSolicitadas.join(' ')
      ]
        .join(' ')
        .toLowerCase();

      if (!textoPesquisavel.includes(termoNormalizado)) {
        return false;
      }
    }

    return true;
  });
}

// Passo 7 (Aula 12): Função pura que calcula o resumo a partir dos dados filtrados e totais
function calcularResumoPainel(vagasVisiveis, vagasTotais) {
  const totais = vagasTotais.reduce(
    (acc, vaga) => {
      if (vaga.recomendada) acc.recomendadasTotal += 1;
      if (vaga.aplicada) acc.aplicadasTotal += 1;
      if (vaga.salva) acc.salvasTotal += 1;
      return acc;
    },
    { recomendadasTotal: 0, aplicadasTotal: 0, salvasTotal: 0 }
  );

  const somaVisiveis = vagasVisiveis.reduce(
    (soma, vaga) => soma + vaga.percentualMatch,
    0
  );
  const mediaVisiveis =
    vagasVisiveis.length > 0
      ? Number((somaVisiveis / vagasVisiveis.length).toFixed(1))
      : 0;

  return {
    quantidadeVisiveis: vagasVisiveis.length,
    quantidadeTotal: vagasTotais.length,
    recomendadasTotal: totais.recomendadasTotal,
    aplicadasTotal: totais.aplicadasTotal,
    salvasTotal: totais.salvasTotal,
    mediaVisiveis
  };
}

/* ==========================================================================
   BLOCO 2: Construção Segura do DOM (Sem innerHTML) e Redesenho (desenhar)
   ========================================================================== */

// Passo 2 (Aula 12): Cria um <li> usando createElement, textContent e dataset (sem innerHTML)
function criarItemListaVaga(vagaAnalisada) {
  const itemLista = document.createElement('li');
  itemLista.classList.add('card-resultado-dom', vagaAnalisada.classeFaixa);
  itemLista.dataset.id = String(vagaAnalisada.id);

  const topoDiv = document.createElement('div');

  const badge = document.createElement('span');
  badge.classList.add('badge-faixa');
  badge.textContent = vagaAnalisada.rotuloClassificacao;

  const titulo = document.createElement('h3');
  titulo.textContent = vagaAnalisada.titulo;

  const empresaInfo = document.createElement('p');
  empresaInfo.textContent = `Empresa: ${vagaAnalisada.empresa} | Modalidade: ${vagaAnalisada.modalidade} | Nível: ${vagaAnalisada.nivel}`;

  const salarioInfo = document.createElement('p');
  salarioInfo.textContent = `Remuneração: R$ ${vagaAnalisada.salario.toLocaleString('pt-BR')}`;

  const skillsExigidasP = document.createElement('p');
  skillsExigidasP.textContent = `Skills exigidas (${vagaAnalisada.skillsSolicitadas.length}): ${vagaAnalisada.skillsSolicitadas.join(', ')}`;

  const skillsMatchP = document.createElement('p');
  const textoMatch =
    vagaAnalisada.skillsCompativeis.length > 0
      ? vagaAnalisada.skillsCompativeis.join(', ')
      : 'Nenhuma skill compatível selecionada';
  skillsMatchP.textContent = `Suas skills compatíveis (${vagaAnalisada.skillsCompativeis.length}/${vagaAnalisada.skillsSolicitadas.length}): ${textoMatch}`;

  const recomendacaoMsg = document.createElement('p');
  if (vagaAnalisada.recomendada === true) {
    recomendacaoMsg.textContent =
      '★ RECOMENDAÇÃO AUTOMÁTICA: Compatibilidade superior a 70% para o seu perfil!';
  } else {
    const faltam =
      vagaAnalisada.skillsFaltantes.length > 0
        ? vagaAnalisada.skillsFaltantes.join(', ')
        : 'Nenhuma';
    recomendacaoMsg.textContent = `Skills pendentes para atingir > 70%: ${faltam}`;
  }

  topoDiv.append(
    badge,
    titulo,
    empresaInfo,
    salarioInfo,
    skillsExigidasP,
    skillsMatchP,
    recomendacaoMsg
  );

  // Ações do card sem registrar ouvintes individuais (controladas por delegação no <ul>)
  const barraAcoes = document.createElement('div');
  barraAcoes.classList.add('acoes-card-vaga');

  const botaoAplicar = document.createElement('button');
  botaoAplicar.type = 'button';
  botaoAplicar.classList.add('btn-aplicar-vaga');
  botaoAplicar.dataset.acao = 'aplicar';
  botaoAplicar.setAttribute('aria-pressed', String(vagaAnalisada.aplicada));
  if (vagaAnalisada.aplicada) {
    botaoAplicar.classList.add('btn-aplicado');
  }
  const textoAplicar = document.createElement('span');
  textoAplicar.textContent = vagaAnalisada.aplicada
    ? `Candidatura Enviada (${vagaAnalisada.percentualMatch}%)`
    : vagaAnalisada.recomendada
      ? 'Candidatar-se (> 70%)'
      : 'Candidatar-se';
  botaoAplicar.append(textoAplicar);

  const botaoSalvar = document.createElement('button');
  botaoSalvar.type = 'button';
  botaoSalvar.classList.add('btn-salvar-vaga');
  botaoSalvar.dataset.acao = 'salvar';
  botaoSalvar.setAttribute('aria-pressed', String(vagaAnalisada.salva));
  const textoSalvar = document.createElement('span');
  textoSalvar.textContent = vagaAnalisada.salva ? '★ Salva' : '☆ Salvar';
  botaoSalvar.append(textoSalvar);

  const botaoRemover = document.createElement('button');
  botaoRemover.type = 'button';
  botaoRemover.classList.add('btn-remover-vaga');
  botaoRemover.dataset.acao = 'remover';
  const textoRemover = document.createElement('span');
  textoRemover.textContent = 'Remover';
  botaoRemover.append(textoRemover);

  barraAcoes.append(botaoAplicar, botaoSalvar, botaoRemover);
  itemLista.append(topoDiv, barraAcoes);

  return itemLista;
}

// Passo 7 (Aula 12): Função que escreve o resumo calculado na região aria-live="polite"
function escreverResumoDom(resumo) {
  const paragrafoResumo = document.querySelector('#resumo-vagas-dom');
  if (paragrafoResumo === null) return;

  paragrafoResumo.textContent =
    `Exibindo ${resumo.quantidadeVisiveis} de ${resumo.quantidadeTotal} vaga(s) | ` +
    `Recomendadas (> 70%): ${resumo.recomendadasTotal} | ` +
    `Candidaturas: ${resumo.aplicadasTotal} | ` +
    `Salvas: ${resumo.salvasTotal} | ` +
    `Média de Match visível: ${resumo.mediaVisiveis}%`;
}

function renderizarAgrupamentoModalidades(agrupadasPorModalidade) {
  const containerCategorias = document.querySelector('#agrupamento-modalidades-dom');
  if (containerCategorias === null) return;

  const blocos = Object.keys(agrupadasPorModalidade).map((chaveModalidade) => {
    const grupo = agrupadasPorModalidade[chaveModalidade];
    const blocoCat = document.createElement('div');
    blocoCat.classList.add('bloco-categoria');

    const tituloCat = document.createElement('h4');
    tituloCat.textContent = `Modalidade: ${grupo.modalidade}`;

    const resumoCat = document.createElement('p');
    resumoCat.textContent = `Total: ${grupo.totalVagas} vaga(s) | Recomendadas (> 70%): ${grupo.recomendadasCount}`;

    const listaCat = document.createElement('ul');
    listaCat.classList.add('lista-recursos');
    for (const vagaGrupo of grupo.itens) {
      const li = document.createElement('li');
      li.textContent = `${vagaGrupo.titulo} — ${vagaGrupo.percentualMatch}%`;
      listaCat.append(li);
    }

    blocoCat.append(tituloCat, resumoCat, listaCat);
    return blocoCat;
  });

  containerCategorias.replaceChildren(...blocos);
}

function sincronizarTabelaVagasHtml() {
  const corpoTabela = document.querySelector('.tabela-vagas tbody');
  if (corpoTabela === null) return;

  const linhas = vagasPortalDom.map((vaga) => {
    const tr = document.createElement('tr');

    const tdTitulo = document.createElement('td');
    tdTitulo.textContent = vaga.titulo;

    const tdEmpresa = document.createElement('td');
    tdEmpresa.textContent = `${vaga.empresa} (${vaga.modalidade})`;

    const tdSkills = document.createElement('td');
    tdSkills.textContent = vaga.skillsSolicitadas.join(', ');

    const minSkillsPara70 = Math.floor(vaga.skillsSolicitadas.length * 0.7) + 1;
    const tdMeta = document.createElement('td');
    tdMeta.textContent = `Acima de 70% (${minSkillsPara70} de ${vaga.skillsSolicitadas.length} skills)`;

    tr.append(tdTitulo, tdEmpresa, tdSkills, tdMeta);
    return tr;
  });

  corpoTabela.replaceChildren(...linhas);
}

// Passo 3 (Aula 12): Função desenhar() lê o array, aplica os filtros, usa replaceChildren e atualiza o resumo
function desenhar() {
  const listaElemento = document.querySelector('#lista-vagas-dom');
  if (listaElemento === null) {
    console.error('[SkillMatch DOM] Elemento #lista-vagas-dom não encontrado.');
    return;
  }

  const analise = analisarListaDeVagas(
    vagasPortalDom,
    estadoPortal.candidatoAtual.skills
  );

  const vagasVisiveis = filtrarVagasAnalisadas(
    analise.vagasOrdenadasPorMatch,
    estadoPortal.filtros
  );

  const infoPerfil = document.querySelector('#perfil-ativo-dom');
  if (infoPerfil !== null) {
    infoPerfil.textContent =
      `Perfil ativo: ${estadoPortal.candidatoAtual.nome} (${estadoPortal.candidatoAtual.email}) | ` +
      `Skills: ${estadoPortal.candidatoAtual.skills.join(', ')}`;
  }

  if (vagasVisiveis.length === 0) {
    const itemVazio = document.createElement('li');
    itemVazio.classList.add('item-vazio-dom');
    itemVazio.textContent =
      'Nenhuma vaga corresponde aos filtros atuais. Tente limpar a busca ou desativar o filtro rápido.';
    listaElemento.replaceChildren(itemVazio);
  } else {
    const elementosVagas = vagasVisiveis.map((vaga) => criarItemListaVaga(vaga));
    listaElemento.replaceChildren(...elementosVagas);
  }

  const resumoCalculado = calcularResumoPainel(
    vagasVisiveis,
    analise.vagasOrdenadasPorMatch
  );
  escreverResumoDom(resumoCalculado);
  renderizarAgrupamentoModalidades(analise.agrupadasPorModalidade);
}

/* ==========================================================================
   BLOCO 3: Ouvintes Nomeados (Delegação, Estado, Busca, Formulários e Teclado)
   ========================================================================== */

// Passo 4 (Aula 12): Ouvinte único delegado no contêiner #lista-vagas-dom usando closest e dataset
function lidarCliqueListaVagas(evento) {
  const botao = evento.target.closest('button[data-acao]');
  if (botao === null) return;

  const itemLi = botao.closest('li[data-id]');
  if (itemLi === null) return;

  const idVaga = Number(itemLi.dataset.id);
  const acao = botao.dataset.acao;
  const indice = vagasPortalDom.findIndex((vaga) => vaga.id === idVaga);
  if (indice === -1) return;

  if (acao === 'aplicar') {
    vagasPortalDom[indice].aplicada = !vagasPortalDom[indice].aplicada;
    desenhar();
  } else if (acao === 'salvar') {
    vagasPortalDom[indice].salva = !vagasPortalDom[indice].salva;
    desenhar();
  } else if (acao === 'remover') {
    vagasPortalDom.splice(indice, 1);
    sincronizarTabelaVagasHtml();
    desenhar();
  }
}

// Passo 6 (Aula 12): Busca com input e filtro com change chamando desenhar()
function lidarBuscaVagas(evento) {
  estadoPortal.filtros.termoBusca = evento.target.value;
  desenhar();
}

function lidarFiltroModalidade(evento) {
  estadoPortal.filtros.modalidade = evento.target.value;
  desenhar();
}

// Passo 5 (Aula 12): Controle com estado (aria-pressed)
function lidarToggleSomenteRecomendadas(evento) {
  const botao = evento.currentTarget;
  estadoPortal.filtros.somenteRecomendadas = !estadoPortal.filtros.somenteRecomendadas;
  botao.setAttribute('aria-pressed', String(estadoPortal.filtros.somenteRecomendadas));
  desenhar();
}

// Passo 5 (Aula 12): Controle com estado (aria-expanded) com suporte a Escape
function alternarPainelDetalhes(abrir, devolverFoco = false) {
  const botao = document.querySelector('#btn-painel-detalhes');
  const painel = document.querySelector('#painel-detalhes-match');
  if (botao === null || painel === null) return;

  painel.hidden = !abrir;
  botao.setAttribute('aria-expanded', String(abrir));

  if (!abrir && devolverFoco) {
    botao.focus();
  }
}

function lidarTogglePainelDetalhes() {
  const botao = document.querySelector('#btn-painel-detalhes');
  if (botao === null) return;
  const estaAberto = botao.getAttribute('aria-expanded') === 'true';
  alternarPainelDetalhes(!estaAberto, false);
}

// Passo 8 (Aula 12): Cadastro de nova vaga adiciona ao array e chama desenhar()
function lidarSubmitCadastroVaga(evento) {
  evento.preventDefault();

  const formVaga = evento.currentTarget;
  const inputTitulo = document.querySelector('#vaga-titulo');
  const inputEmpresa = document.querySelector('#vaga-empresa');
  const inputSalario = document.querySelector('#vaga-salario');
  const selectNivel = document.querySelector('#vaga-nivel');
  const radioModalidade = document.querySelector('input[name="vagaModalidade"]:checked');
  const checkboxesSkills = document.querySelectorAll('input[name="vagaSkills"]:checked');

  const skillsEscolhidas = Array.from(checkboxesSkills).map((cb) => cb.value);
  if (skillsEscolhidas.length === 0) {
    window.alert('Selecione pelo menos 1 skill técnica solicitada para cadastrar a vaga.');
    return;
  }

  const novaVaga = {
    id: Date.now(),
    titulo: inputTitulo ? inputTitulo.value.trim() : 'Nova Vaga',
    empresa: inputEmpresa ? inputEmpresa.value.trim() : 'Empresa Parceira',
    modalidade: radioModalidade ? radioModalidade.value : 'Remoto',
    nivel: selectNivel && selectNivel.value ? selectNivel.value : 'Junior',
    salario: inputSalario ? Number(inputSalario.value) || 3500 : 3500,
    skillsSolicitadas: skillsEscolhidas,
    aplicada: false,
    salva: false
  };

  vagasPortalDom.push(novaVaga);
  sincronizarTabelaVagasHtml();
  desenhar();
  formVaga.reset();

  const secaoResultado = document.querySelector('#resultado');
  if (secaoResultado !== null) {
    secaoResultado.scrollIntoView({ behavior: 'smooth' });
  }
}

function lidarSubmitCandidato(evento) {
  evento.preventDefault();

  const inputNome = document.querySelector('#cand-nome');
  const inputEmail = document.querySelector('#cand-email');
  const selectArea = document.querySelector('#cand-area');
  const radioRegime = document.querySelector('input[name="candRegime"]:checked');
  const checkboxesCandSkills = document.querySelectorAll('input[name="candSkills"]:checked');

  const skillsCandidatoSelecionadas = Array.from(checkboxesCandSkills).map(
    (cb) => cb.value
  );

  estadoPortal.candidatoAtual = {
    nome:
      inputNome && inputNome.value.trim() !== ''
        ? inputNome.value.trim()
        : 'Candidato(a)',
    email:
      inputEmail && inputEmail.value.trim() !== ''
        ? inputEmail.value.trim()
        : 'contato@candidato.com',
    area: selectArea ? selectArea.value : 'frontend',
    regime: radioRegime ? radioRegime.value : 'CLT',
    skills: skillsCandidatoSelecionadas
  };

  for (const vaga of vagasPortalDom) {
    const calculo = calcularCompatibilidadeSkills(vaga, estadoPortal.candidatoAtual.skills);
    if (calculo.percentualMatch > 70) {
      vaga.aplicada = true;
    }
  }

  desenhar();

  const secaoResultado = document.querySelector('#resultado');
  if (secaoResultado !== null) {
    secaoResultado.scrollIntoView({ behavior: 'smooth' });
  }
}

function lidarFecharAvisoTopo() {
  const blocoAviso = document.querySelector('#aviso-match');
  if (blocoAviso !== null) {
    blocoAviso.hidden = true;
  }
}

function fecharMenuHamburguerMobile(devolverFoco = false) {
  const botaoHamburguer = document.querySelector('.botao-hamburguer');
  const menuLista = document.querySelector('#menu-principal-lista');
  if (botaoHamburguer === null || menuLista === null) return;

  if (window.innerWidth <= 768 && menuLista.classList.contains('menu-aberto')) {
    menuLista.classList.remove('menu-aberto');
    botaoHamburguer.classList.remove('menu-ativo');
    botaoHamburguer.setAttribute('aria-expanded', 'false');
    botaoHamburguer.setAttribute('aria-label', 'Abrir menu de navegação');
    if (devolverFoco) {
      botaoHamburguer.focus();
    }
  }
}

function lidarToggleMenuHamburguer() {
  const botaoHamburguer = document.querySelector('.botao-hamburguer');
  const menuLista = document.querySelector('#menu-principal-lista');
  if (botaoHamburguer === null || menuLista === null) return;

  const emTelaEstreita = window.innerWidth <= 768;
  let abertoAgora = false;

  if (emTelaEstreita) {
    menuLista.classList.remove('menu-oculto');
    abertoAgora = menuLista.classList.toggle('menu-aberto');
  } else {
    menuLista.classList.remove('menu-aberto');
    const foiOcultado = menuLista.classList.toggle('menu-oculto');
    abertoAgora = !foiOcultado;
  }

  botaoHamburguer.classList.toggle('menu-ativo', abertoAgora);
  botaoHamburguer.setAttribute('aria-expanded', String(abertoAgora));
  botaoHamburguer.setAttribute(
    'aria-label',
    abertoAgora ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
  );
}

function lidarCliqueLinkMenu(evento) {
  const link = evento.target.closest('a');
  const menuLista = evento.currentTarget;
  if (link === null) return;

  const linksMenu = menuLista.querySelectorAll('a');
  for (const outroLink of linksMenu) {
    outroLink.classList.remove('ativo');
    outroLink.removeAttribute('aria-current');
  }
  link.classList.add('ativo');
  link.setAttribute('aria-current', 'page');

  fecharMenuHamburguerMobile(false);
}

// Desafio Extra (Aula 12): Clique fora com closest no document (registrado uma única vez)
function lidarCliqueForaComponentes(evento) {
  const botaoDetalhes = document.querySelector('#btn-painel-detalhes');
  const painelDetalhes = document.querySelector('#painel-detalhes-match');
  if (
    botaoDetalhes !== null &&
    painelDetalhes !== null &&
    !painelDetalhes.hidden &&
    evento.target.closest('#painel-detalhes-match') === null &&
    evento.target.closest('#btn-painel-detalhes') === null
  ) {
    alternarPainelDetalhes(false, false);
  }

  if (evento.target.closest('.navbar-principal') === null) {
    fecharMenuHamburguerMobile(false);
  }
}

// Desafio Extra (Aula 12): Atalhos de teclado (Escape fecha painéis e '/' foca busca)
function lidarAtalhosTeclado(evento) {
  if (evento.key === 'Escape') {
    const painelDetalhes = document.querySelector('#painel-detalhes-match');
    if (painelDetalhes !== null && !painelDetalhes.hidden) {
      alternarPainelDetalhes(false, true);
      return;
    }

    fecharMenuHamburguerMobile(true);
    return;
  }

  if (evento.key === '/') {
    const elementoFocado = document.activeElement;
    const estaEmCampoTexto =
      elementoFocado !== null &&
      (elementoFocado.tagName === 'INPUT' ||
        elementoFocado.tagName === 'TEXTAREA' ||
        elementoFocado.tagName === 'SELECT' ||
        elementoFocado.isContentEditable);

    if (estaEmCampoTexto) return;

    const campoBusca = document.querySelector('#busca-vagas');
    if (campoBusca !== null) {
      evento.preventDefault();
      campoBusca.focus();
    }
  }
}

/* ==========================================================================
   BLOCO 4: Funções iniciar...() por Recurso (Passo 11 — Sem Duplicidade)
   ========================================================================== */

function iniciarListaVagas() {
  const listaElemento = document.querySelector('#lista-vagas-dom');
  if (listaElemento !== null) {
    listaElemento.addEventListener('click', lidarCliqueListaVagas);
  }
}

function iniciarFiltrosBusca() {
  const campoBusca = document.querySelector('#busca-vagas');
  if (campoBusca !== null) {
    campoBusca.addEventListener('input', lidarBuscaVagas);
  }

  const selectModalidade = document.querySelector('#filtro-modalidade');
  if (selectModalidade !== null) {
    selectModalidade.addEventListener('change', lidarFiltroModalidade);
  }
}

function iniciarControlesEstado() {
  const botaoRecomendadas = document.querySelector('#btn-filtro-recomendadas');
  if (botaoRecomendadas !== null) {
    botaoRecomendadas.addEventListener('click', lidarToggleSomenteRecomendadas);
  }

  const botaoDetalhes = document.querySelector('#btn-painel-detalhes');
  if (botaoDetalhes !== null) {
    botaoDetalhes.addEventListener('click', lidarTogglePainelDetalhes);
  }
}

function iniciarFormulariosPortal() {
  const formVaga = document.querySelector('#form-cadastro-vaga');
  if (formVaga !== null) {
    formVaga.addEventListener('submit', lidarSubmitCadastroVaga);
  }

  const formCandidato = document.querySelector('#form-candidato');
  if (formCandidato !== null) {
    formCandidato.addEventListener('submit', lidarSubmitCandidato);
  }
}

function iniciarAvisoTopo() {
  const botaoFecharAviso = document.querySelector('#btn-fechar-aviso');
  if (botaoFecharAviso !== null) {
    botaoFecharAviso.addEventListener('click', lidarFecharAvisoTopo);
  }
}

function iniciarMenuHamburguer() {
  const botaoHamburguer = document.querySelector('.botao-hamburguer');
  const menuLista = document.querySelector('#menu-principal-lista');
  if (botaoHamburguer === null || menuLista === null) return;

  const telaEstreitaInicial = window.innerWidth <= 768;
  botaoHamburguer.setAttribute('aria-expanded', String(!telaEstreitaInicial));
  if (!telaEstreitaInicial) {
    botaoHamburguer.classList.add('menu-ativo');
  }

  botaoHamburguer.addEventListener('click', lidarToggleMenuHamburguer);
  menuLista.addEventListener('click', lidarCliqueLinkMenu);
}

function iniciarAtalhosECliqueFora() {
  document.addEventListener('click', lidarCliqueForaComponentes);
  document.addEventListener('keydown', lidarAtalhosTeclado);
}

// Inicialização única dos recursos e primeira renderização da página
iniciarListaVagas();
iniciarFiltrosBusca();
iniciarControlesEstado();
iniciarFormulariosPortal();
iniciarAvisoTopo();
iniciarMenuHamburguer();
iniciarAtalhosECliqueFora();

sincronizarTabelaVagasHtml();
desenhar();
