## Contexto

A empresa solicitou o desenvolvimento de uma aplicação web de previsão do tempo com foco em usabilidade rápida e acessibilidade em dispositivos móveis. O principal objetivo é permitir que o usuário consulte o clima de uma cidade de forma simples e eficiente, visualizando rapidamente o estado do tempo atual e a previsão dos próximos dias.

A aplicação deve atender a um público amplo, com necessidade de consulta imediata de informações meteorológicas. O uso em mobile é prioritário, pois a experiência do usuário deve ser natural tanto em smartphones quanto em tablets e desktops.

## Requisitos Funcionais

- RF1 — Buscar cidades por nome.
- RF2 — Exibir o clima atual da cidade pesquisada.
- RF3 — Exibir a previsão de 5 dias.
- RF4 — Alternar entre unidades de temperatura em Celsius e Fahrenheit.
- RF5 — Permitir que o usuário visualize as informações climáticas em dispositivos móveis.
- RF6 — Exibir estados de carregamento enquanto os dados são consultados.
- RF7 — Exibir mensagem de erro quando a busca falhar ou a cidade não for encontrada.
- RF8 — Exibir estado vazio quando ainda não houver uma cidade pesquisada.
- RF9 — Atualizar automaticamente os valores de temperatura quando a unidade for trocada.
- RF10 — Apresentar informações meteorológicas de forma legível e organizada para o usuário.

## Requisitos Não-Funcionais

- RNF1 — Performance: a consulta e a renderização das informações devem ocorrer com baixa latência.
- RNF2 — Responsividade: a interface deve funcionar bem em telas pequenas e grandes.
- RNF3 — Mobile-first: o design deve priorizar a experiência em smartphones.
- RNF4 — Acessibilidade: uso de contraste adequado, labels semânticas e navegação por teclado.
- RNF5 — Resiliência: a aplicação deve tratar falhas na API e na conexão com clareza.
- RNF6 — Manutenibilidade: a arquitetura deve facilitar futuras evoluções e testes.
- RNF7 — Confiabilidade: mensagens de erro e estado de carregamento devem ser consistentes.
- RNF8 — Compatibilidade: a aplicação deve funcionar em navegadores modernos.

## Riscos

| Risco | Probabilidade | Impacto | Estratégia de mitigação |
|---|---|---:|---|
| Dependência de API externa com indisponibilidade ou rate limiting | Média | Alto | Implementar tratamento de erro, retry controlado, mensagens claras e cache leve para evitar falhas visíveis ao usuário. |
| Busca por cidade ambígua ou não localizada | Alta | Médio | Permitir busca por cidade + estado/país, exibir sugestões e tratar “nenhum resultado encontrado” com UX clara. |
| Dados meteorológicos inconsistentes ou imprecisos | Média | Médio | Definir fonte confiável, validar campos essenciais e comunicar limites de precisão da API ao usuário. |
| Conversão incorreta entre Celsius e Fahrenheit | Baixa | Alto | Centralizar a lógica em uma função pura e testada; cobrir os casos com testes unitários e validação visual. |
| Experiência mobile ruim em telas pequenas | Média | Alto | Usar design mobile-first, testar em vários tamanhos de tela e priorizar leitura rápida e informações essenciais. |
| Latência alta ao consultar dados e renderizar a interface | Média | Médio | Reduzir chamadas desnecessárias, aplicar cache, mostrar loading e otimizar renderização para percepção de velocidade. |
| Falha de conexão do usuário | Média | Médio | Exibir mensagem de erro amigável, permitir repetir a ação e usar cache local quando possível. |
| Sobrecarga de informações na tela | Média | Médio | Definir um MVP com dados essenciais, priorizar leitura rápida e evitar excesso de elementos em mobile. |
| Interface pouco acessível | Média | Alto | Seguir boas práticas de acessibilidade: contraste, labels, foco visível, teclado e semântica correta. |
| Escopo de produto mal definido | Alta | Alto | Documento claro de requisitos, prioridades e critérios de aceite antes da implementação. |
| Dependência de um provedor único de dados | Média | Alto | Isolar a integração em um serviço e avaliar alternativas para reduzir risco de bloqueio. |
| Falhas de UX em estados de erro, vazio e carregamento | Média | Médio | Definir e validar esses estados antes do desenvolvimento; testar cada cenário em frontend e E2E. |
| Complexidade crescente do produto | Média | Médio | Manter o escopo enxuto, separar responsabilidade por camada e evitar feature creep no MVP. |

