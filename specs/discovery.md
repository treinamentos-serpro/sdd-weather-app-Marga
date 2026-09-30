# Discovery - Aplicação de Previsão do Tempo

## Resumo Executivo

O produto será um app web para consultas rápidas do clima, com foco em usabilidade, acessibilidade e experiência mobile.
Usuários poderão buscar cidades, ver as condições atuais e a previsão de cinco dias (hoje mais os próximos quatro).
A aplicação permitirá alternar entre Celsius e Fahrenheit, usando Celsius como padrão, e terá interface em pt-BR.
As decisões confirmadas incluem Open-Meteo sem API key e ausência de autenticação ou persistência no servidor.
Antes de fechar a especificação, ainda é preciso definir geolocalização, campos meteorológicos obrigatórios e critérios mensuráveis de qualidade.

## Contexto

A empresa solicitou o desenvolvimento de uma aplicação web de previsão do tempo com foco em usabilidade, acessibilidade e adaptação para dispositivos móveis. O produto deve permitir que usuários consultem condições meteorológicas de diferentes cidades, visualizem o clima atual e a previsão para os próximos 5 dias, alternem entre unidades de temperatura em Celsius e Fahrenheit e tenham uma experiência funcional em smartphones e tablets.

O contexto de negócio sugere um produto de informação prática e de uso frequente, com forte valor para usuários que procuram dados meteorológicos de forma rápida, confiável e intuitiva. Como a aplicação será usada em dispositivos móveis, a experiência deve priorizar navegação simples, leitura ágil e layouts responsivos, com menor esforço para localizar informações essenciais.

Além disso, a solução deve considerar o uso de uma API pública e sem autenticação para consulta de clima e geolocalização, mantendo uma arquitetura leve e de fácil manutenção. A expectativa é que o app funcione como uma ferramenta útil para consulta rápida do tempo, sem exigir cadastro ou fluxo complexo de onboarding.

## Requisitos Funcionais

1. Busca por cidade
   - O usuário deve conseguir pesquisar cidades por nome.
   - A busca deve retornar resultados relevantes e permitir a seleção da cidade desejada.
   - O sistema deve tratar buscas vazias, inexistentes e com múltiplos resultados de forma clara.

2. Visualização do clima atual
   - A aplicação deve exibir as condições climáticas atuais da cidade selecionada.
   - Informações esperadas incluem temperatura, sensação térmica, condições do tempo e outros indicadores relevantes, como umidade e vento, quando disponíveis.
   - A interface deve apresentar os dados de forma legível e de fácil compreensão.

3. Previsão de 5 dias
   - A aplicação deve mostrar a previsão do tempo para os próximos 5 dias.
   - A previsão deve permitir comparar tendências por dia e facilitar a leitura de informações em bloco.
   - A organização visual deve destacar o contexto principal de cada dia, por exemplo, temperatura mínima/máxima e condições gerais.

4. Alternância entre Celsius e Fahrenheit
   - O usuário deve conseguir alternar a unidade de temperatura entre Celsius e Fahrenheit.
   - A troca de unidade deve refletir imediatamente em toda a interface relevante.
   - O comportamento deve ser consistente entre o clima atual e a previsão de 5 dias.

5. Experiência mobile
   - A aplicação deve ser responsiva e funcional em dispositivos móveis.
   - O layout deve adaptar-se a telas menores sem comprometer legibilidade ou navegação.
   - Elementos interativos devem ser acessíveis com touchscreen e manter espaçamento adequado para uso em mobile.

6. Estado de carregamento e erro
   - A aplicação deve indicar quando está carregando dados.
   - Deve também comunicar erros de busca, falha de rede, cidade não encontrada ou indisponibilidade da API.
   - O usuário deve receber feedback claro do que aconteceu e quais são as próximas ações possíveis.

