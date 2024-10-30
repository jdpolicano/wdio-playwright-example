const { TodoPage } = require("../../pages/todoPage");
const { Given, When, Then } = require("@wdio/cucumber-framework");

let todoPage;

Given("I open the Todo application", async () => {
  todoPage = new TodoPage();
  await todoPage.goto();
});

When("I add a todo item with text {string}", async (todoText) => {
  await todoPage.addTodo(todoText);
});

Then("I should see the todo list contains {string}", async (todoText) => {
  const titles = await todoPage.getTodoTitles();
  console.log("titles", titles);
  expect(titles).toContain(todoText);
});

Then("I should see the todo list contains:", async (dataTable) => {
  const expectedTitles = dataTable.raw().flat();
  const actualTitles = await todoPage.getTodoTitles();
  expect(actualTitles).toEqual(expectedTitles);
});

Then("the input field should be empty", async () => {
  const inputValue = await todoPage.newTodoInput.getValue();
  expect(inputValue).toEqual("");
});

Then(
  "the number of todos in local storage should be {int}",
  async (expectedCount) => {
    await todoPage.checkNumberOfTodosInLocalStorage(expectedCount);
  },
);

Given("I have added the following todos:", async (dataTable) => {
  const todos = dataTable.raw().flat();
  console.log(todos);
  await todoPage.createDefaultTodos(todos);
});

Then("the todo count should display {string}", async (expectedText) => {
  const todoCountText = await todoPage.getTodoCountText();
  expect(todoCountText).toEqual(expectedText);
});

When("I mark all todos as completed", async () => {
  await todoPage.toggleAllCheckbox.click();
});

Then("all todo items should be marked as completed", async () => {
  // const todoItems = [...(await todoPage.todoItems)];
  for await (const todoItem of await todoPage.todoItems) {
    const className = await todoItem.getAttribute("class");
    expect(className).toContain("completed");
  }
});

Then(
  "the number of completed todos in local storage should be {int}",
  async (expectedCount) => {
    await todoPage.checkNumberOfCompletedTodosInLocalStorage(expectedCount);
  },
);

Then("I clean up the todos", async () => {
  await todoPage.removeAllTodos();
});
