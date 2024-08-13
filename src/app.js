import "./style.css";

const app = (function () {
  const CreateTask = (title, description, date, priority) => {
    let task = {
      title,
      description,
      date,
      priority,
      completed: false,
      changeCompleted() {
        this.completed = !this.completed;
      },
    };
    return task;
  };

  const saveOnLocalStorgage = (task) => {
    // Recuperar el array de tareas desde el localStorage;
    let tasks = JSON.parse(localStorage.getItem("listTaskLocalStorage"));

    // Agregar la nueva tarea al array
    tasks.push(task);

    // Guardar el array actualizado en el localStorage
    localStorage.setItem("listTaskLocalStorage", JSON.stringify(tasks));
  };

  const dataLocalStorage = () => {
    let data = localStorage.getItem("listTaskLocalStorage");
    return data ? hydrateTasks(JSON.parse(data)) : [];
  };

  const deleteTask = (title) => {
    let task = app.dataLocalStorage();
    let index = task.findIndex((item) => item.title === title);
    if (index !== -1) {
      task.splice(index, 1);
      localStorage.setItem("listTaskLocalStorage", JSON.stringify(task)); // Guardar el cambio en localStorage
    }
    
  };

  const hydrateTasks = (tasks) => {
    return tasks.map((task) => ({
      ...task,
      changeCompleted() {
        this.completed = !this.completed;
      },
    }));
  };

  return {
    CreateTask,
    deleteTask,
    saveOnLocalStorgage,
    dataLocalStorage,
    hydrateTasks,
  };
})();

const tarea = app.CreateTask(
  "Task for test",
  "Not description",
  "12/08/24",
  "Medium"
);

let taskTest = app.dataLocalStorage();
console.log(taskTest.some((item)=> item.title == tarea.title));
if(!taskTest.some((item)=> item.title == tarea.title)){
  app.saveOnLocalStorgage(tarea);
}


const appDOM = (function () {
  const main = document.querySelector(".cont_taks");
  const section = document.getElementById("section");
  const title_section = document.getElementById("title_section");

  const showCompletedTask = () => {
    section.innerHTML = "";
    title_section.innerHTML = "Tasks Completed";
    let task = app.dataLocalStorage();
    task.forEach((item) => {
      let statusCompleted = item.completed ? "Complete: 🟢" : "Incomplete: 🔴";

      if (item.completed) {
        section.innerHTML += `<article class="task_list">
          <div class="title_and_description">
              <h2>${item.title}</h2>
              <p>${item.description}</p>
              <p class="date">Date: ${item.date}</p>
          </div>
          <div class="task_actions">
              <b class="status" data-status="${item.title}">${statusCompleted}</b>
                <b class="delete" data-title="${item.title}">Delete ❌</b>
          </div>
          </article>`;
      }
    });
    addDeleteEventListeners();
    changeStatusCompleted();
  };

  const showTask = () => {
    section.innerHTML = "";
    title_section.innerHTML = "Tasks";
    let task = app.dataLocalStorage();
    task.forEach((item) => {
      let statusCompleted = item.completed ? "Complete: 🟢" : "Incomplete: 🔴";
      if (!item.completed) {
        section.innerHTML += `<article class="task_list">
          <div class="title_and_description">
              <h2>${item.title}</h2>
              <p>${item.description}</p>
              <p class="priori" >Priority: ${item.priority}</p>
              <p class="date" >Date: ${item.date}</p>
          </div>
          <div class="task_actions">
              <b class="status" data-status="${item.title}">${statusCompleted}</b>
              <b class="delete" data-title="${item.title}">Delete ❌</b>
          </div>
          </article>`;
      }
    });
    addDeleteEventListeners();
    changeStatusCompleted();
  };

  const addDeleteEventListeners = () => {
    document.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", (event) => {
        const title = event.target.getAttribute("data-title");
        app.deleteTask(title);
        showTask(); // Actualiza la vista después de eliminar
      });
    });
  };

  const changeStatusCompleted = () => {
    document.querySelectorAll(".status").forEach((button) => {
      button.addEventListener("click", (event) => {
        const state = event.target.getAttribute("data-status");
        let task = app.dataLocalStorage();
        let taskChangeStatus = task.find((item) => item.title == state);
        if (task) {
          taskChangeStatus.changeCompleted();
          localStorage.setItem("listTaskLocalStorage", JSON.stringify(task)); // Guardar el cambio en localStorage
          showTask(); // Actualizar la vista
          showCompletedTask(); // Actualizar la vista de tareas completadas
        }
        showCompletedTask();
        showTask();
      });
    });
  };

  const showAddTask = () => {
    section.innerHTML = "";
    title_section.innerHTML = "Add Tasks";
    section.innerHTML = `
     <article class="cont_form">
        <form action="#" id="form">
          <div class="cont_input">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" required />
          </div>
          <div class="cont_input">
            <label for="description">Description</label>
            <input type="text" name="description" id="description" required />
          </div>
          <div class="cont_input priority_boxs">
            <label for="priority">Priority</label>
            <select name="priority" id="priority" required>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div class="cont_input">
            <label for="date">Date</label>
            <input type="date" name="date" id="date" required />
          </div>
          <button id="btn_save" type="submit">Save</button>
        </form>
      </article>`;

    const form = document.getElementById("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input_title = document.getElementById("title").value;
      const input_description = document.getElementById("description").value;
      const select_priori = document.getElementById("priority").value;
      const input_date = document.getElementById("date").value;

      let newTask = app.CreateTask(
        input_title,
        input_description,
        input_date,
        select_priori
      );
      setTimeout(() => {
        succesSaveTask();
      }, 200);
      app.saveOnLocalStorgage(newTask);
      form.reset();
    });
  };

  const succesSaveTask = () => {
    const h2 = document.createElement("h2");
    h2.innerHTML = "Saving Taks";
    section.prepend(h2);
    setTimeout(() => {
      h2.remove();
    }, 2000);
  };

  return { showCompletedTask, showTask, showAddTask };
})();

const btn_completed = document.getElementById("completed");
const btn_task = document.getElementById("task");
const btn_addTask = document.getElementById("add");

btn_completed.addEventListener("click", appDOM.showCompletedTask);
btn_task.addEventListener("click", appDOM.showTask);
btn_addTask.addEventListener("click", appDOM.showAddTask);
appDOM.showTask();
