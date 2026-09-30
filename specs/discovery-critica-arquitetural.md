# Crítica arquitetural do discovery

Esta revisão avalia se o discovery fornece base suficiente para iniciar a especificação de produto sem criar decisões técnicas prematuras. Ela complementa [discovery.md](./discovery.md) e [discovery-ambiguidades.md](./discovery-ambiguidades.md).

## Pontos vagos e risco de retrabalho

| Tema | O que ainda está vago | Risco de retrabalho ou divergência |
|---|---|---|
| Dados meteorológicos | “Outros indicadores relevantes” e “quando disponíveis” não definem campos obrigatórios e opcionais. | Contrato de dados, interface e testes podem ser construídos com premissas diferentes. |
| Busca | Não há regra para idioma/acentos, quantidade e ordenação de resultados, nem campos de desambiguação. | Pode ser necessário refazer experiência e integração após descobrir que cidades homônimas não são distinguíveis. |
| Geolocalização | Contexto menciona geolocalização, mas perguntas em aberto permitem busca manual ou automática; permissão e fallback não estão decididos. | Fluxo inicial, tratamento de permissão e privacidade podem demandar mudanças posteriores. |
| Temporalidade | “Hoje + 4 dias” foi decidido, mas o fuso horário que determina “hoje”, atualização e timestamp não. | Datas e informações percebidas como “atuais” podem ficar inconsistentes entre locais e horários. |
| Granularidade | Não se sabe se a previsão é só diária ou inclui detalhes por hora. | O modelo de dados e a hierarquia da interface podem precisar de reformulação. |
| Unidades | Celsius é o padrão e Fahrenheit está no escopo, mas unidades de vento/precipitação e arredondamento não estão definidos. | Indicadores podem ficar inconsistentes entre telas e dificultar validação. |
| Persistência | A decisão exclui persistência de servidor; uma suposição exclui persistência local. Favoritos e preferências seguem ambíguos. | Pode haver armazenamento local não esperado ou perda de preferências que o usuário esperava manter. |
| Fora do MVP | Alertas, favoritos e mapas aparecem como “sem recursos avançados” em uma suposição, não como decisão formal. | A equipe pode expandir ou cortar escopo sem alinhamento. |
| Qualidade não funcional | “Rápido”, “responsivo”, “acessível” e “confiável” não têm limites nem método de verificação. | Não será possível avaliar objetivamente a conformidade; otimizações e correções podem vir tarde. |
| Compatibilidade | Não há matriz de navegadores, dispositivos, larguras e versões suportadas. | Testes podem não cobrir o público-alvo ou podem assumir suporte excessivamente amplo. |
| Falhas e cache | Não há política para respostas parciais, timeout, rate limit, dados antigos ou tentativa de recuperação. | Comportamento em indisponibilidade pode ser inconsistente ou apresentar dados desatualizados como atuais. |
| Privacidade | Não está descrito se localização e consultas são armazenadas ou registradas, nem por quanto tempo. | Revisões de privacidade e ajustes de fluxo podem ser necessários após a implementação. |

## O que está suficientemente decidido para orientar a especificação

- A fonte de dados escolhida é Open-Meteo, sem API key.
- O horizonte de previsão é hoje mais os próximos quatro dias.
- Celsius é a unidade inicial, e a troca para Fahrenheit continua prevista.
- A interface será em pt-BR.
- Não haverá autenticação nem persistência de servidor.

Essas decisões definem alguns limites do produto, mas não respondem por si só quais dados serão usados, como a localização será obtida, nem como falhas externas serão tratadas.

## Condições para começar com segurança

A especificação pode ser iniciada agora, desde que marque explicitamente suas hipóteses e não transforme itens ainda incertos em compromissos implícitos. Antes de congelar critérios de aceite ou desenhar contratos detalhados, recomenda-se:

1. Decidir busca manual versus geolocalização e definir o fallback.
2. Selecionar campos obrigatórios e opcionais para clima atual e previsão, incluindo fonte temporal/fuso.
3. Definir granularidade, unidades de todos os indicadores e regras de formatação.
4. Confirmar se persistência local, favoritos, alertas e mapas estão dentro ou fora do MVP.
5. Especificar recuperação para falhas, respostas parciais, limites de requisição e política de dados em cache.
6. Estabelecer metas verificáveis de performance, acessibilidade, responsividade, compatibilidade e disponibilidade.
7. Definir cenários de aceite para sucesso, vazio, erro, dados parciais e uso mobile.

## Conclusão

O discovery é uma base útil para produzir a primeira versão da especificação, mas ainda não é um contrato de implementação completo. Os maiores riscos arquiteturais de retrabalho concentram-se em geolocalização, contrato e temporalidade dos dados, persistência local e comportamento em falhas. Esses pontos devem ser resolvidos ou registrados como hipóteses explícitas, com responsável e momento de validação.
