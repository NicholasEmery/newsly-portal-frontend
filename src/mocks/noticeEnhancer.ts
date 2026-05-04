type EnrichNoticeInput = {
  html?: string;
  title: string;
  category: string;
  creator: string;
  index: number;
};

function shouldInjectAccordion(index: number) {
  return index % 10 < 3;
}

function ensureArticleWrapper(input: string, title: string, creator: string, category: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return `
      <article>
        <header>
          <h1>${title}</h1>
          <p><small>Por ${creator} • ${category}</small></p>
        </header>
        <p>Conteúdo editorial em desenvolvimento para esta notícia.</p>
      </article>
    `.trim();
  }

  if (/<article[\s>]/i.test(trimmed)) return trimmed;
  return `<article>${trimmed}</article>`;
}

function appendBeforeClosingArticle(baseHtml: string, snippet: string) {
  if (/<\/article>/i.test(baseHtml)) {
    return baseHtml.replace(/<\/article>/i, `${snippet}\n      </article>`);
  }

  return `${baseHtml}${snippet}`;
}

export function enrichNoticeHtml({
  html,
  title,
  category,
  creator,
  index,
}: EnrichNoticeInput) {
  const wrapped = ensureArticleWrapper(html || "", title, creator, category);

  const extraSections = `
        <h2>Contexto e desafios em produção</h2>
        <p>Além da teoria, equipes que operam ${category} em produção precisam equilibrar performance, previsibilidade e custo. Neste cenário, ${title.toLowerCase()} ganha relevância por reduzir retrabalho e incidentes.</p>
        <p>Uma estratégia eficiente combina padrões técnicos com revisão contínua de resultados, monitorando impacto real no produto e na experiência do usuário.</p>

        <h2>Plano prático de implementação</h2>
        <p>Para acelerar adoção sem risco elevado, recomendamos um rollout em etapas com metas objetivas de estabilidade e ganho operacional.</p>
        <ul>
          <li>Definir baseline de métricas antes da mudança.</li>
          <li>Aplicar rollout progressivo por módulo ou fluxo.</li>
          <li>Revisar indicadores semanalmente com o time de ${category}.</li>
        </ul>

        <h3>Checklist de validação</h3>
        <p>Antes de publicar em produção, valide cobertura de testes, monitoramento e plano de rollback para garantir previsibilidade.</p>
  `;

  const alreadyHasAccordion = /data-component\s*=\s*["']accordion["']/i.test(wrapped);
  const injectAccordion = shouldInjectAccordion(index) && !alreadyHasAccordion;

  const accordionBlock = injectAccordion
    ? `
        <div data-component="accordion" data-open-first="false">
          <item data-title="Quando aplicar esta abordagem?">
            <p>Use este padrão quando houver necessidade de escala sustentável, governança e visibilidade operacional no ciclo de entrega.</p>
          </item>
          <item data-title="Qual o principal risco inicial?">
            <p>O principal risco é adotar sem critérios de medição. Comece pequeno, meça impacto e evolua conforme evidências.</p>
          </item>
          <item data-title="Como evoluir depois do primeiro rollout?">
            <p>Documente aprendizados, padronize boas práticas e transforme ajustes validados em convenções para novos projetos.</p>
          </item>
        </div>
      `
    : "";

  const closingSection = `
        ${extraSections}
        ${accordionBlock}
        <h2>Conclusão</h2>
        <p>Com processo iterativo e foco em resultados, ${creator} e o time conseguem transformar ${title.toLowerCase()} em vantagem prática para o portal.</p>
  `;

  return appendBeforeClosingArticle(wrapped, closingSection).trim();
}
