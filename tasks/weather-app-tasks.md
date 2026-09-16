# Tarefas de Implementacao do Weather App

As tarefas abaixo derivam do plano tecnico e estao ordenadas por entrega e
dependencia. Cada tarefa e uma unidade implementavel e testavel; os criterios
nao prescrevem codigo de implementacao.

## Entrega 1 — Fundacao e infra minima

### T-01 — Configurar dependencias e scripts

- **ID:** T-01
- **Titulo:** Configurar dependencias e scripts
- **Descricao curta:** Configurar as dependencias do stack e os scripts de desenvolvimento, build, lint, testes unitarios e E2E.
- **Criterios de aceite verificaveis:**
  - `pnpm install` conclui sem erro.
  - Os scripts de desenvolvimento, build, lint, teste unitario e E2E estao disponiveis e `pnpm lint` executa.
- **Rastreabilidade:** RF: N/A; NFR: NFR5, NFR6; AC: N/A; US: N/A; Plano: Tech Stack.
- **Dependencias:** Nenhuma.
- **Arquivos provaveis:** `package.json`, `pnpm-lock.yaml`, `vitest.config.ts`, `playwright.config.ts`.
- **Tipo:** Infra
- **Prioridade:** P0
- **Tamanho:** M

### T-02 — Criar estrutura e configuracao do projeto

- **ID:** T-02
- **Titulo:** Criar estrutura e configuracao do projeto
- **Descricao curta:** Estabelecer a estrutura de pastas e as configuracoes Vite, TypeScript strict, Tailwind, PostCSS e Biome.
- **Criterios de aceite verificaveis:**
  - A estrutura contem `src/components`, `src/hooks`, `src/services`, `src/types`, `src/lib` e `tests/unit`, `tests/components`, `tests/e2e`.
  - `pnpm build` executa em uma base sem implementacao de feature.
  - TypeScript, Tailwind, PostCSS e Biome carregam as configuracoes sem erro.
- **Rastreabilidade:** RF: N/A; NFR: NFR5, NFR6; AC: N/A; US: N/A; Plano: Project Structure e Tech Stack.
- **Dependencias:** T-01.
- **Arquivos provaveis:** `vite.config.ts`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`, `biome.json`, `src/`, `tests/`.
- **Tipo:** Infra
- **Prioridade:** P0
- **Tamanho:** M

## Entrega 2 — Tipos e contratos

### T-03 — Definir contratos de dominio e API

- **ID:** T-03
- **Titulo:** Definir contratos de dominio e API
- **Descricao curta:** Criar os tipos compartilhados para cidades, clima, previsao, unidades, estados de carga, erros voltados ao usuario e respostas Open-Meteo.
- **Criterios de aceite verificaveis:**
  - Os tipos representam `Unit`, `LoadStatus`, `SearchStatus`, `City`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `SearchState`, `WeatherState` e `UserFacingError` conforme o plano.
  - Os contratos externos representam os campos opcionais de geocoding e forecast sem esconder respostas parciais.
  - Os arquivos de tipos nao importam React e passam no TypeScript strict.
- **Rastreabilidade:** RF: N/A; NFR: NFR4, NFR6; AC: N/A; US: N/A; Plano: Data Model.
- **Dependencias:** T-02.
- **Arquivos provaveis:** `src/types/weather.ts`, `src/types/api.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

## Entrega 3 — Funcoes puras e transformacao

### T-04 — Implementar conversao e formatacao de temperatura

- **ID:** T-04
- **Titulo:** Implementar conversao e formatacao de temperatura
- **Descricao curta:** Isolar a conversao Celsius/Fahrenheit e a exibicao com unidade, arredondamento e uma casa decimal.
- **Criterios de aceite verificaveis:**
  - Celsius permanece inalterado e Fahrenheit usa `F = (C * 9 / 5) + 32`.
  - Fahrenheit e arredondado para uma casa decimal, incluindo valores negativos.
  - A formatacao identifica `°C` ou `°F` e nao modifica o dado canonico.
  - A lib nao acessa rede, estado ou React.
- **Rastreabilidade:** RF: FR5; NFR: NFR1, NFR6, NFR7; AC: AC5; US: US5.
- **Dependencias:** T-03.
- **Arquivos provaveis:** `src/lib/temperature.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** P

### T-05 — Mapear codigos WMO e datas locais

- **ID:** T-05
- **Titulo:** Mapear codigos WMO e datas locais
- **Descricao curta:** Fornecer rotulos WMO em pt-BR e formatar datas retornadas pelo timezone da localidade.
- **Criterios de aceite verificaveis:**
  - Cada codigo WMO contemplado pelo mapa de condicoes retorna um rotulo textual nao vazio em pt-BR.
  - Codigo desconhecido retorna fallback textual, sem quebrar a renderizacao.
  - Datas ISO do forecast sao apresentadas como datas locais pt-BR sem usar o timezone do navegador para trocar o dia.
- **Rastreabilidade:** RF: FR4, FR9; NFR: NFR6, NFR7; AC: AC4, AC11; US: US2, US3.
- **Dependencias:** T-03.
- **Arquivos provaveis:** `src/lib/weatherCode.ts`, `src/lib/date.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

### T-06 — Transformar resposta de forecast em dominio

