# Especificação de Produto — Weather App

## Overview

O Weather App é uma aplicação web responsiva para consulta do clima de uma cidade selecionada. A primeira versão permite buscar manualmente uma cidade, consultar as condições atuais e a previsão diária de cinco datas consecutivas (hoje e os quatro dias seguintes no calendário local da cidade) e alternar temperaturas entre Celsius e Fahrenheit. A interface será em português do Brasil (pt-BR), com Celsius como unidade inicial.

A fonte de dados definida é Open-Meteo, sem API key. O produto não terá autenticação, coleta de localização, cache meteorológico ou persistência de estado após recarregar. A experiência deve priorizar leitura rápida, acessibilidade e uso em dispositivos móveis.

As personas descritas no discovery são hipóteses. Esta especificação fecha as decisões necessárias ao desenvolvimento do MVP. Alterações posteriores de escopo ou dos baselines abaixo exigem revisão da spec e dos testes associados.

## Functional Requirements

### FR-01 — Buscar e selecionar cidade

O usuário deve poder submeter manualmente um nome de cidade por botão ou Enter. O app remove espaços externos, preserva acentos e caracteres internos, e pesquisa usando geocodificação Open-Meteo. Exibe os resultados retornados pela fonte em sua ordem original, com cidade e região/país quando disponíveis. A seleção de um resultado inicia as consultas meteorológicas para as coordenadas desse resultado; não se deve consultar apenas pelo texto digitado. Geolocalização automática não faz parte do MVP.

**Critérios de aceite relacionados:** AC-01, AC-02, AC-03, AC-16, AC-19.

### FR-02 — Consultar clima atual

Após selecionar uma cidade, o app deve exibir temperatura do ar, temperatura aparente e condição do tempo. Códigos meteorológicos da Open-Meteo devem ser apresentados como descrições em pt-BR usando a interpretação WMO correspondente. Umidade relativa (%), velocidade do vento (km/h), precipitação (mm) e pressão ao nível médio do mar (hPa) são opcionais e devem ser omitidas quando indisponíveis; direção do vento, quando disponível, é apresentada como ponto cardeal de 8 direções, arredondada ao setor mais próximo. Cidade, país/região disponíveis, unidade e horário local da referência devem acompanhar os dados. O app não deve descrever a previsão atual como observação de estação meteorológica.

**Critérios de aceite relacionados:** AC-04, AC-05, AC-18, AC-23, AC-24.

### FR-03 — Consultar previsão de cinco dias

Para a cidade selecionada, o app deve apresentar cinco datas consecutivas: hoje e os quatro dias seguintes no fuso horário local fornecido pela resposta meteorológica. Cada dia inclui temperatura mínima, máxima e condição geral; quando a fonte fornecer probabilidade máxima de precipitação, ela deve ser apresentada como percentual. Se o valor estiver indisponível, a interface deve omiti-lo. Se não houver fuso local válido, a previsão deve entrar em estado de erro, sem usar silenciosamente o fuso do dispositivo.

**Critérios de aceite relacionados:** AC-06, AC-07, AC-18, AC-20, AC-23, AC-28.

### FR-04 — Alternar unidade de temperatura

O usuário deve poder alternar entre Celsius e Fahrenheit. A alteração atualiza todas as temperaturas visíveis sem nova requisição meteorológica. A preferência vale durante a sessão e também após selecionar outra cidade; recarregar a página restaura Celsius.

**Critérios de aceite relacionados:** AC-08, AC-09, AC-22.

### FR-05 — Usar a experiência em diferentes telas

O app deve permanecer legível e operável em smartphones, tablets e desktops, com controles utilizáveis por toque em dispositivos móveis.

**Critérios de aceite relacionados:** AC-10, AC-11.

### FR-06 — Comunicar carregamento e falhas

O app deve indicar carregamento durante consultas e comunicar falhas de rede, indisponibilidade da fonte, respostas inválidas e timeout. Cada requisição tem timeout de 8 segundos; não há retry automático. A interface oferece nova tentativa manual e ignora respostas tardias de uma tentativa expirada ou superada por busca mais recente.

