/* ==========================================================================
   Mini-Analisador de Dados — SkillMatch Vagas (Aula 09: Lógica com JavaScript)
   ==========================================================================
   - Tema: Portal de Vagas de Emprego com Recomendação por Compatibilidade de Skills (> 70%).
   - Entrada:
     1) Lista de vagas abertas (array de objetos) e lista de skills do candidato.
     2) Parâmetro numérico lido via prompt() indicando a meta mínima de compatibilidade
        (padrão: 70%), validando null (Cancelar), string vazia, NaN e faixa (1 a 100).
     3) Comando interativo lido em laço do...while ("1" listar, "2" resumir, "3" ou "sair").
   - Processamento:
     1) Para cada vaga, calcula o percentual de skills compatíveis em relação às solicitadas.
     2) Classifica cada vaga com if / else if / else em 4 faixas de aderência (destacando > 70%).
     3) Usa switch sobre a modalidade da vaga para orientar a logística de trabalho.
     4) Resume o conjunto com laço for...of usando 4 padrões (contador de recomendadas,
        acumulador de salários/compatibilidade, cálculo de média e busca da vaga de maior match).
   - Saída esperada:
     Frases formatadas com template literals no console e tabela estruturada via console.table().

   Pseudocódigo (6 linhas):
   1. INICIAR array catalogoVagasLogica (6 vagas) e array skillsCandidatoPadrao
   2. LER entradaMeta via prompt(), aplicar ?? "70", converter com Number() e validar faixa [1..100]
   3. PARA CADA vaga de catalogoVagasLogica: calcular percentualMatch e classificar faixa (> 70% = Recomendada)
   4. APLICAR switch na modalidade da vaga e acumular totalRecomendadas, somaPercentuais e maiorMatch
   5. EXIBIR relatório detalhado com console.table() e resumo estatístico com template literals
   6. REPETIR menu interativo (do...while) lendo opção via prompt() até que opção === "3" ou "sair"
   ========================================================================== */

const skillsCandidatoAnalise = [
  'HTML5',
  'CSS3',
  'JavaScript',
  'Git',
  'Acessibilidade'
];

const catalogoVagasLogica = [
  {
    id: 1,
    titulo: 'Desenvolvedor Front-end Junior',
    empresa: 'TechNova Solutions',
    modalidade: 'Remoto',
    salario: 4200,
    totalSkillsSolicitadas: 5,
    skillsCompativeis: 4
  },
  {
    id: 2,
    titulo: 'Engenheiro Front-end Pleno',
    empresa: 'InovaWeb Brasil',
    modalidade: 'Hibrido',
    salario: 7500,
    totalSkillsSolicitadas: 6,
    skillsCompativeis: 5
  },
  {
    id: 3,
    titulo: 'Analista de UI/UX e Front-end',
    empresa: 'Studio Digital Pulse',
    modalidade: 'Remoto',
    salario: 5800,
    totalSkillsSolicitadas: 5,
    skillsCompativeis: 3
  },
  {
    id: 4,
    titulo: 'Especialista em Acessibilidade Web',
    empresa: 'Portal Inclusivo Tech',
    modalidade: 'Remoto',
    salario: 8200,
    totalSkillsSolicitadas: 4,
    skillsCompativeis: 4
  },
  {
    id: 5,
    titulo: 'Desenvolvedor Full Stack Node/React',
    empresa: 'DataCore Sistemas',
    modalidade: 'Presencial',
    salario: 9000,
    totalSkillsSolicitadas: 6,
    skillsCompativeis: 2
  },
  {
    id: 6,
    titulo: 'Desenvolvedor Web Trainee',
    empresa: 'StartUp Impulso',
    modalidade: 'Hibrido',
    salario: 3200,
    totalSkillsSolicitadas: 4,
    skillsCompativeis: 3
  }
];

/* ==========================================================================
   Teste de Mesa (Seção 13.1 — Três primeiras voltas do laço principal)
   Considerando metaCorte = 70:
   +-------+--------------------------------+-------------------+------------------+-----------------------------+-------------------+
   | Volta | Vaga (titulo)                  | Compativeis/Total | percentualMatch  | Classificacao (if/else if)  | contRecomendadas  |
   +-------+--------------------------------+-------------------+------------------+-----------------------------+-------------------+
   |   1   | Desenvolvedor Front-end Junior |       4 / 5       |      80.0%       | Recomendada (Match Alto)    |         1         |
   |   2   | Engenheiro Front-end Pleno     |       5 / 6       |      83.3%       | Recomendada (Match Alto)    |         2         |
   |   3   | Analista de UI/UX e Front-end  |       3 / 5       |      60.0%       | Compatibilidade Parcial     |         2         |
   +-------+--------------------------------+-------------------+------------------+-----------------------------+-------------------+
   ========================================================================== */

