# Revisão da especificação do Weather App

Esta revisão identifica lacunas, ambiguidades, inconsistências e critérios de aceite fracos em [weather-app-spec.md](./weather-app-spec.md). As sugestões abaixo são propostas de correção; perguntas que dependem de decisão de produto permanecem abertas, sem serem convertidas em decisões silenciosas.

> **Status:** revisão inicial anterior ao refinamento da especificação. Os itens foram usados para atualizar `weather-app-spec.md`; consulte a versão atual da spec para requisitos vigentes. Este relatório preserva o diagnóstico e não é uma lista de defeitos ainda necessariamente pendentes.

## Requisitos faltantes

| ID | Referência | Problema | Sugestão de correção |
|---|---|---|---|
| RF-01 | FR-01, AC-01 | O requisito permite pesquisar e selecionar cidade, mas não define claramente que a seleção dispara a consulta de clima nem qual feedback aparece durante a transição. | Definir o fluxo: submeter busca → selecionar um resultado → consultar clima atual e previsão para as coordenadas/identificador selecionados; acrescentar critério que confirme que ambos os dados correspondem à localidade escolhida. |
| RF-02 | FR-01 | Não há regras para normalização/aceitação de entradas como espaços nas bordas, acentos, nomes parciais ou variações de capitalização; AC-16 cobre apenas um exemplo. | Definir o comportamento esperado para trim, acentos, caixa e consulta parcial. Criar casos de teste representativos, sem exigir normalização que o produto não aprovou. |
| RF-03 | FR-02, FR-03 | Não há critério explícito que identifique a referência temporal dos dados meteorológicos ao usuário (data/hora da observação ou da previsão), embora overview e riscos enfatizem dados atuais e fuso. | Decidir se será exibida hora de atualização ou período de referência; incluir formato e critério de aceite em pt-BR. |
| RF-04 | FR-06 | Não há regra para concorrência entre buscas: uma resposta antiga pode chegar depois de uma busca mais recente e substituir os resultados atuais. O caso está mencionado só genericamente em Edge Cases. | Definir que apenas a resposta da busca mais recente pode alterar a tela; adicionar critério Given duas respostas fora de ordem / When a mais recente termina primeiro / Then a antiga não sobrescreve os dados. |
| RF-05 | NFR-05, Risks | Não há requisito operacional para como detectar indisponibilidade recorrente nem como distinguir falha da aplicação e falha externa. | Para o MVP, explicitar se observabilidade é necessária; se for, definir sinais mínimos sem coletar dados pessoais desnecessários. |
| RF-06 | Functional Requirements | Não há requisito explícito de atualização manual ou automática dos dados depois que a previsão já está visível. | Decidir se os dados permanecem até nova busca, são atualizados sob demanda ou têm atualização automática; documentar frequência e feedback. |

## Ambiguidades

| ID | Referência | Problema | Sugestão de correção |
|---|---|---|---|
| AM-01 | FR-01, AC-01 | “Resultados relevantes” e “pelo menos um resultado” não especificam a relevância, ordenação ou o limite da lista. | Definir ordenação/limite como decisão de produto ou deixar o ranking delegado à fonte, mas especificar o mínimo verificável: exibir todos os itens da fixture até um limite aprovado. |
| AM-02 | FR-01, AC-02 | O critério exige região ou país, mas nem todos os resultados necessariamente fornecem ambos; não define fallback quando nenhum deles vem. | Definir campos usados na desambiguação e o fallback, por exemplo, país/região/coordenadas apenas quando fornecidos, sem ocultar que a distinção pode não ser possível. |
| AM-03 | FR-02, FR-03, AC-18 | “Campos essenciais definidos para a seção” não estão enumerados em forma contratual, e a Open Question 2 permanece aberta. | Aprovar uma lista fechada dos campos obrigatórios por seção; enquanto aberta, identificar AC-18 como bloqueado para teste de aceite final e usar fixtures provisórias explicitamente marcadas. |
| AM-04 | AC-06, Edge Cases, Assumptions | “Data definida como hoje”, “contexto de data/fuso usado pelo teste” e calendário da localidade dependem de uma regra de fuso que segue em aberto. | Decidir a fonte do fuso e a regra de “hoje”; usar relógio/fuso fixos no teste e especificar comportamento na virada de dia. |
| AM-05 | AC-17, Open Question 14 | O timeout ocorre após “limite configurado”, mas nenhum valor ou diferença entre geocoding e previsão está definido. | Escolher e registrar limites numéricos por operação (ou um limite único), com unidade, cancelamento da requisição e forma de teste com relógio/requisição controlados. |
| AM-06 | AC-10, NFR-02, Open Questions 8 e 10 | O mínimo de 320 CSS px é uma proposta pendente, enquanto outros dispositivos, navegadores e orientações não têm matriz de suporte. | Aprovar uma matriz mínima (viewport, navegadores e versões) e tratar propostas não aprovadas como não bloqueadoras, não como critérios de aceite vigentes. |
| AM-07 | AC-09, Assumptions, Open Question 5 | A regra de arredondamento está pendente, mas AC-09 exige retorno exato a exemplos e NFRs assumem formatação sem fixá-la. | Aprovar casas decimais/arredondamento antes de teste visual; separar precisão interna de regra de apresentação e comparar valores normalizados nos testes. |
| AM-08 | NFR-01 | A ressalva “exceto se a localidade consultada exigir exibir também sua referência temporal” não esclarece quais localidades ou formatos podem divergir de pt-BR. | Fixar pt-BR para interface e datas; mostrar timezone/horário da localidade como informação explícita adicional, se aprovado. |
| AM-09 | Out of Scope, Open Questions 6 | Favoritos/histórico são descritos como não persistidos, mas preferência local de unidade e localização permanece sem decisão. | Distinguir persistência em servidor de armazenamento local e declarar, para cada dado, se pode permanecer após recarga. |
| AM-10 | Out of Scope | “Salvo decisão posterior” torna alertas, mapas e personalização potencialmente fora ou dentro do escopo sem controle de versão. | Declarar explicitamente fora do MVP atual; mudanças posteriores devem atualizar a spec e critérios de aceite. |
| AM-11 | Overview, FR-02, AC-04 | “Clima atual” não distingue observação atual de valor/modelagem mais recente disponibilizada pela fonte. | Definir a semântica de “atual” e, se aplicável, exibir timestamp ou “última atualização”. |
| AM-12 | FR-04, AC-08, AC-09 | O escopo define conversão de temperatura, mas não define como a unidade selecionada se comporta se uma nova cidade for consultada durante a sessão. | Decidir se a unidade é global por sessão (sugestão coerente com “global”) e adicionar cenário de troca de cidade sem reset da preferência. |

