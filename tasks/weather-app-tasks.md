# Backlog de Implementação — Weather App

Este backlog deriva do [plano técnico](../plans/weather-app-plan.md), que por sua vez segue a [especificação de produto](../specs/weather-app-spec.md). As tarefas estão agrupadas por entrega e ordenadas respeitando suas dependências. Se houver divergência de escopo ou comportamento, prevalece a especificação.

## Convenções

- Cada tarefa identifica uma entrega testável e lista os arquivos prováveis; a lista pode ser ajustada se a implementação seguir a estrutura definida no plano.
- `Dependências: nenhuma` indica que a tarefa pode iniciar sem outra tarefa deste backlog. Nos demais casos, todas as tarefas listadas devem estar concluídas primeiro.
- Os IDs são estáveis; a posição no backlog segue dependências e pode não coincidir com a ordem numérica quando uma tarefa é acrescentada.
- Os critérios de aceite são verificáveis e complementam a rastreabilidade funcional e não funcional informada em cada tarefa.
- O tipo classifica o foco principal: `Data` para contratos, domínio e serviços; `UI` para apresentação e orquestração de tela; `Test` para validação automatizada; `Infra` para configuração e prontidão operacional.

## Prioridade e tamanho relativo

Prioridade indica a ordem recomendada de entrega, não a importância permanente do requisito:

- **P0:** necessário para a primeira experiência funcional e visível.
- **P1:** validação automatizada do fluxo e dos comportamentos centrais após a primeira experiência.
- **P2:** hardening e prontidão operacional; pode vir depois da primeira entrega visível, mas continua obrigatório antes da publicação em produção quando seus critérios forem aplicáveis.

Tamanho é esforço relativo considerando escopo, quantidade de cenários e incerteza; não representa duração: **P** pequeno, **M** médio, **G** grande.

| Tarefa | Prioridade | Tamanho | Justificativa resumida |
|---|---|---|---|
| T-01 | P0 | P | Contratos concentrados em um arquivo. |
| T-16 | P0 | P | Fixture pequena para desenvolver a UI sem chamadas de rede. |
| T-02 | P0 | M | Funções puras de várias áreas, com regras explícitas de data e timezone. |
| T-03 | P0 | G | Três operações externas, validação extensa de payloads e normalização de falhas. |
| T-04 | P0 | G | Orquestração de busca, seleção, concorrência, timeout, retry e estado por seção. |
| T-05 | P0 | M | Busca e componentes de estados acessíveis. |
| T-06 | P0 | G | Apresentação atual, previsão e unidade em múltiplos componentes. |
| T-07 | P0 | M | Integração da aplicação, tema e comportamento responsivo. |
| T-08 | P1 | P | Testes focados de conversão e arredondamento. |
| T-09 | P1 | M | Testes de formatação, calendário, timezone e códigos meteorológicos. |
| T-10 | P1 | G | Fixtures extensas para as três operações, validação e falhas do serviço. |
| T-11 | P1 | G | Muitos cenários de estado, concorrência, timeout e retry do hook. |
| T-12 | P1 | M | Testes dos estados e interações acessíveis dos componentes. |
| T-13 | P1 | M | Um fluxo E2E com interceptação de rede e matriz de viewports. |
| T-14 | P2 | G | Evidências de acessibilidade, performance, compatibilidade e usabilidade. |
| T-15 | P2 | G | Decisões de hospedagem, probe, disponibilidade e conformidade operacional. |

## Sequência sugerida de entrega em fatias verticais

O primeiro incremento visível deve priorizar o caminho **buscar cidade → selecionar resultado → exibir clima atual**, em vez de esperar por todo o hardening. A sequência abaixo atravessa dados, orquestração, UI e verificação:

1. **Fatia 1 — Clima atual visível (P0):** contratos necessários de T-01, fixture local de T-16 para desenvolver a UI sem rede, funções necessárias de T-02, geocoding e consulta atual de T-03, busca/seleção e estado atual de T-04, busca/estados de T-05, cartão atual de T-06 e shell de T-07. Validar junto com os cenários correspondentes de serviço (T-10), hook (T-11) e componentes (T-12).
2. **Fatia 2 — Previsão de cinco dias (P0):** completar o suporte diário em T-02/T-03/T-04 e a apresentação em T-06; cobrir datas/timezone em T-09, fixtures do serviço e hook em T-10/T-11 e o fluxo integrado em T-13.
3. **Fatia 3 — Alternância de unidade e experiência mobile completa (P0):** completar conversão e apresentação em T-02/T-06 e validar alternância sem nova requisição e uso em mobile em T-08/T-11/T-13.
4. **Fatia 4 — Prontidão para release (P2):** após as fatias funcionais e sua verificação, executar T-14 e concluir as decisões/configurações pré-publicação de T-15.

**Atenção à granularidade:** T-03, T-04 e T-06 agrupam hoje o caminho atual e a previsão; T-10, T-11 e T-13 também misturam cobertura de mais de uma fatia. Para entregar e aceitar a Fatia 1 sem declarar tarefas parcialmente concluídas, divida esses escopos em subtarefas antes da implementação e ajuste as dependências dos testes para acompanharem cada fatia. Preserve os critérios de aceite existentes como cobertura final. As estimativas da tabela são para as tarefas no escopo atual, não para essas subtarefas propostas.

