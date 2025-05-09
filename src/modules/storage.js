import Project from './project.js';
import Todo from './todo.js';

export default class Storage {
    static saveProjects(projects) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }

    static getProjects() {
      const projects = localStorage.getItem('projects');
      return projects ? JSON.parse(projects) : [];
    }

    static loadProjects() {
      const projects = Storage.getProjects();

      if (projects.length === 0) {
        const defaultProject = new Project('Default');
        projects.push(defaultProject);
        Storage.saveProjects(projects);
      }

      return projects.map(project => {
        const loadedProject = new Project(project.name);
        loadedProject.id = project.id;
        loadedProject.todos = project.todos.map(todoData => {
          const todo = new Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.checklist,
            todoData.completed
          );
          todo.id = todoData.id;
          return todo;
        });
        return loadedProject;
      });
    }
}
