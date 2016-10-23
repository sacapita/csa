import * as Common from "cubitt-common";
import { D2DAbstractElement } from "./D2DAbstractElement";
export declare class Draw2D {
    Elements: D2DAbstractElement[];
    constructor();
    elements: D2DAbstractElement[];
    deserialize(jsonObject: Object): Draw2D;
    private addModel(id, type, properties?);
    private addNode(id, type, modelId, properties?);
    private addConnector(id, type, properties, nodeId);
    private addEdge(id, type, modelId, startConnectorId, endConnectorId, properties?);
    getElement(id: Common.Guid): D2DAbstractElement;
    hasElement(id: Common.Guid): boolean;
    toJSON(): Object[];
    private propertiesFromJSON(jsonProperties);
}
