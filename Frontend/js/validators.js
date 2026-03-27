export function validateRequire(value) { //función para validar que un campo no esté vacío, recibe el valor del campo como parámetro y devuelve true si el valor no es una cadena vacía después de eliminar los espacios en blanco, de lo contrario devuelve false
    return value && value.trim() !== "";
}

export function validateDates(createdAt, dueDate) { //función para validar que la fecha de creación no sea posterior a la fecha de vencimiento, recibe las fechas de creación y vencimiento como parámetros y devuelve true si la fecha de creación es menor o igual a la fecha de vencimiento, de lo contrario devuelve false
    return new Date(createdAt) <= new Date(dueDate);
}