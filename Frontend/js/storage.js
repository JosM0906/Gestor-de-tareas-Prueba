const USERS_KEYS = "usuarios"; //constante donde se guardaran los usuarios en locastorage
const TASKS_KEYS = "tareas"; //constante donde se guardaran las tareas en locastorage
const SESSION_KEY = "sesion"; //constante donde se guardara la sesion en locastorage

export function getUsers() { //fucion para obtener los usuarios del localstorage, si no hay usuarios devuelve un array vacio
    return JSON.parse(localStorage.getItem(USERS_KEYS)) || [];
}

export function saveUsers(users) { //funcion para guardar un nuevo usuario en el localstorage, recibe un objeto user como parametro
    localStorage.setItem(USERS_KEYS, JSON.stringify(users));
}

export function getTasks() { //funcion para obtener las tareas del localstorage, si no hay tareas devuelve un array vacio
    return JSON.parse(localStorage.getItem(TASKS_KEYS)) || [];
}

export function saveTasks(tasks) { //funcion para guardar una nueva tarea en el localstorage, recibe un objeto task como parametro
    localStorage.setItem(TASKS_KEYS, JSON.stringify(tasks));
}

export function getSession() { //funcion para obtener la sesion del localstorage, si no hay sesion devuelve null
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

export function saveSession(user) { //funcion para guardar la sesion en el localstorage, recibe un objeto user como parametro
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() { //funcion para eliminar la sesion del localstorage
    localStorage.removeItem(SESSION_KEY);
}

export function seedData() { //funcion para inicializar los datos en el localstorage, si no hay usuarios ni tareas, se crean algunos por defecto
    if (!localStorage.getItem(USERS_KEYS)) { 
        saveUsers([
            {id_usuario: 1, nombre_usuario: "admin", contraseña: "Admin123", rol: "Administrador"},
            {id_usuario: 2, nombre_usuario: "josmary", contraseña: "Josmary123", rol: "Usuario"},
            {id_usuario: 3, nombre_usuario: "fernando", contraseña: "Fernando123", rol: "Usuario"}
        ]);
    }

if (!localStorage.getItem(TASKS_KEYS)) { //si no hay tareas, se crean algunas por defecto
    saveTasks([
        { id_tarea: 1, titulo: "Revisar requerimientos", estado: "Pendiente", fecha_creacion: "2026-03-20", fecha_vencimiento: "2026-03-28", id_usuario: 2 },
        { id_tarea: 2, titulo: "Diseñar esquema relacional", estado: "Completada", fecha_creacion: "2026-03-18", fecha_vencimiento: "2026-03-22", id_usuario: 2 },
        { id_tarea: 3, titulo: "Implementar login", estado: "Pendiente", fecha_creacion: "2026-03-21", fecha_vencimiento: "2026-03-27", id_usuario: 3 },
        { id_tarea: 4, titulo: "Corregir validaciones", estado: "Completada", fecha_creacion: "2026-03-19", fecha_vencimiento: "2026-03-24", id_usuario: 3 },
        { id_tarea: 5, titulo: "Probar tareas vencidas", estado: "Pendiente", fecha_creacion: "2026-03-15", fecha_vencimiento: "2026-03-17", id_usuario: 2 }
            
    ]);
}
}