- **ID:** T-06
- **Titulo:** Transformar resposta de forecast em dominio
- **Descricao curta:** Mapear `ForecastApiResponse` valido para `WeatherData`, alinhando clima atual e exatamente cinco dias.
- **Criterios de aceite verificaveis:**
  - Campos essenciais de `current`, `timezone` e dos cinco arrays diarios sao mapeados para os nomes de dominio definidos.
  - Os itens diarios usam os indices 0 a 4, preservando o alinhamento entre data, codigo e temperaturas.
  - Campos opcionais ausentes ou invalidos nao recebem valores inventados.
  - Resposta incompleta ou arrays desalinhados nao e aceita como sucesso e pode ser classificada como `partial-response`.
- **Rastreabilidade:** RF: FR3, FR4, FR7; NFR: NFR4, NFR6; AC: AC3, AC4, AC9; US: US2, US3, US6.
- **Dependencias:** T-03, T-05.
- **Arquivos provaveis:** `src/lib/weatherMapper.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** P

## Entrega 4 — Services, HTTP e integracao Open-Meteo

### T-07 — Criar cliente HTTP com timeout e erros

- **ID:** T-07
- **Titulo:** Criar cliente HTTP com timeout e erros
- **Descricao curta:** Encapsular Fetch API, timeout de 10 segundos, parsing JSON e classificacao inicial de falhas.
- **Criterios de aceite verificaveis:**
  - Toda requisicao pode ser encerrada apos 10 segundos e nunca deixa loading infinito.
  - HTTP nao-OK, JSON invalido, falha de rede e timeout produzem erros classificaveis.
  - O cliente nao executa retry automatico.
  - O cliente permanece independente de componentes e de regras visuais.
- **Rastreabilidade:** RF: FR7; NFR: NFR4, NFR6; AC: AC9; US: US6.
- **Dependencias:** T-02, T-03.
- **Arquivos provaveis:** `src/services/http.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

### T-08 — Implementar servico de geocoding

- **ID:** T-08
- **Titulo:** Implementar servico de geocoding
- **Descricao curta:** Consultar e validar localidades no endpoint Open-Meteo, limitando e mapeando os resultados para `City`.
- **Criterios de aceite verificaveis:**
  - A URL usa `/v1/search` com `name`, `count=5`, `language=pt` e `format=json`.
  - A resposta retorna no maximo cinco cidades e mapeia `admin1` para `region`.
  - `results` ausente ou vazio representa nenhum resultado.
  - Item sem `name`, `latitude` ou `longitude` e tratado como resposta invalida.
- **Rastreabilidade:** RF: FR1, FR7; NFR: NFR4, NFR6, NFR7; AC: AC1, AC8, AC9; US: US1, US6.
- **Dependencias:** T-03, T-07.
- **Arquivos provaveis:** `src/services/geocodingService.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

### T-09 — Implementar servico de forecast

- **ID:** T-09
- **Titulo:** Implementar servico de forecast
- **Descricao curta:** Consultar forecast canonico em Celsius e transformar uma localidade selecionada em `WeatherData` valido.
- **Criterios de aceite verificaveis:**
  - A URL usa latitude, longitude, todas as variaveis `current` e `daily`, `temperature_unit=celsius`, `forecast_days=5` e `timezone=auto`.
  - Respostas HTTP, JSON, campos essenciais e arrays diarios sao validados antes do retorno.
  - Dados canonicos permanecem em Celsius e campos opcionais ausentes sao preservados como opcionais.
  - Falhas de timeout, rede, API e resposta parcial sao propagadas sem retry automatico.
- **Rastreabilidade:** RF: FR3, FR4, FR7; NFR: NFR4, NFR6; AC: AC3, AC4, AC9; US: US2, US3, US6.
- **Dependencias:** T-06, T-07.
- **Arquivos provaveis:** `src/services/forecastService.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

## Entrega 5 — Hook, orquestracao e estado

### T-10 — Implementar hook de busca e selecao

- **ID:** T-10
- **Titulo:** Implementar hook de busca e selecao
- **Descricao curta:** Orquestrar busca explicita, validacao do termo, resultados, selecao de cidade e transicoes basicas de estado.
- **Criterios de aceite verificaveis:**
  - O estado interno inicia em `idle`, sem cidade presumida, e a UI apresenta a
    tela vazia com orientação para a primeira busca em Celsius.
  - Termo vazio, somente espacos ou menor que dois caracteres nao chama API e mostra orientacao em pt-BR.
  - Busca valida normaliza espacos necessarios, consulta geocoding e limpa selecao/retry da operacao anterior.
  - Zero resultados termina em `empty`; resultado unico e selecionado automaticamente; multiplos resultados aguardam selecao explicita.
- **Rastreabilidade:** RF: FR1, FR2, FR6, FR7; NFR: NFR4, NFR7; AC: AC1, AC2, AC6, AC8; US: US1, US6.
- **Dependencias:** T-08, T-09.
- **Arquivos provaveis:** `src/hooks/useWeatherSearch.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

### T-11 — Adicionar concorrencia, loading e requestId

- **ID:** T-11
- **Titulo:** Adicionar concorrencia, loading e requestId
- **Descricao curta:** Garantir que buscas novas invalidem operacoes antigas e que loading, dados anteriores e respostas atrasadas sejam tratados corretamente.
- **Criterios de aceite verificaveis:**
  - Cada operacao recebe `requestId` crescente e somente o id vigente pode alterar o estado.
  - Resposta atrasada de geocoding ou forecast nunca substitui a busca mais recente.
  - Uma nova carga pode manter dados anteriores somente com `isCurrent=false`, sem combinar dados antigos e parciais.
  - Loading e `aria-busy="true"` ficam presentes no DOM ate 100 ms apos a acao.
- **Rastreabilidade:** RF: FR6, FR9; NFR: NFR1, NFR3, NFR4; AC: AC7, AC11; US: US2, US3, US6.
- **Dependencias:** T-10.
- **Arquivos provaveis:** `src/hooks/useWeatherSearch.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

