/**
 * Project class for todo list projects
 * @class
 */

export default class Project {
    constructor(name) {
      this.name = name;
      this.todos = [];
      this.id = Date.now().toString();
    }

    addTodo(todo) {
      this.todos.push(todo);
    }

    deleteTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    getTodoById(todoId) {
      return this.todos.find(todo => todo.id === todoId);
    }
}
