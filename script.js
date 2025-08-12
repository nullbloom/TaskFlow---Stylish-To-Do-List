
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let theme = localStorage.getItem("theme") || "light";

// Apply saved theme
if (theme === "dark") {
    body.classList.add("dark");
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    theme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(taskText, completed = false, animate = true) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="delete-btn">❌</button>
      `;

    if (completed) li.classList.add("completed");

    taskList.appendChild(li);

    if (animate) {
        // Pop animation on new task
        gsap.fromTo(li,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
    }

    li.querySelector(".task-text").addEventListener("click", () => {
        li.classList.toggle("completed");
        const index = tasks.findIndex(t => t.text === taskText);
        if (index > -1) {
            tasks[index].completed = li.classList.contains("completed");
            saveTasks();
        }
        gsap.to(li, { scale: 0.9, yoyo: true, repeat: 1, duration: 0.2 });
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        gsap.to(li, {
            opacity: 0,
            x: 50,
            duration: 0.3,
            onComplete: () => {
                li.remove();
                tasks = tasks.filter(t => t.text !== taskText);
                saveTasks();
            }
        });
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    tasks.push({ text: taskText, completed: false });
    saveTasks();
    createTaskElement(taskText);
    taskInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

// Load tasks with stagger animation
tasks.forEach((task, i) => {
    setTimeout(() => {
        createTaskElement(task.text, task.completed, false);
        gsap.from(taskList.lastChild, { opacity: 0, y: -20, duration: 0.4 });
    }, i * 150);
});