### T-12 — Adicionar erros e retry manual limitado

- **ID:** T-12
- **Titulo:** Adicionar erros e retry manual limitado
- **Descricao curta:** Normalizar mensagens, preservar a operacao util e implementar retry manual sem exceder duas novas tentativas.
- **Criterios de aceite verificaveis:**
  - `network`, `api`, `timeout` e `partial-response` repetivel chegam a `error` com mensagem em pt-BR e `canRetry` apropriado.
  - `not-found` chega a `empty` e `invalid-query` nao cria request.
  - Retry incrementa `retryCount`, gera novo `requestId` e repete a ultima operacao valida.
  - O terceiro acionamento de retry e impedido e nao cria nova chamada.
- **Rastreabilidade:** RF: FR6, FR7; NFR: NFR4; AC: AC9; US: US6.
- **Dependencias:** T-11.
- **Arquivos provaveis:** `src/hooks/useWeatherSearch.ts`, `src/types/weather.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

### T-13 — Adicionar projecao de unidade

- **ID:** T-13
- **Titulo:** Adicionar projecao de unidade
- **Descricao curta:** Controlar Celsius/Fahrenheit somente na memoria e refletir a preferencia durante e apos loading.
- **Criterios de aceite verificaveis:**
  - Unidade inicial e Celsius; todos os valores de temperatura atuais e diarios podem ser projetados em Fahrenheit.
  - Alternar unidade nao chama geocoding nem forecast e nao altera o dado canonico.
  - Troca durante loading e aplicada quando dados validos chegarem.
- **Rastreabilidade:** RF: FR5, FR6; NFR: NFR1, NFR7; AC: AC5, AC7; US: US5, US6.
- **Dependencias:** T-04, T-11.
- **Arquivos provaveis:** `src/hooks/useWeatherSearch.ts`, `src/lib/temperature.ts`.
- **Tipo:** Data
- **Prioridade:** P0
- **Tamanho:** M

## Entrega 6 — Componentes UI

### T-14 — Construir formulario de busca

- **ID:** T-14
- **Titulo:** Construir formulario de busca
- **Descricao curta:** Criar busca explicita com campo rotulado, submissao, refinamento textual e estados de foco/loading.
- **Criterios de aceite verificaveis:**
  - O campo possui label e nome acessivel, aceita cidade com estado/regiao/pais e permite editar apos nenhum resultado.
  - Submissao pode ser feita por teclado e o foco permanece utilizavel durante loading.
  - O componente recebe callbacks e estado por props, sem chamada direta a servicos.
- **Rastreabilidade:** RF: FR1, FR6, FR8; NFR: NFR3, NFR6, NFR7; AC: AC1, AC6, AC7, AC10; US: US1, US4.
- **Dependencias:** T-10, T-11.
- **Arquivos provaveis:** `src/components/SearchForm.tsx`.
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P

### T-15 — Construir lista de localidades selecionavel

- **ID:** T-15
- **Titulo:** Construir lista de localidades selecionavel
- **Descricao curta:** Apresentar resultados homonimos e permitir selecao por clique ou teclado.
- **Criterios de aceite verificaveis:**
  - Cada resultado mostra nome e, quando disponiveis, regiao, pais, latitude e longitude.
  - Multiplos resultados nao exibem forecast antes da selecao.
  - Cada item possui nome acessivel, recebe foco visivel e e alcancavel por Tab na ordem apresentada.
- **Rastreabilidade:** RF: FR2, FR8; NFR: NFR3, NFR7; AC: AC2, AC10; US: US1, US4.
- **Dependencias:** T-14.
- **Arquivos provaveis:** `src/components/LocationResults.tsx`.
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P

### T-16 — Construir mensagens de status acessiveis

- **ID:** T-16
- **Titulo:** Construir mensagens de status acessiveis
- **Descricao curta:** Renderizar idle, loading, empty e error com comunicacao textual e acoes adequadas.
- **Criterios de aceite verificaveis:**
  - Loading, vazio e erro aparecem em regiao `aria-live`; loading tambem expoe `aria-busy`.
  - Mensagens diferenciam busca sem resultado de falha tecnica e sao escritas em pt-BR.
  - Retry aparece apenas quando permitido, respeita o limite e possui nome acessivel.
  - Informacoes nao dependem somente de cor ou icone.
- **Rastreabilidade:** RF: FR6, FR7, FR8; NFR: NFR3, NFR4, NFR7; AC: AC6, AC7, AC8, AC9, AC10; US: US4, US6.
- **Dependencias:** T-12, T-14.
- **Arquivos provaveis:** `src/components/StatusMessage.tsx`.
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P

### T-17 — Construir controle de unidade

- **ID:** T-17
- **Titulo:** Construir controle de unidade
- **Descricao curta:** Expor alternancia acessivel entre Celsius e Fahrenheit.
- **Criterios de aceite verificaveis:**
  - Celsius inicia selecionado e o controle tem labels/nome acessivel.
  - Alternar atualiza a projecao sem requisicao de rede.
  - O controle recebe foco visivel, responde a teclado e expoe o estado selecionado por texto, atributo ou estado semantico alem da cor.
- **Rastreabilidade:** RF: FR5, FR8; NFR: NFR1, NFR3, NFR7; AC: AC5, AC10; US: US4, US5.
- **Dependencias:** T-13.
- **Arquivos provaveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P

### T-18 — Construir clima atual

- **ID:** T-18
- **Titulo:** Construir clima atual
- **Descricao curta:** Renderizar a localidade e os dados atuais, incluindo campos opcionais, com hierarquia legivel.
- **Criterios de aceite verificaveis:**
  - Clima atual mostra temperatura, sensacao, condicao, umidade, vento e precipitacao quando fornecidos; opcionais ausentes aparecem como `—` ou sao omitidos explicitamente.
  - Os valores exibidos respeitam a unidade projetada e rotulos WMO em pt-BR.
  - Markup usa headings/landmarks semanticos e nao depende apenas de icones.
- **Rastreabilidade:** RF: FR3, FR8, FR9; NFR: NFR3, NFR7; AC: AC3, AC10, AC11; US: US2, US4.
- **Dependencias:** T-05, T-06, T-13.
- **Arquivos provaveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P

### T-19 — Construir previsao diaria

- **ID:** T-19
- **Titulo:** Construir previsao diaria
- **Descricao curta:** Renderizar exatamente cinco dias de previsao com condicao, temperaturas e precipitacao opcional.
- **Criterios de aceite verificaveis:**
  - A previsao mostra exatamente cinco dias, data, condicao, minima, maxima e precipitacao quando fornecida.
  - Valores exibidos respeitam a unidade projetada e rotulos WMO em pt-BR.
  - Markup usa headings/landmarks semanticos e nao depende apenas de icones.
- **Rastreabilidade:** RF: FR4, FR8, FR9; NFR: NFR3, NFR7; AC: AC4, AC10, AC11; US: US3, US4.
- **Dependencias:** T-05, T-06, T-13.
- **Arquivos provaveis:** `src/components/DailyForecast.tsx`.
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** P

## Entrega 7 — Integracao da tela, tema e layout

### T-20 — Compor a tela principal

- **ID:** T-20
- **Titulo:** Compor a tela principal
- **Descricao curta:** Integrar o hook e os componentes em uma rota unica, conectando callbacks, estados e dados do fluxo principal.
- **Criterios de aceite verificaveis:**
  - A tela inicial orienta a primeira busca sem presumir localidade; sucesso apresenta cidade, atual e previsao na mesma rota.
  - Componentes recebem estado e callbacks por props e nenhum componente acessa Open-Meteo diretamente.
  - Na mesma rota, uma busca valida exibe resultados, uma selecao inicia o forecast, o sucesso exibe clima/previsao e a troca de unidade atualiza os valores sem nova requisicao.
- **Rastreabilidade:** RF: FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR9; NFR: NFR4, NFR6, NFR7; AC: AC1, AC2, AC3, AC4, AC5, AC6, AC7, AC8, AC9, AC11; US: US1, US2, US3, US5, US6.
- **Dependencias:** T-14, T-15, T-16, T-17, T-18, T-19.
- **Arquivos provaveis:** `src/App.tsx`, `src/main.tsx`.
- **Tipo:** UI
- **Prioridade:** P0
- **Tamanho:** M

### T-21 — Aplicar tema visual base

- **ID:** T-21
- **Titulo:** Aplicar tema visual base
- **Descricao curta:** Definir o tema Tailwind mobile-first, dark glassmorphism, tipografia, cores e estados visuais globais.
- **Criterios de aceite verificaveis:**
  - `src/index.css` define as bases visuais do tema, incluindo fundo, superficies, tipografia, cores e estados de foco.
  - Contraste de texto normal atinge pelo menos 4,5:1, foco e teclado permanecem visiveis.
- **Rastreabilidade:** RF: FR8, FR9; NFR: NFR2, NFR3, NFR7; AC: AC10, AC11; US: US4.
- **Dependencias:** T-20.
- **Arquivos provaveis:** `src/index.css`.
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** P

### T-22 — Aplicar layout responsivo da tela principal

- **ID:** T-22
- **Titulo:** Aplicar layout responsivo da tela principal
- **Descricao curta:** Organizar a composicao da tela principal para leitura e interacao responsivas em diferentes larguras.
- **Criterios de aceite verificaveis:**
  - Em 320 px cidade e clima atual ficam identificaveis sem rolagem horizontal; previsao pode rolar verticalmente.
  - Em 320, 768 e 1280 px, a largura de `document.documentElement.scrollWidth` nao excede `clientWidth`, e nao ha elementos sobrepostos ou texto essencial cortado.
  - O layout preserva foco visivel, teclado utilizavel e hierarquia de informacao.
- **Rastreabilidade:** RF: FR8, FR9; NFR: NFR2, NFR3, NFR5, NFR7; AC: AC10, AC11; US: US4.
- **Dependencias:** T-21.
- **Arquivos provaveis:** `src/App.tsx`.
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** P

### T-23 — Ajustar layout de busca e resultados

- **ID:** T-23
- **Titulo:** Ajustar layout de busca e resultados
- **Descricao curta:** Aplicar o layout responsivo aos componentes de busca e selecao de localidades.
- **Criterios de aceite verificaveis:**
  - Formulario e resultados permanecem utilizaveis em 320, 768 e 1280 px sem texto cortado ou rolagem horizontal.
  - Campos, botoes e itens selecionaveis recebem foco visivel e sao alcancaveis por Tab na ordem visual da interface.
- **Rastreabilidade:** RF: FR1, FR2, FR8; NFR: NFR2, NFR3, NFR5; AC: AC1, AC2, AC10; US: US1, US4.
- **Dependencias:** T-22.
- **Arquivos provaveis:** `src/components/SearchForm.tsx`, `src/components/LocationResults.tsx`.
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** M

### T-24 — Ajustar layout de clima e previsao

- **ID:** T-24
- **Titulo:** Ajustar layout de clima e previsao
- **Descricao curta:** Aplicar o layout responsivo aos paineis de clima atual e previsao diaria.
- **Criterios de aceite verificaveis:**
  - Cidade e clima atual ficam identificaveis em 320 px sem sobreposicao.
  - A previsao exibe seus cinco itens sem texto essencial cortado e, em 320, 768 e 1280 px, `scrollWidth` nao excede `clientWidth`.
- **Rastreabilidade:** RF: FR3, FR4, FR8, FR9; NFR: NFR2, NFR3, NFR5; AC: AC3, AC4, AC10, AC11; US: US2, US3, US4.
- **Dependencias:** T-22.
- **Arquivos provaveis:** `src/components/CurrentWeather.tsx`, `src/components/DailyForecast.tsx`.
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** M

### T-25 — Ajustar layout de status e unidade

- **ID:** T-25
- **Titulo:** Ajustar layout de status e unidade
- **Descricao curta:** Aplicar o layout responsivo às mensagens de status e ao controle de unidade.
- **Criterios de aceite verificaveis:**
  - Mensagens de status e controle de unidade permanecem visiveis e utilizaveis em 320, 768 e 1280 px.
  - Foco, teclado e informacoes textuais permanecem legiveis sem depender de cor ou causar sobreposicao.
- **Rastreabilidade:** RF: FR5, FR6, FR7, FR8; NFR: NFR2, NFR3, NFR4, NFR7; AC: AC5, AC7, AC8, AC9, AC10; US: US4, US5, US6.
- **Dependencias:** T-22.
- **Arquivos provaveis:** `src/components/StatusMessage.tsx`, `src/components/UnitToggle.tsx`.
- **Tipo:** UI
- **Prioridade:** P1
- **Tamanho:** M

## Entrega 8 — Testes unitarios e de componentes

### T-26 — Testar conversao de temperatura

- **ID:** T-26
- **Titulo:** Testar conversao de temperatura
- **Descricao curta:** Cobrir isoladamente a conversao Celsius/Fahrenheit e a formatacao de temperatura.
- **Criterios de aceite verificaveis:**
  - `tests/unit/temperature.test.ts` cobre a formula Celsius/Fahrenheit, arredondamento em uma casa decimal, valores negativos e ambas as unidades.
  - O arquivo de temperatura e executado isoladamente, sem React, rede ou dependencia dos testes de WMO e datas.
  - Os testes confirmam que a conversao nao altera o dado canonico em Celsius.
- **Rastreabilidade:** RF: FR5; NFR: NFR1, NFR6, NFR7; AC: AC5; US: US5.
- **Dependencias:** T-04.
- **Arquivos provaveis:** `tests/unit/temperature.test.ts`.
- **Tipo:** Test
- **Prioridade:** P0
- **Tamanho:** P

### T-27 — Testar WMO e datas locais

- **ID:** T-27
- **Titulo:** Testar WMO e datas locais
- **Descricao curta:** Validar os rotulos WMO e a formatacao de datas no timezone da localidade.
- **Criterios de aceite verificaveis:**
  - Testes cobrem todos os WMO suportados e codigo desconhecido com fallback textual.
  - Testes cobrem datas locais sem permitir que o timezone do navegador troque o dia.
  - Os testes nao usam React nem rede.
- **Rastreabilidade:** RF: FR4, FR9; NFR: NFR6, NFR7; AC: AC4, AC11; US: US2, US3.
- **Dependencias:** T-05.
- **Arquivos provaveis:** `tests/unit/weatherCode.test.ts`, `tests/unit/date.test.ts`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M

### T-28 — Testar mapper de forecast

- **ID:** T-28
- **Titulo:** Testar mapper de forecast
- **Descricao curta:** Validar a transformacao deterministica de respostas de forecast para o dominio.
- **Criterios de aceite verificaveis:**
  - Fixture valida produz exatamente cinco `ForecastDay` alinhados.
  - Fixture parcial ou com arrays desalinhados falha como `partial-response`.
  - O teste nao usa React nem rede.
- **Rastreabilidade:** RF: FR3, FR4, FR7; NFR: NFR4, NFR6; AC: AC3, AC4, AC9; US: US2, US3, US6.
- **Dependencias:** T-06.
- **Arquivos provaveis:** `tests/unit/weatherMapper.test.ts`.
- **Tipo:** Test
- **Prioridade:** P0
- **Tamanho:** P

### T-29 — Testar cliente HTTP e geocoding com fetch mockado

- **ID:** T-29
- **Titulo:** Testar cliente HTTP e geocoding com fetch mockado
- **Descricao curta:** Validar o cliente HTTP e o servico de geocoding usando mock de `fetch`.
- **Criterios de aceite verificaveis:**
  - Testes verificam a URL e todos os parametros de geocoding, incluindo `count=5`, `language=pt` e `format=json`.
  - Fixtures cobrem sucesso, vazio, HTTP nao-OK, JSON invalido, rede e timeout no cliente e no geocoding.
  - Fica demonstrado que nao existe retry automatico.
- **Rastreabilidade:** RF: FR1, FR7; NFR: NFR4, NFR6; AC: AC1, AC8, AC9; US: US1, US6.
- **Dependencias:** T-07, T-08.
- **Arquivos provaveis:** `tests/unit/http.test.ts`, `tests/unit/geocodingService.test.ts`.
- **Tipo:** Test
- **Prioridade:** P0
- **Tamanho:** M

### T-30 — Testar servico de forecast com fetch mockado

- **ID:** T-30
- **Titulo:** Testar servico de forecast com fetch mockado
- **Descricao curta:** Validar requests, parsing, contratos e falhas do servico de forecast usando mock de `fetch`.
- **Criterios de aceite verificaveis:**
  - Testes verificam a URL e todos os parametros de forecast, incluindo `forecast_days=5`, `timezone=auto` e Celsius.
  - Fixtures cobrem sucesso, HTTP nao-OK, JSON invalido, rede, timeout e resposta parcial.
  - Fica demonstrado que nao existe retry automatico.
- **Rastreabilidade:** RF: FR3, FR4, FR7; NFR: NFR4, NFR6; AC: AC3, AC4, AC9; US: US2, US3, US6.
- **Dependencias:** T-06, T-07, T-09.
- **Arquivos provaveis:** `tests/unit/forecastService.test.ts`.
- **Tipo:** Test
- **Prioridade:** P0
- **Tamanho:** P

### T-31 — Testar hook e orquestracao

- **ID:** T-31
- **Titulo:** Testar hook e orquestracao
- **Descricao curta:** Verificar transicoes, concorrencia, retry, preservacao de consulta e troca de unidade.
- **Criterios de aceite verificaveis:**
  - Testes cobrem `idle -> loading -> success`, `loading -> empty` e `loading -> error`.
  - A primeira e a segunda acoes manuais de retry criam uma nova tentativa e preservam query/localidade; a terceira nao cria chamada.
  - Respostas fora de ordem sao descartadas por `requestId` e dados antigos ficam marcados como nao atuais durante nova carga.
  - Troca C/F nao gera chamadas de geocoding ou forecast, inclusive durante loading.
- **Rastreabilidade:** RF: FR1, FR2, FR5, FR6, FR7; NFR: NFR1, NFR4, NFR6; AC: AC2, AC5, AC7, AC9; US: US1, US5, US6.
- **Dependencias:** T-10, T-11, T-12, T-13.
- **Arquivos provaveis:** `tests/unit/useWeatherSearch.test.ts`.
- **Tipo:** Test
- **Prioridade:** P0
- **Tamanho:** M

### T-32 — Testar busca e lista de localidades

- **ID:** T-32
- **Titulo:** Testar busca e lista de localidades
- **Descricao curta:** Cobrir formulario de busca e lista de localidades com Testing Library, callbacks mockados e fixtures deterministicas.
- **Criterios de aceite verificaveis:**
  - `SearchForm` e `LocationResults` sao testados em estados relevantes, incluindo selecao por teclado.
  - Testes verificam labels, roles, nomes acessiveis e foco visivel.
  - Os testes nao dependem de rede real, cor ou icone isoladamente.
- **Rastreabilidade:** RF: FR1, FR2, FR8; NFR: NFR3, NFR6, NFR7; AC: AC1, AC2, AC10; US: US1, US4.
- **Dependencias:** T-14, T-15.
- **Arquivos provaveis:** `tests/components/SearchForm.test.tsx`, `tests/components/LocationResults.test.tsx`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M

### T-33 — Testar mensagens de status e acessibilidade

- **ID:** T-33
- **Titulo:** Testar mensagens de status e acessibilidade
- **Descricao curta:** Cobrir os estados visuais e as regioes acessiveis do componente de status.
- **Criterios de aceite verificaveis:**
  - `StatusMessage` e testado para loading, vazio e erro, com mensagens pt-BR e retry quando permitido.
  - Testes verificam `aria-live`, `aria-busy`, nomes acessiveis e ausencia de dependencia exclusiva de cor ou icone.
- **Rastreabilidade:** RF: FR6, FR7, FR8; NFR: NFR3, NFR4, NFR6, NFR7; AC: AC6, AC7, AC8, AC9, AC10; US: US4, US6.
- **Dependencias:** T-16.
- **Arquivos provaveis:** `tests/components/StatusMessage.test.tsx`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** P

### T-34 — Testar clima atual e previsao

- **ID:** T-34
- **Titulo:** Testar clima atual e previsao
- **Descricao curta:** Cobrir a renderizacao do clima atual e da previsao diaria com fixtures deterministicas.
- **Criterios de aceite verificaveis:**
  - `CurrentWeather` e `DailyForecast` sao testados com temperaturas, condicoes, previsao de cinco dias e campos opcionais.
  - Testes confirmam `—` ou omissao explicita para opcionais ausentes e rotulos em pt-BR.
  - Markup semantico e nomes acessiveis sao verificados sem depender de cor ou icone isoladamente.
- **Rastreabilidade:** RF: FR3, FR4, FR8, FR9; NFR: NFR3, NFR6, NFR7; AC: AC3, AC4, AC10, AC11; US: US2, US3, US4.
- **Dependencias:** T-18, T-19.
- **Arquivos provaveis:** `tests/components/CurrentWeather.test.tsx`, `tests/components/DailyForecast.test.tsx`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M

### T-35 — Testar controle de unidade

- **ID:** T-35
- **Titulo:** Testar controle de unidade
- **Descricao curta:** Cobrir a alternancia acessivel entre Celsius e Fahrenheit.
- **Criterios de aceite verificaveis:**
  - `UnitToggle` e testado com Celsius inicial, labels acessiveis, teclado, foco visivel e estado selecionado.
  - O callback de troca e acionado sem depender de rede, cor ou icone isoladamente.
- **Rastreabilidade:** RF: FR5, FR8; NFR: NFR1, NFR3, NFR6, NFR7; AC: AC5, AC10; US: US4, US5.
- **Dependencias:** T-17.
- **Arquivos provaveis:** `tests/components/UnitToggle.test.tsx`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** P

### T-36 — Testar estados dos componentes

- **ID:** T-36
- **Titulo:** Testar estados dos componentes
- **Descricao curta:** Validar os estados loading, erro, vazio e sucesso nos componentes da interface com Testing Library.
- **Criterios de aceite verificaveis:**
  - Os testes renderizam e verificam explicitamente os estados `loading`, `error`, `empty` e `success` na interface, com as mensagens e dados esperados em cada caso.
  - O estado `loading` verifica `aria-live` e `aria-busy`; o estado `error` verifica mensagem em pt-BR e retry quando permitido; o estado `empty` verifica orientação para busca/refinamento; e o estado `success` verifica localidade, clima atual e previsão.
  - Os testes usam fixtures e callbacks determinísticos, sem rede real, e não dependem somente de cor ou ícone.
- **Rastreabilidade:** RF: FR3, FR4, FR6, FR7, FR8, FR9; NFR: NFR1, NFR3, NFR4, NFR6, NFR7; AC: AC3, AC4, AC6, AC7, AC8, AC9, AC10, AC11; US: US2, US3, US4, US6.
- **Dependencias:** T-16, T-18, T-19, T-32, T-33, T-34, T-35.
- **Arquivos provaveis:** `tests/components/AppStates.test.tsx`, `tests/components/StatusMessage.test.tsx`, `tests/components/CurrentWeather.test.tsx`, `tests/components/DailyForecast.test.tsx`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** G

## Entrega 9 — Testes E2E

### T-37 — Cobrir fluxo principal E2E em viewports definidos

- **ID:** T-37
- **Titulo:** Cobrir fluxo principal E2E em viewports definidos
- **Descricao curta:** Validar os fluxos completos com Playwright, respostas Open-Meteo controladas e execução nos viewports aplicáveis.
- **Criterios de aceite verificaveis:**
  - A suite cobre busca valida, homonimos com selecao, nao encontrado, cinco dias, troca C/F, loading, erro e retry.
  - Interceptacoes confirmam parametros, ausencia de nova chamada ao trocar unidade, saida de timeout/loading e descarte de resposta antiga.
  - O resultado mockado renderiza em ate 2 segundos e o loading e observavel em ate 100 ms.
  - O fluxo principal e executado e validado em viewport mobile de 320 px e tambem em 768 px e 1280 px quando aplicavel, sem sobreposicao, texto essencial cortado ou rolagem horizontal.
- **Rastreabilidade:** RF: FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9; NFR: NFR1, NFR2, NFR3, NFR4, NFR5, NFR6, NFR7; AC: AC1, AC2, AC3, AC4, AC5, AC6, AC7, AC8, AC9, AC10, AC11; US: US1, US2, US3, US4, US5, US6.
- **Dependencias:** T-20, T-21, T-22, T-23, T-24, T-25, T-28, T-29, T-30, T-31, T-32, T-33, T-34, T-35, T-36.
- **Arquivos provaveis:** `tests/e2e/weather-app.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** G

