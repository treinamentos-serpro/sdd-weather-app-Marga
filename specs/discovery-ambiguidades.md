# Ambiguidades e lacunas do discovery

Este documento complementa o [discovery do Weather App](./discovery.md), detalhando perguntas ainda sem resposta e o impacto de avançar sem resolvê-las. As perguntas são hipóteses de discovery, não decisões já aprovadas. As decisões confirmadas estão identificadas separadamente para evitar reabri-las por engano.

## Perguntas em aberto e impactos

| # | Tema | Pergunta em aberto | Impacto de seguir sem resposta |
|---|---|---|---|
| 1 | Objetivo e público | Qual tarefa principal o app deve tornar mais fácil e para quais públicos prioritários? | A equipe pode priorizar informações e fluxos que não atendem ao uso de maior valor. |
| 2 | Critério de sucesso | Como stakeholders e usuários determinarão que a primeira versão foi bem-sucedida? | Não haverá base objetiva para priorização, aceite ou avaliação posterior do produto. |
| 3 | Busca de cidades | Quais entradas a busca aceita (acentos, abreviações, nomes em outros idiomas) e quando a pesquisa é disparada? | Busca, validação e chamadas à API podem ter comportamentos divergentes e gerar retrabalho. |
| 4 | Resultados geográficos | Quantos resultados devem ser apresentados e quais dados distinguem cidades homônimas (país, estado/região, coordenadas)? | O usuário pode selecionar a localidade errada; a qualidade da busca fica difícil de testar. |
| 5 | Geolocalização | A localização do dispositivo será solicitada automaticamente, oferecida como opção ou não será usada? O que ocorre se a pessoa negar a permissão? | A experiência inicial, o tratamento de permissões e as decisões de privacidade podem exigir mudanças estruturais. |
| 6 | Localização por coordenadas | Além da busca por nome, o usuário poderá informar coordenadas ou selecionar sua localização atual? | O fluxo de entrada e o escopo de integração geográfica permanecem incertos. |
| 7 | Dados meteorológicos | Quais campos são obrigatórios no clima atual e na previsão, e quais podem ser omitidos quando indisponíveis? | O modelo de dados, a interface e os critérios de aceite podem divergir; campos opcionais podem quebrar a tela. |
| 8 | “Clima atual” | Qual timestamp ou tipo de dado será apresentado como atual, com que frequência será atualizado e como a atualização será indicada? | Dados defasados podem parecer observações em tempo real, reduzindo confiança e levando a decisões equivocadas. |
| 9 | Janela de previsão | A decisão é hoje mais quatro dias, mas qual fuso horário define “hoje” e qual o limite diário para locais em fusos diferentes? | Datas podem mudar conforme localização e horário de consulta, causando discrepância nos cinco dias exibidos. |
| 10 | Granularidade da previsão | A previsão será apenas diária ou também horária? Quais períodos do dia, se houver, devem ser comparáveis? | A interface e a quantidade/estrutura de dados podem precisar ser refeitas quando o nível de detalhe for decidido. |
| 11 | Unidades | Fahrenheit altera somente temperatura? Quais unidades serão usadas para vento e precipitação, e como valores serão arredondados? | Pode haver exibição inconsistente entre indicadores ou diferenças nos valores esperados nos testes. |
| 12 | Idioma e localização | pt-BR também determina a tradução das condições meteorológicas, nomes de localidades, datas, horários e formatos numéricos? | Uma interface traduzida pode continuar exibindo conteúdo em idioma ou formato incompatível com o usuário. |
| 13 | Favoritos e histórico | Favoritos e histórico estão fora do MVP? Se houver preferências, podem ser guardadas localmente no navegador? | A decisão de não persistir no servidor não esclarece armazenamento local; a arquitetura e a expectativa do usuário podem divergir. |
| 14 | Alertas | Alertas climáticos severos estão explicitamente fora do MVP ou devem ser exibidos quando disponíveis? | O escopo de dados e a responsabilidade do produto ficam incertos; alertas exigem tratamento e destaque próprios. |
| 15 | Estados e recuperação | Para erro de rede, API indisponível, busca sem resultados e resposta parcial, qual mensagem e ação de recuperação devem ser oferecidas? | Mensagens e fluxos inconsistentes podem frustrar usuários e tornar critérios de teste subjetivos. |
| 16 | Dados antigos e cache | É permitido exibir dados em cache durante indisponibilidade? Como informar sua idade e quando tentar atualizar? | Sem política definida, pode-se mostrar informação velha como atual ou descartar dados úteis desnecessariamente. |
| 17 | Interface e identidade | Existe identidade visual, conteúdo editorial ou padrão de design obrigatório? Como se organiza a experiência mobile: tela única ou seções? | Decisões visuais podem ser refeitas e a hierarquia das informações pode não corresponder às expectativas dos stakeholders. |
| 18 | Responsividade e dispositivos | Quais larguras, orientações, navegadores e versões mínimas precisam ser suportados? | “Responsivo” fica subjetivo; cobertura de validação pode deixar de fora ambientes importantes. |
| 19 | Acessibilidade | Qual padrão e nível de conformidade são esperados e como serão verificados (teclado, leitor de tela, contraste, movimento)? | “Princípios básicos” não define aceite; barreiras de acesso podem ser descobertas tarde e custar mais para corrigir. |
| 20 | Performance | Quais metas de carregamento inicial, busca e atualização são aceitáveis, em quais dispositivos e condições de rede? | “Tempo aceitável” não é mensurável, então não se pode avaliar ou priorizar otimizações com segurança. |
| 21 | Disponibilidade e dependências | Qual nível de disponibilidade é esperado e qual experiência deve existir quando Open-Meteo estiver indisponível ou limitar requisições? | A dependência externa pode interromper o uso sem comportamento de contingência nem expectativa operacional acordada. |
| 22 | Privacidade | Quais dados de localização ou consulta são enviados, armazenados ou registrados, e por quanto tempo? | Pode haver coleta além do necessário, comunicação inadequada ao usuário ou revisão tardia de requisitos de privacidade. |
| 23 | Contrato da fonte de dados | Como serão tratados limites de requisição, mudanças no serviço, erros HTTP, timeout e respostas inválidas? Há alternativa ou apenas mensagem de indisponibilidade? | A integração pode ficar acoplada a pressupostos frágeis e falhas externas podem resultar em comportamento inconsistente. |
| 24 | Escopo do MVP | Além de autenticação e persistência no servidor, quais recursos são explicitamente não incluídos na primeira versão? | “Foco em funcionalidade essencial” pode ser interpretado de formas diferentes e expandir o escopo durante a implementação. |
| 25 | Aceite e validação | Quais cenários de sucesso, erro, vazio e dados parciais precisam passar para considerar cada requisito pronto? | Implementação e testes podem validar interpretações distintas, gerando retrabalho na revisão ou no aceite. |

## Decisões já confirmadas

As decisões abaixo estão registradas em [discovery.md](./discovery.md) e não devem ser tratadas como perguntas pendentes:

- Fonte de dados: Open-Meteo, sem API key.
- Previsão: hoje mais os próximos quatro dias.
- Unidade inicial: Celsius; a alternância para Fahrenheit permanece no escopo.
- Sem autenticação e sem persistência no servidor.
- Idioma da interface: pt-BR.

Essas decisões não resolvem automaticamente questões relacionadas, como os campos meteorológicos obrigatórios, o fuso horário que define “hoje”, a persistência local ou o comportamento perante indisponibilidade da fonte.

## Prioridade sugerida para fechar antes da especificação

1. Confirmar o fluxo de busca e a decisão sobre geolocalização.
2. Definir campos, unidades, timestamp e fuso horário dos dados meteorológicos.
3. Fechar o escopo de persistência local, favoritos e recursos explicitamente fora do MVP.
4. Definir comportamento de erro, dados em cache e indisponibilidade da API.
5. Tornar critérios de aceite, performance, acessibilidade e compatibilidade mensuráveis.