## Matriz de rastreabilidade — requisitos funcionais

A coluna “Implementação” lista tarefas que entregam comportamento de produto; “Verificação” lista tarefas que validam esse comportamento. Os ACs citados são os critérios da spec associados a cada FR.

| Requisito da spec | Implementação | Verificação | Critérios da spec |
|---|---|---|---|
| **FR-01 — Buscar e selecionar cidade** | T-03 (geocoding e normalização), T-04 (busca, seleção e coordenadas), T-05 (campo, resultados e estados de busca) | T-10 (serviço com `fetch` mockado), T-11 (hook), T-12 (vazio/erro), T-13 (fluxo E2E) | AC-01, AC-02, AC-03, AC-16, AC-19 |
| **FR-02 — Consultar clima atual** | T-01 (contrato), T-03 (consulta atual), T-04 (orquestração), T-06 (apresentação atual) | T-09 (funções puras/WMO), T-10 (serviço), T-11 (hook), T-13 (E2E) | AC-04, AC-05, AC-18, AC-23, AC-24 |
| **FR-03 — Consultar previsão de cinco dias** | T-01 (contrato), T-02 (datas/timezone), T-03 (consulta diária), T-04 (orquestração), T-06 (apresentação) | T-09 (datas/timezone/WMO), T-10 (serviço), T-11 (hook), T-13 (E2E) | AC-06, AC-07, AC-18, AC-20, AC-23, AC-28 |
| **FR-04 — Alternar unidade de temperatura** | T-02 (conversão/arredondamento), T-04 (preferência de sessão), T-06 (controle e apresentação) | T-08 (testes unitários de conversão), T-11 (hook), T-13 (E2E sem request adicional) | AC-08, AC-09, AC-22 |
| **FR-05 — Usar a experiência em diferentes telas** | T-06 (componentes responsivos), T-07 (composição, tema e layout mobile-first) | T-13 (viewports e interação mobile), T-14 (verificação de release/navegadores) | AC-10, AC-11 |
| **FR-06 — Comunicar carregamento e falhas** | T-03 (erros e timeout por request), T-04 (estados, cancelamento e retry), T-05 (componentes de estado), T-07 (shell operável em falha) | T-10 (serviço/timeouts), T-11 (hook/concorrência), T-12 (loading/erro/retry), T-13 (fluxo integrado) | AC-12, AC-13, AC-17, AC-21, AC-27 |
| **FR-07 — Orientar estado inicial e ausência de resultados** | T-04 (estado inicial e busca sem resultados), T-05 (orientação e estado vazio), T-07 (composição da tela) | T-11 (hook), T-12 (estados vazio/loading/erro), T-13 (fluxo principal) | AC-03, AC-14, AC-15 |

**Lacunas:** nenhum requisito funcional FR-01 a FR-07 está sem tarefa de implementação ou verificação correspondente. Esta matriz rastreia os requisitos funcionais; requisitos não funcionais e riscos operacionais mantêm sua rastreabilidade nas tarefas individuais.


## Entrega 1 — Implementação em ordem de dependência

### T-01 — Definir contratos de domínio e estado

- **ID:** T-01
- **Título:** Definir contratos de domínio e estado
- **Descrição:** Criar os tipos compartilhados para cidade, condições atuais, previsão, composição de dados para apresentação, unidade, estados de operação e erros, conforme os contratos do plano.
- **Critérios de aceite:**
  - `City` expõe `id`, `name`, `latitude`, `longitude` e os campos opcionais de país/região, sem propriedade `timezone`. (FR-01, AC-02, AC-19)
  - `CurrentWeather` expõe temperaturas Celsius sem arredondamento, `weatherCode`, campos opcionais de umidade, vento, precipitação e pressão, `referenceTime` e timezone IANA; `ForecastDay.date` é string de data local `YYYY-MM-DD` e a probabilidade de chuva é opcional, de 0 a 100%. (FR-02, FR-03, AC-04 a AC-07, AC-28)
  - `WeatherData` compõe `city`, `current` e `forecast` para apresentação/fixtures; não substitui os estados independentes `current` e `forecast` do hook nem agrega operações de serviço. (FR-02, FR-03)
  - `WeatherState` tem propriedades distintas para busca, cidade selecionada, clima atual, previsão e unidade; `WeatherError` tipa separadamente `timezone-unavailable` e `incomplete-data` com seção `current` ou `forecast`. (AC-18, AC-20, AC-22, AC-27)
  - `pnpm build` termina com código 0 para o contrato e nenhum tipo compartilhado importa React, DOM ou serviço. (NFR-06)
- **Dependências:** nenhuma
- **Arquivos prováveis:** `src/types/weather.ts`
- **Tipo:** Data
- **Rastreabilidade:** FR-01 a FR-04, FR-06; AC-04, AC-05, AC-18 a AC-20, AC-22, AC-23, AC-27.

