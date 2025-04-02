import * as go from "gojs";

export class DiagramManager {
    constructor(diagramContainer) {
        this.diagram = null;
        this.nodeTemplates = this.getNodeTemplates();
        this.initialize(diagramContainer);

        this.diagram.addDiagramListener("ChangedSelection", (e) => {
            const selectedNode = this.diagram.selection.first(); // Obtiene el primer nodo seleccionado
            if (selectedNode instanceof go.Node) {
                console.log("Nodo seleccionado:", selectedNode.data);
            } else {
                console.log("No hay nodo seleccionado");
            }
        });

    }

    // Métodos privados
    getNodeTemplates() {
        return {
            default: new go.Node("Auto").add(
                new go.Shape("RoundedRectangle", { fill: "white" }),
                new go.TextBlock({ margin: 5 }, new go.Binding("text", "text"))
            ),

            // para texto
            text: new go.Node("Auto", {
                layerName: "Foreground", // Para que el texto siempre esté arriba
                selectable: true, // Permitir seleccionar y editar
                resizable: true, // Permitir redimensionar
                resizeObjectName: "TEXT" // El objeto a redimensionar es el texto
            }).add(
                new go.TextBlock({
                    margin: 5,
                    name: "TEXT",
                    font: "bold 12pt sans-serif", // Valor por defecto
                    editable: true // Permite edición directa
                })
                .bind("text", "text") // Vincular el texto
                .bind("font", "fontSize", (size) => `bold ${size || 12}pt sans-serif`) // Tamaño dinámico
                .bind("stroke", "textColor")
            ),

            //custom
            custom: new go.Node('Spot', {
                    resizable: true,
                    selectable: true,
                    resizeObjectName: 'mainShape',
                    locationSpot: new go.Spot(0, 0, 30 / 2, 30 / 2) // Ajusta la posición según el tamaño de la celda
                })
                .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape({
                        stroke: 'gray',
                        name: 'mainShape',
                        opacity: 0.7,
                        minSize: new go.Size(30, 30), // Ajusta el tamaño mínimo
                        desiredSize: new go.Size(30, 30) // Ajusta el tamaño deseado
                    })
                    .bind('fill', 'color')
                    .bindTwoWay('desiredSize', 'size', go.Size.parse, go.Size.stringify),
                    new go.TextBlock({
                        font: 'italic 11pt Verdana'
                    }).bind('text', 'label')
                )
        };
    }

    // Inicializa el diagrama
    initialize(diagramContainer) {
        const $ = go.GraphObject.make;
        this.diagram = $(go.Diagram, diagramContainer, {
            // contentAlignment: go.Spot.Center, // Centra el contenido en el diagrama

            'animationManager.isEnabled': false, // Desactiva las animaciones
            'undoManager.isEnabled': true, // Habilita el deshacer/rehacer
            // 'draggingTool.dragsLink': true, // Permite arrastrar los enlaces
            // 'relinkingTool.isUnconnectedLinkValid': true, // Los enlaces pueden ser creados sin estar conectados
            // 'linkingTool.isUnconnectedLinkValid': true, // Enlaces pueden estar sin conectar
            'draggingTool.isGridSnapEnabled': true, // Ajuste a la rejilla al arrastrar
            'draggingTool.gridSnapCellSpot': go.Spot.Center, // Ajuste al centro de la celda
            'resizingTool.isGridSnapEnabled': true, // Ajuste a la rejilla al redimensionar
            grid: $(go.Panel, "Grid", // Especificamos que la rejilla es de tipo "Grid"
                {
                    gridCellSize: new go.Size(20, 20), // Tamaño de las celdas
                    visible: true
                },
                $(go.Shape, "LineH", { strokeWidth: 0.5, stroke: "lightgray" }), // Líneas horizontales
                $(go.Shape, "LineV", { strokeWidth: 0.5, stroke: "lightgray" }) // Líneas verticales
            ),
        });
        // Configuración de la plantilla de nodos
        this.diagram.nodeTemplateMap.add("default", this.nodeTemplates.default);
        this.diagram.nodeTemplateMap.add("custom", this.nodeTemplates.custom);
        this.diagram.nodeTemplateMap.add("text", this.nodeTemplates.text);
        this.diagram.model = new go.GraphLinksModel([], []);


    }

    addNodeToDiagram(type, position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add node");

        // Create the node data based on type
        const nodeData = {
            key: model.nodeDataArray.length + 1,
            category: "custom",
            loc: `${position.x} ${position.y}`,
            color: "lightblue", // Default color
            size: "80 30", // Size as string for custom node
            label: "" // Label for custom node
        };

        model.addNodeData(nodeData);

        console.log(nodeData);
        model.commitTransaction("add node");
    }

    addTextNode(position = { x: 0, y: 0 }, text = "Nuevo Texto") {
        const model = this.diagram.model;
        model.startTransaction("add text");

        const textNode = {
            key: model.nodeDataArray.length + 1,
            category: "text", // Usa la nueva plantilla de texto
            loc: `${position.x} ${position.y}`,
            text: text
        };

        model.addNodeData(textNode);
        console.log("Texto agregado:", textNode);

        model.commitTransaction("add text");
    }


    deleteSelectedNode() {
        const model = this.diagram.model;
        const selectedNode = this.diagram.selection.first(); // Obtener el nodo seleccionado

        if (selectedNode instanceof go.Node) {
            model.startTransaction("delete node");
            model.removeNodeData(selectedNode.data); // Eliminar el nodo del modelo
            model.commitTransaction("delete node");

            console.log("Nodo eliminado:", selectedNode.data);
        } else {
            console.log("No hay nodo seleccionado para eliminar");
        }
    }

    changeNodeColor(newColor) {
        const model = this.diagram.model;
        const selectedNode = this.diagram.selection.first(); // Obtener el nodo seleccionado

        if (selectedNode instanceof go.Node) {
            model.startTransaction("change color");
            model.setDataProperty(selectedNode.data, "color", newColor); // Cambiar el color
            model.commitTransaction("change color");

            console.log("Color cambiado a:", newColor);
        } else {
            console.log("No hay nodo seleccionado para cambiar el color");
        }
    }

    changeNodeTextFontZise(size = 20) {
        const model = this.diagram.model;
        const selectedNode = this.diagram.selection.first();

        if (selectedNode instanceof go.Node) {
            model.startTransaction("change text style");
            model.setDataProperty(selectedNode.data, "fontSize", size); // Cambiar el color
            model.commitTransaction("change text style");

            console.log("zise cambiado a:", size);
        } else {
            console.log("No hay nodo seleccionado para cambiar el size");
        }
    }

    changeNodeTextFontColor(color) {
        const model = this.diagram.model;
        const selectedNode = this.diagram.selection.first();

        if (selectedNode instanceof go.Node) {
            model.startTransaction("change text style");
            model.setDataProperty(selectedNode.data, "textColor", color); // Cambiar el color
            model.commitTransaction("change text style");

            console.log("zise cambiado a:", color);
        } else {
            console.log("No hay nodo seleccionado para cambiar el color");
        }

    }

    //para saber que nodo seleccione
    getSelectedNode() {
            const selectedNode = this.diagram.selection.first(); // Obtener el primer nodo seleccionado
            if (selectedNode instanceof go.Node) {
                return selectedNode; // Devuelve el nodo si es de tipo go.Node
            } else {
                console.log("No hay nodo seleccionado");
                return null; // Retorna null si no hay ningún nodo seleccionado
            }
        }
        // Limpia el diagrama principal
    clearDiagram() {
        this.diagram.model.nodeDataArray = [];
        this.diagram.model.linkDataArray = [];
    }
}