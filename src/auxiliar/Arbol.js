export const agregarNodoAlArbol = (arbol, nodoPadreKey, nuevoNodo) => {
    if (!arbol.value) {
        arbol.value = nuevoNodo;
        return true;
    }
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
    if (arbol.value.key === keyAEliminar) {
        arbol.value = null;
        return true;
    }

    const eliminarRecursivo = (nodo) => {
        nodo.children = nodo.children.filter(child => {
            if (child.key === keyAEliminar) {
                return false;
            } else {
                eliminarRecursivo(child);
                return true;
            }
        });
    };

    eliminarRecursivo(arbol.value);
    return true;
};