**Critérios de aceite relacionados:** AC-12, AC-13, AC-17, AC-21, AC-27.

### FR-07 — Orientar estado inicial e ausência de resultados

Antes da seleção de uma cidade, o app deve mostrar um estado inicial que oriente a busca. Quando uma busca válida não encontrar cidades, deve informar que não houve resultados e permitir nova busca.

**Critérios de aceite relacionados:** AC-14, AC-15.

## User Stories

As personas abaixo são hipóteses do discovery, não segmentos validados por pesquisa. Cada história está ligada ao requisito funcional que atende.

| ID | User story | Requisito funcional |
|---|---|---|
| US-01 | Como **Marina, pessoa em deslocamento**, quero buscar minha cidade pelo nome para consultar rapidamente o clima antes de sair. | FR-01 — Buscar cidade |
| US-02 | Como **Lúcia, viajante entre cidades**, quero distinguir resultados com nomes semelhantes pela região ou país para escolher a localidade correta. | FR-01 — Buscar cidade |
| US-03 | Como **Marina, pessoa em deslocamento**, quero ver o clima atual da cidade selecionada para decidir como me preparar para o dia. | FR-02 — Consultar clima atual |
| US-04 | Como **Rafael, quem planeja o dia**, quero consultar a previsão de hoje e dos quatro dias seguintes para organizar minhas atividades. | FR-03 — Consultar previsão de cinco dias |
| US-05 | Como **Rafael, quem planeja o dia**, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas na unidade que prefiro. | FR-04 — Alternar unidade de temperatura |
| US-06 | Como **Marina, pessoa em deslocamento**, quero usar busca, seleção e alternância de unidade em uma tela mobile para consultar o clima durante meus deslocamentos. | FR-05 — Usar a experiência em diferentes telas |
| US-07 | Como **Lúcia, viajante entre cidades**, quero receber uma mensagem clara e poder tentar novamente quando uma consulta falhar para continuar meu planejamento. | FR-06 — Comunicar carregamento e falhas |
| US-08 | Como **Marina, pessoa em deslocamento**, quero receber orientação quando ainda não escolhi uma cidade ou quando minha busca não encontra resultados para saber como prosseguir. | FR-07 — Orientar estado inicial e ausência de resultados |

## Acceptance Criteria

Os critérios abaixo usam **Given / When / Then** (Dado / Quando / Então) e definem resultados observáveis. Testes de integração e E2E devem usar respostas de rede determinísticas, sem depender de chamadas à API real. Em critérios que mencionam dados fornecidos pela fonte, os testes devem controlar esses dados por fixtures.

