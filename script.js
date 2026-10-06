
/* ==========================================================================
   Student Task Manager — Core Logic with LocalStorage
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskPriorityInput = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const emptyState = document.getElementById('empty-state');
    
    const statTotal = document.getElementById('stat-total');
    const statCompleted = document.getElementById('stat-completed');

    // Load tasks from LocalStorage
    let tasks = JSON.parse(localStorage.getItem('tasks_data')) || [];

    // Save tasks to LocalStorage
    function saveTasks() {
        localStorage.setItem('tasks_data', JSON.stringify(tasks));
        updateStats();
    }

    // Update Header Counter Stats
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;

        statTotal.textContent = total;
        statCompleted.textContent = completed;

        // Toggle Empty State Visibility
        if (total === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }

    // Render Initial Tasks
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => appendTaskCardToDOM(task));
        updateStats();
        filterTasks();
    }

    // Form Submission Handler
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleText = taskTitleInput.value.trim();
        const descText = taskDescInput.value.trim();
        const priorityText = taskPriorityInput.value;

        if (!titleText || !descText) return;

        const newTask = {
            id: Date.now().toString(),
            title: titleText,
            desc: descText,
            priority: priorityText,
            completed: false
        };

        tasks.unshift(newTask);
        saveTasks();
        renderTasks();

        taskForm.reset();
        taskTitleInput.focus();
    });

    // Append Task Card to DOM safely
    function appendTaskCardToDOM(task) {
        const li = document.createElement('li');
        li.className = `task-card ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-info">
                <div class="task-header">
                    <span class="priority-badge ${task.priority}">${task.priority}</span>
                    <h3 class="task-title"></h3>
                </div>
                <p class="task-desc"></p>
            </div>
            <div class="task-actions">
                <button class="action-btn check" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </button>
                <button class="action-btn delete" title="Delete task">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                </button>
            </div>
        `;

        // Safe insertion of user input against XSS
        li.querySelector('.task-title').textContent = task.title;
        li.querySelector('.task-desc').textContent = task.desc;

        // Complete Event Listener
        li.querySelector('.check').addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        // Delete Event Listener
        li.querySelector('.delete').addEventListener('click', () => {
            li.style.transform = 'scale(0.95)';
            li.style.opacity = '0';
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            }, 200);
        });

        taskList.appendChild(li);
    }

    // Live Task Search & Filtering Function
    function filterTasks() {
        const query = searchInput.value.toLowerCase().trim();
        const cards = taskList.querySelectorAll('.task-card');
        let visibleCount = 0;

        cards.forEach((card) => {
            const title = card.querySelector('.task-title').textContent.toLowerCase();
            const desc = card.querySelector('.task-desc').textContent.toLowerCase();

            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Handle empty search result state
        if (tasks.length > 0) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTasks);
    }

    // Initial Load
    renderTasks();
});