## Inconsistências

| ID | Referência | Problema | Sugestão de correção |
|---|---|---|---|
| IN-01 | AC-13, AC-17, Edge Cases “Repetição após erro” | AC-13 atualmente exige mensagem e ação de retry, mas não verifica que acioná-la realmente inicia nova requisição; o Edge Case diz que haverá nova tentativa. | Acrescentar ao Then de AC-13: “ao acionar tentar novamente, uma nova requisição da mesma operação é enviada”, e verificar que a resposta mais recente define o estado. |
| IN-02 | AC-16, FR-01 | O exemplo “São João d'Oeste” inclui apóstrofo, mas não define se deve ser enviado como query param codificado, body ou outra forma; “sem interpretação como parâmetro separado” está tecnicamente ambíguo. | Expressar o resultado em termos observáveis: servidor/mock recebe o termo decodificado exatamente igual ao input normalizado e há uma única chamada; não especificar detalhes internos de transporte no critério de produto. |
| IN-03 | AC-18 e Open Question 2 | O critério depende de campos essenciais ainda não decididos, mas está redigido como se pudesse ser aceito agora. | Marcar AC-18 como provisório/bloqueado até decisão dos campos, ou definir baseline de campos diretamente na spec e registrar aprovação pendente. |
| IN-04 | NFR-04 e Open Question 10 | A NFR dá metas de 2 s e 1 s, mas não define dispositivo/rede de referência e exige aprovação. Assim, o número parece normativo, embora ainda não seja testável. | Marcar as metas como propostas não vinculantes até aprovação; depois definir ambiente, percentil, início/fim da medição e ferramenta. |
| IN-05 | FR-05, AC-10 e AC-11 | FR-05 promete smartphones, tablets e desktops, mas AC-10 mede apenas larguras a partir de 320 px e AC-11 apenas um viewport mobile sem dimensão definida. | Vincular requisito e critérios à matriz de viewports/plataformas aprovada e cobrir ao menos breakpoints representativos. |
| IN-06 | NFR-06, Assumptions, Open Questions 1 e 6 | NFR-06 fala em consentimento se houver geolocalização e Assumptions propõem busca manual, mas a escolha do fluxo e a persistência local ainda estão abertas. | Manter geolocalização explicitamente fora do comportamento implementável até decisão; estabelecer se AC/NFR são condicionais ou atualizá-los após discovery. |

## Critérios de aceite fracos ou não verificáveis

