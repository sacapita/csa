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
    private Commands : Commands.Command[];
    private sessionId: Common.Guid;

    constructor(sessionId: Common.Guid) {
        this.sessionId = sessionId;
        this.Commands = [];
    }

    public process(graph: Graph): Commands.Command[] {
        let elements: Common.Dictionary<AbstractElement> = graph.getElements();
        let modelId = Common.Guid.newGuid();
        for(let key in elements) {
            let elem: AbstractElement = elements[key];
            switch(elem.getType()){
                // Create Commands
                case ElementType.Model:
                    this.Commands.push(new Commands.AddModelCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_MODEL", elem.getProperties()));
                    break;
                case ElementType.Node:
                    this.Commands.push(new Commands.AddNodeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_NODE", elem.getProperties(), modelId));
                    break;
                case ElementType.Connector:
                    this.Commands.push(new Commands.AddConnectorCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_CONNECTOR", elem.getProperties(), modelId));
                    break;
                case ElementType.Edge:
                    let edgeElement: EdgeElement = <EdgeElement> elem;
                    this.Commands.push(new Commands.AddEdgeCommand(Common.Guid.newGuid(), Common.Guid.newGuid(), this.sessionId, elem.Id, elem.getProperty("type") + "_EDGE", elem.getProperties(), modelId, edgeElement.getStartConnector(), edgeElement.getEndConnector()));
                    break;
            }
        }

        return this.Commands;
    }
}