| ID | Requisito | Given | When | Then |
|---|---|---|---|---|
| AC-01 | FR-01 | Existe uma fixture com resultados de geocodificação para uma consulta conhecida. | O usuário submete o nome por botão ou Enter. | O app exibe cada resultado da fixture na mesma ordem e cada opção pode ser selecionada. |
| AC-02 | FR-01 | A fixture contém localidades com o mesmo nome e valores distintos de região/país. | O app exibe os resultados. | Cada opção exibe todos os campos de desambiguação disponíveis entre região e país; nenhum dos resultados é selecionado automaticamente. |
| AC-03 | FR-01 | A fixture de geocodificação retorna uma lista vazia. | O usuário pesquisa uma cidade inexistente. | O app informa que nenhuma cidade foi encontrada, mantém o termo pesquisado no campo de busca e não envia uma consulta meteorológica. |
| AC-04 | FR-02 | Uma cidade foi selecionada; relógio e fuso da fixture estão fixos; a resposta atual tem temperatura do ar, temperatura aparente, condição e horário de referência conhecidos. | A consulta atual termina com sucesso. | O app apresenta os valores nos campos rotulados, condição traduzida para pt-BR, horário local no formato `dd/MM/yyyy HH:mm` com timezone e temperaturas em °C conforme NFR-04. |
| AC-05 | FR-02 | A resposta atual contém os campos essenciais válidos, mas omite um ou mais campos opcionais. | A consulta atual termina com sucesso. | Campos opcionais ausentes entre umidade, vento, precipitação e pressão não aparecem como valores, zero ou texto vazio; os campos essenciais continuam visíveis. Quando presentes, umidade usa `%`, vento usa `km/h` e direção cardeal, precipitação usa `mm` e pressão usa `hPa`. |
| AC-06 | FR-03 | O relógio de teste está fixo em `2026-01-11T01:30:00Z`; a fixture fornece timezone `America/Sao_Paulo` e dados para 10 a 14 de janeiro de 2026. | A consulta de previsão termina com sucesso. | O app mostra exatamente as datas locais 10, 11, 12, 13 e 14 de janeiro de 2026, em ordem, sem usar a data UTC ou o timezone do navegador. |
| AC-07 | FR-03 | A fixture fornece mínima, máxima e condição geral distintas para cada uma das cinco datas. | A previsão é exibida. | Cada data aparece uma vez no formato `dd/MM/yyyy`; os valores mínimo, máximo e condição correspondem à mesma data da fixture. |
| AC-08 | FR-04 | Valores Celsius conhecidos 0, 20 e -10 aparecem em clima atual e previsão; o contador de chamadas meteorológicas está registrado. | O usuário seleciona Fahrenheit. | Todos os valores passam a 32, 68 e 14 °F, respectivamente, arredondados ao inteiro mais próximo; o contador de chamadas não muda. |
| AC-09 | FR-04 | Os valores-base Celsius continuam preservados após a conversão para Fahrenheit. | O usuário seleciona Celsius, inclusive após alternar unidades dez vezes. | Todos os valores retornam aos valores-base Celsius, sem acumular arredondamento. |
| AC-10 | FR-05 | A página é aberta nos viewports de 320, 375, 768, 1024 e 1440 CSS px. | O teste verifica controles da busca, resultados, dados e unidade. | Em cada largura, nenhum controle essencial está cortado e `document.documentElement.scrollWidth` é igual a `clientWidth`. |
| AC-11 | FR-05 | A página está em viewport de 375 × 667 CSS px com resultado selecionável. | O teste opera busca, seleção e unidade usando eventos de ponteiro/toque. | Cada ação conclui seu resultado esperado; controles essenciais não se sobrepõem nem saem dos limites do viewport. |
| AC-12 | FR-06 | Uma requisição controlada permanece pendente. | O teste consulta a interface antes da resposta e novamente após sucesso ou falha. | Enquanto pendente, existe um elemento `role="status"` com nome acessível; após a conclusão ou timeout, o status de carregamento deixa de ser anunciado. |
| AC-13 | FR-06 | A primeira requisição controlada retorna erro de rede ou HTTP. | O usuário aciona o controle acessível “Tentar novamente”; a segunda requisição retorna sucesso. | A primeira falha é anunciada em pt-BR; exatamente uma nova requisição da mesma operação é enviada; os dados da segunda resposta substituem o estado de erro. |
| AC-14 | FR-07 | O app foi carregado e nenhuma cidade foi selecionada. | A tela inicial é apresentada. | Uma orientação para iniciar a busca está visível e não há dados meteorológicos atribuídos a uma cidade não selecionada. |
| AC-15 | FR-07 | O campo de busca está vazio ou contém somente espaços. | O usuário tenta submeter a busca. | Nenhuma requisição de geocodificação é enviada e o app orienta o usuário a informar o nome de uma cidade. |
| AC-16 | FR-01 | O campo contém ` São João d'Oeste ` e o mock de geocodificação registra parâmetros decodificados. | O usuário submete a busca. | O parâmetro recebido é exatamente `São João d'Oeste` (trim apenas nas bordas), em uma única chamada; o resultado é exibido como texto literal. |
| AC-17 | FR-06 | Uma chamada fica pendente e o relógio falso está no instante de envio. | O teste avança o relógio em 8 segundos. | O app encerra loading, anuncia timeout em pt-BR e mostra “Tentar novamente”; resolver a chamada expirada depois não altera o estado. |
| AC-18 | FR-02, FR-03 | Uma resposta atual não contém temperatura do ar, sensação térmica ou condição; ou um ou mais dias não contêm data, mínima, máxima ou condição. | A resposta parcial é recebida. | No clima atual, a seção mostra “Dados meteorológicos incompletos” e retry. Na previsão, cada dia incompleto é omitido; dias completos continuam visíveis. Se nenhum dia estiver completo, a seção mostra a mesma mensagem e retry. Dados válidos da outra seção permanecem visíveis. |
| AC-19 | FR-01 | A fixture contém duas localidades com coordenadas diferentes e respostas meteorológicas identificáveis. | O usuário seleciona a segunda localidade. | As chamadas de clima atual e previsão usam exatamente as coordenadas da segunda localidade; a interface exibe o nome correspondente. |
| AC-20 | FR-03 | A resposta da previsão não inclui timezone ou inclui um identificador inválido. | A previsão é recebida. | O app não usa o timezone do navegador nem apresenta datas calculadas; a seção mostra “Fuso horário indisponível” e retry, enquanto dados atuais válidos permanecem visíveis. |
| AC-21 | FR-01, FR-06 | A primeira busca de cidade fica pendente; a segunda busca retorna resultados. | A resposta da segunda busca chega antes da resposta da primeira. | Somente os resultados da segunda busca permanecem visíveis; a resposta antiga não altera a lista nem dispara consultas meteorológicas. |
| AC-22 | FR-04 | A unidade foi alterada para Fahrenheit durante a sessão. | O usuário seleciona outra cidade. | A nova cidade é exibida em Fahrenheit sem nova escolha de unidade. |
| AC-23 | FR-02, FR-03 | A fonte retorna código WMO `0` e, em outra fixture, código `999`, sem mapeamento. | O app renderiza clima atual ou previsão. | O código `0` aparece como “Céu limpo”; o código `999` não é inferido e aciona o tratamento de condição incompleta de AC-18. |
| AC-24 | FR-02 | A fixture contém direções de vento 0°, 44°, 46° e 315°. | A seção de vento é exibida. | As direções são apresentadas como N, NE, NE e NW, respectivamente, junto com velocidade em km/h. |
| AC-25 | FR-04 | A unidade está em Fahrenheit e nenhuma cidade está selecionada no início de uma nova página. | O usuário recarrega a aplicação. | A unidade volta a Celsius, o campo de busca está vazio e nenhum dado meteorológico é exibido. |
| AC-26 | FR-04 | A fixture contém temperaturas Celsius 1,5 °C e -1,5 °C. | Os valores são apresentados em Celsius. | A interface exibe 2 °C e -2 °C, respectivamente, segundo a regra de empate afastando-se de zero. |
| AC-27 | FR-06 | A cidade A já foi selecionada e suas consultas meteorológicas estão pendentes; depois, a cidade B é selecionada e suas consultas terminam com sucesso. | As respostas meteorológicas atrasadas da cidade A chegam por último. | Clima atual, previsão e localidade exibidos continuam sendo os da cidade B; nenhuma resposta da cidade A substitui os dados atuais. |
| AC-28 | FR-03 | A fixture diária contém probabilidade máxima de precipitação para alguns dias e omite o campo em outro dia. | A previsão é exibida. | Cada probabilidade disponível é apresentada como percentual inteiro, associada ao seu dia; dias sem o campo não exibem rótulo nem valor de probabilidade. |

