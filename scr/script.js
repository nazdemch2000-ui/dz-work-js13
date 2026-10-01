const TASK_KEYS = {
  TASK: "app_task",
};
const currentFilter = "all";
//функція витягу всіх тасків
function getTask() {
  try {
    const rawData = localStorage.getItem(TASK_KEYS.TASK);
    return rawData ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error("Failed to parse task data from LocalStorage", error);
    return [];
  }
}
//функція збереження тасків
function saveTask(taskItems) {
  localStorage.setItem(TASK_KEYS.TASK, JSON.stringify(taskItems));
  // Оновлюємо UI поточної вкладки вручну (оскільки подія 'storage' не спрацьовує на вкладці-ініціаторі)
  updateTaskUI();
}
//функція додавання нового таску
function addTask(name) {
  const currentTask = getTask();
  currentTask.push({ id: Date.now(), name, completed: false});
  saveTask(currentTask);
}
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem(TASK_KEYS.TASK);
  updateTaskUI();
});
 
//функція оновленя таску та виведення списку + кнопка видалення та чек бокс+ фультрація 
function updateTaskUI() {
  const task = getTask();
  const cartTaskList = document.getElementById("taskList");
  let filteredTask = task;

if (currentFilter === "active") {
    filteredTask = task.filter(item => !item.completed);
}
if (currentFilter === "completed") {
    filteredTask = task.filter(item => item.completed);
}
  cartTaskList.innerHTML = "";
  if (task.length === 0) {
    cartTaskList.innerHTML = "<li>Task is empty</li>";
  } else {
    filteredTask.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
    const currentTask = getTask();

    const currentItem = currentTask.find(task => task.id === item.id);

    currentItem.completed = checkbox.checked;

    saveTask(currentTask);
});

    const name = document.createElement("span");
    name.textContent = item.name;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.addEventListener("click", () => {
    const currentTask = getTask();

    const newTasks = currentTask.filter(task => task.id !== item.id);

    saveTask(newTasks);
    });
    li.append(checkbox, name, deleteBtn);
        cartTaskList.appendChild(li);
    });
  }
}




window.addEventListener("storage", (event) => {
  // Ігноруємо події, які не стосуються нашої програми
  if (!event.key) return;

  // 1. Реакція на зміну кошика в іншій вкладці
  if (event.key === TASK_KEYS.TASK) {
    updateTaskUI();
  }

  
});

// Ініціалізація інтерфейсу при первинному завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  updateTaskUI();
});

//форма обробка додавання таску з введених данних
document.getElementById("taskForm").addEventListener("submit", (event) => {
    event.preventDefault();

    addTask(document.getElementById("newTask").value);
      document.getElementById("newTask").value = "";
});


//лбробка функціоналу кнопок фільтрації
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");
function setActiveButton(btn) {
    const buttons = [allBtn, activeBtn, completedBtn];

    buttons.forEach((button) => {
        button.classList.remove("btn-primary");
        button.classList.add("btn-outline-primary");
    });

    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-primary");
}
allBtn.addEventListener("click",()=>{
   currentFilter = "all";
    setActiveButton(allBtn);
    updateTaskUI();
})
activeBtn.addEventListener("click",()=>{
 currentFilter = "active";
    setActiveButton(activeBtn);
    updateTaskUI();
})

completedBtn.addEventListener("click",()=>{
  currentFilter = "completed";
    setActiveButton(completedBtn);
    updateTaskUI();
})