let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function getNextId() {
  return todos.length + 1;
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  const input = document.getElementById("todoInput");
  const dueDateInput = document.getElementById("dueDateInput");

  const text = input.value;

  if (!text) {
    alert("Please enter a todo item.");
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
  input.value = "";
  dueDateInput.value = "";
  renderTodos();
}

function toggleTodo(idx) {
  const todo = todos.find((t,id) => idx === id);
  if (todo) {
    if (todo.completed === false) {
      todo.completed = true;
    } else {
      todo.completed = false;
    }
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter((_, idx) => idx !== id);
  saveTodos();
  renderTodos();
}

function filterTodos(filter) {
  currentFilter = filter;
  console.log("currentFilter ", currentFilter);

  if (currentFilter === "active") {
    todos = todos.filter((cur, id) => {
      return cur.completed === false;
    });
  } else if (currentFilter === "completed") {
    todos = todos.filter((cur, id) => {
      return cur.completed === true;
    });
  } else {
    todos = todos.filter((cur) => cur);
  }
  renderTodos()
  todos = JSON.parse(localStorage.getItem("todos"));
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos()
}

function updateCount() {
  const countEl = document.getElementById("itemCount");
  countEl.textContent = `${todos.length} items left`;
}

function isOverdue(dateStr) {
  console.log("date in overdue : ",dateStr);
  
  if (!dateStr) return false;
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due >= today;
}

function renderTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";

  const visible = todos;

  if (visible.length === 0) {
    list.innerHTML =
      '<li style="color:#999;text-align:center;">No todos yet</li>';
  }

  visible.forEach((todo, idx) => {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(idx));

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;

    const dueDateSpan = document.createElement("span");
    dueDateSpan.className = "due-date";
    if (todo.dueDate) {
      dueDateSpan.textContent = todo.dueDate;
      if (isOverdue(todo.dueDate)) {
        dueDateSpan.classList.add("overdue");
      }
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTodo(idx));

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
