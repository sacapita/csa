import * as Common from "cubitt-common";
import * as Commands from 'cubitt-commands';
import { AbstractElement } from "./AbstractElement";
import { Graph } from './Graph';
export declare class CommandGenerator {
    private sessionId;
    constructor(sessionId: Common.Guid);
    processGraph(graph: Graph): Commands.Command[];
    createAddCommand(type: string, elemId: string, modelId: string, properties: Object[]): Commands.Command;
    createISetPropertyCommand(type: string, elemId: string, key: string, value: any): Commands.Command;
    getModelElements(model: any, graph: Graph): AbstractElement[];
    removeState(): Object[];
}