## Non-Functional Requirements

Os valores deste quadro são os baselines obrigatórios de validação do MVP.

| ID | Atributo | Requisito |
|---|---|---|
| NFR-01 | Idioma e localização | Toda UI, descrição de condição meteorológica e mensagem de estado/erro é pt-BR. Datas usam `dd/MM/yyyy`, números usam vírgula decimal e horas usam relógio de 24 horas; timezone local é identificado junto ao horário para distingui-lo do timezone do dispositivo. |
| NFR-02 | Responsividade | Conteúdo essencial permanece disponível entre 320 e 1440 CSS px, nos viewports verificados em AC-10; acima de 1440 px, conteúdo pode limitar largura sem perder informação. |
| NFR-03 | Acessibilidade | Alvo WCAG 2.2 AA nos fluxos de busca, seleção, leitura de dados e alternância de unidade. Todos os fluxos devem operar por teclado; foco é visível; status/erros têm anúncio acessível. Antes do release, executar auditoria automatizada e revisão manual por teclado/leitor de tela; não pode haver violações WCAG A/AA conhecidas nos fluxos principais. |
| NFR-04 | Formatação de dados | Temperaturas são arredondadas ao grau inteiro mais próximo, com empates afastando-se de zero, apenas para exibição; cálculos/conversões partem dos valores não arredondados da fonte. A UI identifica unidade em todos os valores de temperatura. Condições usam descrições WMO pt-BR; códigos sem descrição mapeada são tratados como dados incompletos. Direções de vento usam oito setores cardeais mais próximos. |
| NFR-05 | Performance | Executar 20 medições em Chromium headless, viewport 375 × 667 CSS px, cache frio, CPU 4× desacelerada e rede 10 Mbps down/5 Mbps up/50 ms RTT. O campo de busca deve estar visível e habilitado em ≤2 s no p75 desde `navigationStart`. Com resposta meteorológica mockada, o conteúdo deve estar visível em ≤1 s após a resposta chegar ao cliente. Em ambiente integrado, medir separadamente a latência da API; ela não compõe o orçamento de renderização do cliente. |
| NFR-06 | Confiabilidade | Nenhuma falha ou resposta inválida da fonte pode encerrar a aplicação ou ser exibida como dado válido. Cada operação termina em sucesso, estado vazio ou erro visível; não há retry automático. |
| NFR-07 | Privacidade | Não exigir conta, enviar dados para persistência em servidor próprio ou coletar localização. A busca por nome não persiste após recarregar a página. |
| NFR-08 | Segurança | Não há segredos/API keys no cliente. Texto digitado e respostas externas são tratados como dados, nunca como markup executável. Requisições usam HTTPS. |
| NFR-09 | Disponibilidade | Disponibilidade mensal do app ≥99,5%, calculada como probes saudáveis ÷ probes totais. Medir a cada 5 minutos; uma amostra é saudável quando a aplicação responde HTTP 200 e o shell com campo de busca fica operável. Falhas da API meteorológica não contam como indisponibilidade do shell; a busca e o estado de erro continuam operáveis quando a API falhar. |
| NFR-10 | Compatibilidade | Suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari na data de cada release. No mobile, suportar as duas versões principais mais recentes de Safari no iOS e Chrome no Android. Validar os fluxos críticos em cada família de navegador antes de cada release. |
| NFR-11 | Usabilidade | Em teste moderado pré-lançamento com cinco participantes que não conheçam a interface, pelo menos quatro devem concluir, sem ajuda, as tarefas de buscar uma cidade fornecida, selecioná-la e localizar clima atual e previsão; registrar taxa de conclusão, tempo e bloqueios observados. Não coletar telemetria de uso no MVP. |

