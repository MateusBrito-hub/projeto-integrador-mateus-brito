/* ==========================================================================
   Análise de Compatibilidade, Recomendação (> 70%) e Manipulação de DOM
   SkillMatch Vagas — Aula 11 (js/script.js)
   ========================================================================== */

// Passo 1: Dados iniciais (mínimo de 5 objetos com 3+ propriedades em camelCase e sem acentos)
const vagasPortalDom = [
  {
    id: 101,
    titulo: 'Desenvolvedor(a) Front-end Júnior',
    empresa: 'TechNova Solutions',
    modalidade: 'Remoto',
    nivel: 'Junior',
    salario: 4200,
    skillsSolicitadas: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Acessibilidade']
  },
  {
    id: 102,
    titulo: 'Engenheiro(a) Front-end Pleno',
    empresa: 'InovaWeb Brasil',
    modalidade: 'Hibrido',
    nivel: 'Pleno',
    salario: 7500,
    skillsSolicitadas: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Acessibilidade', 'React']
  },
  {
    id: 103,
    titulo: 'Especialista em Interfaces Acessíveis',
    empresa: 'Portal Inclusivo Tech',
    modalidade: 'Remoto',
    nivel: 'Senior',
    salario: 8200,
    skillsSolicitadas: ['HTML5', 'CSS3', 'Acessibilidade', 'Git']
  },
  {
    id: 104,
    titulo: 'Analista de UI/UX & Front-end',
    empresa: 'Studio Digital Pulse',
    modalidade: 'Remoto',
    nivel: 'Pleno',
    salario: 5800,
    skillsSolicitadas: ['HTML5', 'CSS3', 'Acessibilidade', 'TypeScript', 'React']
  },
  {
    id: 105,
    titulo: 'Desenvolvedor(a) Full Stack Web',
    empresa: 'DataCore Sistemas',
    modalidade: 'Presencial',
    nivel: 'Pleno',
    salario: 9000,
    skillsSolicitadas: ['JavaScript', 'React', 'TypeScript', 'SQL', 'Git']
  },
  {
    id: 106,
    titulo: 'Desenvolvedor(a) Web Estágio / Trainee',
    empresa: 'StartUp Impulso',
    modalidade: 'Hibrido',
    nivel: 'Estagio',
    salario: 2800,
    skillsSolicitadas: ['HTML5', 'CSS3', 'JavaScript', 'Git']
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
  vagasAplicadasIds: []
};

/* ==========================================================================
   BLOCO 1: Funções Puras de Cálculo, Fábrica com Closure e Classificação
   (Separadas das funções que manipulam o DOM — Passo 2, Passo 3 e Passo 10)
   ========================================================================== */

// Passo 2: Função pura que processa/calcula a compatibilidade entre as skills da vaga e do candidato
// Possui parâmetro com valor padrão e NÃO altera os arrays recebidos.
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

// Desafio Extra (Aula 11): Fábrica com closure que recebe o limite de recomendação (padrão 70%)
// e devolve a função classificadora já configurada com esse corte.
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

// Passo 3: Função que classifica ou formata o resultado em 3 faixas na ordem correta
const classificarCompatibilidadeSetentaPorcento = criarClassificadorPorMeta(70);

function classificarFaixaCompatibilidade(percentualMatch, metaMinima = 70) {
  const classificador = criarClassificadorPorMeta(metaMinima);
  return classificador(percentualMatch);
}

// Passo 5: Processamento com map, filter, reduce e cópia segura antes de sort
function analisarListaDeVagas(listaVagas, skillsCandidato) {
  // 1) map: gera um novo array com os dados calculados e classificados de cada vaga
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

  // Cópia antes do sort para NÃO alterar o array original (Erro 4 evitado)
  const vagasOrdenadasPorMatch = [...vagasProcessadas].sort(
    (a, b) => b.percentualMatch - a.percentualMatch
  );

  // 2) filter: separa apenas as vagas recomendadas (compatibilidade > 70%)
  const vagasRecomendadas = vagasOrdenadasPorMatch.filter(
    (item) => item.recomendada === true
  );

  // 3) reduce: calcula estatísticas de resumo (soma de percentuais, contagem de recomendadas e maior match)
  const estatisticas = vagasOrdenadasPorMatch.reduce(
    (acumulador, item) => {
      acumulador.somaPercentuais += item.percentualMatch;
      acumulador.somaSalarios += item.salario;
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
      somaSalarios: 0,
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

  // Desafio Extra (Aula 11): Agrupamento por modalidade com reduce
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

// Passo 4: Testes das funções puras no console com diferentes valores antes de ligar à página
console.group('=== Testes Unitários de Funções Puras (Aula 11 - js/script.js) ===');
const testeCalculo1 = calcularCompatibilidadeSkills(vagasPortalDom[0], [
  'HTML5',
  'CSS3',
  'JavaScript',
  'Git'
]);
const testeCalculo2 = calcularCompatibilidadeSkills(vagasPortalDom[4], [
  'HTML5',
  'CSS3'
]);
console.log('Teste 1 calcularCompatibilidadeSkills (esperado 80%):', testeCalculo1);
console.log('Teste 2 calcularCompatibilidadeSkills (esperado 0%):', testeCalculo2);
console.log(
  'Teste 1 classificarFaixaCompatibilidade(80) [>70%]:',
  classificarFaixaCompatibilidade(80)
);
console.log(
  'Teste 2 classificarFaixaCompatibilidade(60) [50% a 70%]:',
  classificarFaixaCompatibilidade(60)
);
console.log(
  'Teste 3 classificarFaixaCompatibilidade(35) [<50%]:',
  classificarFaixaCompatibilidade(35)
);
console.groupEnd();

/* ==========================================================================
   BLOCO 2: Funções de Manipulação do DOM (createElement, textContent, classList, append)
   ========================================================================== */

// Passo 7 e Passo 8: Função que cria o elemento DOM de cada vaga usando createElement, textContent e classList.add
function criarElementoCardVaga(vagaAnalisada) {
  const artigo = document.createElement('article');
  artigo.classList.add('card-resultado-dom', vagaAnalisada.classeFaixa);

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

  const jaAplicou = estadoPortal.vagasAplicadasIds.includes(vagaAnalisada.id);
  const botaoAplicar = document.createElement('button');
  botaoAplicar.type = 'button';
  botaoAplicar.classList.add('btn-aplicar-vaga');

  if (jaAplicou) {
    botaoAplicar.classList.add('btn-aplicado');
    botaoAplicar.textContent = `Candidatura Enviada (${vagaAnalisada.percentualMatch}% Match)`;
  } else {
    botaoAplicar.textContent = vagaAnalisada.recomendada
      ? 'Candidatar-se Agora (Vaga Recomendada > 70%)'
      : 'Candidatar-se para esta Vaga';
  }

  botaoAplicar.addEventListener('click', () => {
    if (!estadoPortal.vagasAplicadasIds.includes(vagaAnalisada.id)) {
      estadoPortal.vagasAplicadasIds.push(vagaAnalisada.id);
    }
    renderizarPainelResultadosDom();
  });

  artigo.append(topoDiv, botaoAplicar);
  return artigo;
}

// Atualiza também a tabela HTML de vagas quando uma nova vaga é cadastrada
function sincronizarTabelaVagasHtml() {
  const corpoTabela = document.querySelector('.tabela-vagas tbody');
  if (corpoTabela === null) return;

  corpoTabela.textContent = '';

  for (const vaga of vagasPortalDom) {
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
    corpoTabela.append(tr);
  }
}

// Passo 6, Passo 7, Passo 8 e Passo 9: Seleciona #resultado (confirmando !== null) e insere elementos e resumo
function renderizarPainelResultadosDom() {
  const secaoResultado = document.querySelector('#resultado');
  if (secaoResultado === null) {
    console.error('[SkillMatch DOM] Elemento #resultado não encontrado na página.');
    return;
  }

  secaoResultado.textContent = '';

  const analise = analisarListaDeVagas(
    vagasPortalDom,
    estadoPortal.candidatoAtual.skills
  );

  const cabecalhoSecao = document.createElement('h2');
  cabecalhoSecao.textContent =
    'Painel de Compatibilidade de Skills e Vagas Recomendadas (> 70%)';

  // Passo 9: Resumo gerado com reduce inserido na página
  const caixaResumo = document.createElement('div');
  caixaResumo.classList.add('resumo-painel');

  const linhaCandidato = document.createElement('p');
  linhaCandidato.textContent = `Perfil ativo: ${estadoPortal.candidatoAtual.nome} (${estadoPortal.candidatoAtual.email}) | Skills do candidato: ${estadoPortal.candidatoAtual.skills.join(', ')}`;

  const linhaMetricas = document.createElement('p');
  linhaMetricas.textContent = `Resumo (via reduce): ${analise.totalVagas} vagas analisadas | ${analise.totalRecomendadas} vagas RECOMENDADAS (> 70% de compatibilidade) | Média geral de compatibilidade: ${analise.mediaMatch}% | Maior Match: ${analise.melhorVagaTitulo} (${analise.maiorMatch}%)`;

  const linhaAplicacoes = document.createElement('p');
  linhaAplicacoes.textContent = `Candidaturas realizadas nesta sessão: ${estadoPortal.vagasAplicadasIds.length} vaga(s).`;

  caixaResumo.append(linhaCandidato, linhaMetricas, linhaAplicacoes);

  // Subtítulo destacando o subconjunto filtrado com filter (> 70%)
  const subtituloRecomendadas = document.createElement('h3');
  subtituloRecomendadas.textContent = `Vagas Recomendadas para Você (Compatibilidade > 70% — ${analise.vagasRecomendadas.length} encontrada(s))`;

  const descricaoFiltro = document.createElement('p');
  if (analise.vagasRecomendadas.length > 0) {
    const nomesRecomendadas = analise.vagasRecomendadas
      .map((v) => `${v.titulo} (${v.percentualMatch}%)`)
      .join(' • ');
    descricaoFiltro.textContent = `Destaques recomendados (> 70%): ${nomesRecomendadas}`;
  } else {
    descricaoFiltro.textContent =
      'Nenhuma vaga atingiu mais de 70% com as skills atuais. Marque mais skills no formulário de candidato acima para receber recomendações!';
  }

  // Lista completa de cards criada com createElement e inserida com append
  const gradeCardsDom = document.createElement('div');
  gradeCardsDom.classList.add('lista-resultados-dom');

  for (const itemVaga of analise.vagasOrdenadasPorMatch) {
    const cardElemento = criarElementoCardVaga(itemVaga);
    gradeCardsDom.append(cardElemento);
  }

  // Desafio Extra (Aula 11): Bloco de agrupamento por modalidade gerado com reduce
  const tituloCategorias = document.createElement('h3');
  tituloCategorias.textContent =
    'Resumo Agrupado por Modalidade de Trabalho (reduce)';

  const containerCategorias = document.createElement('div');
  containerCategorias.classList.add('agrupamento-categorias');

  for (const chaveModalidade of Object.keys(analise.agrupadasPorModalidade)) {
    const grupo = analise.agrupadasPorModalidade[chaveModalidade];
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
    containerCategorias.append(blocoCat);
  }

  secaoResultado.append(
    cabecalhoSecao,
    caixaResumo,
    subtituloRecomendadas,
    descricaoFiltro,
    gradeCardsDom,
    tituloCategorias,
    containerCategorias
  );
}

// Integração dos formulários da página:
// 1) Cadastrar nova vaga de emprego com skills solicitadas
// 2) Cadastrar candidato com suas skills, aplicar e recomendar vagas > 70%
function configurarEventosFormulariosPortal() {
  const formVaga = document.querySelector('#form-cadastro-vaga');
  if (formVaga !== null) {
    formVaga.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const inputTitulo = document.querySelector('#vaga-titulo');
      const inputEmpresa = document.querySelector('#vaga-empresa');
      const inputSalario = document.querySelector('#vaga-salario');
      const selectNivel = document.querySelector('#vaga-nivel');
      const radioModalidade = document.querySelector(
        'input[name="vagaModalidade"]:checked'
      );
      const checkboxesSkills = document.querySelectorAll(
        'input[name="vagaSkills"]:checked'
      );

      const skillsEscolhidas = Array.from(checkboxesSkills).map(
        (cb) => cb.value
      );

      if (skillsEscolhidas.length === 0) {
        window.alert(
          'Selecione pelo menos 1 skill técnica solicitada para cadastrar a vaga.'
        );
        return;
      }

      const novaVaga = {
        id: Date.now(),
        titulo: inputTitulo ? inputTitulo.value.trim() : 'Nova Vaga',
        empresa: inputEmpresa ? inputEmpresa.value.trim() : 'Empresa Parceira',
        modalidade: radioModalidade ? radioModalidade.value : 'Remoto',
        nivel: selectNivel && selectNivel.value ? selectNivel.value : 'Junior',
        salario: inputSalario ? Number(inputSalario.value) || 3500 : 3500,
        skillsSolicitadas: skillsEscolhidas
      };

      vagasPortalDom.push(novaVaga);
      sincronizarTabelaVagasHtml();
      renderizarPainelResultadosDom();
      formVaga.reset();

      const secaoResultado = document.querySelector('#resultado');
      if (secaoResultado !== null) {
        secaoResultado.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const formCandidato = document.querySelector('#form-candidato');
  if (formCandidato !== null) {
    formCandidato.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const inputNome = document.querySelector('#cand-nome');
      const inputEmail = document.querySelector('#cand-email');
      const selectArea = document.querySelector('#cand-area');
      const radioRegime = document.querySelector(
        'input[name="candRegime"]:checked'
      );
      const checkboxesCandSkills = document.querySelectorAll(
        'input[name="candSkills"]:checked'
      );

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

      // Aplica automaticamente nas vagas recomendadas (> 70% de compatibilidade)
      const analiseAtual = analisarListaDeVagas(
        vagasPortalDom,
        estadoPortal.candidatoAtual.skills
      );
      for (const vagaRec of analiseAtual.vagasRecomendadas) {
        if (!estadoPortal.vagasAplicadasIds.includes(vagaRec.id)) {
          estadoPortal.vagasAplicadasIds.push(vagaRec.id);
        }
      }

      renderizarPainelResultadosDom();

      const secaoResultado = document.querySelector('#resultado');
      if (secaoResultado !== null) {
        secaoResultado.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const botaoFecharAviso = document.querySelector('#btn-fechar-aviso');
  const blocoAviso = document.querySelector('#aviso-match');
  if (botaoFecharAviso !== null && blocoAviso !== null) {
    botaoFecharAviso.addEventListener('click', () => {
      blocoAviso.hidden = true;
    });
  }

  // Controle interativo do botão de menu hambúrguer e links da navbar
  const botaoHamburguer = document.querySelector('.botao-hamburguer');
  const menuLista = document.querySelector('#menu-principal-lista');

  if (botaoHamburguer !== null && menuLista !== null) {
    // Define estado inicial coerente com a largura da janela
    const telaEstreitaInicial = window.innerWidth <= 768;
    botaoHamburguer.setAttribute(
      'aria-expanded',
      telaEstreitaInicial ? 'false' : 'true'
    );
    if (!telaEstreitaInicial) {
      botaoHamburguer.classList.add('menu-ativo');
    }

    botaoHamburguer.addEventListener('click', () => {
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
      botaoHamburguer.setAttribute(
        'aria-expanded',
        abertoAgora ? 'true' : 'false'
      );
      botaoHamburguer.setAttribute(
        'aria-label',
        abertoAgora ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
      );
    });

    // Atualiza o item .ativo ao clicar nos links do menu e recolhe o menu em telas estreitas
    const linksMenu = menuLista.querySelectorAll('a');
    for (const link of linksMenu) {
      link.addEventListener('click', () => {
        for (const outroLink of linksMenu) {
          outroLink.classList.remove('ativo');
          outroLink.removeAttribute('aria-current');
        }
        link.classList.add('ativo');
        link.setAttribute('aria-current', 'page');

        if (window.innerWidth <= 768) {
          menuLista.classList.remove('menu-aberto');
          botaoHamburguer.classList.remove('menu-ativo');
          botaoHamburguer.setAttribute('aria-expanded', 'false');
          botaoHamburguer.setAttribute('aria-label', 'Abrir menu de navegação');
        }
      });
    }
  }
}

sincronizarTabelaVagasHtml();
renderizarPainelResultadosDom();
configurarEventosFormulariosPortal();