### T-16 — Disponibilizar fixture de clima para desenvolvimento de UI

- **ID:** T-16
- **Título:** Disponibilizar fixture de clima para desenvolvimento de UI
- **Descrição:** Criar um objeto `WeatherData` sintético e tipado, com cidade de exemplo, clima atual e cinco dias consecutivos, para montar a interface sem depender da API.
- **Critérios de aceite:**
  - `weatherDataMock` é exportado de `src/mocks/weatherData.ts` com tipo `WeatherData`, uma cidade completa, clima atual com timezone válido e métricas opcionais preenchidas, inclusive precipitação em mm e pressão em hPa, e exatamente cinco previsões diárias cronológicas; pelo menos um dia tem probabilidade de chuva e um dia a omite. (T-01, FR-02, FR-03, AC-28)
  - A fixture inclui valores de unidade e códigos WMO válidos para demonstrar a apresentação, não importa nem chama serviços, `fetch` ou APIs externas. (AC-04 a AC-09, NFR-06)
  - O dado está explicitamente identificado como sintético/estático e não é conectado como fallback silencioso para falha ou resposta vazia da API. (AC-03, AC-13, AC-18, NFR-06)
  - `pnpm build` e `pnpm lint` terminam com código 0 para os arquivos alterados, quando o restante do repositório permite a validação.
- **Dependências:** T-01
- **Arquivos prováveis:** `src/mocks/weatherData.ts`
- **Tipo:** Data
- **Rastreabilidade:** suporte de desenvolvimento a FR-02 e FR-03; AC-04 a AC-09; NFR-06.

### T-02 — Implementar funções puras de domínio

- **ID:** T-02
- **Título:** Implementar funções puras de domínio
- **Descrição:** Implementar conversão e arredondamento de temperatura, formatação pt-BR, interpretação WMO, direção do vento e validação/formatação de datas e horários usando timezones explícitos.
- **Critérios de aceite:**
  - `0 °C`, `20 °C` e `-10 °C` convertem em `32 °F`, `68 °F` e `14 °F`; arredondamento de `1.5` e `-1.5` resulta em `2` e `-2`. (AC-08, AC-09, AC-26, NFR-04)
  - Formatação usa locale `pt-BR`, data `dd/MM/yyyy` e hora `HH:mm`; a hora é formatada com timezone explicitamente recebido, e datas `YYYY-MM-DD` não são deslocadas pelo fuso do dispositivo. (AC-04, AC-06, AC-07, NFR-01)
  - Código WMO `0` retorna “Céu limpo”; código `999` retorna ausência de mapeamento. Timezone inválido e entradas temporais inválidas produzem erro explícito, sem fallback para o fuso do dispositivo. (AC-20, AC-23)
  - Ângulos `0°`, `44°`, `46°` e `315°` resultam em `N`, `NE`, `NE` e `NW`. (AC-24)
  - Módulos de `lib/` não importam React e não usam `fetch`, DOM ou armazenamento global; `pnpm build` passa. (NFR-06)
- **Dependências:** T-01
- **Arquivos prováveis:** `src/lib/temperature.ts`, `src/lib/format.ts`, `src/lib/weatherCodes.ts`
- **Tipo:** Data
- **Rastreabilidade:** FR-02 a FR-04; AC-04, AC-06 a AC-09, AC-23, AC-24, AC-26; NFR-01, NFR-04.

### T-03 — Implementar serviço Open-Meteo

- **ID:** T-03
- **Título:** Implementar serviço Open-Meteo
- **Descrição:** Implementar geocoding e consultas atuais/diárias como operações independentes, validando payloads não confiáveis e normalizando erros.
- **Critérios de aceite:**
  - As três operações geocoding, current e daily chamam somente endpoints HTTPS Open-Meteo com query codificada; não há parâmetro de API key nem segredo embutido no cliente. (FR-01, NFR-08)
  - Com fixture ordenada de duas cidades, a resposta normalizada conserva a ordem. Item com `id` não inteiro/positivo, nome vazio, coordenada não finita/fora dos limites ou país/região de tipo incorreto causa `invalid-response` para a lista inteira; lista vazia válida retorna zero cidades. (AC-01 a AC-03, AC-16)
  - Chamadas current e daily recebem exatamente latitude/longitude da cidade; solicitam Celsius, vento km/h e, na chamada current, `precipitation` em mm e `pressure_msl` em hPa; a diária solicita cinco dias e `precipitation_probability_max`. Cada resposta aceita somente timezone reconhecido por `Intl.DateTimeFormat`; ausência/invalidez resulta em `timezone-unavailable` para a seção correspondente. (AC-04, AC-06, AC-19, AC-20)
  - Current valida temperatura do ar/aparente, código WMO mapeado e horário de referência. Daily valida arrays alinhados, datas `YYYY-MM-DD` consecutivas com a primeira igual a hoje no timezone da resposta, e mínima/máxima/código WMO por dia; array opcional de probabilidade, se presente, também deve estar alinhado e conter valores entre 0 e 100. Dias incompletos são omitidos; nenhum dia completo resulta em `incomplete-data: forecast`. (AC-04, AC-06, AC-07, AC-18, AC-23, AC-28)
  - Payloads são tratados como `unknown`; unidades incompatíveis, JSON inválido e falhas de rede/HTTP/API/timeout/dados resultam nos erros tipados, nunca em dados sintéticos. Campos opcionais de umidade/vento/precipitação/pressão presentes e inválidos invalidam a resposta; campos ausentes são omitidos. (AC-05, AC-13, AC-17, AC-18, AC-20, AC-23, NFR-06)
  - Em teste com relógio falso, cada request pendente termina em erro `timeout` após 8 s; nenhuma chamada é repetida automaticamente e nenhuma resposta que resolva depois do timeout é retornada como sucesso. Serviço não armazena dados entre chamadas. (AC-17, NFR-06, NFR-07)
