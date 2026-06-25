let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function getNextId() {
  return todos.length + 1;
}

function saveTodos() {
  // localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const dueDateInput = document.getElementById('dueDateInput');

  const text = input.value;

  if (!text) {
    alert('Please enter a todo item.');
    return;
  }

  const todo = {
    id: getNextId(),
    text: text,
    completed: false,
    dueDate: dueDateInput.value || null,
  };

  todos.push(todo);
  saveTodos();
  input.value = '';
  dueDateInput.value = '';
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  const index = todos.indexOf(id);
  if (index !== -1) {
    todos.splice(index, 1);
  }
  saveTodos();
  renderTodos();
}

function filterTodos(filter) {
  currentFilter = filter;
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
}

function updateCount() {
  const countEl = document.getElementById('itemCount');
  countEl.textContent = `${todos.length} items left`;
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due >= today;
}

function renderTodos() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  const visible = todos;

  if (visible.length === 0) {
    list.innerHTML = '<li style="color:#999;text-align:center;">No todos yet</li>';
  }

  visible.forEach(todo => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    if (todo.dueDate) {
      dueDateSpan.textContent = todo.dueDate;
      if (isOverdue(todo.dueDate)) {
        dueDateSpan.classList.add('overdue');
      }
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(dueDateSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  updateCount();
}

// Initial render
renderTodos();
