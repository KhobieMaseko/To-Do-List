
import Project from './modules/project.js';
import Todo from './modules/todo.js';
import Storage from './modules/storage.js';
import UI from './modules/ui.js';
import Theme from './modules/theme.js';
import './styles/main.css';


console.log('Project class:', Project);
console.log('Todo class:', Todo);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const projects = Storage.loadProjects();
  UI.init(projects);
  Theme.init();
});
