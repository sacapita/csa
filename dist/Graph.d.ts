import * as Common from "cubitt-common";
import { AbstractElement } from "./AbstractElement";
export declare class Graph {
    private Elements;
    constructor();
    readonly elements: Common.Dictionary<AbstractElement>;
    serialize(jsGraph: string): Graph;
    getElement(id: Common.Guid): AbstractElement;
    hasElement(id: Common.Guid): boolean;
    addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties?: Common.Dictionary<any>): void;
    addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startNodeId: Common.Guid, startConnectorId: Common.Guid, endNodeId: Common.Guid, endConnectorId: Common.Guid, properties?: Common.Dictionary<any>): void;
    addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties: Common.Dictionary<any>): void;
    addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any>): void;
    deserialize(jsonObject: Object): Graph;
    private propertiesFromJSON(jsonProperties);
}
