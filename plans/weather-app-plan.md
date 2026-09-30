# Plano Técnico — Weather App

Este plano deriva de [`specs/weather-app-spec.md`](../specs/weather-app-spec.md), que é a fonte da verdade para escopo e comportamento. Define arquitetura e contratos para as tarefas de implementação; não contém o código final. Se houver divergência, prevalece a spec.

## Architecture

Aplicação web client-side, sem backend próprio. A UI React consome serviços isolados para geocodificação e dados meteorológicos, normaliza as respostas externas para tipos internos e mantém o estado da sessão em memória.

```text
components + App
    | props / callbacks; funções puras de lib
    v
hooks/useWeather
    | operações assíncronas
    v
services/weatherService
    | fetch HTTPS; parseia unknown e normaliza para tipos de domínio
    +---- Open-Meteo Geocoding API
    +---- Open-Meteo Forecast API

lib (WMO, conversão, formatação e cálculos puros)
types (contratos compartilhados; sem dependências de runtime)
```

- **Apresentação (`components/`):** renderiza propriedades recebidas, expõe controles acessíveis e envia ações por callbacks. Não faz fetch, não conhece URLs e não interpreta payloads da API.
- **Composição (`App.tsx`):** liga o hook aos componentes e organiza a página; não contém regras de domínio ou chamadas de rede.
- **Orquestração (`hooks/`):** `useWeather` coordena busca, seleção, unidade, estados independentes de atual/previsão, retry, cancelamento e descarte de respostas obsoletas. Não implementa protocolo HTTP nem regras de formatação.
- **Acesso a dados (`services/`):** constrói URLs, chama `fetch`, aplica timeout, valida respostas externas recebidas como `unknown` e as converte para tipos internos. Não depende de React nem de componentes.
- **Funções puras (`lib/`):** contém conversões, arredondamento, formatação, mapeamento WMO e direção do vento. Não acessa rede, DOM ou estado React.
- **Contratos (`types/`):** tipos compartilhados por UI, hooks e serviços; não importa módulos de runtime.
- Dependências permitidas: `App/components → hooks → services`; `App/components/hooks/services → lib/types` conforme necessário. `lib` e `types` não importam camadas superiores; `services` não importa React; componentes não importam serviços.
- Essa direção mantém cada camada substituível: componentes testam-se com props/callbacks, hooks com serviços mockados, serviços com `fetch` controlado e funções puras com entradas/saídas determinísticas.
- Não há backend, autenticação, cache, armazenamento local, analytics ou dependência de uma API key.
- Cada conjunto de dados (atual e previsão) tem carregamento, erro e retry próprios, conforme FR-06 e AC-13, AC-18 e AC-20.

## Tech Stack

| Tecnologia | Uso no plano |
|---|---|
| TypeScript strict | Tipar estado, contratos internos e integração com payloads externos. |
| React 19 | Composição da UI e hook local para estado da aplicação. |
| Vite | Servidor de desenvolvimento e build estático. |
| Tailwind CSS | Layout mobile-first e tema dark glassmorphism definido pelas instruções do projeto; usar a paleta `night`/`accent`/`sun`, cartões glass e foco visível, sem criar identidade de marca ou design system adicional. |
| Vitest + Testing Library | Testes unitários e de componentes com dependências de rede controladas. |
| Playwright | Fluxos E2E, viewports e verificações de interação entre navegadores. |
| Biome | Lint e formatação conforme scripts existentes. |
| pnpm | Instalação e execução dos scripts existentes. |

Não adicionar dependências para estado global, chamadas HTTP, validação de schema ou formatação sem uma necessidade demonstrada: `fetch`, `AbortController` e funções tipadas bastam para o escopo atual.

## Project Structure

Organizar `src/` por responsabilidade e preservar a convenção existente de um componente por arquivo:

