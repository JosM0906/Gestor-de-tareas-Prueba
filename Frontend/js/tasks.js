import { getTasks, saveTasks } from "./storage.js"; //importamos las funciones necesarias del módulo storage.js para manejar las tareas en el localstorage

export function createTask(task) { //función para crear una nueva tarea, recibe un objeto task como parámetro, obtiene la lista de tareas actual del localstorage utilizando la función getTasks() del módulo storage.js, agrega la nueva tarea a la lista y luego guarda la lista actualizada en el localstorage utilizando la función saveTasks() del módulo storage.js
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function getTasksByRole(user) { //función para obtener las tareas según el rol del usuario, recibe un objeto user como parámetro, obtiene la lista de tareas actual del localstorage utilizando la función getTasks() del módulo storage.js, si el rol del usuario es "Administrador" devuelve todas las tareas, de lo contrario devuelve solo las tareas que pertenecen al usuario (filtrando por id_usuario)
  const tasks = getTasks();
  if (user.rol === "Administrador") return tasks;
  return tasks.filter(task => task.id_usuario === user.id_usuario);
}

export function getFilteredTasks(user, filters = {}) { //función para obtener las tareas filtradas según el rol del usuario y los filtros aplicados, recibe un objeto user y un objeto filters como parámetros, obtiene la lista de tareas correspondiente al rol del usuario utilizando la función getTasksByRole() del módulo tasks.js, luego aplica los filtros de usuario y estado si están presentes en el objeto filters, devolviendo la lista de tareas filtrada
  let tasks = getTasksByRole(user);

  if (filters.userId && filters.userId !== "all") { //si el filtro de usuario está presente y no es "all", se filtran las tareas para mostrar solo las que pertenecen al usuario seleccionado, comparando el id_usuario de cada tarea con el userId del filtro
    tasks = tasks.filter(task => task.id_usuario === Number(filters.userId));
  }

  if (filters.status && filters.status !== "all") { //si el filtro de estado está presente y no es "all", se filtran las tareas para mostrar solo las que tienen el estado seleccionado, comparando el estado de cada tarea con el status del filtro
    tasks = tasks.filter(task => task.estado === filters.status);
  }

  return tasks;
}

export function toggleTaskStatus(taskId) { //función para cambiar el estado de una tarea, recibe el id de la tarea como parámetro, obtiene la lista de tareas actual del localstorage utilizando la función getTasks() del módulo storage.js, mapea la lista de tareas para encontrar la tarea con el id correspondiente y cambia su estado de "Pendiente" a "Completada" o viceversa, luego guarda la lista actualizada en el localstorage utilizando la función saveTasks() del módulo storage.js
  const tasks = getTasks();
  const updated = tasks.map(task =>
    task.id_tarea === taskId
      ? { ...task, estado: task.estado === "Pendiente" ? "Completada" : "Pendiente" }
      : task
  );
  saveTasks(updated); //guardamos la lista actualizada en el localstorage utilizando la función saveTasks() del módulo storage.js
}