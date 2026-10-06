
/* ==========================================================================
   Student Task Manager — Core Application Logic (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Selections
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');

    // 1. Task Form Submission Handler
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get trimmed values from form inputs
        const titleText = taskTitleInput.value.trim();
        const descText = taskDescInput.value.trim();

        // Prevent empty or whitespace-only submissions
        if (!titleText || !descText) {
            alert('Please fill in both the task title and description.');
            return;
        }

        // Create new task card element
        createTaskCard(titleText, descText);

        // Reset form inputs after successful creation
        taskForm.reset();
        taskTitleInput.focus();
    });

    // 2. Function to Create and Append a Task Card
    function createTaskCard(title, description) {
        // Create <li> container for task card
        const li = document.createElement('li');
        li.className = 'task-card';

        // Inner HTML structure for task card
        li.innerHTML = `
            <div class="task-info">
                <h3 class="task-title"></h3>
                <p class="task-desc"></p>
            </div>
            <div class="task-actions">
                <button class="btn-complete" type="button">Complete</button>
                <button class="btn-delete" type="button">Delete</button>
            </div>
        `;

        // Safely insert text content to prevent XSS vulnerabilities
        li.querySelector('.task-title').textContent = title;
        li.querySelector('.task-desc').textContent = description;

        // Event Listener: Toggle Task Completion Status
        const completeBtn = li.querySelector('.btn-complete');
        completeBtn.addEventListener('click', () => {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                completeBtn.textContent = 'Undo';
            } else {
                completeBtn.textContent = 'Complete';
            }
            // Trigger search filter refresh to preserve current search state
            filterTasks();
        });

        // Event Listener: Delete Task Card
        const deleteBtn = li.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        // Append new task card to task list container
        taskList.appendChild(li);

        // Run filter check in case a search query is actively typed
        filterTasks();
    }

    // 3. Live Task Search & Filtering Functionality
    function filterTasks() {
        const query = searchInput.value.toLowerCase().trim();
        const tasks = taskList.querySelectorAll('.task-card');

        tasks.forEach((task) => {
            const title = task.querySelector('.task-title').textContent.toLowerCase();
            const desc = task.querySelector('.task-desc').textContent.toLowerCase();

            // Match query against title or description
            if (title.includes(query) || desc.includes(query)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    // Attach Event Listener for Real-Time Search Filtering
    if (searchInput) {
        searchInput.addEventListener('input', filterTasks);
    }
});s