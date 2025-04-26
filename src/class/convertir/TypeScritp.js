export function extraerNodosAngular(arbol) {
    const inputs = [];
    const listas = [];
    const tablas = [];

    function recorrer(nodo) {
        if (!nodo || typeof nodo !== 'object') return;

        const tipo = nodo.type;

        // Detectar Inputs (input, password, email, number, select, submit)
        if (['input', 'text', 'password', 'email', 'number', 'select', 'submit'].includes(tipo)) {
            inputs.push({
                key: nodo.key,
                tipo: tipo,
                nombre: nodo.text || `input_${nodo.key}`,
                opciones: nodo.opciones || []
            });
        }

        if (tipo === 'list') {
            const valores = [];
            if (Array.isArray(nodo.children)) {
                nodo.children.forEach(child => {
                    valores.push(child.text || `item_${child.key}`);
                });
            }

            listas.push({
                key: nodo.key,
                nombre: nodo.text || `list_${nodo.key}`,
                valores: valores
            });
        }


        if (tipo === 'table') {
            const columnas = [];
            const filasAgrupadas = {};

            if (Array.isArray(nodo.children)) {
                nodo.children.forEach(child => {
                    // Obtener posición vertical Y
                    const locParts = (child.loc || '0 0').split(' ');
                    const y = parseInt(locParts[1], 10);

                    // Detectar títulos (columnas)
                    if (child.type === 'title') {
                        columnas.push(child.text || `col_${child.key}`);
                    }
                    // Agrupar por fila
                    else if (child.type === 'body' || child.type === 'button') {
                        // Agrupar por Y (con redondeo para filas similares)
                        const filaY = Math.round(y / 10) * 10;
                        if (!filasAgrupadas[filaY]) filasAgrupadas[filaY] = [];

                        filasAgrupadas[filaY].push({
                            tipo: child.type,
                            valor: child.text || `val_${child.key}`
                        });
                    }
                });
            }

            const datos = Object.values(filasAgrupadas);

            tablas.push({
                key: nodo.key,
                nombre: nodo.text || `tabla_${nodo.key}`,
                columnas,
                datos
            });
        }


        // Recorrer hijos si existen
        if (Array.isArray(nodo.children)) {
            nodo.children.forEach(recorrer);
        }
    }

    recorrer(arbol);

    return { inputs, listas, tablas };
}


export function generarComponentTs(data, nombreComponente = 'HolaComponent') {
    const formControls = [];
    const listas = [];
    const tablas = [];
    const variablesExtra = [];

    // Inputs
    if (data.inputs && data.inputs.length) {
        data.inputs.forEach(input => {
            if (input.tipo !== 'submit') {
                const validador = input.tipo === 'email' ? 'Validators.email' : 'Validators.required';
                formControls.push(`      ${input.nombre}: ['', ${validador}]`);
            }

            if (input.tipo === 'select' && input.opciones.length) {
                variablesExtra.push(`  ${input.nombre}_opciones = ${JSON.stringify(input.opciones)};`);
            }
        });
    }

    // Listas
    if (data.listas && data.listas.length) {
        data.listas.forEach(lista => {
            listas.push(`  ${lista.nombre} = ${JSON.stringify(lista.valores)};`);
        });
    }

    // Tablas
    if (data.tablas && data.tablas.length) {
        data.tablas.forEach(tabla => {
            const datosTabla = tabla.datos.map(row => {
                const fila = {};
                tabla.columnas.forEach((col, i) => {
                    fila[col] = row[i]?.valor || ''; 
                });
                return fila;
            });
    
            tablas.push(`  ${tabla.nombre} = ${JSON.stringify(datosTabla, null, 2)};`);
        });

        console.log('------------------->',tablas);
        
    }

    const component = `
  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  
  @Component({
    selector: 'app-${nombreComponente.toLowerCase().replace('component', '')}',
    templateUrl: './${nombreComponente.toLowerCase().replace('component', '')}.component.html',
    styleUrls: ['./${nombreComponente.toLowerCase().replace('component', '')}.component.css']
  })
  export class ${nombreComponente} {
    formulario: FormGroup;
  
  ${variablesExtra.join('\n')}
  ${tablas.join('\n')}
  ${listas.join('\n')}
  
    constructor(private fb: FormBuilder) {
      this.formulario = this.fb.group({
  ${formControls.join(',\n')}
      });
    }
  
    enviarFormulario() {
      if (this.formulario.valid) {
        console.log('Datos del formulario:', this.formulario.value);
      } else {
        console.log('Formulario inválido');
      }
    }
  
    editarElemento(elemento: any) {
      this.formulario.patchValue(elemento);
    }
  }
  `;

    return component.trim();
}