```text
src/
├── components/
│   ├── states/
│   │   ├── EmptyState.tsx      # Orientação inicial e busca vazia
│   │   ├── ErrorState.tsx      # Erro visível e retry
│   │   └── LoadingState.tsx    # Status acessível de carregamento
│   ├── SearchBar.tsx           # Entrada, Enter e submissão
│   ├── CurrentWeather.tsx      # Condições atuais
│   ├── ForecastList.tsx        # Lista dos dias completos
│   ├── ForecastCard.tsx        # Apresentação de um dia
│   └── UnitToggle.tsx          # Celsius/Fahrenheit
├── hooks/
│   └── useWeather.ts           # Orquestração e estado da sessão
├── services/
│   └── weatherService.ts       # Open-Meteo, timeout e normalização
├── mocks/
│   └── weatherData.ts          # Fixture sintética para desenvolvimento de UI
├── lib/
│   ├── format.ts               # Datas, números e rótulos pt-BR
│   ├── temperature.ts          # Conversão e arredondamento
│   └── weatherCodes.ts         # Mapeamento WMO fechado
├── types/
│   └── weather.ts              # Contratos de domínio e estado
├── styles/
│   └── index.css
├── App.tsx
└── main.tsx
```

`services/weatherService.ts` mantém operações explícitas para geocoding, clima atual e previsão; elas compartilham transporte e validação sem colapsar os estados independentes. `tests/unit/` espelha funções, serviços, hooks e componentes; `tests/e2e/` cobre os fluxos de ponta a ponta, conforme a Testing Strategy. Não criar diretórios/camadas adicionais sem requisito concreto.

Usar `src/styles/index.css` somente para diretivas/base globais necessárias ao Tailwind; estilos de componentes usam utilitários Tailwind, sem arquivos CSS por componente. A previsão usa grid responsivo conforme `.github/instructions/tailwind.instructions.md`. A decisão da spec de usar uma interface neutra quando não houver padrão visual não substitui o tema obrigatório definido pelas instruções do repositório; não se adiciona marca ou sistema visual separado.

## Data Model

Contratos de domínio propostos. Payloads HTTP devem entrar como `unknown`, ser validados/normalizados no serviço e nunca ser usados diretamente pela UI.

```ts
type Unit = "celsius" | "fahrenheit";

interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
}

interface CurrentWeather {
  temperatureC: number;
  apparentTemperatureC: number;
  weatherCode: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  windDirectionDegrees?: number;
  precipitationMm?: number;
  pressureHpa?: number;
  referenceTime: string;
  timezone: string;
}

interface ForecastDay {
  date: string;
  minTemperatureC: number;
  maxTemperatureC: number;
  weatherCode: number;
  rainProbabilityPercent?: number;
}

type OperationState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: WeatherError };

type SearchState = OperationState<City[]> | { status: "empty" };

type WeatherError =
  | { kind: "network" }
  | { kind: "http"; status: number }
  | { kind: "api" }
  | { kind: "timeout" }
  | { kind: "invalid-response" }
  | { kind: "timezone-unavailable"; section: "current" | "forecast" }
  | { kind: "incomplete-data"; section: "current" | "forecast" };

interface WeatherState {
  query: string;
  search: SearchState;
  selectedCity?: City;
  current: OperationState<CurrentWeather>;
  forecast: OperationState<ForecastDay[]>;
  unit: Unit;
}

interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
```

Regras dos contratos:

