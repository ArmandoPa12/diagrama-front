import * as go from "gojs";

export class DiagramManager {
    constructor(diagramContainer) {
        this.diagram = null;
        this.nodeTemplates = this.getNodeTemplates();
        this.initialize(diagramContainer);
    }

    // Métodos privados
    getNodeTemplates() {
        return {
            // default: new go.Node("Auto")
            //     .bind(go.Node.locationSpot, go.Spot.Center)
            //     .bind("location", "location", go.Point.parse, go.Point.stringify)
            //     .add(
            //         new go.Shape("RoundedRectangle", { fill: "white" }),
            //         new go.TextBlock({ margin: 5 }, new go.Binding("text", "text"))
            //     ),
            default: new go.Node("Auto").add(
                new go.Shape("RoundedRectangle", { fill: "white" }),
                new go.TextBlock({ margin: 5 }, new go.Binding("text", "text"))
            ),
            // circle: new go.Node("Auto").add(
            //     new go.Shape("Circle", { fill: "blue", width: 50, height: 50 }), // Definir tamaño del círculo
            //     new go.TextBlock({ margin: 5 }, new go.Binding("text", "text"))
            // ),
            cricle: new go.Node('Spot', {
                    resizable: true,
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
                ),


            rectangle: new go.Node("Auto").add(
                new go.Shape("Rectangle", { fill: "red", width: 100, height: 50 }), // Definir tamaño del rectángulo
                new go.TextBlock({ margin: 5 }, new go.Binding("text", "text"))
            ),



            custom: new go.Node('Spot', {
                    resizable: true,
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

        // this.diagram = $(go.Diagram, diagramContainer, {
        //     "undoManager.isEnabled": true,
        // });

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
        this.diagram.nodeTemplateMap.add("circle", this.nodeTemplates.circle);
        this.diagram.nodeTemplateMap.add("rectangle", this.nodeTemplates.rectangle);
        this.diagram.nodeTemplateMap.add("custom", this.nodeTemplates.custom);

        // Modelo de datos inicial
        this.diagram.model = new go.GraphLinksModel([], []);
    }

    // Agrega un nodo al diagrama principal
    // addNodeToDiagram(type, position = { x: 0, y: 0 }) {
    //     const model = this.diagram.model;
    //     model.addNodeData({
    //         key: model.nodeDataArray.length + 1,
    //         text: type,
    //         figure: type,
    //         color: type === "circle" ? "blue" : "red",
    //         location: `${position.x} ${position.y}`,
    //         size: new go.Size(30, 30), // Tamaño por defecto para el nodo custom
    //         label: "Custom Node"
    //     });
    // }

    addNodeToDiagram(type, position = { x: 0, y: 0 }) {
        const model = this.diagram.model;
        model.startTransaction("add node");

        // Create the node data based on type
        const nodeData = {
            key: model.nodeDataArray.length + 1,
            category: type, // Set the template category
        };

        // Add properties based on template type
        if (type === "custom") {
            nodeData.loc = `${position.x} ${position.y}`;
            nodeData.color = "lightblue"; // Default color
            nodeData.size = "80 30"; // Size as string for custom node
            nodeData.label = "Custom"; // Label for custom node
        } else {
            nodeData.text = `${type} Node`; // Text for standard nodes
            nodeData.location = `${position.x} ${position.y}`; // Location for standard nodes
            nodeData.size = "40 40"
        }

        model.addNodeData(nodeData);

        console.log(nodeData);
        model.commitTransaction("add node");
    }


    // Limpia el diagrama principal
    clearDiagram() {
        this.diagram.model.nodeDataArray = [];
        this.diagram.model.linkDataArray = [];
    }
}