- **Dependências:** T-01, T-02
- **Arquivos prováveis:** `src/services/weatherService.ts`
- **Tipo:** Data
- **Rastreabilidade:** FR-01 a FR-03, FR-06; AC-01 a AC-07, AC-13, AC-16 a AC-20, AC-23; NFR-06, NFR-08.

### T-04 — Orquestrar estado da sessão meteorológica

- **ID:** T-04
- **Título:** Orquestrar estado da sessão meteorológica
- **Descrição:** Implementar `useWeather` para coordenar busca, seleção, unidade, operações independentes, retry, cancelamento e descarte de respostas obsoletas.
- **Critérios de aceite:**
  - Renderização inicial tem busca vazia, nenhuma cidade selecionada, estados current/forecast `idle` e unidade `celsius`; após recarga esses mesmos valores reiniciam. (AC-14, AC-25)
  - Submissão em branco não chama geocoding; consulta com resultados vazios termina em `empty`; consulta bem-sucedida preserva a ordem e não seleciona automaticamente. (AC-01, AC-03, AC-15)
  - Selecionar uma fixture com coordenadas conhecidas dispara exatamente uma chamada current e uma daily, ambas contendo latitude/longitude idênticas às da opção selecionada; retry de seção dispara exatamente uma chamada da mesma seção e não chama/reinicia a outra. (AC-13, AC-18, AC-19)
  - Falha de timezone atual altera somente current; falha de timezone diário altera somente forecast; estado válido da outra seção permanece idêntico. (AC-18, AC-20)
  - Em buscas/cidades A e B controladas, respostas de A resolvidas após B não alteram query/resultados/dados de B nem iniciam requests extras. (AC-21, AC-27)
  - Avançar relógio controlado a 8 s troca loading por timeout visível e retry; resolver a request expirada depois não altera o estado. (AC-12, AC-17)
  - Mudar unidade não chama serviço; Fahrenheit persiste ao selecionar outra cidade durante a montagem atual do hook; nenhum dado é escrito em storage ou cache. (AC-08, AC-09, AC-22, NFR-07)
  - O fluxo não solicita geolocalização nem envia/persiste a consulta ou estado meteorológico em servidor próprio. (NFR-07)
- **Dependências:** T-01, T-03
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Tipo:** UI
- **Rastreabilidade:** FR-01 a FR-04, FR-06, FR-07; AC-03, AC-08, AC-09, AC-13 a AC-22, AC-25 a AC-27; NFR-07.

### T-05 — Criar busca e componentes de estado

- **ID:** T-05
- **Título:** Criar busca e componentes de estado
- **Descrição:** Implementar campo e submissão de busca, opções de cidade, orientação inicial, ausência de resultados, carregamento e falha com retry acessível.
- **Critérios de aceite:**
  - Teste de UI submete a mesma consulta por botão e Enter; opções aparecem na ordem da fixture, mostram cada campo de região/país disponível e nenhuma recebe seleção antes de interação. (AC-01, AC-02)
  - O formulário expõe `role="search"` e um input com label acessível; `disabled` desabilita campo e botão e nenhuma submissão chama `onSearch`. (NFR-03)
  - Input vazio ou contendo somente espaços não chama `onSearch`; a submissão de ` São João d'Oeste ` encaminha `São João d'Oeste` ao callback. Resultado vazio mostra mensagem de nenhuma cidade, mantém exatamente o termo e não mostra dados meteorológicos. (AC-03, AC-15, AC-16)
  - Conteúdo externo `<script>` é exibido literalmente, sem criar elemento executável. (NFR-08)
  - `LoadingState` expõe `role="status"` e mensagem acessível de carregamento; a animação decorativa é ignorada por leitores de tela e respeita redução de movimento. (AC-12, NFR-03)
  - `ErrorState` expõe `role="alert"`, apresenta a mensagem recebida e oferece botão “Tentar novamente”; ativação por teclado chama `onRetry` uma vez. (AC-13, AC-17, NFR-03)
  - `EmptyState` apresenta título e dica fornecidos por props em `role="status"`/`aria-live="polite"`, anunciando orientação inicial ou ausência de resultados sem inventar cidade/dados. (AC-03, AC-14, AC-15)
  - Estado inicial mostra orientação de busca sem clima atribuído; estado pendente expõe `role=status` nomeado e o estado de erro expõe mensagem pt-BR e botão “Tentar novamente” operável por teclado. (AC-12 a AC-14, NFR-01, NFR-03)
  - Testes de módulo confirmam que componentes não importam `services/` e não executam `fetch`; ações externas são chamadas somente pelos callbacks recebidos. (arquitetura do plano)
