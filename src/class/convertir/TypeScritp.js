import { Base } from "./Base.js";
import { Form } from "./Form.js";
import { Lienzo } from "./Lienzo.js";
import { Table } from "./Table.js";

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
                    fila[col] = row[i] ?.valor || '';
                });
                return fila;
            });

            tablas.push(`  ${tabla.nombre} = ${JSON.stringify(datosTabla, null, 2)};`);
        });
    }

    const component = `
    import { CommonModule } from '@angular/common';
  import { Component } from '@angular/core';
  import { ReactiveFormsModule } from '@angular/forms';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  
  @Component({
    selector: 'app-${nombreComponente.toLowerCase().replace('component', '')}',
    imports: [CommonModule,ReactiveFormsModule],
    standalone: true,
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


export function generarRoutingTs(nombreComponente = 'HolaComponent'){
    const component = `
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { ${nombreComponente} } from './${nombreComponente.toLowerCase().replace('component', '')}.component';

    const routes: Routes = [
    {path: '', component: ${nombreComponente}}
    ];

    @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule] 
    })
    export class ${nombreComponente.toLowerCase().replace('component', '')}RoutingModule { }


  `;

    return component.trim();
}

export function generarModuleTs(nombreComponente = 'HolaComponent'){
    const component = `
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ${nombreComponente.toLowerCase().replace('component', '')}RoutingModule } from './${nombreComponente.toLowerCase().replace('component', '')}-routing.module';
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';


    @NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ${nombreComponente.toLowerCase().replace('component', '')}RoutingModule,
        FormsModule,
        ReactiveFormsModule
    ]
    })
    export class ${nombreComponente.toLowerCase().replace('component', '')}Module { }
  `;

    return component.trim();
}



export function armarArbolConDatos(nodos, jerarquia) {
    const nodosPorKey = new Map(nodos.map(n => [n.key, n]));

    function construirNodoConHijos(nodoJerarquia) {
        const nodoReal = {...nodosPorKey.get(nodoJerarquia.key) };

        // Si es select y tiene opciones, agregarlas como hijos
        if (nodoReal.type === "select" && Array.isArray(nodoReal.opciones)) {
            nodoReal.children = nodoReal.opciones.map(opcion => ({
                key: opcion, // Clave igual al texto de la opción
                type: "opcion",
                text: opcion
            }));
        }

        // Si tiene hijos normales desde el árbol de jerarquía
        if (nodoJerarquia.children && nodoJerarquia.children.length > 0) {
            if (!nodoReal.children) nodoReal.children = [];

            nodoReal.children.push(
                ...nodoJerarquia.children.map(hijo => construirNodoConHijos(hijo))
            );
        }

        return nodoReal;
    }

    return construirNodoConHijos(jerarquia);
}



export function crearElementoDesdeData(data) {
    switch (data.type) {
        case 'lienzo':
            return new Lienzo(data);
        case 'nav':
            return new Nav(data);
        case 'table':
            return new Table(data);
        case 'list':
            return new List(data);
        case 'form':
            return new Form(data);
        case 'div':
        case 'custom':
            return new Div(data);
        case 'texto':
            return new Texto(data);
        case 'input':
        case 'text':
        case 'email':
        case 'number':
        case 'password':
            return new Input(data);
        case 'button':
            return new Button(data);
        case 'select':
            return new Select(data);
        case 'link':
            return new Link(data);
        default:
            return new Base(data);
    }
}