function executarAnaliseLogicaVagas(usarPromptInterativo = false) {
  let entradaBruta = '70';

  if (usarPromptInterativo && typeof window !== 'undefined' && typeof window.prompt === 'function') {
    const respostaUsuario = window.prompt(
      'Informe o percentual mínimo de compatibilidade para recomendação (1 a 100).\nDeixe em branco ou cancele para usar o padrão de 70%:',
      '70'
    );
    // Desafio Extra: Uso de coalescência nula (??) para definir valor padrão quando a entrada for null
    entradaBruta = respostaUsuario ?? '70';
  }

  const textoLimpo = entradaBruta.trim();
  const numeroConvertido = Number(textoLimpo);

  // Passo 3: Validação rigorosa de null/vazio, NaN e faixa numérica [1..100] antes de qualquer conta (Erro 2 evitado)
  const entradaValida =
    textoLimpo !== '' &&
    !Number.isNaN(numeroConvertido) &&
    numeroConvertido >= 1 &&
    numeroConvertido <= 100;

  // Desafio Extra: Operador ternário para definir a meta final de corte
  const metaCorte = entradaValida ? numeroConvertido : 70;

  if (!entradaValida) {
    console.warn(
      `[SkillMatch Lógica] Entrada "${entradaBruta}" inválida ou fora da faixa (1..100). Utilizando o corte padrão de ${metaCorte}%.`
    );
  }

  const relatorioAnalise = [];
  let contadorRecomendadas = 0;
  let contadorAbaixoMeta = 0;
  let somaPercentuais = 0;
  let somaSalariosRecomendadas = 0;
  let vagaMaiorMatch = catalogoVagasLogica[0];
  let maiorPercentualEncontrado = -1;

  // Passo 4, Passo 5 e Passo 6: Laço for...of com classificação if/else if/else, switch e acumuladores
  for (const vaga of catalogoVagasLogica) {
    const percentualExato = (vaga.skillsCompativeis / vaga.totalSkillsSolicitadas) * 100;
    const percentualArredondado = Number(percentualExato.toFixed(1));

    // Cadeia if / else if / else com 4 faixas em ordem decrescente correta e uso de ===
    let faixaCompatibilidade = '';
    let recomendadaAcima70 = false;

    if (percentualArredondado === 100) {
      faixaCompatibilidade = 'Match Perfeito (100% - Recomendada)';
      recomendadaAcima70 = true;
    } else if (percentualArredondado > 70 && percentualArredondado >= metaCorte) {
      faixaCompatibilidade = 'Recomendada (Match Alto > 70%)';
      recomendadaAcima70 = true;
    } else if (percentualArredondado >= 50) {
      faixaCompatibilidade = 'Compatibilidade Parcial (50% a 70%)';
      recomendadaAcima70 = false;
    } else {
      faixaCompatibilidade = 'Baixa Compatibilidade (< 50%)';
      recomendadaAcima70 = false;
    }

    // Passo 5: switch completo sobre propriedade textual (modalidade) com break em todos os cases e default
    let orientacaoModalidade = '';
    switch (vaga.modalidade) {
      case 'Remoto':
        orientacaoModalidade = 'Trabalho 100% remoto com envio de equipamento.';
        break;
      case 'Hibrido':
        orientacaoModalidade = 'Modelo híbrido (2x por semana no escritório).';
        break;
      case 'Presencial':
        orientacaoModalidade = 'Atuação presencial integral na sede da empresa.';
        break;
      default:
        orientacaoModalidade = 'Modalidade a combinar durante a entrevista.';
        break;
    }

    // Passo 6: Padrões de laço (contador, acumulador e máximo)
    somaPercentuais += percentualArredondado;

    if (recomendadaAcima70 === true) {
      contadorRecomendadas += 1;
      somaSalariosRecomendadas += vaga.salario;
    } else {
      contadorAbaixoMeta += 1;
    }

    if (percentualArredondado > maiorPercentualEncontrado) {
      maiorPercentualEncontrado = percentualArredondado;
      vagaMaiorMatch = vaga;
    }

    relatorioAnalise.push({
      id: vaga.id,
      vaga: vaga.titulo,
      empresa: vaga.empresa,
      modalidade: vaga.modalidade,
      skillsMatch: `${vaga.skillsCompativeis}/${vaga.totalSkillsSolicitadas}`,
      compatibilidade: `${percentualArredondado}%`,
      classificacao: faixaCompatibilidade,
      orientacao: orientacaoModalidade
    });
  }

  const mediaCompatibilidade = Number((somaPercentuais / catalogoVagasLogica.length).toFixed(1));

  // Passo 8: Exibição com template literals e console.table()
  console.group('=== Relatório de Análise de Vagas (Aula 09 - js/logica.js) ===');
  console.log(`Skills analisadas do candidato: ${skillsCandidatoAnalise.join(', ')}`);
  console.log(`Meta de recomendação ativa: > ${metaCorte}% de compatibilidade.`);
  console.table(relatorioAnalise);
  console.log(
    `Resumo Geral: ${contadorRecomendadas} vagas recomendadas (> 70%) e ${contadorAbaixoMeta} vagas abaixo da meta.`
  );
  console.log(
    `Média de compatibilidade geral: ${mediaCompatibilidade}% | Soma de salários das vagas recomendadas: R$ ${somaSalariosRecomendadas.toLocaleString('pt-BR')}`
  );
  console.log(
    `Maior índice de Match encontrado: "${vagaMaiorMatch.titulo}" (${vagaMaiorMatch.empresa}) com ${maiorPercentualEncontrado}% de compatibilidade!`
  );
  console.groupEnd();

  return {
    relatorioAnalise,
    contadorRecomendadas,
    contadorAbaixoMeta,
    mediaCompatibilidade,
    maiorPercentualEncontrado,
    vagaMaiorMatch
  };
}

