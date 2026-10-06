/* ==========================================================================
   Student Task Manager — Core Application Logic (script.js)
   Add, complete, delete, search, filter, sort, priority, subjects,
   due dates, progress ring, undo, saved tasks and a dark theme.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---------- DOM Elements ----------
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskCategoryInput = document.getElementById('task-category');
    const taskDueInput = document.getElementById('task-due');
    const taskPriorityInput = document.getElementById('task-priority');
    const taskDescInput = document.getElementById('task-desc');
    const formError = document.getElementById('form-error');

    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const filterButtons = document.querySelectorAll('.pill');
    const clearCompletedBtn = document.getElementById('clear-completed');

    const emptyState = document.getElementById('empty-state');
    const emptyTitle = document.getElementById('empty-title');
    const emptyText = document.getElementById('empty-text');
    const listSummary = document.getElementById('list-summary');

    const toastRegion = document.getElementById('toast-region');
    const themeToggle = document.getElementById('theme-toggle');

    const RING_LENGTH = 326.73; // circumference of the progress ring (r = 52)
    const STORAGE_KEY = 'student-task-manager.tasks';
    const OLD_STORAGE_KEY = 'tasks_data';
    const THEME_KEY = 'student-task-manager.theme';
    const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

    // ---------- State ----------
    let tasks = loadTasks();
    let currentFilter = 'all';
    let newTaskId = null;

    // ---------- Storage ----------
    function normalizeTask(item) {
        return {
            id: String(item.id || Date.now() + Math.random().toString(36).slice(2, 6)),
            title: String(item.title || '').trim(),
            description: String(item.description || item.desc || '').trim(),
            category: String(item.category || '').trim(),
            priority: PRIORITY_ORDER.hasOwnProperty(item.priority) ? item.priority : 'medium',
            due: typeof item.due === 'string' ? item.due : '',
            completed: Boolean(item.completed)
        };
    }

    function loadTasks() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY));
            return Array.isArray(saved) ? saved.map(normalizeTask).filter((t) => t.title) : [];
        } catch (error) {
            return [];
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            /* Storage unavailable: the app still works for this session. */
        }
    }

    // ---------- Add a task ----------
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();

        if (!title || !description) {
            showFormError('Add a title and some notes so you remember what this task is.');
            (title ? taskDescInput : taskTitleInput).focus();
            return;
        }

        hideFormError();

        const task = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            title,
            description,
            category: taskCategoryInput.value.trim(),
            priority: taskPriorityInput.value,
            due: taskDueInput.value,
            completed: false
        };

        tasks.unshift(task);
        newTaskId = task.id;
        saveTasks();
        render();

        taskForm.reset();
        taskPriorityInput.value = 'medium';
        taskTitleInput.focus();
        showToast('Task added');
    });

    [taskTitleInput, taskDescInput].forEach((field) => field.addEventListener('input', hideFormError));

    function showFormError(message) {
        formError.textContent = message;
        formError.hidden = false;
    }

    function hideFormError() {
        formError.hidden = true;
    }

    // ---------- Build a task card ----------
    function buildTaskCard(task) {
        const li = document.createElement('li');
        li.className = 'task-card';
        li.dataset.id = task.id;
        li.dataset.priority = task.priority;
        if (task.completed) li.classList.add('completed');
        if (task.id === newTaskId) li.classList.add('is-new');

        li.innerHTML = `
            <button class="btn-complete" type="button">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
            </button>
            <div class="task-info">
                <h3 class="task-title"></h3>
                <p class="task-desc"></p>
                <div class="task-meta"></div>
            </div>
            <button class="btn-delete" type="button">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>
            </button>
        `;

        // Safe text insertion (prevents XSS)
        li.querySelector('.task-title').textContent = task.title;
        li.querySelector('.task-desc').textContent = task.description;

        const meta = li.querySelector('.task-meta');
        meta.appendChild(makeChip(capitalize(task.priority) + ' priority', 'priority-' + task.priority));
        if (task.category) meta.appendChild(makeChip(task.category));
        if (task.due) {
            const info = describeDue(task.due, task.completed);
            meta.appendChild(makeChip(info.text, info.className));
        }

        const completeBtn = li.querySelector('.btn-complete');
        completeBtn.setAttribute('aria-pressed', String(task.completed));
        completeBtn.setAttribute('aria-label', (task.completed ? 'Mark as not done: ' : 'Mark as done: ') + task.title);
        completeBtn.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            render();
            if (task.completed) showToast('Nice work. Task completed');
        });

        const deleteBtn = li.querySelector('.btn-delete');
        deleteBtn.setAttribute('aria-label', 'Delete task: ' + task.title);
        deleteBtn.addEventListener('click', () => {
            const index = tasks.findIndex((t) => t.id === task.id);
            if (index === -1) return;
            const [removed] = tasks.splice(index, 1);
            saveTasks();
            render();
            showToast('Task deleted', 'Undo', () => {
                tasks.splice(index, 0, removed);
                saveTasks();
                render();
            });
        });

        return li;
    }

    function makeChip(text, extraClass) {
        const chip = document.createElement('span');
        chip.className = 'chip' + (extraClass ? ' ' + extraClass : '');
        chip.textContent = text;
        return chip;
    }

    // ---------- Search, filter and sort ----------
    function getVisibleTasks() {
        const query = searchInput.value.toLowerCase().trim();

        const result = tasks.filter((task) => {
            const matchesQuery =
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query) ||
                task.category.toLowerCase().includes(query);
            const matchesFilter =
                currentFilter === 'all' ||
                (currentFilter === 'active' && !task.completed) ||
                (currentFilter === 'completed' && task.completed);
            return matchesQuery && matchesFilter;
        });

        const sortBy = sortSelect.value;
        if (sortBy === 'due') {
            result.sort((a, b) => {
                if (!a.due && !b.due) return 0;
                if (!a.due) return 1;
                if (!b.due) return -1;
                return a.due.localeCompare(b.due);
            });
        } else if (sortBy === 'priority') {
            result.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        }

        return result;
    }

    searchInput.addEventListener('input', render);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchInput.value) {
            searchInput.value = '';
            render();
        }
    });
    sortSelect.addEventListener('change', render);

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            filterButtons.forEach((b) => {
                const isActive = b === button;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-pressed', String(isActive));
            });
            render();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        const count = tasks.filter((t) => t.completed).length;
        if (!count) return;
        const previous = tasks.slice();
        tasks = tasks.filter((t) => !t.completed);
        saveTasks();
        render();
        showToast(count + (count === 1 ? ' completed task cleared' : ' completed tasks cleared'), 'Undo', () => {
            tasks = previous;
            saveTasks();
            render();
        });
    });

    // ---------- Render ----------
    function render() {
        const visible = getVisibleTasks();

        taskList.replaceChildren(...visible.map(buildTaskCard));
        newTaskId = null;

        updateDashboard();
        updateEmptyState(visible.length);

        const total = tasks.length;
        listSummary.textContent = visible.length === total
            ? total + (total === 1 ? ' task' : ' tasks')
            : 'Showing ' + visible.length + ' of ' + total;
    }

    function updateDashboard() {
        const total = tasks.length;
        const done = tasks.filter((t) => t.completed).length;
        const active = total - done;
        const overdue = tasks.filter((t) => !t.completed && t.due && isOverdue(t.due)).length;
        const percent = total ? Math.round((done / total) * 100) : 0;

        setText('stat-total', total);
        setText('stat-active', active);
        setText('stat-completed', done);
        setText('stat-overdue', overdue);
        setText('count-all', total);
        setText('count-active', active);
        setText('count-completed', done);
        setText('ring-percent', percent + '%');

        document.getElementById('ring-fill').style.strokeDashoffset = RING_LENGTH * (1 - percent / 100);
        document.getElementById('progress-ring').setAttribute('aria-valuenow', percent);

        let message;
        if (!total) {
            message = 'Add your first task to get started.';
        } else if (!active) {
            message = 'Everything is done. Enjoy the break you earned.';
        } else if (overdue) {
            message = active + (active === 1 ? ' task left' : ' tasks left') + ', and ' + overdue + (overdue === 1 ? ' is' : ' are') + ' overdue. Start with those.';
        } else {
            message = active + (active === 1 ? ' task left' : ' tasks left') + ' to finish. You have got this.';
        }
        setText('hero-message', message);

        clearCompletedBtn.disabled = done === 0;
    }

    function updateEmptyState(visibleCount) {
        if (visibleCount > 0) {
            emptyState.hidden = true;
            return;
        }

        const query = searchInput.value.trim();

        if (!tasks.length) {
            emptyTitle.textContent = 'Your list is empty';
            emptyText.textContent = 'Add your first task above and start planning your week.';
        } else if (query) {
            emptyTitle.textContent = 'No matching tasks';
            emptyText.textContent = 'Nothing matches "' + query + '". Try a different keyword.';
        } else if (currentFilter === 'completed') {
            emptyTitle.textContent = 'Nothing completed yet';
            emptyText.textContent = 'Finished tasks will show up here.';
        } else {
            emptyTitle.textContent = 'All caught up';
            emptyText.textContent = 'You have no active tasks. Great job.';
        }
        emptyState.hidden = false;
    }

    // ---------- Greeting and date ----------
    function updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
        setText('greeting', greeting + '. Let\'s get things done.');
        setText('today-date', now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }));
    }

    // ---------- Toasts ----------
    function showToast(message, actionLabel, onAction) {
        const toast = document.createElement('div');
        toast.className = 'toast';

        const text = document.createElement('span');
        text.textContent = message;
        toast.appendChild(text);

        const remove = () => toast.remove();

        if (actionLabel && onAction) {
            const action = document.createElement('button');
            action.type = 'button';
            action.textContent = actionLabel;
            action.addEventListener('click', () => {
                onAction();
                remove();
            });
            toast.appendChild(action);
        }

        toastRegion.appendChild(toast);
        setTimeout(remove, actionLabel ? 6000 : 2400);
    }

    // ---------- Theme ----------
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }

    function getInitialTheme() {
        try {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved) return saved;
        } catch (error) { /* ignore */ }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    themeToggle.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (error) { /* ignore */ }
    });

    // ---------- Utilities ----------
    function setText(id, value) {
        document.getElementById(id).textContent = value;
    }

    function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function parseLocalDate(value) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function startOfToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }

    function isOverdue(value) {
        return parseLocalDate(value) < startOfToday();
    }

    function formatDate(value) {
        return parseLocalDate(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }

    function describeDue(value, completed) {
        const days = Math.round((parseLocalDate(value) - startOfToday()) / 86400000);

        if (completed) return { text: 'Due ' + formatDate(value), className: '' };
        if (days < 0) return { text: 'Overdue since ' + formatDate(value), className: 'overdue' };
        if (days === 0) return { text: 'Due today', className: 'soon' };
        if (days === 1) return { text: 'Due tomorrow', className: 'soon' };
        return { text: 'Due ' + formatDate(value), className: '' };
    }

    // ---------- Start ----------
    applyTheme(getInitialTheme());
    updateGreeting();
    render();
});