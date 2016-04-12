import * as Common from "cubitt-common";
import { ElementType } from "./ElementType";
export declare abstract class AbstractElement {
    protected id: Common.Guid;
    protected type: ElementType;
    protected properties: Common.Dictionary<any>;
    protected nodeNeighbours: Common.Dictionary<Common.Guid>;
    protected edgeNeighbours: Common.Dictionary<Common.Guid>;
    protected connectorNeighbours: Common.Dictionary<Common.Guid>;
    protected modelNeighbours: Common.Dictionary<Common.Guid>;
    constructor(id: Common.Guid, type: ElementType, properties?: Common.Dictionary<any>);
    readonly Id: Common.Guid;
    abstract getType(): ElementType;
    addNodeNeighbour(id: Common.Guid): void;
    addEdgeNeighbour(id: Common.Guid): void;
    addConnectorNeighbour(id: Common.Guid): void;
    addModelNeighbour(id: Common.Guid): void;
    protected internalGetNeighbours(type?: ElementType): Common.Guid[];
    getNeighbours(): Common.Guid[];
    getNodeNeighbours(): Common.Guid[];
    getEdgeNeighbours(): Common.Guid[];
    getConnectorNeighbours(): Common.Guid[];
    getModelNeighbours(): Common.Guid[];
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
    getProperties(): Common.Dictionary<any>;
    private toArray(dictionary);
}
