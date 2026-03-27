export function emitEvent(name, detail = {}) { //función para emitir eventos personalizados, recibe el nombre del evento y un objeto de detalles opcional como parámetros, crea un nuevo evento personalizado utilizando el constructor CustomEvent con el nombre y los detalles proporcionados, y luego lo despacha en el documento utilizando el método dispatchEvent()
    document.dispatchEvent(new CustomEvent(name, { detail }));
}

export function onEvent(name, callback) { //función para escuchar eventos personalizados, recibe el nombre del evento y una función de callback como parámetros, agrega un event listener al documento utilizando el método addEventListener() que escucha el evento con el nombre proporcionado y ejecuta la función de callback cuando se dispara el evento
    document.addEventListener(name, (e) => callback(e.detail));
}