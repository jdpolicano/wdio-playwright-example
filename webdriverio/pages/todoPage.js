const { Key } = require("webdriverio");

// todoPage.js
exports.TodoPage = class TodoPage {
  constructor() {}

  get newTodoInput() {
    return $('input[placeholder="What needs to be done?"]');
  }
  get todoItems() {
    return $$('[data-testid="todo-item"]');
  }
  get todoTitles() {
    return $$("[data-testid='todo-title']");
  }
  get todoCount() {
    return $('[data-testid="todo-count"]');
  }
  get toggleAllCheckbox() {
    return $('label[for="toggle-all"]');
  }
  get clearCompletedButton() {
    return $('button[name="Clear completed"]');
  }
  get allFilter() {
    return $("a=All");
  }
  get activeFilter() {
    return $("a=Active");
  }
  get completedFilter() {
    return $("a=Completed");
  }
  get destroyButtons() {
    return $$('button[class="destroy"]');
  }

  async goto() {
    await browser.url("https://demo.playwright.dev/todomvc", {
      wait: "complete",
    });
  }

  async addTodo(todoText) {
    await this.newTodoInput.setValue(todoText);
    await browser.keys(Key.Return);
  }

  async createDefaultTodos(items) {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  async getTodoTitles() {
    return this.todoTitles.map(async (el) => await el.getText());
  }

  async toggleTodoAt(index) {
    const checkbox = await this.todoItems[index].$('input[type="checkbox"]');
    await checkbox.click();
  }

  async unToggleTodoAt(index) {
    const checkbox = await this.todoItems[index].$('input[type="checkbox"]');
    if (await checkbox.isSelected()) {
      await checkbox.click();
    }
  }

  async editTodoAt(index, newText) {
    const todoItem = this.todoItems[index];
    await todoItem.doubleClick();
    const editInput = await todoItem.$('input[type="text"]');
    await editInput.setValue(newText);
    await browser.keys("Enter");
  }

  async getTodoCountText() {
    return await this.todoCount.getText();
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

  async clearLocalStorage() {
    await browser.execute(() => {
      localStorage.clear();
    });
  }

  async checkNumberOfTodosInLocalStorage(expected) {
    await browser.execute((e) => {
      return JSON.parse(localStorage.getItem("react-todos")).length === e;
    }, expected);
  }

  async checkNumberOfCompletedTodosInLocalStorage(expected) {
    await browser.execute((e) => {
      return (
        JSON.parse(localStorage.getItem("react-todos")).filter(
          (i) => i.completed,
        ).length === e
      );
    }, expected);
  }

  async checkTodosInLocalStorage(title) {
    await browser.execute((t) => {
      return JSON.parse(localStorage.getItem("react-todos")).some(
        (i) => i.title === t,
      );
    }, title);
  }

  async removeAllTodos() {
    const todos = [...(await this.todoItems)];
    for (const todo of todos) {
      await todo.moveTo();
      await todo.$('button[class="destroy"]').click();
    }
  }
};
