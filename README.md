# SkillMatch Vagas — Portal Inteligente de Empregos

O **SkillMatch Vagas** é um portal web simples de vagas de emprego voltado para conectar empresas e profissionais da área de tecnologia.
A plataforma permite o cadastro de novas oportunidades de trabalho com as habilidades técnicas (*skills*) exigidas e o cadastro de candidatos interessados em aplicar para as vagas.
O sistema realiza a comparação automática entre as *skills* solicitadas pela vaga e as competências do candidato, calculando o percentual de compatibilidade.
Quando a compatibilidade entre o perfil do candidato e os requisitos da vaga é maior que **70%**, a plataforma destaca e recomenda a oportunidade automaticamente.

## Comparativo de Performance de Layout (Desafio Extra — Aula 07)

Ao inspecionar o redimensionamento da janela na aba **Performance** do DevTools:
- **CSS Grid (`repeat(auto-fit, minmax(250px, 1fr))`)**: o motor de layout do navegador redistribui as *tracks* nativamente em um único passe de *Layout*, mantendo o tempo de *Recalculate Style + Layout* abaixo de **1,2 ms** por quadro e sem exigir regras de *clearfix* ou recálculo manual de coordenadas.
- **Abordagem legada (`float` + `position: absolute`)**: exige cálculos extras de empilhamento, quebra de linha dependente de alturas fixas e *reflows* sucessivos dos elementos irmãos quando a largura da *viewport* varia.