### T-38 — Validar viewports e acessibilidade

- **ID:** T-38
- **Titulo:** Validar viewports e acessibilidade
- **Descricao curta:** Executar a matriz final de compatibilidade visual, responsividade e acessibilidade.
- **Criterios de aceite verificaveis:**
  - Fluxos principais passam em 320 px, 768 px e 1280 px.
  - Em 320 px nao ha sobreposicao nem rolagem horizontal; previsao, teclado, foco, roles, nomes e regioes live permanecem utilizaveis.
  - A checagem automatizada configurada para acessibilidade e contraste executa nos fluxos principais e retorna zero violacoes.
- **Rastreabilidade:** RF: FR8, FR9; NFR: NFR2, NFR3, NFR5; AC: AC10, AC11; US: US4.
- **Dependencias:** T-21, T-22, T-23, T-24, T-25, T-37.
- **Arquivos provaveis:** `tests/e2e/`, `playwright.config.ts`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** G

## Entrega 10 — Hardening e validacao final

### T-39 — Executar comandos e checklist final

- **ID:** T-39
- **Titulo:** Executar comandos e checklist final
- **Descricao curta:** Rodar os comandos obrigatorios e confirmar os limites de escopo do MVP antes da entrega.
- **Criterios de aceite verificaveis:**
  - `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` terminam com codigo 0, sem adicionar funcionalidades fora do escopo.
  - Nao foram adicionados cache persistente, login, favoritos, geolocalizacao automatica, polling ou retry automatico.
