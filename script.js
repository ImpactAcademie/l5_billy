"use strict";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const taskCount = document.querySelector("#task-count");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll(".filter-button");

const todos = [];
let activeFilter = "all";

function renderTodos() {
  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === "active") return !todo.completed;
    if (activeFilter === "completed") return todo.completed;
    return true;
  });
  const remaining = todos.filter((todo) => !todo.completed).length;

  list.replaceChildren();

  for (const todo of visibleTodos) {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " is-completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `Terminer : ${todo.text}`);
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Supprimer : ${todo.text}`);
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteButton);
    list.append(item);
  }

  emptyState.hidden = visibleTodos.length > 0;
  emptyState.textContent =
    todos.length === 0
      ? "Aucune tâche pour le moment. Ajoutez-en une !"
      : "Aucune tâche dans cette catégorie.";
  taskCount.textContent = `${todos.length} tâche${todos.length > 1 ? "s" : ""}`;
  remainingCount.textContent = `${remaining} tâche${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`;
  clearCompletedButton.hidden = !todos.some((todo) => todo.completed);
}

function toggleTodo(id) {
  const todo = todos.find((item) => item.id === id);
  if (todo) todo.completed = !todo.completed;
  renderTodos();
}

function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) todos.splice(index, 1);
  renderTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  todos.unshift({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });
  renderTodos();
  form.reset();
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
  });
});

clearCompletedButton.addEventListener("click", () => {
  for (let index = todos.length - 1; index >= 0; index -= 1) {
    if (todos[index].completed) todos.splice(index, 1);
  }
  renderTodos();
});

renderTodos();
