# Overview

## Objetivo

O Weather App é uma aplicação web em pt-BR para consulta rápida do clima de
uma cidade. O produto deve permitir que pessoas em trânsito, pessoas do dia a
dia e planejadores de rotina encontrem uma localidade e compreendam o clima
atual e a tendência dos próximos dias sem navegar por múltiplas telas.

## Escopo do MVP

- Buscar uma cidade por nome, com possibilidade de refinar a busca usando
  estado, região ou país.
- Selecionar uma localidade quando houver mais de um resultado compatível.
- Exibir condições atuais e previsão de cinco dias, contando hoje e os quatro
  dias seguintes.
- Alternar temperaturas entre Celsius e Fahrenheit, iniciando em Celsius.
- Comunicar claramente os estados vazio, carregando, sucesso e erro.
- Priorizar uso em smartphones, mantendo a experiência utilizável em tablets e
  desktops.

## Decisões de produto

- A fonte de dados será o Open-Meteo, incluindo geocoding e previsão, sem API
  key.
- A busca usará um campo de texto com submissão explícita. O termo terá no
  mínimo 2 caracteres, aceitará cidade e refinamento opcional por estado/região
  e país, retornará no máximo 5 sugestões e permitirá seleção por teclado.
  Resultados homônimos deverão mostrar localização suficiente para distinção.
- A aplicação exibirá, no clima atual, temperatura, sensação térmica,
  condição textual, umidade, vento e precipitação. A previsão diária exibirá
  data/dia, condição, temperatura mínima e máxima e precipitação. Temperatura,
  sensação térmica, código meteorológico e data são campos essenciais; campos
  opcionais ausentes serão exibidos como `—`.
- O forecast usará `forecast_days=5`, `timezone=auto` e retornará as variáveis
  `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`,
  `wind_speed_10m`, `precipitation` e `weather_code` no atual; e `time`,
  `weather_code`, `temperature_2m_min`, `temperature_2m_max`,
  `precipitation_sum` e `precipitation_probability_max` no diário. A condição
  será mapeada dos códigos WMO para rótulos pt-BR, com fallback textual para
  código desconhecido.
- O estado inicial será Celsius. A troca de unidade atualizará todos os
  valores de temperatura visíveis, sem nova consulta à API. A conversão usará
  `F = (C * 9 / 5) + 32`, arredondada para uma casa decimal; a preferência
  ficará apenas em memória durante a sessão da página.
- A geocoding usará o endpoint `/v1/search` com `name`, `count=5`,
  `language=pt` e `format=json`. O forecast usará `/v1/forecast` com latitude,
  longitude, as variáveis definidas acima, `temperature_unit=celsius`,
  `forecast_days=5` e `timezone=auto`. Respostas HTTP não-OK, JSON inválido ou
  campos essenciais ausentes serão tratados como erro.
- Cada busca nova invalidará a resposta anterior em andamento; respostas fora
  de ordem serão descartadas. O timeout será de 10 segundos e uma falha poderá
  ser repetida no máximo duas vezes manualmente, sem retry automático.
- Não haverá cache persistente no MVP; resultados anteriores poderão permanecer
  visíveis enquanto uma nova consulta carrega, identificados como não atuais.
- “Previsão de 5 dias” significa hoje mais os quatro dias seguintes.
- Não haverá geolocalização automática, login, histórico ou cidades favoritas
  no MVP. A consulta começa por uma busca explícita do usuário.
- A aplicação funcionará online. Falhas de conexão ou da API serão tratadas
  com mensagem clara e opção de tentar novamente; não haverá promessa de uso
  offline.

# Functional Requirements

## FR1 — Buscar cidades

O sistema deve permitir informar o nome de uma cidade e iniciar uma busca de
localidades por submissão explícita. Termos com menos de 2 caracteres não
devem consultar a API. A busca deve aceitar refinamento opcional por
estado/região e país e apresentar no máximo 5 sugestões com nome, país, região,
latitude e longitude quando disponíveis.

## FR2 — Selecionar uma localidade

Quando houver múltiplos resultados, o usuário deve poder escolher uma única
localidade antes de consultar ou exibir o clima. A localidade selecionada deve
ficar identificada na tela principal.

## FR3 — Exibir clima atual

Após uma seleção válida, o sistema deve exibir a temperatura atual, sensação
térmica, condição textual, umidade, vento e precipitação quando fornecidos pela
fonte, sempre com unidade e rótulo compreensíveis.

