import {getUsers, saveUsers} from "./storage.js"; //importamos las funciones necesarias del módulo storage.js para manejar los usuarios

export function createUser(user) { //función para crear un nuevo usuario, recibe un objeto user como parámetro, obtiene la lista de usuarios actual del localstorage utilizando la función getUsers() del módulo storage.js, agrega el nuevo usuario a la lista y luego guarda la lista actualizada en el localstorage utilizando la función saveUsers() del módulo storage.js
    const users = getUsers();

    const exists = users.some(u => u.nombre_usuario === user.nombre_usuario); //verificamos si ya existe un usuario con el mismo nombre de usuario utilizando el método some() del array, que devuelve true si al menos un elemento del array cumple con la condición especificada
    if (exists) { //si ya existe un usuario con el mismo nombre de usuario, se devuelve un objeto con ok: false y un mensaje de error
        return { ok: false, message: "El nombre de usuario ya está en uso." };
    }

    users.push(user);
    saveUsers(users);
    return { ok: true, message: "Usuario creado exitosamente." }; //si el usuario se crea correctamente, se devuelve un objeto con ok: true y un mensaje de éxito
}