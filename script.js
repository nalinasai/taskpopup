const STORAGE_KEY = "quicktask.tasks";
const THEME_KEY = "quicktask.theme";

var buttonadd = document.querySelector(".buttonadd");
var popuplay = document.querySelector(".popuplay");
var popupbox = document.querySelector(".popupbox");
var adds = document.getElementById("add");
var tasktitle = document.getElementById("task-title");
var date = document.getElementById("Date");
var description = document.getElementById("description");
var taskIdField = document.getElementById("task-id");
var container = document.querySelector(".container");
var cancel = document.getElementById("cancel");
var taskForm = document.getElementById("task-form");
var sortBy = document.getElementById("sort-by");
var themeToggle = document.getElementById("theme-toggle");
var installBtn = document.getElementById("install-btn");
var deferredInstallPrompt = null;

function getTasks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);

    if (themeToggle) {
        const icon = themeToggle.querySelector(".theme-icon");
        if (icon) {
            icon.textContent = isDark ? "☀️" : "🌙";
        }
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);
}

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js").catch(function () {
            return null;
        });
    }
}

function sortTasks(tasks) {
    const mode = sortBy ? sortBy.value : "date-asc";

    return [...tasks].sort((a, b) => {
        const aDate = a.date ? new Date(a.date).getTime() : 0;
        const bDate = b.date ? new Date(b.date).getTime() : 0;

        if (mode === "date-desc") {
            return bDate - aDate;
        }

        return aDate - bDate;
    });
}

function closePopup() {
    popuplay.style.display = "none";
    popupbox.style.display = "none";
    if (taskForm) {
        taskForm.reset();
    }
    if (taskIdField) {
        taskIdField.value = "";
    }
    const popupTitle = document.getElementById("popup-title");
    if (popupTitle) {
        popupTitle.textContent = "Add New Task";
    }
    if (adds) {
        adds.textContent = "Add";
    }
}

function renderTasks() {
    const tasks = sortTasks(getTasks());
    container.innerHTML = "";

    if (tasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "task task-empty";
        emptyState.innerHTML = "<h3>No tasks yet</h3><p>Add your first task and stay on top of your day.</p>";
        container.appendChild(emptyState);
        return;
    }

    tasks.forEach(task => {
        const divs = document.createElement("div");
        divs.className = `task ${task.completed ? "completed" : ""}`;
        divs.dataset.id = task.id;
        divs.innerHTML = `
            <div class="task-header">
                <div class="task-check">
                    <input type="checkbox" ${task.completed ? "checked" : ""} class="task-complete" aria-label="Mark task complete">
                    <span>${task.completed ? "Done" : "Open"}</span>
                </div>
            </div>
            <h3 id="taskname">${task.title}</h3>
            <h2 id="taskdate">${task.date || "No date"}</h2>
            <p id="taskdetail">${task.description || "No description"}</p>
            <div class="task-actions">
                <button class="task-btn edit" type="button">Edit</button>
                <button class="task-btn delete" type="button">Delete</button>
            </div>
        `;
        container.appendChild(divs);
    });
}

function openAddPopup() {
    popuplay.style.display = "block";
    popupbox.style.display = "block";
}

function openEditPopup(taskId) {
    const tasks = getTasks();
    const task = tasks.find(item => String(item.id) === String(taskId));

    if (!task) return;

    if (taskIdField) taskIdField.value = task.id;
    if (tasktitle) tasktitle.value = task.title;
    if (date) date.value = task.date || "";
    if (description) description.value = task.description || "";
    const popupTitle = document.getElementById("popup-title");
    if (popupTitle) popupTitle.textContent = "Edit Task";
    if (adds) adds.textContent = "Save";

    openAddPopup();
}

buttonadd.addEventListener("click", function (event) {
    event.preventDefault();
    closePopup();
    openAddPopup();
});

popuplay.addEventListener("click", closePopup);

adds.addEventListener("click", function (event) {
    event.preventDefault();

    const enteredTitle = tasktitle.value.trim();
    if (enteredTitle === "") {
        alert("Give any title");
        return;
    }

    const tasks = getTasks();
    const taskId = taskIdField.value;

    if (taskId) {
        const taskIndex = tasks.findIndex(item => String(item.id) === String(taskId));
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title: enteredTitle,
                date: date.value || "No date",
                description: (description.value || "No description").trim()
            };
        }
    } else {
        tasks.push({
            id: Date.now() + Math.random(),
            title: enteredTitle,
            date: date.value || "No date",
            description: (description.value || "No description").trim(),
            completed: false
        });
    }

    saveTasks(tasks);
    closePopup();
    renderTasks();
});

window.addEventListener("DOMContentLoaded", function () {
    initializeTheme();
    registerServiceWorker();
    renderTasks();
});

cancel.addEventListener("click", function (event) {
    event.preventDefault();
    closePopup();
});

sortBy.addEventListener("change", function () {
    renderTasks();
});

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const isDark = document.body.classList.contains("dark-mode");
        const nextTheme = isDark ? "light" : "dark";
        localStorage.setItem(THEME_KEY, nextTheme);
        applyTheme(nextTheme);
    });
}

window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installBtn) {
        installBtn.hidden = false;
    }
});

if (installBtn) {
    installBtn.addEventListener("click", async function () {
        if (!deferredInstallPrompt) return;

        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        installBtn.hidden = true;
    });
}

container.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("taskdelete") || target.classList.contains("delete")) {
        const taskDiv = target.closest(".task");
        if (!taskDiv) return;

        const taskId = taskDiv.dataset.id;
        const tasks = getTasks().filter(task => String(task.id) !== String(taskId));
        saveTasks(tasks);
        taskDiv.classList.add("task-removing");
        setTimeout(() => {
            renderTasks();
        }, 180);
        return;
    }

    if (target.classList.contains("task-btn") && target.textContent.trim() === "Edit") {
        const taskDiv = target.closest(".task");
        if (!taskDiv) return;
        openEditPopup(taskDiv.dataset.id);
        return;
    }
});

container.addEventListener("change", function (event) {
    if (!event.target.classList.contains("task-complete")) return;

    const taskDiv = event.target.closest(".task");
    if (!taskDiv) return;

    const taskId = taskDiv.dataset.id;
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => String(task.id) === String(taskId));

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = event.target.checked;
        saveTasks(tasks);
        renderTasks();
    }
});