// Passo 7 e Desafio Extra: Menu interativo com do...while e switch atualizando a condição dentro do laço
function iniciarMenuInterativoConsole() {
  let opcaoMenu = '';

  do {
    const entradaMenu = window.prompt(
      'Menu SkillMatch Vagas (Aula 09):\n' +
        '1 — Listar vagas e compatibilidade no console\n' +
        '2 — Resumir indicadores com novo filtro de corte\n' +
        '3 — Sair (ou digite "sair")',
      '3'
    );

    // Coalescência nula (??): se o usuário cancelar (null), assume "sair" para evitar loop infinito (Erro 4 evitado)
    opcaoMenu = (entradaMenu ?? 'sair').trim().toLowerCase();

    switch (opcaoMenu) {
      case '1':
      case 'listar': {
        const dados = executarAnaliseLogicaVagas(false);
        window.alert(
          `Listagem concluída no Console (F12)!\nTotal de vagas analisadas: ${dados.relatorioAnalise.length}\nRecomendadas (>70%): ${dados.contadorRecomendadas}`
        );
        break;
      }
      case '2':
      case 'resumir': {
        const resumo = executarAnaliseLogicaVagas(true);
        window.alert(
          `Resumo SkillMatch:\n` +
            `• Vagas Recomendadas (>70%): ${resumo.contadorRecomendadas}\n` +
            `• Média Geral de Match: ${resumo.mediaCompatibilidade}%\n` +
            `• Top Vaga: ${resumo.vagaMaiorMatch.titulo} (${resumo.maiorPercentualEncontrado}%)`
        );
        break;
      }
      case '3':
      case 'sair':
        console.log('[SkillMatch Lógica] Menu interativo encerrado pelo usuário.');
        break;
      default:
        window.alert('Opção inválida! Digite 1 (listar), 2 (resumir) ou 3 / "sair".');
        break;
    }
  } while (opcaoMenu !== '3' && opcaoMenu !== 'sair');
}

// Executa a análise padrão automaticamente ao carregar a página para exibir o console.table imediato no F12
executarAnaliseLogicaVagas(false);

// Associa botão opcional na página caso o visitante queira testar o prompt/menu interativo (do...while)
if (typeof document !== 'undefined') {
  const botaoMenuLogica = document.getElementById('btn-menu-logica');
  if (botaoMenuLogica) {
    botaoMenuLogica.addEventListener('click', iniciarMenuInterativoConsole);
  }
}
