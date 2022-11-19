export class project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    if (!this.todos.find((e) => e.title === todo.title)) {
      this.todos.push(todo);
    }
  }

  getTodos() {
    return this.todos;
  }

  deleteTodo(title) {
    this.todos = this.todos.filter((todo) => todo.title !== title);
  }
}