- `City.id` identifica a localidade retornada; a seleção e consultas usam latitude/longitude, não o texto pesquisado (FR-01, AC-19).
- Clima atual exige temperatura do ar, aparente, código WMO conhecido, horário de referência utilizável e timezone válido recebido na resposta atual. O timezone acompanha `CurrentWeather`, permitindo formatar a hora local mesmo se a previsão falhar; sem timezone, somente a operação atual termina com `timezone-unavailable`. Umidade, velocidade/direção do vento, precipitação e pressão são opcionais e ausentes são omitidos, não convertidos em zero; precipitação usa mm e pressão ao nível médio do mar usa hPa (FR-02, AC-04, AC-05, AC-23).
- Cada dia exige data, mínima, máxima e código WMO conhecido. A probabilidade máxima de precipitação é opcional, validada entre 0 e 100 e omitida quando ausente (FR-03, AC-07, AC-28). Dias incompletos são descartados; se não houver dia completo, a operação de previsão termina em erro (FR-03, AC-18, AC-23).
- A resposta atual e a resposta diária são normalizadas independentemente: cada operação mantém seu estado e valida o timezone que recebeu. `WeatherData` é somente uma composição de cidade, clima atual e dias de previsão para fixtures e apresentação; não é retorno agregado dos serviços nem estado do hook, portanto não acopla erros, carregamento ou sucesso entre as seções. Um timezone válido é um identificador não vazio aceito pela opção `timeZone` de `Intl.DateTimeFormat`. `CurrentWeather.timezone` identifica o fuso da hora de referência; a operação de previsão valida o próprio timezone antes de aceitar suas datas locais. `CurrentWeather.referenceTime` é validado e formatado como data/hora local fornecida pela API, sem convertê-lo usando o timezone do dispositivo. `ForecastDay.date` é uma data-calendário local no formato `YYYY-MM-DD`, não um instante a reinterpretar no fuso do navegador; a lista deve conter hoje e os quatro dias locais seguintes, consecutivos no calendário.
- `City` não inclui timezone: o timezone opcional da geocodificação é ignorado e não substitui o timezone retornado pelo endpoint meteorológico correspondente.
- Os valores normalizados são numéricos sem arredondamento e em Celsius. A UI aplica conversão e arredondamento somente ao apresentar (FR-04, NFR-04, AC-08, AC-09, AC-26).
- A descrição pt-BR é obtida de um mapa explícito de códigos WMO; código não mapeado é dado incompleto, nunca texto inferido.
- A unidade inicial é `celsius`; a unidade não é persistida e sobrevive apenas à troca de cidade na sessão (AC-22, AC-25).

## Data Flow

1. Ao carregar, inicializar busca vazia, sem cidade selecionada, operações meteorológicas em `idle` e unidade Celsius; apresentar orientação inicial (FR-07, AC-14).
2. Ao submeter, aplicar `trim()` apenas nas bordas. Para texto vazio, não chamar a API; para consulta válida, marcar busca como `loading` (FR-01, FR-07, AC-15, AC-16).
3. O serviço envia a consulta de geocodificação. Lista vazia resulta em `empty`; lista válida é normalizada e preservada na ordem da API. Nenhuma cidade é selecionada automaticamente (AC-01, AC-02, AC-03).
4. Ao selecionar um resultado, associar a seleção à cidade e consultar clima atual e previsão em operações independentes, ambas com as coordenadas daquela cidade.
5. Normalizar cada resposta no serviço. Atualizar apenas sua operação correspondente; respostas de buscas/cidades/solicitações antigas não podem substituir o estado mais recente (AC-21, AC-27).
6. Renderizar seções atuais e previsão independentemente. Um resultado válido pode permanecer visível quando a outra operação falha (AC-18).
7. Ao alternar unidade, atualizar a apresentação de todos os valores a partir dos valores-base em Celsius, sem requisição (AC-08, AC-09).
8. Ao recarregar, descartar busca, cidade e unidade anteriores; reiniciar em Celsius e sem dados meteorológicos (AC-25).

### Diagrama do fluxo