## Personas

### 1) Viajante em trânsito
- Objetivo principal: consultar rapidamente o clima de uma cidade para decidir o que levar na viagem ou ajustar o planejamento do dia.
- Contexto de uso: principalmente mobile, em deslocamento, durante o dia, com acesso rápido e pouca leitura.
- Métrica de sucesso: buscar a cidade em poucos segundos e visualizar as informações principais sem precisar navegar em múltiplas telas.

### 2) Pessoa do dia a dia
- Objetivo principal: saber se vai chover, quão quente está e se precisa levar guarda-chuva ou roupa adequada.
- Contexto de uso: mobile como principal canal, em uso frequente e recorrente; desktop pode ser usado ocasionalmente.
- Métrica de sucesso: uso recorrente da aplicação para conferir o clima antes de sair de casa ou do trabalho.

### 3) Planejador de rotina / organização pessoal
- Objetivo principal: ver a previsão de 5 dias para planejar compromissos, viagens, atividades ao ar livre e rotina.
- Contexto de uso: desktop e mobile, com uso mais deliberado e exploratório, buscando uma visão geral da semana.
- Métrica de sucesso: entender rapidamente a tendência dos próximos dias e decidir com confiança.

## Decisões

- Fonte de dados: Open-Meteo (sem API key).
  - Justificativa: a API oferece geocoding e previsão sem necessidade de autenticação, reduzindo custos e simplificando a implementação do MVP.
  - Resolve: define a base tecnológica da busca e do clima, evitando ambiguidade sobre a infraestrutura de dados.

- “5 dias” = hoje + 4 dias.
  - Justificativa: simplifica a interpretação do requisito e mantém a previsão em um intervalo curto e útil para o uso diário.
  - Resolve: responde à ambiguidade sobre se o período inclui o dia atual ou começa no próximo dia.

- Unidade padrão: Celsius.
  - Justificativa: é a unidade mais adotada em contexto brasileiro e mais natural para o maior público do produto.
  - Resolve: define a experiência inicial da interface e elimina indefinição sobre a unidade padrão.

- Sem autenticação e sem persistência de servidor.
  - Justificativa: o MVP tem foco em consulta rápida de clima e não exige usuários, login ou armazenamento em backend.
  - Resolve: reduz o escopo e elimina dúvidas sobre histórico, login e persistência de dados no servidor.

- Idioma da UI: pt-BR.
  - Justificativa: o público alvo e o contexto do treinamento priorizam a experiência em português brasileiro.
  - Resolve: define o idioma principal da interface e elimina incerteza sobre localização e textos da UI.

## Perguntas em Aberto

- A busca deve aceitar apenas cidade ou também estado/país para reduzir ambiguidades?
- O termo “previsão de 5 dias” inclui o dia atual ou começa no próximo dia?
- A aplicação deve ter geolocalização automática?
- Qual unidade deve ser padrão ao abrir a aplicação: Celsius ou Fahrenheit?
- Existe necessidade de histórico de buscas ou cidades favoritas?
- A aplicação deve funcionar offline ou apenas online?
- Quais dados meteorológicos devem ser exibidos além da temperatura, como umidade, vento e precipitação?
- A empresa exige suporte para idiomas específicos além do português?

## Suposições

- A aplicação será usada por pessoas comuns, sem login obrigatório.
- A fonte de dados será uma API pública e sem autenticação.
- A experiência mobile será prioridade no design e na interação.
- O objetivo principal é a consulta rápida de clima, não a gestão de usuários ou dados complexos.
- A aplicação será entregue como uma solução web front-end simples, consumindo dados externos.
- O usuário aceita que a informação pode variar conforme a API e a precisão geográfica.
