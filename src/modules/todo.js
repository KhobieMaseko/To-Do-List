/**
 * Todo item class
 * @class
 */

export default class Todo {
    constructor(title, description, dueDate, priority, notes = '', checklist = [], completed = false) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.notes = notes;
      this.checklist = checklist;
      this.completed = completed;
      this.id = Date.now().toString();
    }

    toggleComplete() {
      this.completed = !this.completed;
    }

    updatePriority(newPriority) {
      this.priority = newPriority;
    }

    updateDueDate(newDate) {
      this.dueDate = newDate;
    }

    addChecklistItem(item) {
      this.checklist.push({ text: item, completed: false });
    }

    toggleChecklistItem(index) {
      if (index >= 0 && index < this.checklist.length) {
        this.checklist[index].completed = !this.checklist[index].completed;
      }
    }
}