- **Rastreabilidade:** RF: N/A; NFR: NFR4, NFR5, NFR6; AC: AC9, AC10; US: US6.
- **Dependencias:** T-38.
- **Arquivos provaveis:** `package.json`, `README.md`.
- **Tipo:** Test
- **Prioridade:** P1
- **Tamanho:** M

## Rastreabilidade por requisito funcional

| Requisito funcional | Tarefas que implementam ou validam | Cobertura |
|---|---|---|
| FR1 — Buscar cidades | T-08, T-10, T-14, T-15, T-28, T-31, T-35 | Implementação do geocoding, validação da busca, UI e testes. |
| FR2 — Selecionar uma localidade | T-10, T-15, T-20, T-31, T-35 | Seleção por clique/teclado e forecast somente após seleção. |
| FR3 — Exibir clima atual | T-06, T-09, T-18, T-27, T-29, T-33, T-35 | Transformação, service, componente e testes. |
| FR4 — Exibir previsão de cinco dias | T-05, T-06, T-09, T-19, T-27, T-29, T-33, T-35 | Datas, arrays alinhados, cinco itens e testes. |
| FR5 — Alternar unidades de temperatura | T-04, T-13, T-17, T-26, T-34, T-35 | Conversão, projeção, controle e testes sem novo request. |
| FR6 — Gerenciar estados da interface | T-10, T-11, T-12, T-16, T-20, T-32, T-35 | Estados, orquestração, mensagens e fluxos E2E. |
| FR7 — Tratar busca sem resultado e falhas | T-07, T-08, T-09, T-12, T-16, T-28, T-29, T-32, T-35 | Erros de entrada, API, rede, timeout, resposta parcial e retry. |
| FR8 — Interface responsiva e acessível | T-14, T-15, T-16, T-17, T-18, T-19, T-21, T-22, T-23, T-24, T-25, T-31, T-32, T-33, T-34, T-35, T-38 | Componentes, tema, viewports, teclado, foco, semântica e testes. |
| FR9 — Dados de forma legível | T-05, T-18, T-19, T-20, T-21, T-22, T-24, T-33, T-35, T-38 | Rótulos, hierarquia visual, composição e validação responsiva. |

