let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let lefttodos = todos;
let editId = null;

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

  if (dueDateInput.value && new Date(dueDateInput.value) < Date.now()) {
    alert("date should be of future");
    return;
  }
  if (editId !== null) {
    todos[editId].text = document.getElementById("todoInput").value;
    todos[editId].dueDate = document.getElementById("dueDateInput").value;
    saveTodos();
    document.getElementById("todoInput").value="";
    document.getElementById("dueDateInput").value="";
    renderTodos();
    return;
  } else {
    const todo = {
      id: getNextId(),
      text: text,
      completed: false,
      dueDate: dueDateInput.value || null,
    };
    todos.push(todo);
    saveTodos();
  }

  
  input.value = "";
  dueDateInput.value = "";
  renderTodos();
}

function toggleTodo(idx) {
  const todo = todos.find((t, id) => idx === id);
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

function editTodo(id) {
  console.log(id);
  editId = id;
  const todo = todos.filter((cur, idx) => idx === id);
  document.getElementById("todoInput").value = todo[0].text;
  document.getElementById("dueDateInput").value = todo[0].dueDate;
}

function filterTodos(filter) {
  currentFilter = filter;

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
  renderTodos();
  todos = JSON.parse(localStorage.getItem("todos"));
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos();
}
function updateCount() {
  lefttodos = todos.filter((cur) => cur.completed === false);
  const countEl = document.getElementById("itemCount");
  countEl.textContent = `${lefttodos.length} items left`;
}

function isOverdue(dateStr) {
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

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTodo(idx));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTodo(idx));

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(dueDateSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  updateCount();
}

// Initial render
renderTodos();
