import * as Common from "cubitt-common";
import * as Commands from 'cubitt-commands';
import {AbstractElement} from "./AbstractElement"
import {EdgeElement} from "./EdgeElement"
import {ElementType} from "./ElementType"
import {Graph} from './Graph';

/**
 * Generate cubitt-commands from a given Draw2D Graph object to interact with the backend
 *
 */
export class CommandGenerator {
  private sessionId : Common.Guid;

  constructor(sessionId: Common.Guid) {
    this.sessionId = sessionId;
  }

  public processGraph(graph: Graph): Commands.Command[] {
    let commands: Commands.Command[] = [];
    for(let k in graph.elements){
      let item = graph.elements[k];

      if(item.getType() == ElementType.Model){
        let elements: AbstractElement[] = this.getModelElements(item, graph);
        let modelId = item.Id;

        // Create and Add the addModelCommand
        commands.push(new Commands.AddModelCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, item.Id, item.getProperty("type") + "_MODEL", item.getProperties()));

        for(let key in elements) {
          let elem: AbstractElement = elements[key];
          switch(elem.getType()){
            // Add Commands to an array
            case ElementType.Node:
              commands.push(new Commands.AddNodeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_NODE", elem.getProperties(), modelId));
              break;
            case ElementType.Connector:
              commands.push(new Commands.AddConnectorCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_CONNECTOR", elem.getProperties(), modelId));
              break;
            case ElementType.Edge:
              let edgeElement: EdgeElement = <EdgeElement> elem;
              commands.push(new Commands.AddEdgeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_EDGE", elem.getProperties(), modelId, edgeElement.getStartConnector(), edgeElement.getEndConnector()));
              break;
          }
        }
      }
    }

    return commands;
  }

  public createAddCommand(type: string, elemId: string, modelId: string, properties: Object[]) : Commands.Command{
    let command: Commands.Command;
    let elementType : ElementType = <ElementType> ElementType[type];

    switch(elementType){
        case ElementType.Node:
            command = new Commands.AddNodeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), "csa.ModuleShape", properties, Common.Guid.parse(modelId));
            break;
        default:
            throw new Error("CREATE COMMAND ERROR: ElementType does not matching any supported ElementTypes for creation");
    }

    return command;
  }

  public createISetPropertyCommand(type: string, elemId: string, key: string, value: any) : Commands.Command {
    let command: Commands.Command;
    let elementType : ElementType = <ElementType> ElementType[type];

    switch(elementType){
        case ElementType.Node:
            command = new Commands.SetNodePropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
            break;
        case ElementType.Edge:
            command = new Commands.SetEdgePropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
            break;
        case ElementType.Model:
            command = new Commands.SetModelPropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
            break;
        case ElementType.Connector:
            command = new Commands.SetConnectorPropertyCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, Common.Guid.parse(elemId), key, value);
            break;
        default:
            throw new Error("CREATE COMMAND ERROR: ElementType does not matching any existing ElementTypes");
    }
    return command;
  }

  public getModelElements(model, graph: Graph): AbstractElement[] {
    let elements : AbstractElement[] = [];
    let children : Common.Guid[] = [];
    children = model.getNodeNeighbours().concat(model.getEdgeNeighbours());
    for(let k in children){
        elements.push(graph.getElement(children[k]));
    }

    return elements;
  }

  public removeState(): Object[] {
    return [
      /*
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId": Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"DeleteModelCommand",
        "elementId":Common.Guid.parse("98ab320d-dc64-42c3-bd86-709616e0d0f4").toString(),
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId": Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"DeleteModelCommand",
        "elementId":Common.Guid.parse("f8ab7db5-714e-43ab-ba37-87e3fbc63f95").toString(),
      }*/
    ]
  }
