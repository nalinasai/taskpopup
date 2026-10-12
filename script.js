const STORAGE_KEY = "quicktask.tasks";

var buttonadd = document.querySelector(".buttonadd");
var popuplay = document.querySelector(".popuplay");
var popupbox = document.querySelector(".popupbox");
var adds = document.getElementById("add");
var tasktitle = document.getElementById("task-title");
var date = document.getElementById("Date");
var description = document.getElementById("description");
var container = document.querySelector(".container");
var cancel = document.getElementById("cancel");
var taskForm = document.getElementById("task-form");

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

function closePopup() {
    popuplay.style.display = "none";
    popupbox.style.display = "none";
    if (taskForm) {
        taskForm.reset();
    }
}

function renderTasks() {
    const tasks = getTasks();
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
        divs.className = "task";
        divs.dataset.id = task.id;
        divs.innerHTML = `
            <h3 id="taskname">${task.title}</h3>
            <h2 id="taskdate">${task.date || "No date"}</h2>
            <p id="taskdetail">${task.description || "No description"}</p>
            <button class="taskdelete" type="button">Delete</button>
        `;
        container.appendChild(divs);
    });
}

buttonadd.addEventListener("click", function (event) {
    event.preventDefault();
    popuplay.style.display = "block";
    popupbox.style.display = "block";
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
    const newTask = {
        id: Date.now() + Math.random(),
        title: enteredTitle,
        date: date.value || "No date",
        description: (description.value || "No description").trim()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    closePopup();
    renderTasks();
});

window.addEventListener("DOMContentLoaded", function () {
    renderTasks();
});

cancel.addEventListener("click", function (event) {
    event.preventDefault();
    closePopup();
});

container.addEventListener("click", function (event) {
    if (!event.target.classList.contains("taskdelete")) {
        return;
    }

    event.preventDefault();
    const taskDiv = event.target.closest(".task");
    if (!taskDiv) return;

    const taskId = taskDiv.dataset.id;
    const tasks = getTasks().filter(task => String(task.id) !== String(taskId));
    saveTasks(tasks);
    renderTasks();
});