## Matriz de Rastreabilidade

Cada linha liga a história aos critérios que a verificam e aos requisitos não funcionais que condicionam sua implementação ou validação. Requisitos não funcionais transversais são listados quando afetam diretamente o fluxo da história.

| User Story | Requisito funcional | Acceptance Criteria | Requisitos não funcionais relevantes |
|---|---|---|---|
| US-01 — Buscar uma cidade pelo nome | FR-01 | AC-01, AC-16, AC-19, AC-21 | NFR-01 (pt-BR), NFR-03 (teclado e foco), NFR-05 (disponibilidade do campo de busca), NFR-06 (falhas visíveis), NFR-08 (texto tratado como dado), NFR-10 (navegadores), NFR-11 (tarefa principal) |
| US-02 — Distinguir cidades homônimas | FR-01 | AC-01, AC-02 | NFR-01 (rótulos em pt-BR), NFR-03 (opções acessíveis), NFR-08 (respostas externas tratadas como dados), NFR-10 (navegadores), NFR-11 (seleção da localidade correta) |
| US-03 — Consultar o clima atual | FR-02 | AC-04, AC-05, AC-18, AC-23, AC-24, AC-27 | NFR-01 (idioma, data e horário local), NFR-03 (leitura acessível), NFR-04 (unidades, arredondamento e descrição WMO), NFR-05 (renderização), NFR-06 (dados inválidos e falhas), NFR-08 (resposta externa não executável), NFR-10 (navegadores), NFR-11 (localizar o clima atual) |
| US-04 — Consultar a previsão de cinco dias | FR-03 | AC-06, AC-07, AC-18, AC-20, AC-23, AC-27 | NFR-01 (idioma, datas e fuso), NFR-03 (leitura acessível), NFR-04 (unidades, arredondamento e descrição WMO), NFR-05 (renderização), NFR-06 (dados inválidos e falhas), NFR-08 (resposta externa não executável), NFR-10 (navegadores), NFR-11 (localizar a previsão) |
| US-05 — Alternar Celsius e Fahrenheit | FR-04 | AC-08, AC-09, AC-22, AC-25, AC-26 | NFR-01 (formatação pt-BR), NFR-03 (controle acessível por teclado), NFR-04 (conversão e arredondamento), NFR-10 (navegadores), NFR-11 (uso da unidade preferida) |
| US-06 — Usar a experiência em tela mobile | FR-05 | AC-10, AC-11 | NFR-02 (responsividade), NFR-03 (acessibilidade), NFR-05 (viewport de referência), NFR-10 (navegadores móveis), NFR-11 (conclusão da tarefa principal) |
| US-07 — Entender e recuperar-se de uma falha | FR-06 | AC-12, AC-13, AC-17, AC-18, AC-20, AC-21, AC-27 | NFR-01 (mensagens em pt-BR), NFR-03 (anúncio acessível de status e erro), NFR-06 (término em estado explícito, sem retry automático), NFR-10 (navegadores), NFR-11 (conclusão sem bloqueio) |
| US-08 — Receber orientação no estado inicial ou sem resultados | FR-07 | AC-03, AC-14, AC-15 | NFR-01 (orientação em pt-BR), NFR-03 (orientação acessível), NFR-05 (campo de busca disponível), NFR-06 (estado vazio explícito), NFR-08 (termo tratado como dado), NFR-10 (navegadores), NFR-11 (início da tarefa de busca) |