/*
  public buildState(): Object[] {
    return [
      {
        "type"     : "AddModelCommand",
        "elementType": "DRAW2D_MODEL_FAM",
        "id"         : Common.Guid.newGuid().toString(),
        "requestId"  : Common.Guid.newGuid().toString(),
        "sessionId"  : this.sessionId.toString(),
        "elementId"  : Common.Guid.parse("98ab320d-dc64-42c3-bd86-709616e0d0f4").toString(),
        "elementProperties" : {}
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddNodeCommand",
        "elementId":Common.Guid.parse("fa0757e4-cd57-40b5-9770-617e180f3566").toString(),
        "elementType":"csa.ModuleShape",
        "elementProperties":{
          "x": 69.84375,
          "y": 98,
          "width": 50,
          "height": 50,
          "alpha": 1,
          "angle": 0,
          "userData": {
            "shapeType": "DRAW2D_MODEL_FAM"
          },
          "cssClass": "csa_ModuleShape",
          "bgColor": "#DBDDDE",
          "color": "#D7D7D7",
          "stroke": 1,
          "radius": 1,
          "dasharray": null,
          "name": "Module",
          "entities": []
        },
        "modelId":Common.Guid.parse("98ab320d-dc64-42c3-bd86-709616e0d0f4").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("8ff43070-6e9a-48d6-a5e9-f4c20b160120").toString(),
        "elementType":"draw2d.HybridPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_InputPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "input_fa0757e4-cd57-40b5-9770-617e180f3566",
          "port": "draw2d.InputPort",
          "locator": "draw2d.layout.locator.InputPortLocator"
        },
        "nodeId":Common.Guid.parse("fa0757e4-cd57-40b5-9770-617e180f3566").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("7211dc4d-5984-4a23-a70f-28ad88298aaa").toString(),
        "elementType":"draw2d.HybridPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_OutputPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 2,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "output_fa0757e4-cd57-40b5-9770-617e180f3566",
          "port": "draw2d.OutputPort",
          "locator": "draw2d.layout.locator.OutputPortLocator"
        },
        "nodeId":Common.Guid.parse("fa0757e4-cd57-40b5-9770-617e180f3566").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "type":"AddNodeCommand",
        "elementId":Common.Guid.parse("17e43124-7dd6-4480-936c-bea6da3b33e7").toString(),
        "elementType":"csa.ModuleShape",
        "elementProperties":{
          "x": 176.84375,
          "y": 90,
          "width": 50,
          "height": 50,
          "alpha": 1,
          "angle": 0,
          "userData": {
            "shapeType": "DRAW2D_MODEL_FAM"
          },
          "cssClass": "csa_ModuleShape",
          "bgColor": "#DBDDDE",
           "color": "#000000",
           "stroke": 0,
           "radius": 0,
           "dasharray": null,
           "name": "Module",
           "entities": []
        },
        "modelId":Common.Guid.parse("98ab320d-dc64-42c3-bd86-709616e0d0f4").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("12b9b20d-5085-4432-8fc3-f6415a239a71").toString(),
        "elementType":"draw2d.HybridPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_HybridPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "input_17e43124-7dd6-4480-936c-bea6da3b33e7",
          "port": "draw2d.HybridPort",
          "locator": "draw2d.layout.locator.InputPortLocator"
        },
        "nodeId":Common.Guid.parse("17e43124-7dd6-4480-936c-bea6da3b33e7").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("7d0e2aaf-5386-439f-ba5c-5af9324197ac").toString(),
        "elementType":"draw2d.HybridPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_HybridPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "output_17e43124-7dd6-4480-936c-bea6da3b33e7",
          "port": "draw2d.HybridPort",
          "locator": "draw2d.layout.locator.OutputPortLocator"
        },
        "nodeId":Common.Guid.parse("17e43124-7dd6-4480-936c-bea6da3b33e7").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("54d84876-b393-4ab5-8000-94087b6a95d0").toString(),
        "elementType":"draw2d.HybridPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_HybridPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "top17e43124-7dd6-4480-936c-bea6da3b33e7",
          "port": "draw2d.HybridPort",
          "locator": "draw2d.layout.locator.TopLocator"
        },
        "nodeId":Common.Guid.parse("17e43124-7dd6-4480-936c-bea6da3b33e7").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("229817e9-d930-4afd-bbfd-e386d9abb020").toString(),
        "elementType":"draw2d.HybridPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_HybridPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "bottom17e43124-7dd6-4480-936c-bea6da3b33e7",
          "port": "draw2d.HybridPort",
          "locator": "draw2d.layout.locator.BottomLocator"
        },
        "nodeId":Common.Guid.parse("17e43124-7dd6-4480-936c-bea6da3b33e7").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddEdgeCommand",
        "elementId": Common.Guid.parse("d0a84770-9ab5-4650-a300-0e1790f13008").toString(),
        "elementType":"csa.Edge",
        "elementProperties":{
          "alpha": 1,
          "angle": 0,
          "userData": {
            "shapeType": "DRAW2D_MODEL_FAM"
          },
          "cssClass": "csa_Edge",
          "stroke": 2,
          "color": "#129CE4",
          "outlineStroke": 0,
          "outlineColor": "none",
          "policy": "draw2d.policy.line.VertexSelectionFeedbackPolicy",
          "vertex": [
            {
              "x": 119.84375,
              "y": 123
            },
            {
              "x": 176.84375,
              "y": 115
            }
          ],
          "router": "draw2d.layout.connection.VertexRouter",
          "radius": 3,
          "source": {
            "node": "fa0757e4-cd57-40b5-9770-617e180f3566",
            "port": "output_fa0757e4-cd57-40b5-9770-617e180f3566"
          },
          "target": {
            "node": "17e43124-7dd6-4480-936c-bea6da3b33e7",
            "port": "input_17e43124-7dd6-4480-936c-bea6da3b33e7"
          }
        },
        "modelId":Common.Guid.parse("98ab320d-dc64-42c3-bd86-709616e0d0f4").toString(),
        "startConnectorId":Common.Guid.parse("7211dc4d-5984-4a23-a70f-28ad88298aaa").toString(),
        "endConnectorId":Common.Guid.parse("12b9b20d-5085-4432-8fc3-f6415a239a71").toString()
      },
      //Classdiagram model
      {
        "type"     : "AddModelCommand",
        "elementType": "DRAW2D_MODEL_CLASSDIAGRAM",
        "id"         : Common.Guid.newGuid().toString(),
        "requestId"  : Common.Guid.newGuid().toString(),
        "sessionId"  : this.sessionId.toString(),
        "elementId"  : Common.Guid.parse("f8ab7db5-714e-43ab-ba37-87e3fbc63f95").toString(),
        "elementProperties" : {}
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddNodeCommand",
        "elementId":Common.Guid.parse("d2dad284-8361-4cee-8c46-c38190350dd9").toString(),
        "elementType":"csa.TableShape",
        "elementProperties":{
          "x": 11.84375,
          "y": 13,
          "width": 88,
          "height": 60,
          "alpha": 1,
          "angle": 0,
          "userData": {
            "shapeType": "DRAW2D_MODEL_CLASSDIAGRAM"
          },
          "cssClass": "TableShape",
          "bgColor": "#DBDDDE",
          "color": "#D7D7D7",
          "stroke": 1,
          "radius": 3,
          "dasharray": null,
          "gap": 0,
          "name": "ClassName",
          "entities": [
            {
              "text": "id",
              "id": "8a6bfdb5-2f81-4a33-92f4-fdf0f4f01de8"
            }
          ]
        },
        "modelId":Common.Guid.parse("f8ab7db5-714e-43ab-ba37-87e3fbc63f95").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("5458c106-fa51-40f6-a83a-d209a648515e").toString(),
        "elementType":"draw2d.InputPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_InputPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "input_8a6bfdb5-2f81-4a33-92f4-fdf0f4f01de8",
          "port": "draw2d.InputPort",
          "locator": "draw2d.layout.locator.InputPortLocator"
        },
        "nodeId":Common.Guid.parse("d2dad284-8361-4cee-8c46-c38190350dd9").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("4f1ef323-ebfa-433b-a822-e969ae8d22d8").toString(),
        "elementType":"draw2d.OutputPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_OutputPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "output_8a6bfdb5-2f81-4a33-92f4-fdf0f4f01de8",
          "port": "draw2d.OutputPort",
          "locator": "draw2d.layout.locator.OutputPortLocator"
        },
        "nodeId":Common.Guid.parse("d2dad284-8361-4cee-8c46-c38190350dd9").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddNodeCommand",
        "elementId":Common.Guid.parse("7ea90d23-cad3-42b0-922a-98dc3b414f94").toString(),
        "elementType":"csa.TableShape",
        "elementProperties":{
          "x": 177.84375,
          "y": 5,
          "width": 88,
          "height": 60,
          "alpha": 1,
          "angle": 0,
          "userData": {
            "shapeType": "DRAW2D_MODEL_CLASSDIAGRAM"
          },
          "cssClass": "TableShape",
          "bgColor": "#DBDDDE",
          "color": "#D7D7D7",
          "stroke": 1,
          "radius": 3,
          "dasharray": null,
          "gap": 0,
          "name": "ClassName",
          "entities": [
            {
              "text": "id",
              "id": "49def6e7-a987-4fbb-baee-27a8d76f2b58"
            }
          ]
        },
        "modelId":Common.Guid.parse("f8ab7db5-714e-43ab-ba37-87e3fbc63f95").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("0d5c190e-320d-47f7-b998-f5e3d99ba985").toString(),
        "elementType":"draw2d.InputPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_InputPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "input_49def6e7-a987-4fbb-baee-27a8d76f2b58",
          "port": "draw2d.InputPort",
          "locator": "draw2d.layout.locator.InputPortLocator"
        },
        "nodeId":Common.Guid.parse("7ea90d23-cad3-42b0-922a-98dc3b414f94").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddConnectorCommand",
        "elementId":Common.Guid.parse("31684e51-55e5-4ec0-915a-0fbcd890d95c").toString(),
        "elementType":"draw2d.OutputPort",
        "elementProperties":{
          "width": 10,
          "height": 10,
          "alpha": 1,
          "angle": 0,
          "userData": {},
          "cssClass": "draw2d_OutputPort",
          "bgColor": "#4F6870",
          "color": "#1B1B1B",
          "stroke": 1,
          "dasharray": null,
          "maxFanOut": 9007199254740991,
          "name": "output_49def6e7-a987-4fbb-baee-27a8d76f2b58",
          "port": "draw2d.OutputPort",
          "locator": "draw2d.layout.locator.OutputPortLocator"
        },
        "nodeId":Common.Guid.parse("7ea90d23-cad3-42b0-922a-98dc3b414f94").toString()
      },
      {
        "id":Common.Guid.newGuid().toString(),
        "requestId":Common.Guid.newGuid().toString(),
        "sessionId":this.sessionId.toString(),
        "type":"AddEdgeCommand",
        "elementId": Common.Guid.parse("34685fac-ff15-4803-8142-0cac8d266b82").toString(),
        "elementType":"csa.Edge",
        "elementProperties":{
          "alpha": 1,
          "angle": 0,
          "userData": {
            "shapeType": "DRAW2D_MODEL_CLASSDIAGRAM"
          },
          "cssClass": "csa_Edge",
          "stroke": 3,
          "color": "#91B93E",
          "outlineStroke": 1,
          "outlineColor": "#303030",
          "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
          "vertex": [
            {
              "x": 99.84375,
              "y": 43
            },
            {
              "x": 138.84375,
              "y": 43
            },
            {
              "x": 138.84375,
              "y": 35
            },
            {
              "x": 177.84375,
              "y": 35
            }
          ],
          "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
          "radius": 3,
          "routingMetaData": {
            "routedByUserInteraction": false,
            "fromDir": 1,
            "toDir": 3
          },
          "source": {
            "node": "d2dad284-8361-4cee-8c46-c38190350dd9",
            "port": "output_8a6bfdb5-2f81-4a33-92f4-fdf0f4f01de8"
          },
          "target": {
            "node": "7ea90d23-cad3-42b0-922a-98dc3b414f94",
            "port": "input_49def6e7-a987-4fbb-baee-27a8d76f2b58"
          }
        },
        "modelId":Common.Guid.parse("f8ab7db5-714e-43ab-ba37-87e3fbc63f95").toString(),
        "startConnectorId":Common.Guid.parse("4f1ef323-ebfa-433b-a822-e969ae8d22d8").toString(),
        "endConnectorId":Common.Guid.parse("0d5c190e-320d-47f7-b998-f5e3d99ba985").toString()
      }
    ];
  }*/
}
