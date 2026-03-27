import { seedData } from "./storage.js"; //importa la función seedData desde el módulo storege.js para inicializar los datos en el localstorage
import { login, logout, currentUser, isAdmin } from "./auth.js"; //importa las funciones relacionadas con la autenticación desde el módulo auth.js
import { createUser } from "./users.js"; //importa la función createUser desde el módulo users.js para manejar la creación de usuarios
import { createTask  } from "./tasks.js"; //importa las funciones relacionadas con las tareas desde el módulo tasks.js para manejar la creación, obtención y actualización de tareas
import { validateDates } from "./validators.js"; //importa la función validateDates desde el módulo validators.js para validar las fechas de creación y vencimiento de las tareas
import { renderTasks, renderUserInfo, renderTaskUserOptions } from "./dom.js"; //importa las funciones relacionadas con la manipulación del DOM desde el módulo dom.js para renderizar las tareas, la información del usuario y las opciones de usuario en el formulario de creación de tareas
import { emitEvent, onEvent } from "./events.js"; //importa la función emitEvent desde el módulo events.js para emitir eventos personalizados en la aplicación, aunque en este código no se utiliza directamente, podría ser útil para futuras funcionalidades o para mantener una arquitectura basada en eventos


seedData(); //llama a la función seedData() para inicializar los datos en el localstorage

const loginSection = document.getElementById("login-section"); //obtiene la sección de inicio de sesión del DOM
const appSection = document.getElementById("app-section"); //obtiene la sección de la aplicación principal del DOM
const adminSection = document.getElementById("admin-section"); //obtiene la sección de administración de usuarios del DOM
const loginForm = document.getElementById("login-form"); //obtiene el formulario de inicio de sesión del DOM
const logoutBtn = document.getElementById("logout-btn"); //obtiene el botón de cerrar sesión del DOM
const taskForm = document.getElementById("task-form");  //obtiene el formulario de creación de tareas del DOM
const userForm = document.getElementById("user-form"); //obtiene el formulario de creación de usuarios del DOM