## Edge Cases

| Caso | Comportamento esperado | Critério relacionado |
|---|---|---|
| Cidade inexistente | Informar que não há cidade correspondente, manter o termo no campo para edição e não consultar o serviço meteorológico. | AC-03 |
| Input vazio ou só com espaços | Não chamar geocodificação; orientar em pt-BR a informar um nome de cidade. | AC-15 |
| Acentos e caracteres especiais | Aplicar trim somente nas bordas; preservar acentos e caracteres internos, enviar query decodificada sem alteração adicional e renderizar respostas como texto literal. | AC-16 |
| Falha da API/rede | Encerrar loading, mostrar erro compreensível e opção de tentar novamente; não tratar falha nem dados antigos como resposta atual bem-sucedida. | AC-13 |
| Timeout | Cada chamada de rede termina em até 8 s; ao exceder, exibe erro e retry manual. Resposta da chamada expirada é ignorada. | AC-17 |
| Geocoding sem resultados | Tratar lista vazia como “cidade não encontrada”; manter termo pesquisado e busca disponível; nenhuma consulta meteorológica é enviada. | AC-03 |
| Resposta parcial | Clima atual exige temperatura do ar, sensação térmica e condição mapeável. Cada dia exige data, mínima, máxima e condição mapeável; dias incompletos são omitidos, e a seção de previsão falha apenas se nenhum dia for completo. Umidade, vento, precipitação e pressão opcionais são omitidos. | AC-05, AC-18, AC-23 |
| Mais de uma cidade correspondente | Exibir cada resultado como opção separada com região/país quando presentes para evitar seleção ambígua. | AC-02 |
| Erro apenas na previsão | Preservar o clima atual que carregou com sucesso, sinalizar a falha da previsão separadamente e permitir nova tentativa da consulta de previsão. | AC-13, AC-18 |
| Mudança de unidade durante carregamento ou após exibição | Aplicar a unidade selecionada aos dados assim que disponíveis; não fazer nova consulta apenas por alternar unidade. | AC-08, AC-09 |
| Consulta perto da mudança de data local | Usar o timezone local retornado pela resposta meteorológica. Se ausente/inválido, exibir erro de previsão em vez de cair no timezone do browser. | AC-06 |
| Valores negativos ou limítrofes | Converter a partir dos valores-fonte e aplicar a regra de arredondamento aprovada sem acumular erro ao alternar unidades. | AC-08, AC-09 |
| Viewport estreito, orientação, zoom ou teclado | Manter conteúdo e controles essenciais acessíveis, sem sobreposição que impeça interação; permitir operação de controles via teclado. | AC-10, AC-11; NFR-03 |
| Buscas/consultas concorrentes | Somente respostas associadas à busca e cidade selecionadas mais recentemente podem alterar resultados ou dados meteorológicos visíveis. | AC-21, AC-27 |
| Repetição após erro | Cada acionamento de retry gera uma nova requisição; resposta antiga ou duplicada não pode sobrescrever resultado mais recente. | AC-13, AC-17 |

