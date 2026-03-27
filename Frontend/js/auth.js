import { getUsers, saveSession, clearSession, getSession } from "./storage.js"; //importamos las funciones necesarias del módulo storage.js para manejar los usuarios y la sesión

export function login(username, password) { //función para iniciar sesión, recibe el nombre de usuario y la contraseña como parámetros
  const users = getUsers(); //obtenemos la lista de usuarios del localstorage utilizando la función getUsers() del módulo storage.js
  const user = users.find( 
    u => u.nombre_usuario === username && u.contraseña === password
  );

  if (!user) { //si no se encuentra un usuario que coincida con el nombre de usuario y la contraseña proporcionados, se devuelve un objeto con ok: false y un mensaje de error
    return { ok: false, message: "Credenciales inválidas." };
  }

  saveSession(user); //si se encuentra un usuario válido, se guarda la sesión utilizando la función saveSession() del módulo storage.js y se devuelve un objeto con ok: true, el usuario y un mensaje de éxito
  return { ok: true, user, message: "Inicio de sesión exitoso." };
}

export function logout() { //función para cerrar sesión, simplemente llama a la función clearSession() del módulo storage.js para eliminar la sesión almacenada en el localstorage
  clearSession();
}

export function currentUser() { //función para obtener el usuario actualmente autenticado, devuelve la sesión actual utilizando la función getSession() del módulo storage.js, si no hay sesión devuelve null
  return getSession();
}

export function isAdmin() { //función para verificar si el usuario actualmente autenticado tiene el rol de "Administrador", obtiene la sesión actual utilizando la función getSession() del módulo storage.js y verifica si el rol del usuario es "Administrador", devuelve true si es así, de lo contrario devuelve false
  const user = getSession();
  return user?.rol === "Administrador";
}