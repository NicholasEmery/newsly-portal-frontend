describe('Home page', () => { it('renders', () => { cy.visit('/'); cy.contains('Next.js').should('exist'); }); });