## Assumptions

- A API Open-Meteo fornece geocodificação e meteorologia sem API key para o MVP; validar os termos e limites vigentes antes de publicar o serviço.
- O fluxo de localização do MVP é busca manual por nome; não é solicitada geolocalização.
- “Hoje + quatro dias” usa o timezone local retornado pela consulta meteorológica; ausência/invalidez desse timezone torna a previsão indisponível.
- Para aceite, os campos essenciais são temperatura atual, sensação térmica e condição atual; na previsão, data, mínima, máxima e condição por dia. Umidade, vento, precipitação e pressão são opcionais.
- Celsius é a unidade inicial. A alternância para Fahrenheit persiste durante a sessão e após troca de cidade; recarregar restaura Celsius.
- A apresentação arredonda temperaturas ao inteiro mais próximo, mas os cálculos usam os valores-fonte sem arredondar.
- Códigos de condição do tempo seguem interpretação WMO; códigos desconhecidos não recebem descrição inferida.
- Direção do vento, quando disponível, usa uma de oito direções cardeais, determinada pelo ângulo mais próximo.
- Uma operação de rede expira após 8 s e só é repetida por ação explícita do usuário.
- A busca remove espaços externos e não altera acentos, caixa ou caracteres internos.
- Cidade e unidade selecionadas existem apenas em memória; nenhuma é salva em servidor ou navegador. A unidade escolhida é mantida ao trocar de cidade durante a sessão, e recarga restaura o estado inicial em Celsius sem cidade selecionada.
- Personas e suas métricas são hipóteses para orientar validação, não compromissos de desempenho do produto.
- Os viewports, ambiente sintético, compatibilidade, acessibilidade, performance e disponibilidade dos NFRs são os baselines de validação do MVP.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Indisponibilidade, lentidão ou limite de requisições da Open-Meteo | Média | Alto: funções centrais podem ficar indisponíveis. | Timeout de 8 s, estados de erro, retry manual e nenhuma apresentação de cache como dado atual. Confirmar limites/condições de uso antes do lançamento. |
| Resultados geográficos ambíguos | Alta | Alto: pode ser exibido o clima da localidade errada. | Mostrar país/região quando disponíveis e testar nomes homônimos. |
| Campos ou formatos ausentes/alterados na resposta | Média | Alto: dados incorretos ou tela quebrada. | Validar e normalizar respostas, tratar campos opcionais e cobrir respostas inválidas em testes. |
| Datas ou “hoje” interpretados em fuso incorreto | Média | Alto: previsão associada ao dia errado. | Usar timezone retornado pela resposta; falhar de forma visível se ausente/inválido; testar virada de data com relógio fixo. |
| Conversão/arredondamento inconsistente | Média | Alto: reduz confiança nos dados. | Converter a partir dos valores não arredondados e aplicar arredondamento só na apresentação; cobrir valores negativos e alternância repetida. |
| Termos ou limites do provedor incompatíveis com o uso pretendido | Média | Alto: pode impedir a publicação. | Confirmar termos e limites atuais da Open-Meteo antes do lançamento; se incompatíveis, suspender release e reabrir decisão de fonte de dados. |

