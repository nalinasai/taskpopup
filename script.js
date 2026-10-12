var buttonadd = document.querySelector(".buttonadd");
var popuplay = document.querySelector(".popuplay");
var popupbox = document.querySelector(".popupbox");
var adds = document.getElementById("add");
var tasktitle = document.getElementById("task-title");
var date = document.getElementById("Date");
description = document.getElementById("description");
var container = document.querySelector(".container");
var cancel = document.getElementById("cancel");
var taskForm = document.getElementById("task-form");

function closePopup() {
    popuplay.style.display = "none";
    popupbox.style.display = "none";
    taskForm.reset();
}

function updateEmptyState() {
    const taskCards = container.querySelectorAll(".task:not(.task-empty)");
    const emptyCard = container.querySelector(".task-empty");

    if (taskCards.length === 0) {
        if (!emptyCard) {
            const emptyState = document.createElement("div");
            emptyState.className = "task task-empty";
            emptyState.innerHTML = "<h3>No tasks yet</h3><p>Add your first task and stay on top of your day.</p>";
            container.appendChild(emptyState);
        }
    } else if (emptyCard) {
        emptyCard.remove();
    }
}

buttonadd.addEventListener("click", function (event) {
    event.preventDefault();
    popuplay.style.display = "block";
    popupbox.style.display = "block";
});

popuplay.addEventListener("click", closePopup);

adds.addEventListener("click", function (event) {
    event.preventDefault();

    if (tasktitle.value.trim() === "") {
        alert("Give any title");
        return;
    }

    var divs = document.createElement("div");
    divs.setAttribute("class", "task");
    divs.innerHTML = `<h3 id="taskname">${tasktitle.value.trim()}</h3>
        <h2 id="taskdate">${date.value || "No date"}</h2>
        <p id="taskdetail">${(description.value || "No description").trim()}</p>
        <button class="taskdelete" type="button">Delete</button>`;

    container.appendChild(divs);
    closePopup();

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({
        title: tasktitle.value.trim(),
        date: date.value || "No date",
        description: description.value.trim() || "No description"
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateEmptyState();
});

window.addEventListener("DOMContentLoaded", function () {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (tasks.length === 0) {
        updateEmptyState();
        return;
    }

    container.innerHTML = "";
    tasks.forEach(task => {
        let divs = document.createElement("div");
        divs.setAttribute("class", "task");
        divs.innerHTML = `<h3 id="taskname">${task.title}</h3>
            <h2 id="taskdate">${task.date || "No date"}</h2>
            <p id="taskdetail">${task.description || "No description"}</p>
            <button class="taskdelete" type="button">Delete</button>`;
        container.appendChild(divs);
    });
});

cancel.addEventListener("click", function (event) {
    event.preventDefault();
    closePopup();
});

container.addEventListener("click", function (event) {
    if (event.target.classList.contains("taskdelete")) {
        event.preventDefault();
        let taskDiv = event.target.parentElement;
        let taskTitle = taskDiv.querySelector("#taskname").innerText;

        taskDiv.remove();

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.title !== taskTitle);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateEmptyState();
    }
});