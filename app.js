const toDoCount = document.querySelector(".to-do-count");
const inProgressCount = document.querySelector(".in-progress-count");
const doneCount = document.querySelector(".done-count");

const addTaskBtn = document.querySelector(".to-do-tasks .add-to-do");
const addTaskContainer = document.querySelector(".to-do-tasks .add-task-input");
const newTaskInput = document.querySelector(".to-do-tasks .new-task-input");

const approveNewTask = document.querySelector(".to-do-tasks .approve-new-task");
const cancelNewTask = document.querySelector(".to-do-tasks .cancel-new-task");

const toDoWrapper = document.querySelector(".to-do-tasks .to-dos-wrapper");
const toDoTaskContainer = document.querySelector(".to-do-tasks .tasks-content");
const inProgressTasksContainer = document.querySelector(".in-progress-tasks .tasks-content");
const doneTaskContainer = document.querySelector(".resolved-tasks .tasks-content");

console.log("toDoTaskContainer", toDoTaskContainer.children.length);


document.addEventListener("DOMContentLoaded", () => {
  toDoCount.textContent = toDoTaskContainer.children.length
  inProgressCount.textContent = inProgressTasksContainer.children.length
  doneCount.textContent = doneTaskContainer.children.length;
});


const addToDoTask = (taskDescription, taskId) => {
  return `
    <div class="task" id='${taskId}'>
      <h4>${taskDescription}</h4>
      <div class="separator"></div>
      <div class="task-action">
        <i class="fa-solid fa-caret-right move" style="font-size: 23px;"></i>
        <i class="fa-solid fa-trash remove"></i>
      </div>
    </div>
  `;
}
const addInProgressTask = (taskDescription, taskId) => {
  return `
    <div class="task" id='${taskId}'>
      <h4>${taskDescription}</h4>
      <div class="separator"></div>
      <div class="task-action">
        <i class="fa-solid fa-caret-right move" style="font-size: 23px;"></i>
        <i class="fa-solid fa-trash remove"></i>
      </div>
    </div>
  `;
}
const addDoneTask = (taskDescription, taskId) => {
  return `
    <div class="task" id='${taskId}'>
      <h4>${taskDescription}</h4>
      <div class="separator"></div>
      <div class="task-action">
        <div> </div>
        <i class="fa-solid fa-trash remove"></i>
      </div>
    </div>
  `;
}

const injectTask = (parentElement, childElement) => {
  parentElement.insertAdjacentHTML("beforeend", childElement);
}

const toggleAddTaskContainer = (show) => { 
  addTaskContainer.style.display = show ? "block" : "none"
}

const generateId = () => Math.floor(Math.random() * 58955) * 1568;

let addedTasks = [];

addTaskBtn.addEventListener("click", () => { 
  toDoWrapper.style.height = "calc(100% - 150px)";
  addTaskBtn.classList.add('disabled');
  toggleAddTaskContainer(true);
})
approveNewTask.addEventListener('click', () => {
  if (newTaskInput.value !== '') {
    const taskDescription = newTaskInput.value;
    const taskId = generateId()
    injectTask(toDoTaskContainer, addToDoTask(taskDescription, taskId));
    newTaskInput.value = ''
    toDoCount.textContent = toDoTaskContainer.children.length;
    addedTasks.push({
      type: "to-do",
      id: `${taskId}`,
    });
  } else { 
    alert('Scrie ceva !!')
  }

  console.log("addedTasks", addedTasks);
})
cancelNewTask.addEventListener('click', () => {
  toDoWrapper.style.height = 'calc(100% - 50px)';
  addTaskBtn.classList.remove("disabled");
  toggleAddTaskContainer(false);
})

document.addEventListener('click', (element) => {
  const clickedTaskClasses = element.target.classList
  const clickedTask = element.target.parentElement.parentElement

  if (clickedTask.id !== "" && clickedTaskClasses.length === 3) {
    console.log("clickedTask", clickedTask.children);
		const taskItemId = clickedTask.id
    const taskContent = clickedTask.children[0].textContent

    const isMove = clickedTaskClasses.contains("move");
    const isRemove = clickedTaskClasses.contains("remove");

		const existingTask = addedTasks.find(task => task.id === taskItemId)
		if (existingTask.id) {
			const taskItemPosition = addedTasks.findIndex((task) => task.id === taskItemId)

      if (isMove) {
        switch (existingTask.type) {
          case "to-do":
            injectTask(
              inProgressTasksContainer,
              addInProgressTask(taskContent, taskItemId)
            )
            addedTasks[taskItemPosition].type = "progress"
            clickedTask.remove()

            toDoCount.textContent = toDoTaskContainer.children.length
            inProgressCount.textContent = inProgressTasksContainer.children.length
            break;
          case "progress":
            injectTask(
              doneTaskContainer,
              addDoneTask(taskContent, taskItemId)
            );
            addedTasks[taskItemPosition].type = "done"
            clickedTask.remove()

            inProgressCount.textContent = inProgressTasksContainer.children.length
            doneCount.textContent = doneTaskContainer.children.length
            break;
          default:
            console.log("job done!")
        }
      } else if (isRemove) {
        clickedTask.remove()
        addedTasks = addedTasks.filter((task) => task.id !== taskItemId)

        if (existingTask.type === 'to-do') {
          toDoCount.textContent = toDoTaskContainer.children.length;
        } else if (existingTask.type === "progress") {
          inProgressCount.textContent = inProgressTasksContainer.children.length;
        } else if (existingTask.type === 'done') { 
          doneCount.textContent = doneTaskContainer.children.length;
        }
      }
		}
	}
})