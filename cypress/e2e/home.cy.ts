const assertSectionSeparation = () => {
  cy.get('[data-cy="grid-section-block"]')
    .first()
    .then(($gridSection) => {
      const gridBottom = $gridSection[0].getBoundingClientRect().bottom;

      cy.get('[data-cy="subscriber-section-block"]')
        .first()
        .then(($subscriberSection) => {
          const subscriberTop =
            $subscriberSection[0].getBoundingClientRect().top;

          expect(subscriberTop).to.be.greaterThan(gridBottom);
        });
    });
};

const assertAspectRatioInRange = (
  selector: string,
  minRatio = 0.8,
  maxRatio = 4.5,
) => {
  cy.get(selector, { timeout: 10000 }).then(($elements) => {
    const element = [...$elements].find((node) => {
      const bounds = node.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0;
    });

    expect(element, `Elemento valido para ${selector}`).to.exist;

    const bounds = (element as HTMLElement).getBoundingClientRect();
    const ratio = bounds.width / Math.max(bounds.height, 1);

    expect(ratio).to.be.greaterThan(minRatio);
    expect(ratio).to.be.lessThan(maxRatio);
  });
};

describe("Home page", () => {
  it("fixa a navbar ao rolar a pagina", () => {
    cy.visit("/");

    cy.get('nav[role="navigation"]').first().as("mainNav");

    cy.scrollTo(0, 900);

    cy.get("@mainNav", { timeout: 10000 }).should("have.class", "fixed");

    cy.get("@mainNav").then(($mainNav) => {
      const navBounds = $mainNav[0].getBoundingClientRect();
      expect(navBounds.bottom).to.be.greaterThan(0);
    });
  });

  it("carrega seções progressivamente com skeleton", () => {
    cy.intercept("GET", "**/api/sections/latest-news*").as("latestNews");
    cy.intercept("GET", "**/api/sections/home-grids*").as("homeGrids");
    cy.intercept("GET", "**/api/sections/subscriber-news*").as(
      "subscriberNews",
    );

    cy.visit("/");

    cy.get('[data-cy="section-skeleton-latest"]').should("exist");
    cy.get('[data-cy="section-skeleton-grid"]').should("exist");
    cy.get('[data-cy="section-skeleton-subscriber"]').should("exist");

    cy.get('[data-cy="lazy-latest-section"]').scrollIntoView();
    cy.get('[data-cy="section-skeleton-latest"]', { timeout: 10000 }).should(
      "not.exist",
    );

    cy.get('[data-cy="lazy-grids-section"]').scrollIntoView();
    cy.get('[data-cy="section-skeleton-grid"]', { timeout: 10000 }).should(
      "not.exist",
    );

    cy.get('[data-cy="grid-section-block"]').should("exist");
    cy.get('[data-cy="subscriber-section-block"]').should("exist");

    assertSectionSeparation();
  });

  [
    { label: "desktop", width: 1440, height: 900 },
    { label: "mobile", width: 390, height: 844 },
  ].forEach(({ label, width, height }) => {
    it(`mantem proporcao e separacao visual no ${label}`, () => {
      cy.viewport(width, height);
      cy.visit("/");

      cy.get('[data-cy="lazy-grids-section"]').scrollIntoView();
      cy.get('[data-cy="grid-section-block"]', { timeout: 10000 }).should(
        "exist",
      );
      cy.get('[data-cy="subscriber-section-block"]', { timeout: 10000 }).should(
        "exist",
      );

      assertAspectRatioInRange('[data-cy="top-notice-media"]');
      assertAspectRatioInRange('[data-cy="trending-card-media"]');
      assertAspectRatioInRange('[data-cy="subscriber-banner-media"]');

      assertSectionSeparation();
    });
  });
});
