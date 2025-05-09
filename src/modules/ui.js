import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import Project from './project.js';  // Add this
import Todo from './todo.js';       // Add this
import Storage from './storage.js'; // Add this if not already present

export default class UI {
  static init(projects) {
    this.projects = projects;
    this.currentProject = projects[0];
    this.renderProjects();
    this.renderTodos();
    this.setupEventListeners();
  }

  static renderProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    this.projects.forEach(project => {
      const projectElement = document.createElement('li');
      projectElement.textContent = project.name;
      projectElement.dataset.projectId = project.id;
      projectElement.classList.toggle('active', project.id === this.currentProject.id);
      projectElement.addEventListener('click', () => this.switchProject(project.id));
      projectsList.appendChild(projectElement);
    });
  }

  static renderTodos() {
    const todosContainer = document.getElementById('todos-container');
    todosContainer.innerHTML = '';

    if (this.currentProject.todos.length === 0) {
      todosContainer.innerHTML = '<p class="empty-message">No todos yet. Add one to get started!</p>';
      return;
    }

    this.currentProject.todos.forEach(todo => {
      const todoElement = this.createTodoElement(todo);
      todosContainer.appendChild(todoElement);
    });
  }

  static createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.className = `todo ${todo.priority} ${todo.completed ? 'completed' : ''}`;
    todoElement.dataset.todoId = todo.id;

    const formattedDate = this.formatDueDate(todo.dueDate);

    todoElement.innerHTML = `
      <div class="todo-checkbox">
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      </div>
      <div class="todo-content">
        <h3 class="todo-title">${todo.title}</h3>
        <p class="todo-due-date">${formattedDate}</p>
      </div>
      <button class="todo-expand-btn">⋮</button>
      <button class="todo-delete-btn">×</button>
    `;

    // Add event listeners
    todoElement.querySelector('input').addEventListener('change', () => this.toggleTodoComplete(todo.id));
    todoElement.querySelector('.todo-expand-btn').addEventListener('click', () => this.showTodoDetails(todo.id));
    todoElement.querySelector('.todo-delete-btn').addEventListener('click', () => this.deleteTodo(todo.id));

    return todoElement;
  }

  static formatDueDate(dateString) {
    if (!dateString) return 'No due date';

    const date = new Date(dateString);

    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');

    return format(date, 'MM/dd/yyyy');
  }

  static switchProject(projectId) {
    this.currentProject = this.projects.find(project => project.id === projectId);
    this.renderProjects();
    this.renderTodos();
  }

  static toggleTodoComplete(todoId) {
    const todo = this.currentProject.getTodoById(todoId);
    if (todo) {
      todo.toggleComplete();
      this.renderTodos();
      Storage.saveProjects(this.projects);
    }
  }

  static showTodoDetails(todoId) {
    const todo = this.currentProject.getTodoById(todoId);
    if (!todo) return;

    const modal = document.getElementById('todo-details-modal');
    const formattedDate = todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : '';

    document.getElementById('edit-title').value = todo.title;
    document.getElementById('edit-description').value = todo.description;
    document.getElementById('edit-due-date').value = formattedDate;
    document.getElementById('edit-priority').value = todo.priority;
    document.getElementById('edit-notes').value = todo.notes;

    const checklistContainer = document.getElementById('edit-checklist');
    checklistContainer.innerHTML = '';
    todo.checklist.forEach((item, index) => {
      const checklistItem = document.createElement('div');
      checklistItem.className = 'checklist-item';
      checklistItem.innerHTML = `
        <input type="checkbox" id="checklist-${index}" ${item.completed ? 'checked' : ''}>
        <label for="checklist-${index}">${item.text}</label>
      `;
      checklistContainer.appendChild(checklistItem);
    });

    modal.dataset.todoId = todoId;
    modal.classList.add('active');
  }

  static deleteTodo(todoId) {
    this.currentProject.deleteTodo(todoId);
    this.renderTodos();
    Storage.saveProjects(this.projects);
  }

  static setupEventListeners() {
    // Add project button
    document.getElementById('add-project-btn').addEventListener('click', () => {
      const projectName = prompt('Enter project name:');
      if (projectName) {
        const newProject = new Project(projectName);
        this.projects.push(newProject);
        this.renderProjects();
        Storage.saveProjects(this.projects);
      }
    });

    // Add todo button
    document.getElementById('add-todo-btn').addEventListener('click', () => {
      document.getElementById('todo-form-modal').classList.add('active');
    });

    // Todo form submission
    document.getElementById('todo-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const dueDate = document.getElementById('due-date').value;
      const priority = document.getElementById('priority').value;

      const newTodo = new Todo(title, description, dueDate, priority);
      this.currentProject.addTodo(newTodo);

      document.getElementById('todo-form').reset();
      document.getElementById('todo-form-modal').classList.remove('active');
      this.renderTodos();
      Storage.saveProjects(this.projects);
    });

    // Edit todo form submission
    document.getElementById('edit-todo-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const todoId = document.getElementById('todo-details-modal').dataset.todoId;
      const todo = this.currentProject.getTodoById(todoId);
      if (!todo) return;

      todo.title = document.getElementById('edit-title').value;
      todo.description = document.getElementById('edit-description').value;
      todo.dueDate = document.getElementById('edit-due-date').value;
      todo.priority = document.getElementById('edit-priority').value;
      todo.notes = document.getElementById('edit-notes').value;

      document.getElementById('todo-details-modal').classList.remove('active');
      this.renderTodos();
      Storage.saveProjects(this.projects);
    });

    // Close modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('active');
      });
    });
  }
}