7. Estado vazio
   - Quando não houver cidade pesquisada ou resultados disponíveis, a interface deve exibir um estado inicial ou vazio adequado.
   - A experiência deve orientar o usuário para que ele realize a busca corretamente.

## Requisitos Não-Funcionais

1. Usabilidade
   - A interface deve ser simples, intuitiva e de uso rápido.
   - A navegação principal deve exigir poucos passos para consultar clima de uma cidade.

2. Responsividade
   - A aplicação deve funcionar adequadamente em diferentes tamanhos de tela, especialmente mobile.
   - A experiência deve manter consistência em smartphones, tablets e desktops.

3. Performance
   - O carregamento inicial e as buscas devem ocorrer em tempo aceitável.
   - A interface deve responder rapidamente às interações do usuário.
   - O uso de cache ou otimizações leves pode ser considerado para reduzir latência.

4. Confiabilidade
   - A aplicação deve lidar adequadamente com falhas temporárias de rede ou indisponibilidade de serviço externo.
   - A exibição de dados deve evitar que erros de API comprometam a usabilidade do produto.

5. Acessibilidade
   - O sistema deve respeitar princípios básicos de acessibilidade, como contraste adequado, labels, navegação por teclado e uso semântico de componentes.
   - Elementos interativos devem possuir foco visual claro e boa usabilidade por leitores de tela.

6. Manutenibilidade
   - O código deve seguir boas práticas de organização, separação por responsabilidades e reutilização.
   - A lógica de consumo de API e a camada de apresentação devem estar bem delineadas para facilitar evoluções futuras.

7. Segurança
   - Como a aplicação usará uma API pública sem autenticação, o foco principal será garantir que o uso da API ocorra de forma segura e sem vazamento de informações sensíveis.
   - A aplicação deve evitar processamento desnecessário de dados pessoais.

## Riscos

1. Dependência de serviços externos
   - O funcionamento da funcionalidade principal depende da disponibilidade da API de previsão do tempo.
   - Falhas, limitações de quota ou instabilidades na API podem afetar a experiência do usuário.

2. Qualidade dos dados geográficos
   - Nomes de cidades podem ser ambíguos ou semelhantes, gerando confusão no momento da busca.
   - A ligação entre cidade e dados meteorológicos pode exigir tratamento de múltiplos resultados.

3. Diversidade de dispositivos
   - O suporte a mobile exige cuidado com resolução, orientação da tela e usabilidade em diferentes navegadores.
   - O layout pode funcionar em alguns dispositivos e falhar em outros se não houver validação adequada.

4. Interpretação da temperatura
   - A conversão entre Celsius e Fahrenheit pode gerar inconsistência se a lógica de arredondamento ou exibição não for padronizada.
   - Isso pode causar confusão para o usuário ao comparar valores.

5. Erros de experiência em estados de falha
   - Se a aplicação não tratar corretamente falhas de busca ou ausência de resultados, a percepção de qualidade do produto cai rapidamente.

6. Ambiguidade no escopo de dados meteorológicos
   - O briefing menciona clima atual e previsão de 5 dias, mas não define detalhadamente quais campos são obrigatórios ou opcionais.
   - Isso pode levar a divergências entre stakeholders e time de desenvolvimento.

## Perguntas em Aberto

1. **Em aberto:** a busca por cidade deve considerar geolocalização automática, localização sob demanda ou apenas busca manual por nome? Qual é o fallback se a permissão for negada?
2. **Parcialmente resolvida:** a fonte é Open-Meteo, sem API key. Quais campos meteorológicos são obrigatórios para a versão inicial?
3. **Resolvida:** a interface será em pt-BR; múltiplos idiomas não fazem parte da versão inicial.
4. **Em aberto:** favoritos estão fora do MVP? Preferências ou cidades podem ser salvas localmente no navegador?
5. **Assumida como fora do MVP, confirmar:** alertas climáticos severos não fazem parte do escopo essencial inicial?
6. **Em aberto:** quais navegadores, dispositivos e versões mínimas devem ser suportados?
7. **Em aberto:** existe paleta visual, identidade de marca ou design system obrigatório?
8. **Em aberto:** como as informações e seções devem ser organizadas na experiência mobile?
9. **Em aberto:** a aplicação aceitará coordenadas além da busca por nome ou da eventual localização do dispositivo?
10. **Em aberto:** quais critérios mensuráveis de sucesso e aceite serão usados para performance, usabilidade e fidelidade dos dados?