- **Dependências:** T-04
- **Arquivos prováveis:** `src/components/SearchBar.tsx`, `src/components/states/EmptyState.tsx`, `src/components/states/ErrorState.tsx`, `src/components/states/LoadingState.tsx`, `tests/unit/states.test.tsx`
- **Tipo:** UI
- **Rastreabilidade:** FR-01, FR-06, FR-07; AC-01 a AC-03, AC-12 a AC-16; NFR-01, NFR-03, NFR-08.

### T-06 — Criar apresentação meteorológica

- **ID:** T-06
- **Título:** Criar apresentação meteorológica
- **Descrição:** Implementar exibição de condições atuais, previsão diária de cinco dias e controle de unidade com os valores tipados recebidos.
- **Critérios de aceite:**
  - Com fixture conhecida, seção atual renderiza temperatura, sensação, condição WMO e hora `dd/MM/yyyy HH:mm` com timezone, além de nome/localização disponíveis. Não afirma que o dado é observação de estação. (FR-02, AC-04, NFR-01)
  - Quando qualquer métrica opcional está ausente, seu rótulo/valor não aparece; quando presentes, umidade usa `%`, vento `km/h` e direções 0°, 44°, 46°, 315° são N, NE, NE, NW, precipitação usa `mm` e pressão `hPa`. (AC-05, AC-24)
  - O componente importa `formatTemperature` de `lib/temperature` e `getWeatherIcon`/`getWeatherLabel` de `lib/weatherCodes`; temperatura atual e sensação são exibidas na unidade recebida pelas props, sempre identificada por °C/°F, sem mutar dados-base ou fazer requisições. (AC-04, AC-08, AC-09, NFR-04)
  - Com fixture de cinco datas `2026-01-10` a `2026-01-14`, renderiza exatamente cinco entradas `10/01/2026` a `14/01/2026`; cada uma exibe rótulo do dia, ícone WMO, máxima/mínima na unidade selecionada e condição associados à mesma data. (AC-06, AC-07)
  - `ForecastList` usa exatamente `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`; cada card exibe probabilidade máxima de chuva como percentual inteiro quando presente e omite a métrica quando ausente, sem substituir campo ausente por zero. (AC-10, AC-28)
  - Código WMO `0` aparece como “Céu limpo”; código `999` não recebe descrição inventada e aciona estado de dados incompletos conforme o estado/callback recebido. (AC-18, AC-23)
  - Temperaturas exibem o símbolo da unidade; fixtures 0, 20 e -10 °C mostram 32, 68 e 14 °F após alternância, e o contador de chamadas não muda. (AC-08, AC-09, AC-22, AC-26, NFR-04)
  - Controle de unidade usa dois botões °C/°F num `role="group"` com nome acessível; somente a unidade ativa tem `aria-pressed="true"`, `onChange` recebe a unidade acionada e ambos os botões funcionam com Tab e Enter/Espaço. (AC-08, AC-09, NFR-03)
  - Testes consultam controles por nome/role acessível; revisão visual confirma indicador de foco visível; componentes não importam `services/`. (NFR-03)
