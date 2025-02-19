import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Accordion Block: add accordion content', () => {
    // without this the clear command below does nothing sometimes
    cy.wait(500);

    // Change page title
    cy.get('[contenteditable=true]').first().clear();

    cy.get('[contenteditable=true]').first().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get('[contenteditable=true]').first().type('{enter}');

    // Add accordion block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.ui.basic.icon.button.accordion').contains('Accordion').click();

    // enter title for first item in accordion (it is first of the accordion but second as child)
    cy.get('.accordion:nth-child(2) > .title input')
      .click()
      .type('panel 1')
      .should('have.value', 'panel 1');

    // enter title for third item in accordion
    // enter content
    cy.get('.accordion:nth-child(3) > .title input').click();
    cy.get('.accordion:nth-child(3) > .title input').type('panel 2');
    cy.get('.accordion:nth-child(3) > .title > .icon').click();
    cy.wait(500);

    // the cypress test runs with both slate and draftjs.
    cy.get('.accordion:nth-child(3) .content')
      .first()
      .within(() => {
        cy.getIfExists(
          '.public-DraftStyleDefault-block:nth-child(1)',
          () => {
            cy.get('.public-DraftStyleDefault-block:nth-child(1)')
              .should('have.value', '')
              .invoke('attr', 'tabindex', 1)
              .type('children', { delay: 50 });
          },
          () => {
            cy.get('div.text-slate-editor-inner')
              .should('have.value', '')
              .invoke('attr', 'tabindex', 1)
              .click()
              .type('children', { delay: 50 });
          },
        );
      });

    cy.get('#toolbar-save path').click({ force: true });
    cy.wait(1000);

    //after saving
    cy.get('div.accordion-title > span').contains('panel 2');
    // after save, the 3 child becomes second
    cy.get('.accordion:nth-child(2) > .title > .icon').click();
    cy.get('div.content')
      .should('have.class', 'active')
      .within(() => {
        cy.get('p').contains('children');
      });
  });

  it('Accordion Block: Empty', () => {
    // without this the clear command below does nothing sometimes
    cy.wait(500);

    // Change page title
    cy.get('[contenteditable=true]').first().clear();

    cy.get('[contenteditable=true]').first().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get('[contenteditable=true]').first().type('{enter}');

    // Add metadata block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.ui.basic.icon.button.accordion').contains('Accordion').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
  });

  it('Accordion Block: Change Title', () => {
    // without this the clear command below does nothing sometimes
    cy.wait(500);

    // Change page title
    cy.get('[contenteditable=true]').first().clear();

    cy.get('[contenteditable=true]').first().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get('[contenteditable=true]').first().type('{enter}');

    // Add accordion block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.ui.basic.icon.button.accordion').contains('Accordion').click();

    // By default all should be collapsed (no active class on first)
    cy.get('.accordion:nth-child(2)').should('not.have.class', 'active');

    cy.get('.accordion:nth-child(2) > .title input')
      .click()
      .type('Accordion panel 1')
      .should('have.value', 'Accordion panel 1');

    cy.get('[id="field-title_size"] .react-select__value-container')
      .click()
      .type('h2{enter}');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.get('h2.accordion-title').contains('Accordion panel 1');
  });
});