```mermaid
flowchart TD
    UI[Componentes de UI<br/>SearchBar / resultados] -->|submit(query)| Hook[useWeather<br/>estado da sessão]
    Hook -->|consulta trimada| Geo[weatherService.geocode]
    Geo -->|fetch HTTPS| GeoAPI[Open-Meteo Geocoding API]
    GeoAPI -->|payload JSON| Geo
    Geo -->|City[] validado| Hook

    Hook -->|search = success<br/>renderiza opções| UI
    Geo -->|lista válida vazia| Empty[search = empty]
    Empty -->|mensagem sem resultados<br/>termo preservado| UI
    Geo -->|rede / HTTP / API / timeout<br/>ou resposta inválida| GeoError[search = error]
    GeoError -->|erro acessível + retry manual| UI
    UI -->|seleciona City| Hook

    Hook -->|coordenadas da City| Forecast[weatherService<br/>consultas independentes]
    Forecast -->|consulta atual| CurrentAPI[Open-Meteo Forecast API<br/>current]
    Forecast -->|consulta diária: 5 dias| DailyAPI[Open-Meteo Forecast API<br/>daily]
    CurrentAPI -->|resposta| Forecast
    DailyAPI -->|resposta| Forecast
    Forecast -->|CurrentWeather validado| Hook
    Forecast -->|ForecastDay[] válidos<br/>timezone validado| Hook
    Forecast -->|erro da consulta atual| CurrentError[current = error]
    Forecast -->|erro da previsão / timezone| DailyError[forecast = error]
    Forecast -->|resposta parcial<br/>filtra dias incompletos| Partial{Há dado completo?}
    Partial -->|sim| Hook
    Partial -->|não| DataError[seção correspondente = error<br/>dados incompletos]
    CurrentError --> Hook
    DailyError --> Hook
    DataError --> Hook

    Hook -->|estados independentes<br/>loading / success / error| UIData[Componentes de UI<br/>CurrentWeather / ForecastList / States]
    Hook -->|retry manual da seção afetada| Forecast
    UIData -->|muda Unit: conversão derivada<br/>sem request meteorológico| Hook
```

## External APIs

Todas as chamadas são HTTPS diretas do navegador, sem chave. Usar `URL`/`URLSearchParams` para codificar parâmetros e tratar a resposta como não confiável.

### Geocoding

- Base: `https://geocoding-api.open-meteo.com/v1/search`
- Parâmetros: `name=<consulta trimada>`, `language=pt`, `format=json`.
- Não impor ordenação local nem selecionar automaticamente; preservar a ordem recebida.
- Mapear `id`, `name`, `latitude`, `longitude`, `country`, `country_code` e `admin1` para `City`; `timezone` não é usado. Para cada resultado, exigir `id` inteiro positivo, `name` não vazio e coordenadas numéricas finitas dentro dos limites geográficos (latitude −90..90, longitude −180..180). País/região são opcionais; se fornecidos, devem ser strings válidas.
- `results` ausente ou lista vazia representa ausência de resultados somente em um objeto JSON estruturalmente válido; se `results` existir, deve ser uma lista e todos os itens devem satisfazer o contrato de `City`. Item malformado invalida a resposta inteira como `invalid-response`, em vez de descartar silenciosamente um resultado ou alterar a ordem.

### Forecast

- Base: `https://api.open-meteo.com/v1/forecast`
- Fazer duas chamadas independentes para uma cidade selecionada, para que o clima atual e a previsão possam falhar e ser repetidos separadamente conforme FR-06:
  - Atual: `latitude`, `longitude`, `current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,pressure_msl`, `temperature_unit=celsius`, `wind_speed_unit=kmh`, `precipitation_unit=mm`, `pressure_unit=hPa`, `timezone=auto`.
  - Diária: `latitude`, `longitude`, `daily=temperature_2m_min,temperature_2m_max,weather_code,precipitation_probability_max`, `forecast_days=5`, `temperature_unit=celsius`, `wind_speed_unit=kmh`, `timezone=auto`.
- Exigir as unidades e campos temporais correspondentes ao contrato na validação; aceitar campos opcionais somente quando presentes e válidos. Arrays diários opcionais de probabilidade devem estar alinhados às datas e conter números entre 0 e 100; valor inválido invalida a resposta, campo ausente omite a métrica apenas nos dias correspondentes.
- Cada resposta meteorológica deve validar seu próprio identificador de timezone utilizável (aceito por `Intl.DateTimeFormat`). O timezone da resposta atual é mantido em `CurrentWeather` para exibir `referenceTime` como `dd/MM/yyyy HH:mm` local, acompanhado do identificador do fuso. Validar e formatar os componentes locais retornados pela API; não interpretar uma string sem offset com `new Date()` no timezone do dispositivo. O timezone da resposta diária é usado para validar as cinco datas locais consecutivas, incluindo que a primeira seja hoje no calendário desse fuso; usar relógio controlável nos testes e não depender do timezone da máquina. Se o atual não tiver timezone válido, somente `current` falha; se a resposta diária não tiver timezone válido, somente `forecast` falha. Nunca recorrer ao timezone do navegador (AC-04, AC-06, AC-20).
- A consulta de temperatura é sempre em Celsius: a alternância °C/°F é local e não causa nova chamada.
- Limitar cada chamada a oito segundos. Não adicionar retry automático, cache, proxy ou persistência. Repetição manual refaz somente a operação que falhou.
- Confirmar termos e limites do provedor antes de publicar, como exige a spec; essa verificação não bloqueia desenvolvimento local.

