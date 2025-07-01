var buttonadd = document.querySelector(".buttonadd")
var popuplay = document.querySelector(".popuplay")
var popupbox = document.querySelector(".popupbox")

buttonadd.addEventListener("click",function(event){
    popuplay.style.display = "block"
    popupbox.style.display = "block"
    event.preventDefault()
})

var adds = document.getElementById("add")
var tasktitle = document.getElementById("task-title")
var date = document.getElementById("Date")
var description = document.getElementById("description")
var container = document.querySelector(".container")
adds.addEventListener("click",function(event){
    if(tasktitle.value==""){
        alert("Give any title")
    }
    else{
        event.preventDefault()
        var divs = document.createElement("div")
        divs.setAttribute("class","task")
        divs.innerHTML = `<h3 id="taskname">${tasktitle.value}</h3>
                <h2 id="taskdate">${date.value}</h2>
                <p id="taskdetail">${description.value}</p><button class="taskdelete" onclick="deletes(event)">Delete</button>`
        container.append(divs)
        popuplay.style.display = "none"
        popupbox.style.display = "none"

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({
            title: tasktitle.value,
            date: date.value,
            description: description.value
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));


    }
    

})


window.addEventListener("DOMContentLoaded", function() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        let divs = document.createElement("div");
        divs.setAttribute("class", "task");
        divs.innerHTML = `<h3 id="taskname">${task.title}</h3>
            <h2 id="taskdate">${task.date}</h2>
            <p id="taskdetail">${task.description}</p>
            <button class="taskdelete">Delete</button>`;
        container.append(divs);
    });
});



var cancel = document.getElementById("cancel")

cancel.addEventListener("click",function(event){
    event.preventDefault()
    popuplay.style.display = "none"
    popupbox.style.display = "none"

})

container.addEventListener("click", function(event) {
    if (event.target.classList.contains("taskdelete")) {
        event.preventDefault();
        let taskDiv = event.target.parentElement;
        let taskTitle = taskDiv.querySelector("#taskname").innerText;
        
        
        taskDiv.remove();
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.title !== taskTitle);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});