- **Dependências:** T-02, T-04
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`, `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`, `src/components/UnitToggle.tsx`, `src/lib/format.ts`, `tests/unit/CurrentWeather.test.tsx`, `tests/unit/ForecastCard.test.tsx`, `tests/unit/format.test.ts`
- **Tipo:** UI
- **Rastreabilidade:** FR-02 a FR-04; AC-04 a AC-09, AC-18, AC-22 a AC-24, AC-26; NFR-01, NFR-03, NFR-04.

### T-07 — Compor aplicação e tema responsivo

- **ID:** T-07
- **Título:** Compor aplicação e tema responsivo
- **Descrição:** Ligar hook e componentes no shell do app e aplicar tema dark glassmorphism e layout mobile-first conforme as instruções do projeto.
- **Critérios de aceite:**
  - `App` liga cada estado/ação de `useWeather` ao componente correspondente; revisão de imports confirma ausência de dependência direta de `services/` e de chamadas `fetch` em `App`. (arquitetura do plano)
  - No incremento de protótipo com fixture, estado de UI é discriminado entre idle/loading/empty/error/success, unidade inicia em Celsius e permanece separada dos dados; somente a cidade contida no mock mostra sucesso, enquanto outras consultas mostram vazio. A resolução local é identificada como demonstração e não simula resposta de API. (AC-03, AC-08, AC-14)
  - O ramo de erro exibe mensagem e retry para a integração futura; não deve fabricar falha ou apresentar o mock como fallback de API. A integração posterior substitui o resolvedor local pelo hook/serviço sem alterar os componentes de apresentação. (AC-13, AC-18, NFR-06)
  - Há link de salto visível ao receber foco por teclado; a região de busca tem nome acessível; grupo de unidade e métricas mantêm semântica nomeada/descrição e todos os controles principais têm alvo de pelo menos 44 × 44 CSS px. (NFR-03)
  - Texto normal em botões de destaque mantém contraste WCAG 2.2 AA mínimo 4.5:1 em estado padrão e hover; foco de teclado é visível. Em larguras 320, 375, 640, 768, 1024 e 1440 CSS px, header, busca e unidade não causam overflow horizontal nem sobreposição. (AC-10, NFR-02, NFR-03)
  - CSS de componente é implementado por classes Tailwind; `src/styles/index.css` contém apenas diretivas/base globais. O shell usa `bg-night-900`/`bg-night-800`; cards usam `bg-white/5 backdrop-blur-md border border-white/10`; destaques usam tokens `accent-500`/`accent-400`/`text-sun`; previsão usa `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`. (instruções do projeto)
  - Nos viewports 320, 375, 768, 1024 e 1440 CSS px, teste verifica `scrollWidth === clientWidth` e bounding boxes dos controles essenciais dentro do viewport. (AC-10, NFR-02)
  - Em 375 × 667 CSS px, busca, seleção e alternância por ponteiro concluem e nenhum controle essencial está sobreposto/cortado. (AC-11)
  - Com geocoding/forecast respondendo erro, shell e busca permanecem operáveis e erro meteorológico aparece sem encerrar a aplicação. (NFR-06, NFR-09)
- **Dependências:** T-04, T-05, T-06
- **Arquivos prováveis:** `src/App.tsx`, `src/main.tsx`, `src/styles/index.css`, `tailwind.config.js`
- **Tipo:** UI
- **Rastreabilidade:** FR-05 a FR-07; AC-10 a AC-15; NFR-01 a NFR-03, NFR-06, NFR-09.



## Entrega 2 — Testes após integração

### T-08 — Testar conversão de unidade

- **ID:** T-08
- **Título:** Testar conversão de unidade
- **Descrição:** Criar testes unitários dedicados à conversão entre Celsius e Fahrenheit e ao arredondamento de apresentação, sempre a partir do valor-base.
- **Critérios de aceite:**
  - Testes verificam conversões exatas `0 °C→32 °F`, `20 °C→68 °F` e `-10 °C→14 °F` antes da formatação. (AC-08, AC-09)
  - Testes verificam arredondamento `1.5→2` e `-1.5→-2`, além de dez alternâncias sem alterar o valor-base ou acumular deriva. (AC-09, AC-26, NFR-04)
  - Testes verificam que a apresentação sempre identifica unidade com `°C` ou `°F`. (NFR-04)
  - `pnpm test -- tests/unit/temperature.test.ts` termina com código 0. (checklist do projeto)
- **Dependências:** T-02, T-07
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`
- **Tipo:** Test
- **Rastreabilidade:** AC-08, AC-09, AC-26; NFR-04.


### T-09 — Testar demais funções puras

- **ID:** T-09
- **Título:** Testar demais funções puras
- **Descrição:** Testar formatação pt-BR, interpretação WMO, direção do vento e calendário/timezone independentemente dos testes de conversão de unidade.
- **Critérios de aceite:**
  - Formatação verifica locale pt-BR, data `dd/MM/yyyy` e hora `HH:mm` com timezone identificado; o resultado permanece igual em processos com timezones diferentes. (AC-04, AC-07, NFR-01)
  - Rótulos de previsão verificam índice 0 como “Hoje”, índice 1 como “Amanhã”, demais índices como dia da semana e datas inválidas como erro explícito; datas são interpretadas como datas-calendário, sem deslocamento de timezone. (AC-06, AC-07)
  - Com relógio `2026-01-11T01:30:00Z` e `America/Sao_Paulo`, verifica exatamente `2026-01-10` a `2026-01-14`; timezone inválido não usa o timezone do dispositivo. (AC-06, AC-20)
  - Código WMO `0` resulta em “Céu limpo”; `999` não recebe descrição. Ângulos `0°`, `44°`, `46°` e `315°` resultam em `N`, `NE`, `NE` e `NW`. (AC-23, AC-24)
  - `pnpm test -- tests/unit/format.test.ts tests/unit/weatherCodes.test.ts` termina com código 0. (NFR-01, NFR-04, checklist do projeto)
- **Dependências:** T-02, T-07
- **Arquivos prováveis:** `tests/unit/format.test.ts`, `tests/unit/weatherCodes.test.ts`
- **Tipo:** Test
- **Rastreabilidade:** AC-04, AC-06, AC-07, AC-20, AC-23, AC-24; NFR-01, NFR-04.

### T-10 — Testar serviço Open-Meteo com fetch mockado