## State Management

Manter o estado em memória em um único hook `useWeather`, consumido por `App`; não usar Context, store global, URL state ou persistência para esta tela única. O hook expõe estado e ações sem expor payloads HTTP:

```ts
interface UseWeatherResult extends WeatherState {
  submitSearch(query: string): Promise<void>;
  selectCity(city: City): void;
  retrySearch(): Promise<void>;
  retryCurrent(): Promise<void>;
  retryForecast(): Promise<void>;
  setUnit(unit: Unit): void;
}
```

Estados explícitos:

| Estado | Significado e uso |
|---|---|
| `idle` | Operação ainda não iniciada; usado para clima/previsão sem cidade selecionada e antes de uma tentativa. |
| `loading` | Requisição da operação em andamento; expor status acessível. |
| `success` | Operação concluída com dados validados e normalizados. |
| `error` | Operação falhou; contém erro tipado e ação de retry manual quando aplicável. |
| `empty` | Somente busca de geocoding válida sem resultados; mantém termo para edição. Não representa clima ou previsão vazios. |

- Busca, clima atual e previsão têm estados independentes. Falha/retry de uma seção não substitui os dados válidos nem o estado da outra seção.
- Inicializar `search`, `current` e `forecast` em `idle`, sem cidade selecionada, e `unit` em `celsius`. Busca sem resultados resulta em `search: empty`.
- Novo termo invalida a busca anterior. Nova cidade selecionada invalida resultados meteorológicos da cidade anterior e inicia as duas operações para a nova seleção.
- Usar `AbortController` para cancelar chamadas substituídas ou expiradas e uma identidade/geração por operação para ignorar respostas tardias mesmo quando o cancelamento não impeça a conclusão (AC-17, AC-21, AC-27).
- Retry é sempre explícito, inicia exatamente uma nova chamada da operação afetada e mantém intacta a outra seção (AC-13, AC-18).
- A preferência `unit` vive no estado do hook e dura apenas a sessão. Não há persistência em `localStorage`, `sessionStorage`, cookies ou servidor.
- Temperaturas ficam armazenadas somente em Celsius, sem arredondamento. Na renderização, uma função pura recebe o valor-base e `unit`: para Celsius usa o valor original; para Fahrenheit calcula `C × 9 / 5 + 32`; arredonda então ao inteiro mais próximo com empates afastando-se de zero e acrescenta o símbolo correspondente.
- Componentes derivam o texto exibido diretamente dos dados-base e da unidade selecionada. Não armazenar valores convertidos, não converter sucessivamente o valor já exibido e não disparar request ao trocar unidade; assim a alternância repetida não acumula erro (AC-08, AC-09, AC-22, AC-26).
- Ao recarregar, inicializar novamente em Celsius, sem cidade selecionada e sem resultados anteriores (AC-25).

## Error Handling

O serviço converte falhas em `WeatherError`; o componente de estado traduz cada categoria para mensagem pt-BR, com ação apropriada. Não capturar erros indiscriminadamente, expor payload bruto/razões externas ao usuário ou retornar dados com formato de sucesso em caso de falha.

