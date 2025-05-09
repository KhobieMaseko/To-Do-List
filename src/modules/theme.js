export default class Theme {
    static init() {
      this.loadTheme();
      document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    static toggleTheme() {
      const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.body.classList.toggle('dark-mode', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    }

    static loadTheme() {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    }
}
