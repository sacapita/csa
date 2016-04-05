import * as Common from "cubitt-common";
export interface GraphInterface {
    addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties?: Common.Dictionary<any>): any;
    addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startNodeId: Common.Guid, startConnectorId: Common.Guid, endNodeId: Common.Guid, endConnectorId: Common.Guid, properties?: Common.Dictionary<any>): any;
    addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties?: Common.Dictionary<any>): any;
    serialize(): Object;
    deserialize(jsonObject: Object): GraphInterface;
}