| Situação | Estado/ação |
|---|---|
| Busca vazia | Não enviar requisição; orientar a informar uma cidade. |
| Geocoding válido sem resultados | `search: empty`; manter texto editável e permitir nova busca. |
| Falha de rede (`network`) | Marcar somente a operação afetada como `error`; mensagem de conexão em pt-BR e retry manual. |
| HTTP não-success (`http`) | Guardar status para diagnóstico; apresentar mensagem genérica em pt-BR e retry manual. Não tratar corpo de erro como dado meteorológico. |
| Erro declarado pela API (`api`) | Normalizar resposta de erro da Open-Meteo, sem expor `reason` bruto; marcar operação como erro com retry manual. |
| Timeout (`timeout`) | Cada request termina em até 8 s; abortar quando possível, anunciar timeout e oferecer retry. Ignorar qualquer resposta que chegue após a expiração. |
| JSON inválido, shape inesperado ou unidades incompatíveis (`invalid-response`) | Rejeitar resposta e marcar só a operação correspondente como erro; nunca renderizar como sucesso ou assumir defaults. |
| Clima atual incompleto (`incomplete-data: current`) | Se faltar temperatura do ar/aparente, horário de referência ou condição WMO mapeável, marcar clima atual como erro de dados incompletos e oferecer retry; manter previsão válida. Campos de umidade/vento/precipitação/pressão são opcionais e simplesmente omitidos quando ausentes. |
| Previsão parcialmente incompleta (`incomplete-data: forecast`) | Omitir dias sem data, mínima, máxima ou condição WMO mapeável; mostrar dias válidos. Se nenhum dia for completo, marcar previsão como erro e oferecer retry; manter clima atual válido. |
| Timezone ausente/inválido (`timezone-unavailable`) | Se falhar a resposta atual, não exibir seu horário local; se falhar a previsão, não exibir datas calculadas com timezone do dispositivo. Marcar como erro somente a operação cuja resposta não forneceu timezone válido e oferecer retry; manter os dados válidos da outra seção. |
| Resposta de operação antiga | Ignorar sem alterar estado visível ou iniciar consultas para a cidade antiga. |

Loading e erros devem usar status acessível; retry deve ser operável por teclado e anunciado (NFR-03, AC-12, AC-13). O shell e a busca permanecem utilizáveis quando a API falhar (NFR-06, NFR-09).

## Testing Strategy

Usar Vitest + Testing Library para testes isolados rápidos e Playwright para validar os fluxos integrados no navegador. `pnpm test` cobre Vitest; `pnpm test:e2e` cobre Playwright. Construir fixtures estáticas e controlar toda a rede: nenhum teste automatizado depende da disponibilidade, conteúdo ou limites correntes da Open-Meteo. A matriz de rastreabilidade da spec é a fonte para relacionar cada teste aos ACs.

### Vitest — funções puras

Testar entradas e saídas sem React, DOM, relógio real ou rede:

- Conversão °C ↔ °F, conversão repetida sempre a partir do valor-base em °C e ausência de deriva por arredondamento (AC-08, AC-09).
- Arredondamento ao inteiro mais próximo com empates afastando-se de zero, incluindo positivos, negativos e zero (AC-26).
- Formatação pt-BR de número, temperatura, data e hora, respeitando a unidade em cada valor; hora de referência usa o timezone da resposta atual e o apresenta junto ao horário (AC-04, AC-07; NFR-01, NFR-04).
- Mapeamento de códigos WMO conhecidos e comportamento explícito para código sem mapeamento; nunca inferir descrição (AC-23).
- Conversão dos ângulos de vento para oito setores cardeais, inclusive limites entre setores (AC-24).
- Seleção/validação de datas consecutivas no timezone fornecido, sem depender do timezone da máquina de teste (AC-06, AC-20).

### Vitest — serviços com `fetch` mockado

Substituir `globalThis.fetch` por mock controlável, restaurando-o após cada teste. Verificar método, URL e parâmetros, sinal de abort, número de chamadas e resposta normalizada:

- Geocoding: trim externo, acentos/caracteres internos, idioma `pt`, preservação da ordem, campos opcionais de cidade, timezone da geocodificação ignorado, coordenadas/identificadores inválidos, lista vazia válida e payload malformado (AC-01 a AC-03, AC-16).
- Forecast: chamadas separadas para dados atuais e diários; coordenadas da cidade escolhida; unidades sempre Celsius/km/h; solicitação de cinco dias e timezone automático (AC-19).
- Respostas: campos essenciais válidos, opcionais ausentes, WMO desconhecido, dias parciais, arrays desiguais/malformados, unidades ausentes/incompatíveis e timezone ausente/inválido em cada operação; falha de timezone em uma operação não apaga o sucesso da outra (AC-04, AC-05, AC-18, AC-20, AC-23).
- Falhas: rejeição de rede, HTTP não-success, erro declarado pela API, JSON inválido e timeout de 8 s; garantir que erro nunca resulte em dado com formato de sucesso e que retry seja responsabilidade explícita do chamador (AC-13, AC-17).
- Concorrência/cancelamento: chamadas abortadas ou superadas não podem ser aceitas como resultado atual (AC-21, AC-27).

### Vitest + Testing Library — hooks e componentes

Renderizar componentes com dados/ações controlados ou mockar apenas a fronteira do serviço no teste do hook. Cobrir:

- Estado inicial orientando a busca; submit vazio não chama serviço; resultados vazios mantêm o termo e permitem nova tentativa (AC-03, AC-14, AC-15).
- Busca por botão e Enter; resultados distinguíveis por região/país, na ordem recebida e sem seleção automática; selecionar a opção aciona coordenadas corretas (AC-01, AC-02, AC-19).
- Estados visíveis de busca/clima: `idle`, `loading`, `success`, `error`; estado `empty` exclusivo de geocoding sem resultados. Loading usa status acessível; erro é anunciado e oferece ação manual quando recuperável (AC-12, AC-13).
- Erro ou retry de clima atual preserva a previsão válida, e erro ou retry de previsão preserva clima atual válido; dias incompletos são omitidos e seção sem dados completos mostra erro (AC-18, AC-20).
- Alternar unidade enquanto carregando e após sucesso; UI apresenta valores derivados, preserva valores-base, não chama serviço e continua Fahrenheit ao trocar cidade na sessão; nova inicialização volta a Celsius (AC-08, AC-09, AC-22, AC-25).
- Teclado, roles, labels, foco visível, live/status regions e controles acionáveis sem pointer (NFR-03).

### Playwright — E2E e viewport mobile

Interceptar com `page.route` as requisições de geocoding e as duas operações meteorológicas; usar fixtures versionadas e relógio/controladores determinísticos. Manter poucos cenários abrangentes, deixando os casos combinatórios nos testes Vitest:

1. Fluxo principal: abrir estado inicial, buscar por Enter, distinguir/selecionar cidade, ver clima atual e cinco datas e alternar °C/°F sem nova chamada meteorológica (AC-01, AC-04, AC-06 a AC-09, AC-14).
2. Busca sem resultados e input vazio: mensagens corretas, termo editável e nenhuma consulta meteorológica indevida (AC-03, AC-15).
3. Falha/timeout e retry manual: erro acessível, exatamente uma nova tentativa e sucesso posterior; não aceitar resposta atrasada (AC-12, AC-13, AC-17, AC-21, AC-27).
4. Resposta parcial: dados válidos de uma seção continuam visíveis se a outra falhar; previsão exibe somente dias completos (AC-18, AC-20, AC-23).
5. Mobile: viewport 375 × 667 CSS px com fluxo de busca, seleção e unidade via interação de ponteiro; sem controles cortados/sobrepostos nem overflow horizontal. Adicionar teste de larguras 320, 375, 768, 1024 e 1440 CSS px para a regra de layout (AC-10, AC-11).

Executar E2E em Chromium por padrão; a matriz de compatibilidade NFR-10 deve ser uma verificação de release nas versões de navegadores suportadas, não uma multiplicação obrigatória de todos os casos E2E.

### Verificações de release