## FR4 — Exibir previsão de cinco dias

Após uma seleção válida, o sistema deve exibir uma visão diária de hoje e dos
quatro dias seguintes. Cada dia deve apresentar sua data ou dia da semana,
condição e temperaturas mínima e máxima; precipitação deve ser apresentada
quando disponível.

## FR5 — Alternar unidades de temperatura

O sistema deve permitir alternar entre Celsius e Fahrenheit. Celsius deve ser a
unidade inicial. A preferência deve permanecer apenas enquanto a sessão da
página estiver aberta e a conversão deve usar uma casa decimal.

## FR6 — Gerenciar estados da interface

O sistema deve apresentar estado vazio antes da primeira busca, estado de
carregamento durante cada consulta, estado de sucesso quando houver dados
válidos e estado de erro quando a consulta não puder ser concluída.

## FR7 — Tratar busca sem resultado e falhas

O sistema deve diferenciar uma cidade não encontrada de uma falha de conexão ou
da API. Em ambos os casos deve informar o problema em pt-BR e oferecer uma ação
adequada: corrigir/refinar a busca para nenhum resultado e tentar novamente
para falha técnica.

## FR8 — Oferecer interface responsiva e acessível

O sistema deve permitir consultar e ler os dados em smartphones, tablets e
desktops, com layout adaptável, labels semânticas, contraste adequado, foco
visível e operação completa por teclado.

## FR9 — Apresentar dados de forma legível

O sistema deve organizar a localidade, o clima atual e a previsão em uma
hierarquia visual que priorize temperatura, condição e tendência diária, sem
exigir navegação por múltiplas telas para a consulta principal.

# User Stories

## US1 — Busca rápida (FR1)

Como viajante em trânsito, quero buscar uma cidade rapidamente para decidir o
que levar e ajustar meu planejamento do dia.

## US2 — Clima atual (FR3)

Como pessoa do dia a dia, quero ver temperatura, condição e precipitação para
decidir se preciso levar guarda-chuva ou usar uma roupa adequada.

## US3 — Planejamento da semana (FR4)

Como planejador de rotina / organização pessoal, quero consultar a previsão de
cinco dias para organizar compromissos, viagens e atividades ao ar livre.

## US4 — Uso em diferentes dispositivos (FR8)

Como pessoa do dia a dia, quero consultar e ler os dados em diferentes tamanhos
de tela para verificar o clima com conforto onde estiver.

## US5 — Preferência de unidade (FR5)

Como planejador de rotina / organização pessoal, quero trocar a unidade de
temperatura para interpretar os dados sem fazer conversões mentalmente.

## US6 — Recuperação de falha (FR6, FR7)

Como viajante em trânsito, quero receber uma mensagem clara e poder tentar
novamente quando a consulta falhar para continuar meu planejamento sem ficar
sem saber o que fazer.

# Acceptance Criteria

Os critérios abaixo são verificáveis e fazem a rastreabilidade entre os
requisitos funcionais e o comportamento esperado.

## AC1 — Busca válida (FR1, US1)

- **Given** que o usuário está na tela inicial
- **When** informa uma cidade válida e envia a busca
- **Then** o sistema faz uma única consulta de geocoding com o termo, `count=5`
  e idioma pt-BR, e apresenta no máximo 5 resultados com nome, país, região,
  latitude e longitude quando disponíveis.

## AC2 — Busca ambígua (FR1, FR2, US1)

- **Given** que existem duas ou mais localidades compatíveis com o termo
- **When** os resultados são carregados
- **Then** o sistema mostra as opções com estado/região e país quando
  disponíveis, e só exibe o clima após o usuário selecionar uma opção.

## AC3 — Clima atual (FR3, US2)

- **Given** que o usuário selecionou uma localidade com dados meteorológicos
  válidos
- **When** a consulta termina com sucesso
- **Then** a tela exibe temperatura, sensação térmica e condição, além de
  umidade, vento e precipitação; cada campo tem rótulo e unidade, e campo
  opcional ausente aparece como `—`.

## AC4 — Previsão de cinco dias (FR4, US3)

- **Given** que o clima da localidade foi carregado com sucesso
- **When** o usuário visualiza a previsão
- **Then** são exibidos exatamente cinco datas consecutivas do timezone da
  localidade, começando pela data de `daily.time[0]`, com condição e
  temperaturas mínima e máxima alinhadas ao mesmo índice.

## AC5 — Troca de unidade (FR5, US5)

