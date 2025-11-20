const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearCompleted');
const filters = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const dateDisplay = document.getElementById('date');

// Set current date
dateDisplay.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Load tasks on start
loadTasks();

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
clearBtn.addEventListener('click', clearCompleted);

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTasks();
    });
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert('Please enter a task!');

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    saveAndRender();
    taskInput.value = '';
}

function toggleComplete(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
}

function loadTasks() {
    const filter = document.querySelector('.filter-btn.active').dataset.filter;
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span class="task-text" onclick="toggleComplete(${task.id})">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${task.id})">
                    ${task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateTaskCount();
}

function updateTaskCount() {
    const remaining = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}