## Out of Scope

- Aplicativos nativos para iOS, Android ou desktop; o produto é uma aplicação web responsiva acessada por navegador.
- Autenticação, contas, perfis e qualquer dado associado a usuário.
- Geolocalização automática ou sob demanda, coleta de localização e busca de cidades próximas à posição do usuário.
- Favoritos, comparação simultânea de cidades, cidades recentes, histórico de buscas e restauração da cidade após recarregar.
- Persistência local ou em servidor de cidade, unidade, consultas ou dados meteorológicos.
- Cache meteorológico para exibição posterior, uso offline, atualização em segundo plano ou atualização automática periódica dos dados.
- Previsão horária, previsões além de hoje e dos quatro dias seguintes e dados históricos.
- Volume de precipitação, alertas meteorológicos severos, mapas, radar e imagens de satélite.
- Notificações push, widgets, compartilhamento ou exportação de dados meteorológicos.
- Idiomas além de pt-BR e conversão de unidades além da alternância de temperatura entre Celsius e Fahrenheit; velocidade do vento permanece em km/h.
- Analytics, telemetria de uso, publicidade e rastreamento de usuários.
- Garantia ou controle da disponibilidade, precisão e limites operacionais da API externa pelo próprio app.

## Open Questions

**Nenhuma pergunta bloqueia o desenvolvimento do MVP.** Para eliminar dependências implícitas, as seguintes decisões são adotadas nesta versão:

| Tema | Decisão para o MVP |
|---|---|
| Localização | Busca manual por nome; sem geolocalização ou permissão de localização. |
| Dados essenciais | Atual: temperatura do ar, sensação térmica e condição WMO mapeada. Previsão: data, mínima, máxima e condição WMO mapeada por dia. Umidade, vento, precipitação e pressão são opcionais. |
| Datas e granularidade | Hoje e os quatro dias seguintes no timezone válido retornado pela fonte; apenas previsão diária. Sem timezone válido, erro na previsão. |
| Unidades | °C inicial, opção °F, vento em km/h, precipitação em mm e pressão em hPa; essas três métricas são opcionais. Temperatura arredondada ao grau inteiro mais próximo, com empate afastando-se de zero. |
| Persistência | Nenhuma persistência local ou no servidor. A unidade permanece só durante a sessão e retorna a °C após recarga; cidade não é restaurada. |
| Recursos excluídos | Alertas severos, mapas, favoritos, histórico, previsão horária, localização, idiomas além de pt-BR e analytics. |
| Identidade visual | Sem marca ou design system externo obrigatório. Seguir o padrão existente no projeto; se inexistente, usar interface neutra, responsiva e acessível sem criar sistema de marca separado. |
| Critérios operacionais | Timeout de 8 s, sem retry automático; baselines NFR-02 a NFR-11 são aceitação do MVP. |
| Métricas de produto | Sem telemetria. Validar tarefa principal em teste moderado pré-lançamento segundo NFR-11. |

### Verificações obrigatórias antes do lançamento

- Confirmar que os termos e limites vigentes da Open-Meteo permitem o uso pretendido e respeitar os limites publicados.
- Executar a matriz de navegadores e as validações de acessibilidade, performance, disponibilidade e usabilidade definidas nos NFRs.
- Se uma verificação falhar, corrigir ou registrar exceção aprovada antes da publicação. Essas verificações não bloqueiam o desenvolvimento local.

## Review Results

A revisão inicial de requisitos faltantes, ambiguidades, inconsistências e critérios de aceite fracos está registrada em [weather-app-spec-review.md](./weather-app-spec-review.md). Ela antecede as decisões finais acima e permanece como histórico; esta especificação atualizada prevalece.