- **Given** que há dados meteorológicos visíveis em Celsius
- **When** o usuário seleciona Fahrenheit
- **Then** temperatura e sensação térmica atuais e temperaturas mínimas e
  máximas diárias são convertidas pela fórmula definida, arredondadas para uma
  casa decimal, identificadas como °F e sem chamadas de geocoding ou forecast.

## AC6 — Estado vazio (FR6)

- **Given** que a aplicação acabou de ser aberta e nenhuma busca foi enviada
- **When** a tela inicial é renderizada
- **Then** o sistema mostra uma orientação para pesquisar uma cidade e não
  mostra dados meteorológicos de uma localidade presumida.

## AC7 — Carregamento (FR6, FR9)

- **Given** que o usuário enviou uma busca ou selecionou uma localidade
- **When** a consulta ainda está em andamento
- **Then** o sistema mostra o indicador em até 100 ms, anuncia o carregamento
  em uma região `aria-live`, mantém o foco utilizável e não mistura dados da
  resposta nova com dados parciais; um resultado anterior, se houver, é
  identificado como não atual.

## AC8 — Cidade não encontrada (FR7, US1)

- **Given** que o serviço de geocoding não retorna localidades para o termo
- **When** a busca termina
- **Then** o sistema informa que nenhuma cidade foi encontrada e permite que o
  usuário altere ou refine a busca.

## AC9 — Falha técnica e retry (FR7, US6)

- **Given** que a API ou a conexão falha durante uma busca
- **When** a aplicação recebe a falha ou esgota o tempo de espera
- **Then** o sistema exibe uma mensagem de erro em pt-BR, encerra o loading em
  até 10 segundos, não apresenta dados incompletos como atuais e oferece retry
  manual, limitado a duas novas tentativas.

## AC10 — Responsividade e acessibilidade (FR8, US4)

- **Given** que a aplicação é aberta em viewport de 320 px, tablet ou desktop
- **When** o usuário percorre os controles usando apenas o teclado
- **Then** todos os controles têm nome acessível, foco visível e ordem de foco
  coerente, o contraste de texto normal é de pelo menos 4,5:1 e o conteúdo não
  apresenta sobreposição nem rolagem horizontal.

## AC11 — Hierarquia de informação (FR9, US2, US3)

- **Given** que existem dados atuais e previsão carregados
- **When** o usuário visualiza a tela de resultados
- **Then** a localidade, a temperatura atual, a condição e a previsão diária
  ficam identificáveis na mesma rota, com localidade e clima atual visíveis sem
  rolagem no viewport de 320 px; a previsão pode exigir rolagem vertical e não
  depende apenas de cor ou ícone.

# Non-Functional Requirements

## NFR1 — Performance percebida

O indicador de carregamento deve aparecer em até 100 ms após a ação. No cenário
de teste com respostas mockadas, o resultado deve renderizar em até 2 segundos.
Trocar a unidade não pode iniciar chamadas de geocoding ou forecast.

## NFR2 — Responsividade e mobile-first

A experiência deve priorizar smartphones, adaptar-se a tablets e desktops e
manter leitura e controles utilizáveis sem zoom ou rolagem horizontal.

## NFR3 — Acessibilidade

A interface deve usar HTML semântico, labels associados aos controles,
contraste mínimo de 4,5:1 para texto normal, foco visível, suporte completo a
teclado, nomes acessíveis e comunicação textual dos estados de carregamento,
vazio e erro por regiões live quando o conteúdo mudar.

## NFR4 — Resiliência e confiabilidade

Falhas da API, ausência de resultados, timeout e perda de conexão devem resultar
em estados previsíveis, mensagens claras e recuperação por nova tentativa quando
aplicável. A aplicação não deve afirmar precisão maior que a fornecida pela
fonte.

## NFR5 — Compatibilidade

O MVP deve funcionar nas versões estáveis atuais de Chrome, Firefox, Safari e
Edge, nos viewports de 320 px, 768 px e 1280 px de largura.

## NFR6 — Manutenibilidade e testabilidade

As regras de conversão, estados e transformação dos dados devem ser
determinísticas e testáveis, e a integração com a fonte externa deve permanecer
isolada para permitir evolução ou substituição futura.

## NFR7 — Localização

Textos, mensagens, rótulos de unidade e apresentação de datas devem estar em
pt-BR. Celsius deve ser a unidade inicial.

# Edge Cases

