import * as go from "gojs";

export class DiagramManager {
    constructor(diagramContainer, onNodeSelectedCallback) {
        this.diagram = null;
        this.nodeTemplates = this.getNodeTemplates();
        this.initialize(diagramContainer);

        this.diagram.addDiagramListener("ChangedSelection", (e) => {
            const selectedNode = this.diagram.selection.first(); // Obtiene el primer nodo seleccionado
            if (selectedNode instanceof go.Node) {
                console.log("Nodo seleccionado:", selectedNode.data);
                if (typeof onNodeSelectedCallback === 'function') {
                    onNodeSelectedCallback(selectedNode.data);
                }
            } else {
                if (typeof onNodeSelectedCallback === 'function') {
                    onNodeSelectedCallback(null);
                }
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

                })
                .bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
                .add(
                    new go.TextBlock({
                        margin: 5,
                        name: "TEXT",
                        font: "bold 12pt sans-serif", // Valor por defecto
                        editable: true // Permite edición directa
                    })
                    .bindTwoWay("text", "text")
                    .bind("font", "fontSize", (size) => `bold ${size || 12}pt sans-serif`) // Tamaño dinámico
                    .bind("stroke", "textColor")
                ),

            //custom
            custom: new go.Node('Spot', {
                    resizable: true,
                    selectable: true,
                    resizeObjectName: 'mainShape',
                    locationSpot: new go.Spot(0, 0, 30 / 1, 30 / 1) // Ajusta la posición según el tamaño de la celda
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
                ),

            rectangleTextNode: new go.Node('Auto', {
                    locationSpot: go.Spot.Center,
                    resizable: true,
                    selectable: true,
                    resizeObjectName: 'mainShape'
                })
                .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape('Rectangle', {
                        name: 'mainShape',
                        fromLinkable: true,
                        toLinkable: true,
                        fromSpot: go.Spot.AllSides,
                        toSpot: go.Spot.AllSides,
                        fill: "lightgreen"
                    })
                    .bind('fill', 'color'),
                    new go.TextBlock({
                        margin: 12,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.Wrap.Fit,
                        editable: true
                    })
                    .bindTwoWay("text", "text")
                    .bind("font", "fontSize", (size) => `bold ${size || 12}pt sans-serif`)
                ),


            select: new go.Node("Auto", {
                    locationSpot: go.Spot.Center,
                    resizable: true,
                    selectable: true,
                    resizeObjectName: "SHAPE"
                })
                .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify)
                .add(
                    new go.Shape("Rectangle", {
                        name: "SHAPE",
                        fill: "lightyellow",
                        stroke: "gray"
                    })
                    .bind("fill", "color")
                    .bindTwoWay("desiredSize", "size", go.Size.parse, go.Size.stringify),

                    new go.Panel("Vertical", {
                        itemTemplate: new go.Panel("Auto")
                            .add(
                                new go.Shape("Rectangle", {
                                    fill: "white",
                                    stroke: null
                                }),
                                new go.TextBlock({
                                    margin: 2,
                                    editable: true,
                                    font: "10pt sans-serif"
                                }).bindTwoWay("text", "")
                            )
                    })
                    .bind("itemArray", "options")
                )
        };
    }

    // Inicializa el diagrama
    initialize(diagramContainer) {
        const $ = go.GraphObject.make;
        this.diagram = $(go.Diagram, diagramContainer, {
            'animationManager.isEnabled': false,
            'undoManager.isEnabled': true,
            'draggingTool.isGridSnapEnabled': true,
            'draggingTool.gridSnapCellSpot': go.Spot.Center,
            'resizingTool.isGridSnapEnabled': true,
            'initialDocumentSpot': go.Spot.TopLeft,
            'initialViewportSpot': go.Spot.TopLeft,
            'commandHandler.deletesTree': false,
            'commandHandler.canDeleteSelection': () => false,

            grid: $(go.Panel, "Grid", { gridCellSize: new go.Size(10, 10), visible: true },
                $(go.Shape, "LineH", { strokeWidth: 0.5, stroke: "lightgray" }),
                $(go.Shape, "LineV", { strokeWidth: 0.5, stroke: "lightgray" })
            )
        });


        // Configuración de la plantilla de nodos
        this.diagram.nodeTemplateMap.add("default", this.nodeTemplates.default);
        this.diagram.nodeTemplateMap.add("custom", this.nodeTemplates.custom);
        this.diagram.nodeTemplateMap.add("text", this.nodeTemplates.text);
        this.diagram.nodeTemplateMap.add("rectangleTextNode", this.nodeTemplates.rectangleTextNode);
        this.diagram.nodeTemplateMap.add("select", this.nodeTemplates.select);
        this.diagram.model = new go.GraphLinksModel([], []);


    }

    addNodeToDiagram(type, size = { x: 0, y: 0 }, position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add node");

        const nodeData = {
            key: model.nodeDataArray.length + 1,
            category: "custom",
            type: type,
            loc: `${position.x} ${position.y}`,
            color: "lightblue", // Default color
            size: `${size.x} ${size.y}`, // Size as string for custom node
            label: "" // Label for custom node
        };

        model.addNodeData(nodeData);

        // console.log(nodeData);
        model.commitTransaction("add node");
        return nodeData;

    }

    addTextNode(tipo, text = "Nuevo Texto", position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add text");

        const textNode = {
            key: model.nodeDataArray.length + 1,
            category: "text", // Usa la nueva plantilla de texto
            loc: `${position.x} ${position.y}`,
            text: text,
            fontSize: 10,
            type: tipo
        };

        model.addNodeData(textNode);
        console.log("Texto agregado:", textNode);

        model.commitTransaction("add text");

        return textNode;
    }

    addRectangleTextNode(type, size = { x: 80, y: 30 }, text, position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add rectangle text node");
        const nodeData = {
            key: model.nodeDataArray.length + 1,
            category: "rectangleTextNode",
            loc: `${position.x} ${position.y}`,
            text: text,
            color: "lightgreen",
            size: `${size.x} ${size.y}`,
            type: type,
            opciones: [],
            validation: [],
        };
        console.log(nodeData);

        model.addNodeData(nodeData);
        // console.log("Nodo agregado:", nodeData);

        model.commitTransaction("add rectangle text node");
        return nodeData;
    }

    addSelectNode(position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add select node");
        model.addNodeData({
            key: model.nodeDataArray.length + 1,
            category: "select", // coincide con el template arriba
            loc: `${position.x} ${position.y}`,
            color: "lightyellow", // color de fondo
            size: "100 60", // ancho x alto inicial
            options: ["Opción 1"] // arranca con una única opción
        });
        model.commitTransaction("add select node");
    }

    deleteSelectedNode() {
        const model = this.diagram.model;
        const selectedNode = this.diagram.selection.first(); // Obtener el nodo seleccionado

        if (selectedNode instanceof go.Node) {
            model.startTransaction("delete node");
            model.removeNodeData(selectedNode.data); // Eliminar el nodo del modelo
            model.commitTransaction("delete node");

            console.log("Nodo eliminado:", selectedNode.data);
            return selectedNode
        } else {
            console.log("No hay nodo seleccionado para eliminar");
            return null
        }

    }

    changeNodeColor(newColor) {
        const model = this.diagram.model;
        const selectedNode = this.diagram.selection.first(); // Obtener el nodo seleccionado

        console.log(selectedNode.data);
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

        console.log(selectedNode.data);
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

    saveDiagram() {
        const diagrama = this.diagram.model.toJson();
        return diagrama;
    }

    loadDiagram(json) {
            try {
                this.diagram.model = go.Model.fromJson(json);
                console.log('modelo cargado');
            } catch (error) {
                console.log('error al cargar', error);
            }
        }
        // setNodeMovedCallback(callback) {
        //     // this.onNodeMoved = callback;

    //     // let timeout = null;

    //     // this.diagram.addDiagramListener("SelectionMoved", (e) => {
    //     //     clearTimeout(timeout);

    //     //     timeout = setTimeout(() => {
    //     //         console.log("✅ Nodo movido, listo para enviar al servidor");
    //     //         const json = this.saveDiagram();
    //     //         callback(json);
    //     //     }, 200);
    //     // });

    //     this.onDiagramChanged = callback;

    //     let timeout = null;

    //     this.diagram.model.addChangedListener((e) => {
    //         const isNodeData = this.diagram.model.nodeDataArray.includes(e.object);
    //         const isNodeInsertOrRemove = (
    //             (e.change === go.ChangedEvent.Insert || e.change === go.ChangedEvent.Remove) &&
    //             e.modelChange === "nodeDataArray"
    //         );

    //         const isNodePropertyChange = (
    //             e.change === go.ChangedEvent.Property &&
    //             e.modelChange === "" &&
    //             isNodeData
    //         );

    //         if (isNodeInsertOrRemove || isNodePropertyChange) {
    //             clearTimeout(timeout);
    //             timeout = setTimeout(() => {
    //                 const json = this.saveDiagram();
    //                 console.log("✅ Cambio en el diagrama detectado y enviado:", json);
    //                 callback(json);
    //             }, 200);
    //         }
    //     });
    // }

    setNodeMovedCallback(callback) {
        this.onDiagramChanged = callback;
        this._registerChangeListener();
    }

    _registerChangeListener() {
        let timeout = null;
        this.diagram.model.addChangedListener((e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const json = this.saveDiagram();
                this.onDiagramChanged(json);
            }, 200);
        });

    }

    loadDiagram(json) {
        this.diagram.model = go.Model.fromJson(json);

        // Registrar de nuevo el listener
        this._registerChangeListener();
    }

    getDiagramImageData() {
        if (!this.diagram) return null;

        const imageData = this.diagram.makeImageData({
            background: "white", // color de fondo
            scale: 1, // escala de la imagen
            type: "image/png", // tipo MIME
            imageFormat: "png" // formato de la imagen
        });

        return imageData; // devuelve una URL tipo data:image/png;base64,...
    }

}