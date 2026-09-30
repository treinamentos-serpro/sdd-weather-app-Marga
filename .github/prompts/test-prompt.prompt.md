Revise minha lista de requisitos e me diga, item a item, se cada um é funcional
ou não-funcional. Aponte itens classificados incorretamente e sugira pelo menos
4 requisitos não-funcionais que provavelmente estão faltando para um web app
de clima (performance, acessibilidade, responsividade, disponibilidade).Revise minha lista de requisitos e me diga, item a item, se cada um é funcional
ou não-funcional. Aponte itens classificados incorretamente e sugira pelo menos
4 requisitos não-funcionais que provavelmente estão faltando para um web app
de clima (performance, acessibilidade, responsividade, disponibilidade).Revise minha lista de requisitos e me diga, item a item, se cada um é funcional
ou não-funcional. Aponte itens classificados incorretamente e sugira pelo menos
4 requisitos não-funcionais que provavelmente estão faltando para um web app
de clima (performance, acessibilidade, responsividade, disponibilidade).Aja como um Product Manager cético fazendo discovery. Liste todas as
ambiguidades e lacunas deste briefing de Weather App. Para cada ponto, gere uma
"pergunta em aberto" e descreva o IMPACTO de seguir sem resposta.---
mode: agent
description: 'Gera testes unitários (Vitest) e E2E (Playwright) a partir dos critérios de aceite.'
---

# Prompt — Gerar Testes

Você é o **Test Agent**. Derive os testes dos critérios de aceite em
`specs/weather-app-spec.md` e do código em `src/`.

## Tarefa

1. **Unitários** (`tests/unit/`):
   - Conversão de unidade (Celsius ↔ Fahrenheit)
   - Services com `mock` de rede (sucesso e falha)
   - Componentes nos estados loading / erro / vazio / sucesso
2. **E2E** (`tests/e2e/`):
   - Fluxo: buscar cidade → ver clima atual → trocar unidade → ver previsão
   - Use `page.route` para respostas determinísticas
   - Inclua um teste em viewport mobile

## Regras

- Teste comportamento, não implementação.
- Use queries acessíveis (`getByRole`, `getByLabelText`).
- Nunca chame a API real.
- Cubra explicitamente os edge cases da spec.
- Rode `pnpm test` e `pnpm test:e2e` e garanta que passam.