| Caso | Comportamento esperado |
|---|---|
| Cidade inexistente | Informar que a cidade não foi encontrada, manter o campo editável e permitir uma nova busca. |
| Campo de busca vazio ou só com espaços | Não iniciar consulta; mostrar orientação para informar uma cidade. |
| Caracteres especiais, acentos ou espaços extras | Normalizar o termo quando necessário, preservar o texto compreensível para o usuário e consultar o geocoding sem quebrar a interface. |
| Termo muito curto ou inválido | Informar que a busca precisa de um nome de cidade compreensível, sem chamar a previsão. |
| Cidade homônima | Mostrar sugestões com estado/região e país; exigir seleção explícita. |
| Geocoding sem resultados | Exibir estado de “cidade não encontrada” e permitir editar ou refazer a busca, sem chamar o serviço de previsão. |
| Falha da API ou da conexão | Exibir erro técnico amigável, preservar a busca quando possível e oferecer uma ação de nova tentativa. |
| Timeout | Encerrar o carregamento após o limite definido, exibir mensagem de indisponibilidade temporária e oferecer retry sem deixar spinner infinito. |
| Resposta parcial | Validar os campos essenciais; se faltarem, exibir erro de dados indisponíveis, e, se faltarem apenas dados opcionais, omitir o campo ou marcá-lo como indisponível sem inventar valor. |
| Perda de conexão durante a consulta | Encerrar o carregamento em estado de erro; não deixar spinner infinito nem substituir dados válidos por dados vazios. |
| Troca de unidade durante carregamento | Aplicar a unidade selecionada aos dados quando chegarem, sem duplicar a consulta. |
| Dados opcionais de umidade, vento ou precipitação ausentes | Omitir o campo ou marcar como indisponível de forma explícita; não inventar valor. |
| Virada de data ou fuso horário da localidade | Agrupar e rotular os cinco dias usando a data local da localidade consultada. |
| Tela estreita ou texto longo de localidade | Reorganizar o conteúdo sem sobreposição, corte de rótulos essenciais ou rolagem horizontal indevida. |

# Assumptions

- O Open-Meteo permanece disponível para geocoding e previsão sem autenticação
  no escopo do MVP.
- A precisão e a cobertura dependem da localidade retornada pelo serviço; a
  aplicação não promete precisão meteorológica adicional.
- O usuário terá conexão com a internet para consultar dados novos.
- Não há necessidade de conta, autenticação ou persistência em servidor.
- A busca explícita é suficiente para o MVP; geolocalização automática não é
  necessária.
- A preferência de unidade precisa durar apenas enquanto a sessão da página
  estiver aberta.
- Os dados opcionais serão exibidos somente quando a fonte os fornecer de modo
  válido.

# Risks

| Risco | Impacto | Mitigação prevista |
|---|---:|---|
| Indisponibilidade, rate limiting ou mudança do Open-Meteo | Alto | Isolar a integração, tratar timeout/erro, limitar retries e comunicar o problema. |
| Ambiguidade de cidades | Médio | Busca refinável e seleção com estado/região e país. |
| Dados meteorológicos inconsistentes | Médio | Validar campos essenciais, tratar opcionais e não fabricar valores. |
| Conversão de temperatura incorreta | Alto | Manter regra determinística e cobrir Celsius/Fahrenheit em testes. |
| Latência elevada | Médio | Carregamento imediato, evitar chamadas na troca de unidade e considerar cache leve. |
| Layout inadequado em mobile | Alto | Mobile-first, conteúdo prioritário e validação em larguras pequenas e grandes. |
| Falhas de acessibilidade | Alto | Semântica, labels, teclado, foco, contraste e validação dos estados da UI. |
| Expansão indevida do MVP | Médio | Manter fora do escopo login, favoritos, histórico, geolocalização e offline. |

# Out of Scope

- Login, cadastro, perfis e autenticação.
- Histórico de buscas, cidades favoritas e sincronização entre dispositivos.
- Geolocalização automática ou solicitação de permissão de localização.
- Funcionamento offline garantido ou sincronização de dados em segundo plano.
- Cache persistente de clima ou cidades, incluindo `localStorage`, IndexedDB e
  sincronização entre abas.
- Retry automático, polling ou atualização periódica sem ação do usuário.
- Alertas, notificações, previsão horária, mapas, radar ou dados climáticos
  históricos.
- Personalização visual de ícones, temas e animações além do necessário para
  comunicar a condição meteorológica acessivelmente.