| ID | Referência | Problema | Sugestão de correção |
|---|---|---|---|
| CA-01 | AC-01 | “Pelo menos um resultado” não prova que resultados relevantes foram usados, que o clique seleciona uma cidade ou que a consulta seguinte usa a seleção. | Usar fixture com resultados conhecidos; selecionar um item e verificar nome/identificador da localidade e chamada meteorológica correspondente. |
| CA-02 | AC-02 | “Permite identificar” é subjetivo; seleção visual suficiente não é definida. | Verificar literalmente que cada opção apresenta os valores distintos de região/país da fixture; evitar afirmação subjetiva de compreensão. |
| CA-03 | AC-04 | “Mostra os valores” não fixa conteúdo textual/localizado para condição do tempo e não checa associação de cada label com o valor. | Fixar fixture e verificar strings/labels de temperatura, sensação térmica, descrição traduzida e cidade, com unidades. |
| CA-04 | AC-06 | A sequência esperada depende de data de referência externa ao critério, então um teste não consegue determinar hoje sem configurar o relógio/fuso. | Fornecer instante e timezone fixos como Given; então comparar exatamente as cinco datas esperadas nessa zona. |
| CA-05 | AC-07 | “Cada data aparece uma vez” é verificável, mas não define o formato de data nem cobertura para datas inválidas/duplicadas na fonte. | Fixar o formato pt-BR e fixtures com data duplicada/inválida; especificar se a resposta inválida gera erro de seção ou normalização. |
| CA-06 | AC-08 | Apenas dois pontos Celsius/Fahrenheit não verificam o comportamento de todas as temperaturas visíveis, apesar do requisito dizer “todas”. | Usar valores distintos no clima atual e nos cinco dias; verificar cada valor convertido e que o contador de chamadas meteorológicas não aumenta. |
| CA-07 | AC-09 | Critério limitado a valores exatos de exemplo e sem teste de arredondamento aprovado; não verifica a unidade exibida em cada item. | Após aprovação da regra, usar valores fracionários e negativos em todas as seções e comparar valores/unidades formatados esperados, sem erro cumulativo após alternâncias repetidas. |
| CA-08 | AC-10 | “Podem ser alcançados e usados” exige julgamento manual e não descreve como detectar overflow/acessibilidade; viewport mínimo também não está aprovado. | Uma vez aprovado o viewport, verificar `scrollWidth <= clientWidth` e disponibilidade/visibilidade dos elementos; usar testes de interação para cada controle. |
| CA-09 | AC-11 | “Viewport mobile” e “não cortado/sobreposto” não especificam tamanho nem limiar observável; interação por toque via automação precisa de definição. | Fixar viewport em CSS px, usar device scale apropriado e verificar bounding boxes sem interseção dos controles essenciais, além de completar os cliques/toques. |
| CA-10 | AC-12 | “Indicação perceptível” não determina role/texto acessível; “antes de liberar a resposta” não exige duração nem define fim para sucesso/erro. | Verificar indicador com role/status e nome acessível enquanto uma resposta controlada está pendente; após sucesso, falha ou timeout, confirmar que deixa o estado ativo. |
| CA-11 | AC-13 | Testa o estado de erro, mas não a ação de recuperação prometida pelo FR-06. | Verificar role/nome do botão, acionamento e segunda chamada; devolver sucesso na segunda resposta e verificar transição para conteúdo válido. |
| CA-12 | AC-14 | “Orientação visível” não define texto nem localização/associação com busca. | Fixar texto ou identificador acessível da orientação e verificar que está associado ao controle de busca, em pt-BR. |
| CA-13 | AC-16 | A fixture “retorna esse termo” mistura input de busca com resposta geográfica e “caracteres reservados válidos” é vago. | Separar asserção: chamada recebe query decodificada idêntica ao texto (após normalização aprovada); resposta da fixture é renderizada como texto literal. |
| CA-14 | AC-17 | O critério depende de timeout “configurado”, sem valor; a regra para resposta tardia não indica a sequência concreta nem qual resultado permanece. | Após decisão do prazo, usar relógio falso: pendurar a primeira chamada, ultrapassar limite, iniciar retry, resolver a primeira tardiamente e verificar estado/resultado da segunda. |
| CA-15 | AC-18 | “Seção afetada”, “campos essenciais” e “informar” não definem conteúdo, seção ou ação esperada. | Enumerar campos essenciais, definir qual cartão fica em erro e qual texto/ação de retry aparece; testar falta de um campo por vez. |
| CA-16 | NFR-05 | “Não causar crash” e “mensagem compreensível” não são critérios de aceite medidos. | Traduzir para cenários de resposta inválida/erro: app permanece renderizado, mostra estado acessível e mantém busca/retry operáveis. |
| CA-17 | NFR-03 | WCAG AA é apenas proposta, e não define páginas, método de auditoria ou tratamento de exceções. | Aprovar nível e definir auditoria automatizada + revisão manual de teclado/leitor de tela para os fluxos principais; registrar exclusões. |
| CA-18 | NFR-08 | Separação de responsabilidades é uma orientação de solução/arquitetura, não uma qualidade de produto diretamente verificável. | Mover para plano técnico/convenções de implementação, ou definir uma evidência de qualidade testável sem prescrever estrutura prematuramente. |

## Prioridade sugerida de correção

1. Fechar campos essenciais e regra temporal/fuso; sem isso, AC-06, AC-07 e AC-18 não têm oráculo estável.
2. Definir timeout e retry; fechar AC-13 e AC-17 com sequência observável.
3. Aprovar matriz de dispositivos, acessibilidade e metas de performance antes de usá-las como gates.
4. Reforçar rastreabilidade da busca: resultado selecionado → coordenadas/identificador → respostas meteorológicas correspondentes.
5. Separar requisitos de produto testáveis de diretrizes de arquitetura, especialmente NFR-08.
