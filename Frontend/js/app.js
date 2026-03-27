import { seedData } from "./storege.js"; //importa la función seedData desde el módulo storege.js para inicializar los datos en el localstorage
import { login, logout, currentUser, isAdmin } from "./auth.js"; //importa las funciones relacionadas con la autenticación desde el módulo auth.js
import { createUser } from "./users.js"; //importa la función createUser desde el módulo users.js para manejar la creación de usuarios
import { createTask  } from "./tasks.js"; //importa las funciones relacionadas con las tareas desde el módulo tasks.js para manejar la creación, obtención y actualización de tareas
import { validateDates } from "./validators.js"; //importa la función validateDates desde el módulo validators.js para validar las fechas de creación y vencimiento de las tareas
import { renderTasks, renderUserInfo, renderTaskUserOptions } from "./dom.js"; //importa las funciones relacionadas con la manipulación del DOM desde el módulo dom.js para renderizar las tareas, la información del usuario y las opciones de usuario en el formulario de creación de tareas


seedData(); //llama a la función seedData() para inicializar los datos en el localstorage

const loginSection = document.getElementById("login-section"); //obtiene la sección de inicio de sesión del DOM
const appSection = document.getElementById("app-section"); //obtiene la sección de la aplicación principal del DOM
const adminSection = document.getElementById("admin-section"); //obtiene la sección de administración de usuarios del DOM

function loadApp() { //función para cargar la aplicación, verifica si hay un usuario autenticado utilizando la función currentUser() del módulo auth.js, si no hay un usuario autenticado muestra la sección de inicio de sesión y oculta las secciones de la aplicación principal y administración, si hay un usuario autenticado muestra la sección de la aplicación principal, oculta la sección de inicio de sesión y muestra u oculta la sección de administración según el rol del usuario, luego renderiza la información del usuario y las tareas correspondientes utilizando las funciones renderUserInfo() y renderTasks() del módulo dom.js
    const user = currentUser();

    if (!user) {
        loginSection.classList.remove("hidden");
        appSection.classList.add("hidden");
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

    document.getElementById("login-form").addEventListener("submit", (e) => { //agrega un evento de envío al formulario de inicio de sesión, al enviar el formulario se previene el comportamiento por defecto, se obtiene el nombre de usuario y la contraseña ingresados, se llama a la función login() del módulo auth.js con las credenciales proporcionadas, si el inicio de sesión es exitoso se carga la aplicación llamando a la función loadApp(), de lo contrario se muestra un mensaje de error en el elemento con id "login-message"
        e.preventDefault();

        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        const result = login(username, password);
        document.getElementById("login-message").textContent = result.message || "";

        if (result.ok) {
            loadApp();  
        }
    });

    document.getElementById("logout-btn").addEventListener("click", () => { //agrega un evento de clic al botón de cerrar sesión, al hacer clic se llama a la función logout() del módulo auth.js para cerrar la sesión y luego se carga la aplicación llamando a la función loadApp() para mostrar la sección de inicio de sesión nuevamente
        logout();
        loadApp();
    });

    document.getElementById("task-form").addEventListener("submit", (e) => { //agrega un evento de envío al formulario de creación de tareas, al enviar el formulario se previene el comportamiento por defecto, se obtiene el título, la fecha de vencimiento, el estado y el usuario asignado para la nueva tarea, se valida que las fechas sean correctas utilizando la función validateDates() del módulo validators.js, si las fechas son válidas se crea un nuevo objeto de tarea con la información proporcionada y se llama a la función createTask() del módulo tasks.js para guardar la nueva tarea en el localstorage, luego se limpia el formulario y se vuelve a renderizar la lista de tareas para mostrar la nueva tarea creada
        e.preventDefault();

        const user = currentUser();
        const titulo = document.getElementById("task-title").value;
        const fechaCreacion = document.getElementById("task-title").value;
        const fechaVencimiento = document.getElementById("task-due-date").value;
        const estado = document.getElementById("task-status").value;
        const idUsuario = Number(document.getElementById("task-user").value);

        if (!validateDates(fechaCreacion, fechaVencimiento)) {
            document.getElementById("task-message").textContent = 
            "La fecha de vencimiento no puede ser anterior a la fecha de creación.";
        return;
        }

        createTask({
            id_tarea: Date.now(),
            titulo,
            estado,
            fecha_creacion: fechaCreacion,
            fecha_vencimiento: fechaVencimiento,
            idUsuario: idUsuario
        });

        document.getElementById("task-message").textContent = "Tarea creada exitosamente.";
        e.target.reset();
        renderTaskUserOptions(user);
        renderTasks(user);
    });

    document.getElementById("user-form").addEventListener("submit", (e) => { //agrega un evento de envío al formulario de creación de usuarios, al enviar el formulario se previene el comportamiento por defecto, se obtiene el nombre de usuario, la contraseña y el rol para el nuevo usuario, se crea un nuevo objeto de usuario con la información proporcionada y se llama a la función createUser() del módulo users.js para guardar el nuevo usuario en el localstorage, luego se limpia el formulario y se muestra un mensaje indicando si el usuario fue creado exitosamente o si hubo un error (por ejemplo, si el nombre de usuario ya está en uso)
        e.preventDefault();

        const username = document.getElementById("new-username").value;
        const password = document.getElementById("new-password").value;
        const role = document.getElementById("new-role").value;

        const result = createUser({
            id_usuario: Date.now(),
            nombre_usuario: username,
            contrasena: password,
            rol: role
        });

        document.getElementById("user-message").textContent = result.message || "Usuario Creado Correctamente.";

        if (result.ok) {
            e.target.reset();
            renderTaskUserOptions(currentUser());
        }
    });


    loadApp(); //llama a la función loadApp() para cargar la aplicación al iniciar el script





}