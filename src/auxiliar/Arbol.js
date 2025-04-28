export const agregarNodoAlArbol = (arbol, nodoPadreKey, nuevoNodo) => {
    // Si el árbol aún no existe, creamos el nodo raíz
    if (!arbol.value) {
        arbol.value = nuevoNodo;
        return true;
    }

    // Función recursiva para buscar el nodo padre y agregar el hijo
    const insertarComoHijo = (nodo) => {
        if (nodo.key === nodoPadreKey) {
            nodo.children.push(nuevoNodo);
            return true;
        }

        for (let child of nodo.children) {
            if (insertarComoHijo(child)) return true;
        }

        return false;
    };

    return insertarComoHijo(arbol.value);
};

export const eliminarNodoDelArbol = (arbol, keyAEliminar) => {
    if (!arbol.value) return false;

    // Caso especial: si el nodo a eliminar es la raíz
    if (arbol.value.key === keyAEliminar) {
        arbol.value = null;
        return true;
    }

    // Función recursiva para buscar y eliminar
    const eliminarRecursivo = (nodo) => {
        nodo.children = nodo.children.filter(child => {
            if (child.key === keyAEliminar) {
                return false; // lo eliminamos
            } else {
                eliminarRecursivo(child); // seguimos buscando
                return true;
            }
        });
    };

    eliminarRecursivo(arbol.value);
    return true;
};