## Decisões

1. **Fonte de dados: Open-Meteo, sem API key**
   - Justificativa: adotar uma fonte pública sem exigir credenciais simplifica a integração e a configuração da aplicação.
   - Resolve: define a fonte exata da API, respondendo parcialmente à pergunta em aberto 2. Os campos meteorológicos obrigatórios ainda precisam ser especificados.

2. **Previsão de 5 dias: hoje mais os próximos 4 dias**
   - Justificativa: fixa um intervalo de cinco dias de calendário, incluindo o dia da consulta.
   - Resolve: elimina a ambiguidade sobre se “5 dias” começa hoje ou no dia seguinte, complementando o requisito de previsão.

3. **Unidade padrão: Celsius**
   - Justificativa: estabelece um valor inicial previsível para a interface em pt-BR.
   - Resolve: define a unidade exibida antes de o usuário alterá-la; a alternância para Fahrenheit continua disponível conforme o requisito funcional.

4. **Sem autenticação e sem persistência de servidor**
   - Justificativa: mantém a versão inicial simples e não exige contas nem armazenamento associado a usuários no servidor.
   - Resolve: esclarece que não haverá fluxo de cadastro ou login e restringe a persistência no servidor. Não define se preferências ou favoritos poderão ser armazenados localmente no navegador; essa parte da pergunta em aberto 4 permanece por decidir.

5. **Idioma da interface: pt-BR**
   - Justificativa: define o idioma da experiência inicial e evita escopo de localização indefinido para a primeira versão.
   - Resolve: responde à pergunta em aberto 3: a UI será em português do Brasil, sem suporte a múltiplos idiomas nesta versão.

## Suposições

1. A aplicação será uma SPA (Single Page Application) simples, com interface responsiva e consulta em tempo real.
2. A busca por cidade será realizada por nome, sem necessidade de autenticação do usuário.
3. A API pública escolhida fornecerá os dados necessários para clima atual e previsão de 5 dias.
4. O produto priorizará a experiência mobile em vez de uma experiência desktop detalhada.
5. A conversão entre Celsius e Fahrenheit será implementada como uma interação de usuário global na interface.
6. Os estados de carregamento, erro e vazio serão obrigatórios para garantir melhor usabilidade.
7. A versão inicial terá foco em funcionalidade essencial, sem recursos avançados como alertas severos, favoritos ou mapas.
8. O público-alvo será amplo, sem necessidade de personalização por perfil de usuário.
9. O uso de dados meteorológicos será de leitura, sem necessidade de persistência local além do estado da interface.
10. A interface deve seguir princípios de acessibilidade e design responsivo, mesmo na versão inicial.

## Documento relacionado

Os artefatos complementares deste discovery estão organizados em documentos próprios:

- [Especificação do produto](./weather-app-spec.md) — requisitos, histórias, critérios de aceite, NFRs, edge cases, riscos e questões em aberto derivados deste discovery.
- [Ambiguidades e lacunas](./discovery-ambiguidades.md) — perguntas em aberto, impactos e prioridades de discovery.
- [Riscos de produto e técnicos](./discovery-riscos.md) — avaliação de probabilidade, impacto e mitigação.
- [Personas hipotéticas](./discovery-personas.md) — objetivos, contexto de uso e métricas de sucesso a validar.
- [Crítica arquitetural do discovery](./discovery-critica-arquitetural.md) — pontos vagos, fontes de retrabalho e condições para especificar com mais segurança.
