Feature: Todo application

  Scenario: Add todo items
    Given I open the Todo application
    When I add a todo item with text "buy some cheese"
    Then I should see the todo list contains "buy some cheese"

    When I add a todo item with text "feed the cat"
    Then I should see the todo list contains:
      | buy some cheese |
      | feed the cat    |

    And the number of todos in local storage should be 2
    Then I clean up the todos

  Scenario: Clear text input field when an item is added
    Given I open the Todo application
    When I add a todo item with text "buy some cheese"
    Then the input field should be empty
    And the number of todos in local storage should be 1
    Then I clean up the todos

  Scenario: Append new items to the bottom of the list
    Given I open the Todo application
    Given I have added the following todos:
      | buy some cheese             |
      | feed the cat                |
      | book a doctors appointment  |
    Then the todo count should display "3 items left"
    And I should see the todo list contains:
      | buy some cheese             |
      | feed the cat                |
      | book a doctors appointment  |
    And the number of todos in local storage should be 3
    Then I clean up the todos

  Scenario: Mark all items as completed
    Given I open the Todo application
    Given I have added the following todos:
      | buy some cheese             |
      | feed the cat                |
      | book a doctors appointment  |
    When I mark all todos as completed
    Then all todo items should be marked as completed
    And the number of completed todos in local storage should be 3
    Then I clean up the todos
