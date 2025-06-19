document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');

  // Fetch and display tasks
  async function loadTasks() {
    const res = await fetch('/api/items');
    const data = await res.json();
    taskList.innerHTML = '';
    data.forEach(item => renderTask(item));
  }

  function renderTask(item) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td><span class="task-name">${item.name}</span></td>
      <td>
        <button class="edit-btn">✏️ Edit</button>
        <button class="delete-btn">🗑️ Delete</button>
      </td>
    `;
    taskList.appendChild(row);

    row.querySelector('.delete-btn').onclick = async () => {
      await fetch(`/api/items/${item.id}`, { method: 'DELETE' });
      loadTasks();
    };

    row.querySelector('.edit-btn').onclick = () => {
      const span = row.querySelector('.task-name');
      const newName = prompt('Edit task name:', span.textContent);
      if (newName) {
        fetch(`/api/items/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        }).then(loadTasks);
      }
    };
  }

  addBtn.onclick = async () => {
    const name = taskInput.value.trim();
    if (name) {
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      taskInput.value = '';
      loadTasks();
    }
  };

  loadTasks(); // Initial load
});