- **ID:** T-10
- **Título:** Testar serviço Open-Meteo com fetch mockado
- **Descrição:** Testar as chamadas, normalização, validação e falhas do serviço com `fetch` controlado e fixtures, sem rede real.
- **Critérios de aceite:**
  - Mock de `fetch` verifica URLs HTTPS, parâmetros geocoding (`language=pt`, `format=json`, trim e acentos) e preservação da ordem; seleção encaminha as coordenadas da cidade escolhida. (AC-01, AC-02, AC-16, AC-19, NFR-08)
  - Fixtures cobrem lista vazia, `results` malformado, campos/tipos inválidos, ids e coordenadas dentro/fora dos limites e campos opcionais ausentes/presentes. Respostas inválidas são rejeitadas com erro tipado. (AC-03, AC-05, NFR-06)
  - Mocks verificam requests current/daily, cinco dias, unidades, timezone independente, métricas opcionais de precipitação/pressão/probabilidade de chuva, arrays desalinhados, datas consecutivas, filtro de dias incompletos e erro sem dias completos. (AC-04 a AC-07, AC-18, AC-20, AC-23, AC-28)
  - Com relógio falso, request permanece pendente em 7.999 ms e falha com `timeout` em 8.000 ms; falhas de rede/HTTP/API/JSON são tipadas e não provocam retry automático. (AC-13, AC-17, NFR-06)
  - `pnpm test -- tests/unit/weatherService.test.ts` termina com código 0; `fetch` e timers são restaurados após cada teste. (checklist do projeto)
- **Dependências:** T-03, T-07
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`
- **Tipo:** Test
- **Rastreabilidade:** AC-01 a AC-07, AC-13, AC-16 a AC-20, AC-23; NFR-06, NFR-08.


### T-11 — Testar orquestração da sessão

- **ID:** T-11
- **Título:** Testar orquestração da sessão
- **Descrição:** Validar hook e transições de estado com serviços controlados, incluindo concorrência, retry e isolamento entre seções.
- **Critérios de aceite:**
  - Testes de hook verificam estado inicial exato (`idle`, Celsius, cidade indefinida), input whitespace sem chamadas, resultado vazio, resultado com cidades e seleção explícita. (AC-01, AC-03, AC-14, AC-15)
  - Teste submete ` São João d'Oeste ` e verifica que o serviço mockado recebe `São João d'Oeste`; remount do hook restaura estado inicial sem cidade e unidade Celsius. (AC-16, AC-25)
  - Para cada seção, teste de erro e retry confirma uma chamada adicional apenas para a operação acionada e estado/dados inalterados na seção irmã. (AC-13, AC-18)
  - Testes resolvem busca/cidade antiga por último e comparam estado final integral ao da busca/cidade mais recente; nenhum request meteorológico é iniciado pela resposta antiga. (AC-21, AC-27)
  - Após dez alternâncias e troca para outra cidade, teste confirma valores exibidos calculados dos valores-base e contador de chamadas meteorológicas sem incremento pela mudança de unidade. (AC-08, AC-09, AC-22)
  - Relógio falso confirma timeout aos 8 s, exibição do erro/retry e que resolver a promise depois não muda estado. (AC-12, AC-17)
  - `pnpm test -- tests/unit/useWeather.test.ts` termina com código 0. (AC-17, checklist do projeto)
- **Dependências:** T-04, T-07
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`
- **Tipo:** Test
- **Rastreabilidade:** AC-01, AC-03, AC-08, AC-09, AC-13, AC-14, AC-15, AC-16, AC-17, AC-18, AC-21, AC-22, AC-25, AC-27.

### T-12 — Testar estados loading, erro e vazio dos componentes

- **ID:** T-12
- **Título:** Testar estados loading, erro e vazio dos componentes
- **Descrição:** Criar testes dedicados dos componentes de busca e estados para ausência de entrada/resultados, carregamento e falhas recuperáveis.
- **Critérios de aceite:**
  - Input vazio/whitespace exibe orientação para informar cidade e aciona zero callbacks de busca; resposta de geocoding com lista vazia exibe estado sem resultados e mantém o termo digitado. (AC-03, AC-15)
  - Enquanto a promise controlada está pendente, existe `role="status"` com nome acessível; após resolver ou rejeitar, o status de loading deixa de estar presente. (AC-12)
  - Falhas de rede/HTTP/timeout mostram mensagem pt-BR e ação “Tentar novamente”; acioná-la por teclado chama exatamente uma vez o callback de retry. (AC-13, AC-17, NFR-01, NFR-03)
  - Erro/estado vazio não removem a busca nem dados válidos da seção meteorológica não afetada; após erro, busca continua habilitada. (AC-03, AC-18, NFR-06)
  - Queries acessíveis identificam busca, estados e retry; testes comprovam operação por teclado e que os componentes não chamam `fetch` nem importam services. (NFR-03, NFR-06)
  - `pnpm test -- tests/unit/SearchBar.test.tsx tests/unit/states.test.tsx` termina com código 0. (checklist do projeto)
