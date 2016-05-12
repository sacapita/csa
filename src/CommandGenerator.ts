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

    public incrementalCommand(type: string, elemId: string, key: string, value: any) : Commands.Command {
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
}
