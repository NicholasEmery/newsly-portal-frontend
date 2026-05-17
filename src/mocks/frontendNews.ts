// frontendNews.ts
import type { HomeSectionItem } from "./homeFactory";
import { createCreatedAtFromMinutesAgo } from "@/utils/date";

const FRONTEND_SEEDS = [
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Mock Accordion: Guia Interativo",
    Creators: {
      Owner: {
        name: "mockuser",
        imgProfile: "",
        bio: "mockuser — tester",
        socialMedias: [],
      },
      Colaborators: [
        {
          name: "ryckyollab",
          imgProfile: "",
          bio: "mockcollab — colaboradora editorial",
          socialMedias: [],
        },
        {
          name: "chckhollab2",
          imgProfile: "",
          bio: "mockcollab — colaboradora editorial",
          socialMedias: [],
        },
      ],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(1),
    CommentsCount: 0,
    isSubscriber: false,
    Slug: "mock-accordion-1",
    notice: `
      <article>
        <header><h1>Mock Accordion: Guia Interativo</h1></header>
        <p>Introdução rápida ao conteúdo interativo.</p>
        <div data-component="accordion">
          <item data-title="O que é isto?">
            <p>Este é um exemplo de accordion inserido via HTML do backend.</p>
          </item>
          <item data-title="Como testar?">
            <p>Navegue até esta rota e clique nos itens para verificar renderização.</p>
          </item>
        </div>
        <p>Fim do mock.</p>
        <section>
          <h2>Mais contexto</h2>
          <p>Esse exemplo existe para testar conteúdo editorial rico com interação customizada, mantendo a estrutura simples e previsível.</p>
          <p>Use-o como base para validar blocos expansíveis, hierarquia visual e comportamento em páginas com bastante densidade de informação.</p>
        </section>
      </article>
    `.trim(),
    Description: "Introdução rápida ao conteúdo interativo.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "React 19 no mundo real: boundaries, suspense e streaming",
    Creators: {
      Owner: {
        name: "frontendmaria",
        imgProfile: "",
        bio: "frontendmaria — desenvolvedora frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(0),
    CommentsCount: 10,
    isSubscriber: false,
    Slug: "react-19-boundaries-suspense-streaming",
    notice: `
      <article>
        <header>
          <h1>React 19 no mundo real: boundaries, suspense e streaming</h1>
          <p><small>Por frontendmaria • Frontend • Atualizado</small></p>
        </header>
        <p>Com o lançamento do React 19, equipes estão adotando boundaries e Suspense para controlar renderização concorrente em aplicações reais. Este artigo reúne padrões práticos, trade-offs e exemplos de implementação em componentes de grande escala.</p>
        <h2>Padrões de boundaries</h2>
        <p>Use boundaries para isolar falhas e atrasos de renderização em seções não críticas, garantindo que o restante da UI permaneça responsivo. Mostramos exemplos de composição que evitam waterfall renders.</p>
        <h2>Suspense e streaming</h2>
        <p>Suspense combinado com streaming melhora time-to-interactive ao priorizar partes da página. Demonstramos um caso real onde o streaming reduziu o tempo percebido pelo usuário em 40%.</p>
        <h3>Exemplo prático</h3>
        <p>Fragmentos de código e considerações sobre cache, SSR e transitions são apresentados para orientar a migração gradual.</p>
        <p style="text-align:center"><img src="/images/imageScience.png" alt="react19" style="max-width:100%"/></p>
        <p>Conclusão: adotar esses recursos exige disciplina em arquitetura, mas traz ganhos significativos em UX.</p>
        <section>
          <h2>Aplicação prática</h2>
          <p>Na prática, boundaries ajudam a separar áreas críticas e menos críticas da interface para evitar que um atraso isolado degrade toda a experiência.</p>
          <p>Já o strea ming fica mais útil quando você precisa servir o conteúdo principal cedo sem esperar pela renderização completa do restante da página.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Padrões práticos e trade-offs para usar boundaries, Suspense e streaming em aplicações reais.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Acessibilidade em design systems com Tailwind e tokens",
    Creators: {
      Owner: {
        name: "uxdevana",
        imgProfile: "",
        bio: "uxdevana — designer de produto",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(37),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "acessibilidade-design-system-tailwind",
    notice: `
      <article>
        <header>
          <h1>Acessibilidade em design systems com Tailwind e tokens</h1>
          <p><small>Por uxdevana • Frontend • Atualizado</small></p>
        </header>
        <p>Design systems bem-sucedidos incorporam acessibilidade desde o início: tokens semânticos, utilitários com contraste adequado e componentes que expõem pontos de foco claros. Aqui descrevemos um processo para auditar e evoluir um design system com foco em acessibilidade.</p>
        <h2>Checklist prático</h2>
        <ul>
          <li>Roles e labels apropriados</li>
          <li>Contraste mínimo para texto e elementos interativos</li>
          <li>Foco visível e navegabilidade por teclado</li>
        </ul>
        <h3>Automação</h3>
        <p>Integre testes automatizados (axe, jest-axe) e revisões manuais para validar mudanças em tokens e utilitários.</p>
        <p>Recomendamos documentar exemplos de uso e incluir guias para desenvolvedores sobre como usar atributos ARIA corretamente.</p>
        <section>
          <h2>Checklist extra</h2>
          <p>Além do contraste, valide foco visível, navegação por teclado e feedback de estado para evitar regressões difíceis de perceber em revisão visual.</p>
          <p>Em sistemas grandes, pequenos desvios de acessibilidade acumulam muito rápido, então vale revisar componentes compartilhados com frequência.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Como incorporar acessibilidade em design systems usando tokens e utilitários com contraste adequado.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégias de hidratação parcial para reduzir TTI",
    Creators: {
      Owner: {
        name: "fealvaro",
        imgProfile: "",
        bio: "fealvaro — desenvolvedor frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(74),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "hidratacao-parcial-reduzir-tti",
    notice: `
      <article>
        <header><h1>Estratégias de hidratação parcial para reduzir TTI</h1></header>
        <p>Reduzir o Time To Interactive (TTI) exige priorizar a hidratação de elementos críticos e adiar scripts menos importantes. Neste artigo compilamos estratégias práticas adotadas por equipes em produção.</p>
        <h2>Hidrate por prioridade</h2>
        <p>Identifique componentes essenciais ao primeiro input do usuário e hidrate-os primeiro; carregue o restante de forma lazy.</p>
        <h2>Streaming e progressive enhancement</h2>
        <p>Streaming permite enviar conteúdo crítico ao cliente mais cedo; combine com técnicas de progressive enhancement para manter funcionalidades básicas mesmo quando a hidratação completa ainda não ocorreu.</p>
        <p style="text-align:center"><img src="/images/imageScience.png" alt="hydration" style="max-width:100%"/></p>
        <p>Testes A/B podem validar impacto real das mudanças na percepção do usuário.</p>
        <section>
          <h2>Recomendação de uso</h2>
          <p>Esse padrão funciona melhor quando você sabe exatamente quais blocos precisam responder primeiro e quais podem chegar depois sem comprometer a navegação.</p>
          <p>Combine isso com observabilidade de front para confirmar se a melhoria percebida realmente reduz o custo de interação.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Técnicas para priorizar hidratação de elementos críticos e reduzir o Time To Interactive.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Internacionalização em Next.js com fallback resiliente",
    Creators: {
      Owner: {
        name: "frontendmaria",
        imgProfile: "",
        bio: "frontendmaria — desenvolvedora frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(111),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "internacionalizacao-nextjs-fallback",
    notice: `
      <article>
        <header><h1>Internacionalização em Next.js com fallback resiliente</h1></header>
        <p>Implementar i18n em Next.js envolve roteamento por locale, fallback de traduções e cache adequado. Descrevemos um fluxo que combina prerendering por locale e revalidação seletiva para suportar aplicações globais.</p>
        <h2>Estratégia de fallback</h2>
        <p>Use um fallback resiliente para exibir conteúdo em um idioma default quando traduções não estiverem disponíveis, com revalidação posterior para substituir por traduções completas.</p>
        <h3>Práticas recomendadas</h3>
        <ul>
          <li>Manter catálogo de strings centralizado</li>
          <li>Automatizar revisões de tradução</li>
          <li>Medir impacto por região</li>
        </ul>
        <p>Mais informações: <a href="https://nextjs.org/docs/advanced-features/i18n">Next.js i18n docs</a></p>
        <section>
          <h2>Observação adicional</h2>
          <p>Quando a tradução é parte do produto, o fallback precisa ser previsível e consistente para não quebrar o fluxo de leitura em mercados diferentes.</p>
          <p>Esse mock ajuda a testar o comportamento visual e editorial quando o idioma muda sem reescrever a estrutura da página.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Fluxo resiliente de internacionalização em Next.js com fallback e revalidação.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Microinterações sem custo alto de renderização",
    Creators: {
      Owner: {
        name: "uxdevana",
        imgProfile: "",
        bio: "uxdevana — designer de produto",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(148),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "microinteracoes-performance-render",
    notice: `
      <article>
        <header><h1>Microinterações sem custo alto de renderização</h1></header>
        <p>Microinterações melhoram a percepção de qualidade, mas mal planejadas podem causar reflows caros. Aqui mostramos técnicas para manter interações leves e performant.</p>
        <h2>Princípios</h2>
        <p>Prefira transform e opacity para animações, evite mudanças que afetem layout e use composição de camadas quando necessário.</p>
        <h3>Ferramentas e práticas</h3>
        <p>Utilize requestAnimationFrame para coordenação e limite número de elementos animados simultaneamente.</p>
        <p style="text-align:center"><img src="/images/imageScience.png" alt="microinteractions" style="max-width:100%"/></p>
        <section>
          <h2>Aplicação editorial</h2>
          <p>Em portais de conteúdo, uma microinteração boa é a que melhora a leitura sem competir com o texto nem mudar a estrutura de forma brusca.</p>
          <p>Esse exemplo reforça o uso de animações discretas e previsíveis, que são mais fáceis de manter e testar.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Práticas para criar microinterações leves que não prejudicam performance.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Arquitetura de componentes para portais de conteúdo",
    Creators: {
      Owner: {
        name: "fealvaro",
        imgProfile: "",
        bio: "fealvaro — desenvolvedor frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(185),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "arquitetura-componentes-portais",
    notice: `
      <article>
        <header><h1>Arquitetura de componentes para portais de conteúdo</h1></header>
        <p>Portais de conteúdo exigem componentes reutilizáveis e fáceis de testar. Propomos uma estrutura de pastas e patterns que facilitam evolução sem quebrar o ecossistema.</p>
        <h2>Patterns recomendados</h2>
        <ul>
          <li>Separação entre apresentação e lógica (smart/dumb)</li>
          <li>Slots e composição para fragmentos dinâmicos</li>
          <li>Contract tests para componentes compartilhados</li>
        </ul>
        <p>Incluímos exemplos de composição e um checklist para revisão de PRs focado em compatibilidade.</p>
        <section>
          <h2>Boa prática adicional</h2>
          <p>Quanto mais clara for a fronteira entre layout, dados e apresentação, mais simples fica escalar o portal sem introduzir regressões visuais ou de comportamento.</p>
          <p>O objetivo é manter os blocos previsíveis o suficiente para serem combinados em várias páginas sem duplicação de lógica.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Estrutura e patterns para construir componentes reutilizáveis em portais de conteúdo.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Server Actions com formulários robustos",
    Creators: {
      Owner: {
        name: "frontendmaria",
        imgProfile: "",
        bio: "frontendmaria — desenvolvedora frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(222),
    CommentsCount: 7,
    isSubscriber: false,
    Slug: "server-actions-formularios-robustos",
    notice: `
      <article>
        <header><h1>Server Actions com formulários robustos</h1></header>
        <p>Server Actions permitem processar formulários no servidor com menor complexidade no cliente. Aqui apresentamos técnicas para validação, proteção CSRF e retorno de erros amigáveis.</p>
        <h2>Validação e UX</h2>
        <p>Valide dados no servidor e devolva apenas o necessário para que o cliente mostre feedback instantâneo sem expor detalhes internos.</p>
        <h3>Exemplo</h3>
        <pre style="background:#f6f8fa;padding:8px;border-radius:4px">POST /actions/submit
{ "email": "user@example.com" }</pre>
        <p>Integre com middlewares para gestão de sessões e proteção contra replay attacks.</p>
        <section>
          <h2>Quando usar</h2>
          <p>Esse padrão é útil quando o custo de manter estados intermediários no cliente é maior do que concentrar a mutação no servidor.</p>
          <p>Ele funciona bem em fluxos simples e previsíveis, onde o feedback de validação pode ser rápido e direto.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Server Actions para processar formulários com validação e proteção de segurança no servidor.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Revalidação seletiva com cache tags",
    Creators: {
      Owner: {
        name: "fealvaro",
        imgProfile: "",
        bio: "fealvaro — desenvolvedor frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(259),
    CommentsCount: 1,
    isSubscriber: false,
    Slug: "revalidacao-seletiva-cache-tags",
    notice: `
      <article>
        <header><h1>Revalidação seletiva com cache tags</h1></header>
        <p>Cache tags permitem invalidar conjuntos de conteúdo relacionados sem limpar todo o cache. Mostramos implementações com CDN e edge logic para revalidação eficiente.</p>
        <h2>Quando usar</h2>
        <p>Útil quando mudanças afetam apenas setores do site, por exemplo, atualizações de uma categoria ou autor.</p>
        <p>Incluímos exemplos de TTLs e estratégias de revalidação on-write.</p>
        <section>
          <h2>Benefício prático</h2>
          <p>O ganho real aparece quando você consegue atualizar um conjunto pequeno de páginas sem abrir mão da consistência do restante do site.</p>
          <p>Esse mock ajuda a validar esse tipo de comportamento sem tornar a implementação mais complexa do que precisa ser.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Uso de cache tags para invalidar conjuntos de conteúdo relacionados sem limpar todo o cache.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Escalando estado global com baixo acoplamento",
    Creators: {
      Owner: {
        name: "uxdevana",
        imgProfile: "",
        bio: "uxdevana — designer de produto",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(296),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "estado-global-baixo-acoplamento",
    notice: `
      <article>
        <header><h1>Escalando estado global com baixo acoplamento</h1></header>
        <p>Manter estado global escalável requer limitar acoplamento entre módulos e optar por stores regionais quando possível. Discutimos trade-offs entre consistência e performance.</p>
        <h2>Arquitetura</h2>
        <p>Use eventos e sincronização eventual para reduzir dependências diretas entre componentes, e mecanismos de cache local para leituras frequentes.</p>
        <section>
          <h2>Resumo prático</h2>
          <p>Se uma mudança em um lugar exige reescrever muitos consumidores, o estado provavelmente está acoplado demais.</p>
          <p>Prefira interfaces menores, limites mais claros e fontes de verdade bem definidas para evitar fragilidade estrutural.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Práticas para manter estado global escalável reduzindo acoplamento entre módulos.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Métricas Core Web Vitals em apps Next.js",
    Creators: {
      Owner: {
        name: "frontendmaria",
        imgProfile: "",
        bio: "frontendmaria — desenvolvedora frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(333),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "core-web-vitals-nextjs",
    notice: `
      <article>
        <header><h1>Métricas Core Web Vitals em apps Next.js</h1></header>
        <p>Medir LCP, CLS e INP em produção é essencial para priorizar melhorias. Neste artigo descrevemos instrumentação, dashboards e ações corretivas que funcionaram em portais de alto tráfego.</p>
        <h2>Coleta</h2>
        <p>Combine RUM com métricas sintéticas para obter sinais confiáveis; agregue por rota e por segmento de usuário.</p>
        <h3>Ações</h3>
        <p>Priorize imagens e fontes para melhorar LCP; reduza repaints causados por layout para diminuir CLS.</p>
        <section>
          <h2>Interpretação</h2>
          <p>Métricas só ajudam quando viram decisão de produto e engenharia, então esse exemplo precisa carregar contexto suficiente para guiar uma revisão real.</p>
          <p>Use-o para discutir trade-offs entre percepção do usuário e custo técnico da melhoria.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Instrumentação e ações corretivas para medir e melhorar Core Web Vitals em Next.js.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Layouts compostos com slots e paralel routes",
    Creators: {
      Owner: {
        name: "fealvaro",
        imgProfile: "",
        bio: "fealvaro — desenvolvedor frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(370),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "layouts-compostos-parallel-routes",
    notice: `
      <article>
        <header><h1>Layouts compostos com slots e paralel routes</h1></header>
        <p>Compor layouts usando slots e rotas paralelas permite criar experiências complexas sem duplicar lógica. Apresentamos uma abordagem para dividir zonas de renderização e gerenciar dados de forma eficiente.</p>
        <h2>Benefícios</h2>
        <ul>
          <li>Reuso de layouts</li>
          <li>Isolamento de responsabilidades</li>
        </ul>
        <section>
          <h2>Aplicação sugerida</h2>
          <p>Use esse padrão quando diferentes áreas da tela precisarem evoluir com ritmos independentes sem quebrar o restante da navegação.</p>
          <p>Ele funciona melhor com contratos claros entre slots, conteúdo e estados de carregamento.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Compor layouts usando slots e rotas paralelas para experiências complexas sem duplicação.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégias de fallback visual para UX contínua",
    Creators: {
      Owner: {
        name: "uxdevana",
        imgProfile: "",
        bio: "uxdevana — designer de produto",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(407),
    CommentsCount: 1,
    isSubscriber: false,
    Slug: "fallback-visual-ux-continua",
    notice: `
      <article>
        <header><h1>Estratégias de fallback visual para UX contínua</h1></header>
        <p>Fallbacks bem projetados reduzem fricção enquanto o conteúdo principal é carregado. Discutimos placeholders, skeletons e técnicas para manter o layout estável.</p>
        <h2>Skeletons vs spinners</h2>
        <p>Skeletons preservam a estrutura visual e ajudam usuários a entender o que esperar; use spinners apenas para operações cujo tamanho é incerto.</p>
        <section>
          <h2>Regra prática</h2>
          <p>Se o carregamento vai demorar o suficiente para gerar ansiedade, o fallback precisa parecer uma continuação da interface e não um bloco genérico de espera.</p>
          <p>Esse mock serve para testar exatamente essa sensação de continuidade.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Fallbacks visuais (skeletons) e técnicas para manter a experiência do usuário consistente.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Otimização de imagens para portais de notícia",
    Creators: {
      Owner: {
        name: "frontendmaria",
        imgProfile: "",
        bio: "frontendmaria — desenvolvedora frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(444),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "otimizacao-imagens-portais",
    notice: `
      <article>
        <header><h1>Otimização de imagens para portais de notícia</h1></header>
        <p>Portais de notícia dependem fortemente de imagens; otimização correta impacta diretamente performance e custo. Neste guia cobrimos formatos modernos, compressão e delivery responsivo.</p>
        <h2>Formatos e compressão</h2>
        <p>Adote WebP/AVIF quando possível e ajuste qualidade por viewport para equilibrar qualidade visual e payload.</p>
        <figure style="text-align:center"><img src="/images/imageScience.png" alt="otimizacao" style="max-width:100%"/></figure>
        <p>Combine com lazy-loading e prioridade para imagens acima da dobra para otimizar LCP.</p>
        <section>
          <h2>Nota editorial</h2>
          <p>Em portais de notícia, imagens são parte do conteúdo e não só enfeite, então o tratamento visual precisa considerar contexto, peso e relevância.</p>
          <p>Um bom mock precisa refletir esse equilíbrio para ser útil no teste de leitura real.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Guia para otimizar imagens em portais de notícia com formatos modernos e lazy-loading.",
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Roteamento avançado com intercepting routes",
    Creators: {
      Owner: {
        name: "fealvaro",
        imgProfile: "",
        bio: "fealvaro — desenvolvedor frontend",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "Frontend",
    CreatedAt: createCreatedAtFromMinutesAgo(481),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "roteamento-intercepting-routes",
    notice: `
      <article>
        <header><h1>Roteamento avançado com intercepting routes</h1></header>
        <p>Intercepting routes são úteis para validar permissões, mostrar modais de confirmação e aplicar lógica antes da navegação. Discutimos impactos na usabilidade e como integrar com analytics.</p>
        <h2>Casos de uso</h2>
        <ul>
          <li>Proteção de rotas</li>
          <li>Fluxos de confirmação</li>
        </ul>
        <section>
          <h2>Quando faz sentido</h2>
          <p>Esse padrão é mais valioso quando a navegação precisa ser interrompida de forma elegante para preservar contexto e controle do usuário.</p>
          <p>Ele ajuda a manter o fluxo fluido sem transformar ações de confirmação em páginas inteiras desnecessárias.</p>
        </section>
      </article>
    `.trim(),
    Description:
      "Intercepting routes para validação de permissões e modais antes da navegação.",
    commentsNotice: [],
  },
];

export const FRONTEND_NEWS_MOCK: HomeSectionItem[] = FRONTEND_SEEDS.map(
  (s) => ({
    ...s,
    Creator: s.Creators.Owner.name,
    notice: s.notice,
    Description: s.Description,
  }),
);