- **Dependências:** T-05, T-06, T-07
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`, `tests/unit/states.test.tsx`
- **Tipo:** Test
- **Rastreabilidade:** AC-03, AC-12 a AC-18; NFR-01, NFR-03, NFR-06.


### T-13 — Testar fluxo E2E principal e viewport mobile

- **ID:** T-13
- **Título:** Testar fluxo E2E principal e viewport mobile
- **Descrição:** Validar com Playwright o fluxo de buscar, selecionar, consultar e alternar unidade, incluindo interação e layout mobile.
- **Critérios de aceite:**
  - Em Chromium, fixtures determinísticas percorrem estado inicial → busca por Enter → seleção explícita → clima atual e cinco datas → alternância °C/°F; máximas/mínimas e probabilidades disponíveis aparecem no dia correspondente, ausências de probabilidade são omitidas e a alternância não aumenta o contador de requests meteorológicos. (AC-01, AC-04, AC-06 a AC-09, AC-14, AC-28)
  - Em viewport 375 × 667 CSS px, busca, seleção e alternância terminam via interação de ponteiro; controles essenciais permanecem no viewport sem corte/sobreposição. (AC-10, AC-11)
  - Nos viewports 320, 375, 768, 1024 e 1440 CSS px, `document.documentElement.scrollWidth === document.documentElement.clientWidth`. (AC-10, NFR-02)
  - `page.route` intercepta todas as chamadas Open-Meteo; o teste não acessa a API real e falha se uma requisição não for interceptada. (NFR-06, NFR-08)
  - `pnpm test:e2e` termina com código 0 em Chromium. (NFR-10, checklist do projeto)
- **Dependências:** T-07, T-08, T-09, T-10, T-11, T-12
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, `tests/fixtures/`, `playwright.config.ts`
- **Tipo:** Test
- **Rastreabilidade:** AC-01, AC-04, AC-06 a AC-11, AC-14, AC-28; NFR-02, NFR-06, NFR-08, NFR-10.



## Entrega 3 — Hardening e prontidão de release

### T-14 — Executar validações de qualidade e release

- **ID:** T-14
- **Título:** Executar validações de qualidade e release
- **Descrição:** Executar verificações de código e os protocolos de acessibilidade, performance, compatibilidade e usabilidade antes da publicação.
- **Critérios de aceite:**
  - `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` terminam com código 0; relatório registra comando, resultado e exceções. (checklist do projeto)
  - Auditoria automatizada e revisão manual por teclado/leitor de tela registram zero violações WCAG 2.2 A/AA conhecidas nos fluxos principais de busca, seleção, leitura e unidade. (NFR-03)
  - São registradas 20 medições em Chromium headless, 375 × 667 CSS px, cache frio, CPU 4×, rede 10/5 Mbps e RTT 50 ms; campo visível/habilitado atende ≤2 s no p75 e conteúdo mockado ≤1 s após resposta. Latência API é reportada separadamente. (NFR-05)
  - Relatório lista os fluxos críticos executados nas duas versões estáveis mais recentes de cada família: Chrome, Edge, Firefox e Safari desktop; Safari no iOS; Chrome no Android. (NFR-10)
  - Teste moderado registra cinco participantes sem familiaridade, conclusão, tempo e bloqueios; ao menos quatro concluem sem ajuda a busca, seleção e localização do clima/previsão. (NFR-11)
- **Dependências:** T-08, T-09, T-10, T-11, T-12, T-13
- **Arquivos prováveis:** `package.json` (somente se scripts necessários estiverem ausentes), `tests/`, relatório de release documentado no processo do repositório
- **Tipo:** Infra
- **Rastreabilidade:** NFR-03, NFR-05, NFR-10, NFR-11.

### T-15 — Preparar requisitos operacionais de publicação

- **ID:** T-15
- **Título:** Preparar requisitos operacionais de publicação
- **Descrição:** Antes de publicar, decidir e registrar hospedagem estática, responsabilidade e destino de probes, e confirmar termos/limites vigentes da Open-Meteo; não presumir fornecedor neste backlog.
- **Critérios de aceite:**
  - Antes de publicar, registro identifica fornecedor/plataforma de hospedagem estática, responsável operacional e local dos dados dos probes; nenhum fornecedor é presumido pelo backlog. (NFR-09)
  - Probe configurado para intervalo de 5 minutos marca saudável somente quando recebe HTTP 200 e o shell/campo de busca está operável; indisponibilidade da Open-Meteo com shell operável é classificada saudável. (NFR-09)
  - Relatório de probes permite calcular `probes saudáveis ÷ probes totais` por mês e demonstra alvo ≥99,5%; falha no alvo bloqueia aprovação de release. (NFR-09)
  - Registro de release referencia os termos/limites vigentes da Open-Meteo e decisão explícita de compatibilidade; sem confirmação ou diante de incompatibilidade não aprovada, publicação é bloqueada. (spec: Verificações obrigatórias antes do lançamento)
  - Procedimento/configuração operacional fica documentado no artefato do fornecedor escolhido; desenvolvimento e testes locais não dependem dessa decisão. (NFR-09)
- **Dependências:** T-14
- **Arquivos prováveis:** documentação de deploy (`README.md` ou documento operacional existente), configuração de hospedagem/CI e probe, a definir após escolha da plataforma
- **Tipo:** Infra
- **Rastreabilidade:** NFR-09; risco de termos/limites do provedor e verificações obrigatórias antes do lançamento na spec.
