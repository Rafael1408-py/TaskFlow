
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");

const totalElement = document.querySelector("#total");
const completedElement = document.querySelector("#completed");
const pendingElement = document.querySelector("#pending");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;

    totalElement.textContent = tasks.length;
    completedElement.textContent = completed;
    pendingElement.textContent = tasks.length - completed;
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    emptyMessage.hidden = filteredTasks.length > 0;

    filteredTasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task";

        if (task.completed) {
            item.classList.add("done");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Concluir tarefa: ${task.name}`
        );

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.name;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(currentTask => currentTask.id !== task.id);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, name, deleteButton);
        taskList.appendChild(item);
    });

    updateStats();
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = input.value.trim();

    if (name === "") {
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        name: name,
        completed: false
    });

    saveTasks();
    input.value = "";
    input.focus();

    renderTasks();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(filter => {
            filter.classList.toggle("active", filter === button);
        });

        renderTasks();
    });
});

renderTasks();
