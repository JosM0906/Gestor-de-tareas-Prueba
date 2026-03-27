import { getTasksByRole, toggleTaskStatus } from "./tasks.js"; //importamos las funciones necesarias del módulo tasks.js para manejar las tareas según el rol del usuario y cambiar el estado de las tareas
import { getUsers } from "./storege.js"; //importamos la función getUsers() del módulo storage.js para obtener la lista de usuarios

export function renderUserInfo(user) { //función para mostrar la información del usuario actualmente autenticado, recibe un objeto user como parámetro, selecciona el elemento con id "current-user-info" y actualiza su contenido con el nombre de usuario y el rol del usuario
    document.getElementById("current-user-info").textContent = `${user.nombre_usuario} (${user.rol})`;
}

export function renderTaskUserOptions(currentUser) {
    const select = document.getElementById("task-user");
    const users = getUsers();

    if (currentUser.rol === "Administrador") {
        select.innerHTML = users.map(u => `<option value="${u.id_usuario}">${u.nombre_usuario}</option>`).join("");
    } else {
        select.innerHTML = `<option value="${currentUser.id_usuario}">${currentUser.nombre_usuario}</option>`;
    }
}

export function renderTasks(currentUser) { //función para mostrar las tareas en la interfaz, recibe un objeto user como parámetro, obtiene las tareas correspondientes al rol del usuario utilizando la función getTasksByRole() del módulo tasks.js, selecciona el elemento con id "tasks-list" y actualiza su contenido con las tareas formateadas en HTML
    const container = document.getElementById("tasks-list");
    const tasks = getTasksByRole(currentUser);

    if (tasks.length === 0) {
        container.innerHTML = "<p>No hay tareas asignadas.</p>";
        return;
    }

    const today = new Date();  //obtenemos la fecha actual para comparar con las fechas de vencimiento de las tareas y determinar si están atrasadas o no

    container.innerHTML = tasks.map(task => { //mapeamos la lista de tareas para generar el HTML de cada tarea, dentro del mapeo se determina la clase CSS a aplicar según el estado de la tarea y si está atrasada o no, luego se devuelve el HTML formateado para cada tarea
        const dueDate = new Date(task.fecha_vencimiento);
        const overdue = task.estado === "Pendiente" && dueDate < today;

        let cssClass = "pending"; //inicialmente asignamos la clase "pending" a todas las tareas, luego si la tarea está completada se cambia a "completed" y si está atrasada se cambia a "overdue"
        if (task.estado === "Completada") {
            cssClass = "completed";
        }
        if (overdue) { //si la tarea está atrasada, se asigna la clase "overdue" para aplicar estilos específicos a las tareas atrasadas
            cssClass = "overdue";
        }
 

        // devolvemos el HTML formateado para cada tarea, incluyendo el título, estado, fecha de creación, fecha de vencimiento y un botón para cambiar el estado de la tarea, el botón tiene un atributo data-id con el id de la tarea para identificarla al hacer clic
        return `
      <article class="task-card ${cssClass}">
        <h4>${task.titulo}</h4>
        <p><strong>Estado:</strong> ${task.estado}</p>
        <p><strong>Creación:</strong> ${task.fecha_creacion}</p>
        <p><strong>Vencimiento:</strong> ${task.fecha_vencimiento}</p>
        <button class="toggle-btn" data-id="${task.id_tarea}">
          Cambiar estado
        </button>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".toggle-btn").forEach(button => { //seleccionamos todos los botones con la clase "toggle-btn" y les agregamos un evento de clic, al hacer clic en el botón se llama a la función toggleTaskStatus() del módulo tasks.js pasando el id de la tarea (obtenido del atributo data-id del botón) y luego se vuelve a renderizar la lista de tareas para reflejar el cambio de estado
    button.addEventListener("click", () => {
      toggleTaskStatus(Number(button.dataset.id));
      renderTasks(currentUser);
    });
  });
}