- Código: executar `pnpm lint`, `pnpm build` e `pnpm test` antes de concluir a tarefa; executar também `pnpm test:e2e` para validar os fluxos Playwright.
- Acessibilidade: testes automatizados não substituem auditoria automatizada e revisão manual por teclado/leitor de tela; não pode haver violações WCAG A/AA conhecidas nos fluxos principais (NFR-03).
- Performance: executar protocolo NFR-05 com 20 medições em Chromium, cache frio, CPU 4× e rede especificada; campo de busca ≤2 s no p75 e conteúdo mockado ≤1 s após resposta.
- Compatibilidade: executar fluxos críticos nas versões definidas em NFR-10.
- Usabilidade: teste moderado com cinco participantes; pelo menos quatro concluem tarefas centrais sem ajuda (NFR-11).
- Disponibilidade: probes a cada 5 minutos e alvo mensal ≥99,5%, segundo NFR-09. Trata-se de requisito operacional da publicação, não de lógica da aplicação client-side. Como a plataforma de hospedagem não está definida neste plano, as tarefas de release devem identificar hospedagem estática, responsável pelos probes e destino dos resultados antes da publicação; isso não bloqueia o desenvolvimento local.

## Risks & Trade-offs

| Decisão | Trade-off / risco | Alternativa considerada e motivo para não adotá-la no MVP |
|---|---|---|
| Vitest para unidades/componentes; Playwright para poucos fluxos E2E | Testes isolados são rápidos e localizam falhas; E2E cobre integração real, mas é mais lento e frágil. | Cobrir toda combinação apenas via E2E: custo/tempo alto e diagnósticos piores. Manter regras combinatórias em Vitest e fluxo crítico em Playwright. |
| `fetch` mockado/interceptado e fixtures fixas | Resultados são reproduzíveis e não dependem da internet; fixtures não detectam automaticamente mudanças reais da API. | Chamar Open-Meteo em cada teste: flakiness, limites externos e builds não determinísticos. Fazer validação integrada separada, controlada e não bloqueante para o ciclo unitário. |
| Duas chamadas meteorológicas por cidade (atual e diária) | Aumenta requisições e possível latência/cota, mas permite estados e retry independentes exigidos pela spec. | Uma chamada combinada reduz requests, mas acopla falhas/retry das seções; não corresponde ao comportamento requerido. |
| Estado local em hook, sem store global | Simples para uma tela e fácil de montar isoladamente; compartilhar estado entre novas rotas/componentes distantes exigiria revisão. | Redux/Context/store externo: adiciona dependência e abstração sem necessidade atual. |
| Sem cache ou persistência | Mantém privacidade e evita exibir dados antigos como atuais; recarregar perde cidade e unidade volta a Celsius. | `localStorage`/cache offline melhoraria conveniência, mas contradiz decisões explícitas do MVP e aumenta estados/testes de invalidação. |
| Temperaturas canônicas em °C; conversão derivada | Alternância não chama API e não acumula arredondamento; a apresentação sempre depende da transformação pura testada. | Persistir valores convertidos ou pedir dados Fahrenheit ao provedor: risco de deriva e/ou nova chamada, contrariando FR-04. |
| Timeout de 8 s e retry somente manual | Evita chamadas repetidas e fornece controle explícito ao usuário; pode exigir ação manual durante falha transitória. | Retry automático/backoff melhora recuperação percebida, mas pode duplicar chamadas e exceder limites; fica fora do MVP. |
| Descrições WMO mapeadas explicitamente e datas pelo timezone da API | Resultados são previsíveis, mas códigos futuros/desconhecidos e timezone inválido deixam dados incompletos. | Inferir descrição ou usar timezone do dispositivo parece mais tolerante, mas pode exibir informação incorreta; falhar explicitamente é preferível. |
| Limitar E2E padrão a Chromium e verificar matriz de navegador no release | Reduz duração da suíte regular; regressões específicas de browser podem escapar até a validação de release. | Rodar todos os cenários em todas as versões/navegadores a cada execução: custo elevado sem ganho proporcional para o MVP. |
| NFRs de performance, disponibilidade, acessibilidade manual e usabilidade como verificações de release | Não são demonstrados apenas por testes unitários locais; exigem ambiente, usuários ou auditoria próprios. | Fingir cobertura via mocks/testes unitários daria confiança enganosa. Manter procedimentos e limiares explícitos conforme a spec. |
