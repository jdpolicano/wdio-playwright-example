// @ts-check
const { test: base, expect } = require("@playwright/test");
const { TodoPage } = require("../pages/todoPage");

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

// Extend the base test to include the todoPage fixture
const test = base.extend({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ todoPage }) => {
    // Create 1st todo.
    await todoPage.addTodo(TODO_ITEMS[0]);

    // Make sure the list only has one todo item.
    await expect(await todoPage.getTodoTitles()).toEqual([TODO_ITEMS[0]]);

    // Create 2nd todo.
    await todoPage.addTodo(TODO_ITEMS[1]);

    // Make sure the list now has two todo items.
    await expect(await todoPage.getTodoTitles()).toEqual([
      TODO_ITEMS[0],
      TODO_ITEMS[1],
    ]);

    await todoPage.checkNumberOfTodosInLocalStorage(2);
  });

  test("should clear text input field when an item is added", async ({
    todoPage,
  }) => {
    // Create one todo item.
    await todoPage.addTodo(TODO_ITEMS[0]);

    // Check that input is empty.
    await expect(todoPage.newTodoInput).toBeEmpty();
    await todoPage.checkNumberOfTodosInLocalStorage(1);
  });

  test("should append new items to the bottom of the list", async ({
    todoPage,
  }) => {
    // Create 3 items.
    await todoPage.createDefaultTodos(TODO_ITEMS);

    // Check test using different methods.
    await expect(todoPage.page.getByText("3 items left")).toBeVisible();
    await expect(todoPage.todoCount).toHaveText("3 items left");
    await expect(todoPage.todoCount).toContainText("3");
    await expect(todoPage.todoCount).toHaveText(/3/);

    // Check all items in one call.
    await expect(todoPage.getTodoTitles()).resolves.toEqual(TODO_ITEMS);
    await todoPage.checkNumberOfTodosInLocalStorage(3);
  });
});

test.describe("Mark all as completed", () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.createDefaultTodos(TODO_ITEMS);
    await todoPage.checkNumberOfTodosInLocalStorage(3);
  });

  test.afterEach(async ({ todoPage }) => {
    await todoPage.checkNumberOfTodosInLocalStorage(3);
  });

  test("should allow me to mark all items as completed", async ({
    todoPage,
  }) => {
    // Complete all todos.
    await todoPage.toggleAllCheckbox.check();

    // Ensure all todos have 'completed' class.
    await expect(todoPage.todoItems).toHaveClass([
      "completed",
      "completed",
      "completed",
    ]);
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(3);
  });

  test("should allow me to clear the complete state of all items", async ({
    todoPage,
  }) => {
    // Check and then immediately uncheck.
    await todoPage.toggleAllCheckbox.check();
    await todoPage.toggleAllCheckbox.uncheck();

    // Should be no completed classes.
    await expect(todoPage.todoItems).toHaveClass(["", "", ""]);
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    todoPage,
  }) => {
    await todoPage.toggleAllCheckbox.check();
    await expect(todoPage.toggleAllCheckbox).toBeChecked();
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(3);

    // Uncheck first todo.
    await todoPage.unToggleTodoAt(0);

    // Reuse toggleAll locator and make sure it's not checked.
    await expect(todoPage.toggleAllCheckbox).not.toBeChecked();

    await todoPage.toggleTodoAt(0);
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(3);

    // Assert the toggle all is checked again.
    await expect(todoPage.toggleAllCheckbox).toBeChecked();
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ todoPage }) => {
    // Create two items.
    await todoPage.createDefaultTodos(TODO_ITEMS.slice(0, 2));

    // Check first item.
    await todoPage.toggleTodoAt(0);
    await expect(todoPage.todoItems.nth(0)).toHaveClass("completed");

    // Check second item.
    await expect(todoPage.todoItems.nth(1)).not.toHaveClass("completed");
    await todoPage.toggleTodoAt(1);

    // Assert completed class.
    await expect(todoPage.todoItems.nth(0)).toHaveClass("completed");
    await expect(todoPage.todoItems.nth(1)).toHaveClass("completed");
  });

  test("should allow me to un-mark items as complete", async ({ todoPage }) => {
    // Create two items.
    await todoPage.createDefaultTodos(TODO_ITEMS.slice(0, 2));

    await todoPage.toggleTodoAt(0);
    await expect(todoPage.todoItems.nth(0)).toHaveClass("completed");
    await expect(todoPage.todoItems.nth(1)).not.toHaveClass("completed");
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    await todoPage.unToggleTodoAt(0);
    await expect(todoPage.todoItems.nth(0)).not.toHaveClass("completed");
    await expect(todoPage.todoItems.nth(1)).not.toHaveClass("completed");
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(0);
  });

  test("should allow me to edit an item", async ({ todoPage }) => {
    await todoPage.createDefaultTodos(TODO_ITEMS);

    await todoPage.editTodoAt(1, "buy some sausages");

    // Explicitly assert the new text value.
    await expect(todoPage.getTodoTitles()).resolves.toEqual([
      TODO_ITEMS[0],
      "buy some sausages",
      TODO_ITEMS[2],
    ]);
    await todoPage.checkTodosInLocalStorage("buy some sausages");
  });
});