### Requisitos sem tarefa correspondente

Todos os requisitos funcionais FR1–FR9 possuem pelo menos uma tarefa de
implementação e uma tarefa de teste ou validação. Não há requisito funcional da
spec sem tarefa correspondente.

## Sequência de fatias verticais

As fatias abaixo priorizam entregas observáveis cedo e respeitam as dependências
das tarefas. Cada fatia pode ser demonstrada isoladamente antes da seguinte.

### 1. Shell React, formulário e estados com dados mockados

- **Objetivo visível:** Abrir a aplicação, ver a tela inicial em idle, enviar
  uma busca mockada e observar loading, empty e error em uma interface
  navegável.
- **Tarefas incluídas:** T-01, T-02, T-03, T-10, T-11, T-12, T-14, T-16, T-20.
- **Critério de pronto:** O shell React executa e uma busca com dados mockados
  percorre idle/loading/empty/error sem rede real, com mensagens em pt-BR e
  retry limitado quando aplicável.

### 2. Fluxo principal mockado com cidade, clima atual e cinco dias

- **Objetivo visível:** Selecionar uma cidade mockada e exibir sua localidade,
  clima atual e previsão de exatamente cinco dias na mesma tela.
- **Tarefas incluídas:** T-04, T-05, T-06, T-13, T-15, T-17, T-18, T-19.
- **Critério de pronto:** O fluxo mockado mostra cidade, condição, temperaturas
  atuais e cinco dias, permite selecionar homônimos e alternar a unidade sem
  nova requisição.

