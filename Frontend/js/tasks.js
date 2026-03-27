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

export function toggleTaskStatus(taskId) { //función para cambiar el estado de una tarea, recibe el id de la tarea como parámetro, obtiene la lista de tareas actual del localstorage utilizando la función getTasks() del módulo storage.js, mapea la lista de tareas para encontrar la tarea con el id correspondiente y cambia su estado de "Pendiente" a "Completada" o viceversa, luego guarda la lista actualizada en el localstorage utilizando la función saveTasks() del módulo storage.js
  const tasks = getTasks();
  const updated = tasks.map(task =>
    task.id_tarea === taskId
      ? { ...task, estado: task.estado === "Pendiente" ? "Completada" : "Pendiente" }
      : task
  );
  saveTasks(updated); //guardamos la lista actualizada en el localstorage utilizando la función saveTasks() del módulo storage.js
}