function loadApp() { //función para cargar la aplicación, verifica si hay un usuario autenticado utilizando la función currentUser() del módulo auth.js, si no hay un usuario autenticado muestra la sección de inicio de sesión y oculta las secciones de la aplicación principal y administración, si hay un usuario autenticado muestra la sección de la aplicación principal, oculta la sección de inicio de sesión y muestra u oculta la sección de administración según el rol del usuario, luego renderiza la información del usuario y las tareas correspondientes utilizando las funciones renderUserInfo() y renderTasks() del módulo dom.js
    const user = currentUser();

    if (!user) {
        loginSection.classList.remove("hidden");
        appSection.classList.add("hidden");
        adminSection.classList.add("hidden");
        return;
    }

    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    renderUserInfo(user);
    renderTaskUserOptions(user);
    renderTasks(user);

    if (isAdmin()) {
        adminSection.classList.remove("hidden");
    } else {
        adminSection.classList.add("hidden");
    }
}

    //evento personalizado para volver a renderizar tareas
    onEvent("taskCreated", () => {
        const user = currentUser();
        if (user) {
            renderTasks(user);
        }
    });

    //Login
    loginForm.addEventListener("submit", (e) => { //agrega un evento de envío al formulario de inicio de sesión, al enviar el formulario se previene el comportamiento por defecto, se obtiene el nombre de usuario y la contraseña ingresados, se llama a la función login() del módulo auth.js con las credenciales proporcionadas, si el inicio de sesión es exitoso se carga la aplicación llamando a la función loadApp(), de lo contrario se muestra un mensaje de error en el elemento con id "login-message"
        e.preventDefault();

        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        const result = login(username, password);
        document.getElementById("login-message").textContent = result.message || "";

        if (result.ok) {
            loadApp();  
            loginForm.reset();
        }
    });

    //logout
    logoutBtn.addEventListener("click", () => { //agrega un evento de clic al botón de cerrar sesión, al hacer clic se llama a la función logout() del módulo auth.js para cerrar la sesión y luego se carga la aplicación llamando a la función loadApp() para mostrar la sección de inicio de sesión nuevamente
        logout();
        loadApp();
    });

    //Crear tareas
    taskForm.addEventListener("submit", (e) => { //agrega un evento de envío al formulario de creación de tareas, al enviar el formulario se previene el comportamiento por defecto, se obtiene el título, la fecha de vencimiento, el estado y el usuario asignado para la nueva tarea, se valida que las fechas sean correctas utilizando la función validateDates() del módulo validators.js, si las fechas son válidas se crea un nuevo objeto de tarea con la información proporcionada y se llama a la función createTask() del módulo tasks.js para guardar la nueva tarea en el localstorage, luego se limpia el formulario y se vuelve a renderizar la lista de tareas para mostrar la nueva tarea creada
        e.preventDefault();

        const user = currentUser();
        const titulo = document.getElementById("task-title").value.trim();
        const fechaCreacion = document.getElementById("task-created-at").value;
        const fechaVencimiento = document.getElementById("task-due-date").value;
        const estado = document.getElementById("task-status").value;
        const idUsuario = Number(document.getElementById("task-user").value);

        if (!validateDates(fechaCreacion, fechaVencimiento)) {
            document.getElementById("task-message").textContent = 
            "La fecha de vencimiento no puede ser anterior a la fecha de creación.";
        return;
        }

        createTask({ //creamos un nuevo objeto de tarea con la información proporcionada, el id de la tarea se genera utilizando Date.now() para asegurar que sea único, luego se llama a la función createTask() del módulo tasks.js para guardar la nueva tarea en el localstorage
            id_tarea: Date.now(),
            titulo,
            estado,
            fecha_creacion: fechaCreacion,
            fecha_vencimiento: fechaVencimiento,
            id_usuario: idUsuario
        });

        emitEvent("taskCreated"); //emitimos un evento personalizado "taskCreated" para notificar que se ha creado una nueva tarea, nto, podría ser útil para futuras funcionalidades o para mantener una arquitectura basada en eventos

        document.getElementById("task-message").textContent = "Tarea creada exitosamente.";// emitimos un evento personalizado "taskCreated" para actualizar la interfaz dinámicamente "Tarea creada exitosamente.";
        taskForm.reset();

        if (user) {
            renderTaskUserOptions(user);
        }
    });


        //crear usuarios
        if (userForm) {
            userForm.addEventListener("submit", (e) => { //agrega un evento de envío al formulario de creación de usuarios, al enviar el formulario se previene el comportamiento por defecto, se obtiene el nombre de usuario, la contraseña y el rol para el nuevo usuario, se crea un nuevo objeto de usuario con la información proporcionada y se llama a la función createUser() del módulo users.js para guardar el nuevo usuario en el localstorage, luego se limpia el formulario y se muestra un mensaje indicando si el usuario fue creado exitosamente o si hubo un error (por ejemplo, si el nombre de usuario ya está en uso)
                e.preventDefault(); 

            const username = document.getElementById("new-username").value.trim(); //obtenemos el nombre de usuario ingresado en el formulario de creación de usuarios
            const password = document.getElementById("new-password").value.trim(); //obtenemos la contraseña ingresada en el formulario de creación de usuarios
            const role = document.getElementById("new-role").value;

        const result = createUser({ //creamos un nuevo objeto de usuario con la información proporcionada, el id del usuario se genera utilizando Date.now() para asegurar que sea único, luego se llama a la función createUser() del módulo users.js para guardar el nuevo usuario en el localstorage
            id_usuario: Date.now(),
            nombre_usuario: username,
            contraseña: password,
            rol: role
        });

        document.getElementById("user-message").textContent = result.message || "Usuario Creado Correctamente.";

        if (result.ok) {
            userForm.reset();
            const user = currentUser();
            if (user) {
                renderTaskUserOptions(user);
            }
        }
    });
}

loadApp(); //llama a la función loadApp() para cargar la aplicación al iniciar el script