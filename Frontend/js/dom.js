import { getFilteredTasks, toggleTaskStatus } from "./tasks.js"; //importamos las funciones necesarias del módulo tasks.js para manejar las tareas según el rol del usuario y cambiar el estado de las tareas
import { getUsers } from "./storage.js"; //importamos la función getUsers() del módulo storage.js para obtener la lista de usuarios


export function renderUserInfo(user) { //función para mostrar la información del usuario actualmente autenticado, recibe un objeto user como parámetro, selecciona el elemento con id "current-user-info" y actualiza su contenido con el nombre de usuario y el rol del usuario
    document.getElementById("current-user-info").textContent = `${user.nombre_usuario} (${user.rol})`;
}

export function renderTaskUserOptions(currentUser) {  //función para mostrar las opciones de usuario en el formulario de creación de tareas, recibe un objeto currentUser como parámetro, selecciona el elemento con id "task-user" y obtiene la lista de usuarios utilizando la función getUsers() del módulo storage.js, si el rol del usuario es "Administrador" muestra una opción para cada usuario en la lista, de lo contrario muestra solo la opción del usuario actualmente autenticado
    const select = document.getElementById("task-user");
    const users = getUsers();

    if (currentUser.rol === "Administrador") { //si el rol del usuario es "Administrador", se muestra una opción para cada usuario en la lista, utilizando el método map() del array para crear una cadena de opciones HTML y luego se asigna al contenido del elemento select
        select.innerHTML = users.map(u => `<option value="${u.id_usuario}">${u.nombre_usuario}</option>`).join("");
    } else {
        select.innerHTML = `<option value="${currentUser.id_usuario}">${currentUser.nombre_usuario}</option>`;
    }
}

export function renderFilterUserOptions() { //función para mostrar las opciones de usuario en el filtro de tareas, selecciona el elemento con id "filter-user" y obtiene la lista de usuarios utilizando la función getUsers() del módulo storage.js, si el elemento existe muestra una opción para cada usuario en la lista además de una opción "Todos", utilizando el método map() del array para crear una cadena de opciones HTML y luego se asigna al contenido del elemento select
    const filterUser = document.getElementById("filter-user");
    const users = getUsers();

    if (!filterUser) return;
    //si el elemento existe, se muestra una opción para cada usuario en la lista además de una opción "Todos", utilizando el método map() del array para crear una cadena de opciones HTML y luego se asigna al contenido del elemento select
    filterUser.innerHTML = ` 
        <option value="all">Todos</option>
        ${users.map(user => `<option value="${user.id_usuario}">${user.nombre_usuario}</option>`).join("")}
    `;
}

export function renderTasks(currentUser) { //función para mostrar las tareas correspondientes al usuario actualmente autenticado, recibe un objeto currentUser como parámetro, selecciona el elemento con id "task-list" y los elementos de filtro de usuario y estado, crea un objeto filters con los valores seleccionados en los filtros, obtiene la lista de tareas filtradas utilizando la función getFilteredTasks() del módulo tasks.js con el usuario actual y los filtros aplicados, si no hay tareas muestra un mensaje indicando que no hay tareas asignadas, de lo contrario genera el HTML para cada tarea utilizando el método map() del array y asigna el contenido al elemento container, luego agrega un evento de clic a cada botón de cambio de estado para llamar a la función toggleTaskStatus() del módulo tasks.js con el id de la tarea correspondiente y volver a renderizar las tareas
    const container = document.getElementById("task-list");

    const filterUser = document.getElementById("filter-user");
    const filterStatus = document.getElementById("filter-status");

    const filters = {
        userId: filterUser ? filterUser.value : "all",
        status: filterStatus ? filterStatus.value : "all"
    };

    const tasks = getFilteredTasks(currentUser, filters);

    if (tasks.length === 0) {
        container.innerHTML = "<p>No hay tareas asignadas.</p>";
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    container.innerHTML = tasks.map(task => {
        const dueDate = new Date(task.fecha_vencimiento);
        dueDate.setHours(0, 0, 0, 0);

        const overdue = task.estado === "Pendiente" && dueDate < today;

        let cssClass = "pending";
        if (task.estado === "Completada") {
            cssClass = "completed";
        }
        if (overdue) {
            cssClass = "overdue";
        }

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

    document.querySelectorAll(".toggle-btn").forEach(button => {
        button.addEventListener("click", () => {
            toggleTaskStatus(Number(button.dataset.id));
            renderTasks(currentUser);
        });
    });
}

