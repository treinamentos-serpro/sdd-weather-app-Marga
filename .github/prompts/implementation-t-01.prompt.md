---
mode: agent
description: 'Implementa T-01: contratos de domínio e estado do Weather App.'
---

# Prompt de implementação — T-01: Definir contratos de domínio e estado

Você é o **Code Agent** do projeto SDD Weather App. Implemente somente a tarefa T-01 abaixo, usando este prompt como contexto autocontido e consultando os artefatos indicados apenas para confirmar consistência. Não avance para T-02 nem implemente lógica de runtime.

## Contexto

O Weather App é uma aplicação client-side em TypeScript strict, React e Vite que consulta Open-Meteo sem backend próprio ou API key. Os dados externos serão validados e normalizados nas tarefas posteriores; esta tarefa define apenas os contratos internos compartilhados.

Princípios relevantes:

- Contratos compartilhados não dependem de React, DOM, serviços ou outras camadas de runtime.
- `City` representa o resultado de geocoding; as consultas meteorológicas usam coordenadas. O timezone opcional de geocoding é ignorado.
- Valores meteorológicos normalizados permanecem em Celsius e sem arredondamento. Formatação e conversões pertencem a tarefas posteriores.
- Clima atual e previsão são operações independentes, cada qual com seu estado e erro.
- Narrativa e comentários explicativos em arquivos do projeto devem estar em pt-BR; identificadores e tipos em inglês.

## Escopo

Atualize exclusivamente:

- `src/types/weather.ts`

Não crie serviços, hooks, componentes, helpers, fixtures ou testes nesta tarefa. Não altere configurações nem outros arquivos para contornar problemas fora deste escopo.

## Contratos que devem existir

Declare os tipos/interfaces abaixo em `src/types/weather.ts`, com documentação breve em pt-BR onde útil:

1. `Unit`: união `'celsius' | 'fahrenheit'`.
2. `City`: `id: number`, `name: string`, `latitude: number`, `longitude: number`; campos opcionais `country`, `countryCode` e `admin1`, todos `string`. Não deve conter `timezone`.
3. `CurrentWeather`:
   - `temperatureC: number`
   - `apparentTemperatureC: number`
   - `weatherCode: number`
   - `humidityPercent?: number`
   - `windSpeedKmh?: number`
   - `windDirectionDegrees?: number`
   - `precipitationMm?: number`
   - `pressureHpa?: number`
   - `referenceTime: string`
   - `timezone: string`

   Temperaturas são valores Celsius sem arredondamento. `timezone` é o timezone IANA validado retornado pela resposta de clima atual.
4. `ForecastDay`: `date: string` (data-calendário local `YYYY-MM-DD`), `minTemperatureC: number`, `maxTemperatureC: number`, `weatherCode: number`.
5. `WeatherData`: composição de apresentação com `city: City`, `current: CurrentWeather` e `forecast: ForecastDay[]`. Não é retorno agregado de serviço nem estado do hook; o hook mantém operações atual e previsão independentes.
6. `WeatherError`: união discriminada contendo:
   - `{ kind: 'network' }`
   - `{ kind: 'http'; status: number }`
   - `{ kind: 'api' }`
   - `{ kind: 'timeout' }`
   - `{ kind: 'invalid-response' }`
   - `{ kind: 'timezone-unavailable'; section: 'current' | 'forecast' }`
   - `{ kind: 'incomplete-data'; section: 'current' | 'forecast' }`
7. `OperationState<T>`: união discriminada com `{ status: 'idle' }`, `{ status: 'loading' }`, `{ status: 'success'; data: T }` e `{ status: 'error'; error: WeatherError }`.
8. `SearchState`: `OperationState<City[]> | { status: 'empty' }`.
9. `WeatherState`:
   - `query: string`
   - `search: SearchState`
   - `selectedCity?: City`
   - `current: OperationState<CurrentWeather>`
   - `forecast: OperationState<ForecastDay[]>`
   - `unit: Unit`

   Os estados de clima atual e previsão devem permanecer separados.

Não use `WeatherData` para acoplar os estados de carregamento/erro/sucesso das operações: a composição serve apenas para apresentação/fixtures. Não represente ausência de dados opcionais por valores `null` ou zero.

## Critérios de aceite

- `City` tem os campos requeridos e os opcionais indicados; não tem propriedade `timezone`.
- `CurrentWeather` mantém temperaturas em Celsius, sem arredondamento, inclui os campos opcionais de umidade, vento, precipitação e pressão, `referenceTime` e `timezone`.
- `ForecastDay.date` representa uma data local `YYYY-MM-DD`.
- `WeatherData` compõe cidade, clima atual e previsão para apresentação/fixtures sem substituir os estados independentes no `WeatherState`.
- `WeatherState` modela busca, cidade selecionada, estado atual, previsão e unidade; atual e previsão são operações independentes.
- `WeatherError` discrimina `timezone-unavailable` e `incomplete-data`, cada um com seção `current` ou `forecast`.
- Os contratos não importam React, DOM, serviços ou dependências de runtime.
- `pnpm build` termina com código 0, se o estado do repositório permitir executar a validação. Se falhar por arquivos/configuração ausentes ou alterações preexistentes fora do escopo, registre a falha e sua evidência sem fazer correções fora de T-01.
- Não crie comportamento executável ou testes para esta tarefa; reporte explicitamente o que foi validado.

## Artefatos de referência

- Backlog e critérios originais: `tasks/weather-app-tasks.md`, seção “T-01 — Definir contratos de domínio e estado”.
- Modelo de dados e regras de timezone: `plans/weather-app-plan.md`, seção “Data Model”.
- Requisitos de produto associados: `specs/weather-app-spec.md`, FR-01 a FR-04, FR-06 e critérios AC-04, AC-05, AC-18 a AC-20, AC-22, AC-23 e AC-27.
- Convenções do projeto: `.github/copilot-instructions.md` e `.github/instructions/react.instructions.md`.

## Fluxo de execução

1. Leia o conteúdo atual de `src/types/weather.ts` e preserve comentários ou mudanças preexistentes que permaneçam corretos.
2. Compare os contratos existentes com a lista deste prompt; faça a menor alteração completa que satisfaça os critérios.
3. Confirme que o arquivo contém somente declarações de tipo/interface, sem imports de runtime.
4. Execute `pnpm build`. Execute também `pnpm lint` e `pnpm test` conforme o checklist do Code Agent, sem expandir o escopo para corrigir falhas alheias à T-01.
5. Se uma validação falhar, diferencie claramente falha causada pela alteração de bloqueio preexistente/externo e não a oculte.

## Formato da resposta final

Informe:

- o contrato alterado em `src/types/weather.ts`;
- os comandos executados e o resultado de cada um;
- qualquer bloqueio preexistente observado;
- confirmação de que nenhum arquivo fora do escopo foi alterado.
