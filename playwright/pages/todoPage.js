// todoPage.js
exports.TodoPage = class TodoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId("todo-item");
    this.todoTitles = page.getByTestId("todo-title");
    this.todoCount = page.getByTestId("todo-count");
    this.toggleAllCheckbox = page.getByLabel("Mark all as complete");
    this.clearCompletedButton = page.getByRole("button", {
      name: "Clear completed",
    });
    this.allFilter = page.getByRole("link", { name: "All" });
    this.activeFilter = page.getByRole("link", { name: "Active" });
    this.completedFilter = page.getByRole("link", { name: "Completed" });
  }

  async goto() {
    await this.page.goto("https://demo.playwright.dev/todomvc");
  }

  async addTodo(todoText) {
    await this.newTodoInput.fill(todoText);
    await this.newTodoInput.press("Enter");
  }

  async createDefaultTodos(items) {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  async getTodoTitles() {
    return await this.todoTitles.allTextContents();
  }

  async toggleTodoAt(index) {
    await this.todoItems.nth(index).getByRole("checkbox").check();
  }

  async unToggleTodoAt(index) {
    await this.todoItems.nth(index).getByRole("checkbox").uncheck();
  }

  async editTodoAt(index, newText) {
    const todoItem = this.todoItems.nth(index);
    await todoItem.dblclick();
    const editInput = todoItem.getByRole("textbox", { name: "Edit" });
    await editInput.fill(newText);
    await editInput.press("Enter");
  }

  async getTodoCountText() {
    return await this.todoCount.textContent();
  }

  async selectFilter(filterName) {
    switch (filterName) {
      case "All":
        await this.allFilter.click();
        break;
      case "Active":
        await this.activeFilter.click();
        break;
      case "Completed":
        await this.completedFilter.click();
        break;
      default:
        throw new Error(`Unknown filter: ${filterName}`);
    }
  }

  async checkNumberOfTodosInLocalStorage(expected) {
    await this.page.waitForFunction((e) => {
      return JSON.parse(localStorage["react-todos"]).length === e;
    }, expected);
  }

  async checkNumberOfCompletedTodosInLocalStorage(expected) {
    await this.page.waitForFunction((e) => {
      return (
        JSON.parse(localStorage["react-todos"]).filter((i) => i.completed)
          .length === e
      );
    }, expected);
  }

  async checkTodosInLocalStorage(title) {
    await this.page.waitForFunction((t) => {
      return JSON.parse(localStorage["react-todos"])
        .map((i) => i.title)
        .includes(t);
    }, title);
  }
};