- Suporte a idiomas além de pt-BR.
- Persistência de dados em servidor e painel administrativo.
- Garantia de precisão meteorológica superior à fonte externa.

# Open Questions

## Status de prontidão

Esta especificação é suficiente para desenvolver a aplicação sem novas
perguntas. As decisões necessárias sobre contrato da API, dados exibidos,
timezone, unidades, estados de interface, erros, retry, responsividade,
acessibilidade e limites do escopo estão definidas nas seções anteriores.

Não há questões bloqueantes abertas. O plano técnico pode detalhar a estrutura
de módulos, mocks, componentes e comandos de teste sem alterar o comportamento
previsto nesta especificação.

- **Resolvida — formato do refinamento de busca:** o MVP aceitará cidade e
  refinamento opcional por estado/região e país, com sugestões para resultados
  ambíguos. Impacto: define o fluxo de seleção e reduz consultas na localidade
  errada.
- **Resolvida — período da previsão:** serão exibidos hoje e os quatro dias
  seguintes. Impacto: fixa a quantidade e os limites da previsão.
- **Resolvida — unidade inicial:** Celsius. Impacto: define o primeiro estado da
  interface e o comportamento da conversão.
- **Resolvida — geolocalização:** não será usada no MVP. Impacto: a primeira
  consulta depende da busca explícita e não de permissões do navegador.
- **Resolvida — histórico e favoritos:** não serão implementados. Impacto:
  nenhuma persistência ou conta é necessária.
- **Resolvida — offline:** não é requisito; o produto depende de conexão e
  comunica falhas. Impacto: não há garantia de consulta sem rede.
- **Resolvida — retry e cache:** haverá apenas retry manual, com no máximo duas
  novas tentativas; não haverá cache persistente no MVP. Impacto: evita loops,
  resultados obsoletos e comportamento não determinístico nos testes.
- **Resolvida — códigos e ícones meteorológicos:** os códigos WMO serão
  convertidos em rótulos pt-BR; o ícone é opcional e nunca será a única forma
  de comunicar a condição. Impacto: garante compreensão e acessibilidade.

## Rastreabilidade resumida

## Rastreabilidade por User Story

| User Story | Requisitos funcionais | Acceptance Criteria | Requisitos não funcionais relevantes |
|---|---|---|---|
| US1 — Busca rápida | FR1 | AC1, AC2, AC8 | NFR1, NFR2, NFR3, NFR4, NFR7 |
| US2 — Clima atual | FR3 | AC3, AC11 | NFR2, NFR3, NFR4, NFR7 |
| US3 — Planejamento da semana | FR4 | AC4, AC11 | NFR1, NFR2, NFR3, NFR7 |
| US4 — Uso em diferentes dispositivos | FR8 | AC10, AC11 | NFR2, NFR3, NFR5 |
| US5 — Preferência de unidade | FR5 | AC5 | NFR1, NFR6, NFR7 |
| US6 — Recuperação de falha | FR6, FR7 | AC6, AC7, AC8, AC9 | NFR1, NFR3, NFR4, NFR6, NFR7 |

Essa matriz permite derivar tarefas por story e verificar que cada fluxo de
usuário possui critérios de aceite e qualidades técnicas associadas.

## Rastreabilidade por origem

| Origem no discovery | Cobertura nesta especificação |
|---|---|
| RF1, RF2 | FR1–FR2; AC1–AC2 |
| RF3, RF10 | FR3, FR9; AC3, AC11 |
| RF4 | FR4; AC4 |
| RF5, RF9 | FR5; AC5 |
| RF6, RF8 | FR6; AC6–AC7 |
| RF7 | FR7; AC8–AC9 |
| RF5 mobile / RNF2–RNF4 | FR8; NFR1–NFR5; AC10 |
| RNF5–RNF8 | NFR4–NFR7; Edge Cases; Risks |
| Personas | US1–US6 |
| Decisões e perguntas do discovery | Overview, Assumptions e Open Questions |

# Revisão Crítica

Os achados abaixo foram identificados durante a revisão e incorporados nas
decisões, requisitos e critérios desta versão. A lista permanece como checklist
de rastreabilidade para o plano técnico e os testes, não como pendência aberta.

## Requisitos faltantes

- **Contrato da Open-Meteo:** a spec não define endpoints, parâmetros, campos,
  unidades nem formato de resposta. **Correção:** especificar geocoding com
  nome, quantidade, idioma e campos de localização; e forecast com latitude,
  longitude, `current`, `daily`, cinco dias e timezone automático.