### 3. Integração real de geocoding e forecast

- **Objetivo visível:** Substituir as fontes mockadas pelas consultas reais da
  Open-Meteo, mantendo a experiência principal.
- **Tarefas incluídas:** T-07, T-08, T-09.
- **Critério de pronto:** Uma busca explícita consulta geocoding, uma seleção
  válida consulta forecast com os parâmetros especificados e os dados válidos
  são transformados e renderizados no fluxo principal.

### 4. Unidade C/F, concorrência e retry

- **Objetivo visível:** Tornar o fluxo resistente a alternâncias de unidade,
  respostas fora de ordem, falhas transitórias e novas tentativas manuais.
- **Tarefas incluídas:** T-11, T-12, T-13, T-26, T-28, T-29, T-30, T-31.
- **Critério de pronto:** A unidade C/F é projetada em memória, respostas
  obsoletas são descartadas, timeout/loading terminam corretamente e retry
  manual não ultrapassa duas novas tentativas.

### 5. Acessibilidade, tema, layout mobile e E2E

- **Objetivo visível:** Entregar uma interface legível e operável em mobile,
  tablet e desktop, validada por fluxos completos.
- **Tarefas incluídas:** T-21, T-22, T-23, T-24, T-25, T-32, T-33, T-34, T-35,
  T-36, T-37, T-38.
- **Critério de pronto:** Os fluxos E2E passam em 320, 768 e 1280 px, sem
  rolagem horizontal ou sobreposição, com foco, teclado, nomes acessíveis,
  regiões live e contraste validados.

### 6. Hardening e validação final

- **Objetivo visível:** Confirmar a qualidade do MVP e seus limites antes da
  entrega.
- **Tarefas incluídas:** T-39.
- **Critério de pronto:** Lint, build, testes unitários e E2E terminam com
  sucesso e o checklist confirma ausência de funcionalidades fora do escopo.