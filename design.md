# Logistics Control Tower — direção visual
Protótipo web responsivo isolado. Dados fictícios e estado local; sem novas regras de cálculo, banco, API ou importação real.
## Identidade
Verde profundo #073B2C, verde de ação #087A55, superfície #E9F5EF, fundo #F3F6F4, branco #FFFFFF. Texto #17231E, secundário #65736C, bordas #DCE5E0. Âmbar e vermelho apenas para alertas, acompanhados por rótulos e ícones. Poppins em títulos e corpo; números tabulares.
Referência fornecida: composição corporativa limpa, espaços definidos, superfícies claras e elementos verdes marcantes; adaptar ao dashboard, sem landing page fotográfica.
## Layout
Sidebar fixa 232px, header 86px, conteúdo espaçado 24px. Banner verde em degradê e ilustração técnica de rotas. Cards com raio 10px, borda e sombra discretas. Oito KPIs, gráficos, alertas acionáveis, tabela operacional.
## Páginas e comportamento
Início consolidado e quatro áreas para TRD, DeY, Tragetta e Pacífico. Navegação URL. Modais com foco preso, Escape e retorno ao acionador. Filtros locais, tabelas paginadas, tooltips. Importação seleciona arquivos mas não lê seu conteúdo, resultado explicitamente simulado. Sem autenticação real.
## Mobile e acessibilidade
Menu recolhível com overlay; KPIs em coluna, gráficos em largura total, tabelas com rolagem horizontal. Foco visível, labels, contraste e status textuais.
## Arquitetura
UI em pages/tower.tsx, componentes e fixtures separados, styles.css. Preservar plumbing e analytics. Nenhuma alteração em códigos externos. Guia de páginas/componentes/integração separado.