- **Mapeamento meteorológico:** a condição textual é exigida, mas a API fornece
  um código numérico. **Correção:** definir o mapeamento dos códigos WMO para
  rótulos em pt-BR e o fallback para código desconhecido.
- **Concorrência de buscas:** não há regra para submissões consecutivas ou
  respostas fora de ordem. **Correção:** cancelar a requisição anterior ou
  ignorar respostas cujo identificador não seja o da busca mais recente.
- **Semântica dos dados:** precipitação, probabilidade, vento e sensação térmica
  não têm métrica e unidade exatas. **Correção:** nomear cada campo, unidade e
  origem da API, distinguindo milímetros, porcentagem e velocidade do vento.

## Ambiguidades

- **Fluxo de busca:** “no texto ou por refinamento” não define os controles nem
  o autocomplete. **Correção:** definir campo único ou campos separados,
  submissão, mínimo de caracteres, limite de resultados e seleção por teclado.
- **Retry:** não está claro se a tentativa repete geocoding, forecast ou toda a
  última operação. **Correção:** definir a operação repetida, preservação da
  localidade e limite de tentativas.
- **Persistência da unidade:** “sessão atual” não define o efeito de reload ou
  fechamento da aba. **Correção:** declarar que a preferência vive apenas em
  memória da página ou definir explicitamente `sessionStorage`.
- **Datas e timezone:** não há formato pt-BR nem regra para ausência de timezone.
  **Correção:** exigir `timezone=auto`, usar as datas locais retornadas pela API
  e definir a formatação, como dia da semana e `dd/MM`.
- **Campos ausentes:** a spec permite omitir ou marcar indisponível. **Correção:**
  escolher uma regra única, como manter o rótulo e exibir `—`.

## Inconsistências

- **Sensação térmica:** FR3 e AC3 exigem o campo, mas o contrato da API não
  especifica `apparent_temperature`. **Sugestão de correção:** incluir esse campo em
  `current` ou removê-lo do requisito.
- **Precipitação opcional:** FR3 a trata como opcional, mas AC3 não distingue
  campos essenciais de opcionais. **Sugestão de correção:** definir temperatura, código e
  data como essenciais e uma resposta específica para cada opcional ausente.
- **Retry limitado:** aparece em Risks, mas a política fica aberta em Open
  Questions. **Sugestão de correção:** definir máximo, intervalo/backoff e disponibilidade do
  botão de nova tentativa.
- **Cache indefinido:** é sugerido em NFR1 e Risks, mas não está claro se faz
  parte do MVP. **Sugestão de correção:** declarar cache fora do escopo ou definir chave,
  validade e invalidação.

## Critérios de aceite fracos ou não verificáveis

- **Performance:** “baixa latência” e “imediato” não têm limite. **Correção:**
  definir metas, como loading visível em até 100 ms, resultado renderizado em
  até 2 s no cenário de teste e zero chamadas ao trocar a unidade.
- **AC1:** não valida parâmetros, idioma, quantidade nem campos do geocoding.
  **Correção:** verificar a requisição e os campos de nome, país, região,
  latitude e longitude, além de HTTP não-OK e JSON inválido.
- **AC4:** não define a origem de “hoje” nem o alinhamento dos arrays diários.
  **Correção:** verificar cinco datas consecutivas no timezone da localidade e a
  correspondência entre data, mínima, máxima e condição.
- **AC7:** não comprova loading imediato, anúncio semântico ou isolamento de
  dados anteriores. **Correção:** definir limite de exibição, `aria-live` ou
  estado busy e a regra para preservar ou ocultar o resultado anterior.
- **AC9:** não define duração do timeout nem classes de erro. **Correção:**
  definir o limite, os erros cobertos, a mensagem esperada e que retry produz
  uma nova chamada controlada.
- **AC10:** “contraste adequado” e “ordem coerente” são subjetivos. **Correção:**
  definir WCAG 2.2 AA, contraste mínimo de 4,5:1, viewports de teste, roles,
  labels, regiões live e destino do foco.
- **AC5:** não define arredondamento, casas decimais e todos os campos convertidos.
  **Correção:** fixar fórmula, arredondamento, conversão da sensação térmica,
  rótulos `°C`/`°F` e ausência de chamadas de geocoding e forecast.
- **AC11:** “na mesma tela” não define visibilidade por viewport. **Correção:**
  indicar quais informações devem aparecer sem navegação adicional e quais podem
  exigir apenas rolagem vertical.