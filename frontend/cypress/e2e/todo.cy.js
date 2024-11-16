describe('Todo App E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/todo.html'); // Besucht die Seite mit den Todos
    });
  
    it('sollte ein neues Todo erstellen', () => {
      // Eingabefeld für neues Todo und Button zur Erstellung
      cy.get('[data-cy=new-todo-input]').type('Mein neues Todo');
      cy.get('[data-cy=add-todo-button]').click();
  
      // Überprüfen, ob das neue Todo angezeigt wird
      cy.contains('Mein neues Todo').should('be.visible');
    });
  
    it('sollte ein bestehendes Todo aktualisieren', () => {
      // Klicken auf den Bearbeiten-Button des entsprechenden Todos
      cy.contains('Mein neues Todo').parent().find('[data-cy=edit-todo-button]').click();
  
      // Eingabe des neuen Werts und Speichern
      cy.get('[data-cy=edit-todo-input]').clear().type('Aktualisiertes Todo');
      cy.get('[data-cy=save-todo-button]').click();
  
      // Überprüfen, ob das Todo aktualisiert wurde
      cy.contains('Aktualisiertes Todo').should('be.visible');
    });
  
    it('sollte ein Todo als erledigt markieren', () => {
      // Markieren Sie das aktualisierte Todo als erledigt
      cy.contains('Aktualisiertes Todo').parent().find('[data-cy=complete-todo-button]').click();
  
      // Überprüfen, ob das Todo als erledigt markiert ist (mit der Klasse 'completed')
      cy.contains('Aktualisiertes Todo').should('have.class', 'completed');
    });
  
    it('sollte ein bestehendes Todo löschen', () => {
      // Klicken auf den Lösch-Button des entsprechenden Todos
      cy.contains('Aktualisiertes Todo').parent().find('[data-cy=delete-todo-button]').click();
  
      // Überprüfen, ob das Todo entfernt wurde
      cy.contains('Aktualisiertes Todo').should('not.exist');
    });
  });  