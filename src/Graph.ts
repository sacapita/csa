import * as Common from "cubitt-common";
import {GraphInterface} from './GraphInterface'
import {AbstractElement} from "./AbstractElement"
import {ElementType} from "./ElementType"
import {NodeElement} from "./NodeElement"
import {ConnectorElement} from "./ConnectorElement"
import {EdgeElement} from "./EdgeElement"
import {ModelElement} from "./ModelElement"

/**
 * Draw2D Graph object containing nodes, connectors and edges
 *
 */
export class Graph {
  private  Elements : Common.Dictionary<AbstractElement>;

  constructor() {
      this.Elements = {};
  }

  get elements(): Common.Dictionary<AbstractElement> {
      return this.Elements;
  }

  /**
   * Convert a JSON Draw2D graph object to a Graph
   */
    public serialize(jsGraph: string): Graph {
        let graph = new Graph();
        let json = JSON.parse(jsGraph);

        for(let m in json){
            let model = json[m];
            let modelId = (model.id ? Common.Guid.parse(model.id) : Common.Guid.newGuid());

            this.addModel(modelId, model.type, {});
            let ports : string[] = []; // ports from Draw2D aka connectors for this object

            for(let key in model.elements) {
                let elem = model.elements[key];
                let elemId = elem.id;
                let elemProperties: Object[] = [];
                let connectorsToAdd: {id: Common.Guid, type: string; elemId: Common.Guid, props: Object[]}[] = [];

                switch(elem.type){
                    case "csa.Edge":
                        var startNodeId: Common.Guid = null;
                        var startConnectorId: Common.Guid = null;
                        var endNodeId: Common.Guid = null;
                        var endConnectorId: Common.Guid = null;
                        for(let prop in elem) {
                            let value = elem[prop];
                            if(prop == "source" && elem.hasOwnProperty("source")){
                                startNodeId = Common.Guid.parse(elem.source.node);
                                startConnectorId = Common.Guid.parse(ports[elem.source.port]);
                            }else if(prop == "target" && elem.hasOwnProperty("target")){
                                endNodeId = Common.Guid.parse(elem.target.node);
                                endConnectorId = Common.Guid.parse(elem.target.port.substring(6, elem.target.port.length));
                            }else{
                                elemProperties[prop] = value;
                            }
                        }
                        this.addEdge(elemId, elem.type, modelId, startNodeId, startConnectorId, endNodeId, endConnectorId, elemProperties);
                        break;
                    default:
                        for(let prop in elem) {
                            let value = elem[prop];
                            if(prop == "ports" && elem.hasOwnProperty(prop)){
                                for(let port in value){
                                    // Add connector for each port
                                    let portObject = value[port];
                                    let portProperties: Object[] = [];
                                    for(let portProps in portObject){
                                        portProperties[portProps] = portObject[portProps];
                                    }
                                    let connector = {id: portObject.id, type: portObject.type, elemId: elemId, props: portProperties};
                                    connectorsToAdd.push(connector);
                                    ports[portProperties["name"]] = portObject.id;
                                }
                            }else{
                                elemProperties[prop] = value;
                            }
                        }
                        this.addNode(elemId, elem.type, modelId, elemProperties);
                        let self = this;
                        connectorsToAdd.forEach(function(currentValue, index, arr){ self.addConnector(currentValue.id, currentValue.type, currentValue.elemId, currentValue.props); });
                        break;
                }
            }
        }
        return this;
    }

  /**
   * Returns an element given an GUID
   *
   * @param id GUID representing an element identifier
   */
  public getElement(id: Common.Guid) : AbstractElement {
      var elem = this.Elements[id.toString()];
      if (elem == undefined) {
          throw new Error("Element with GUID " + id.toString() + " not found");
      }
      return elem;
  }

  /**
   * @inheritdoc
   */
  public hasElement(id: Common.Guid) : boolean {
      return this.Elements[id.toString()] !== undefined;
  }

  /**
   * @inheritdoc
   */
  public addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties: Common.Dictionary<any> = {})
  {
      if (this.hasElement(id)) {
          throw new Error("An Element with GUID " + id.toString() + " already exists");
      }
      var model = this.Elements[modelId.toString()];
      if (model == undefined) {
          throw new Error("No model with GUID " + modelId + " could be found");
      }
      if (model.getType() != ElementType.Model) {
          throw new Error("GUID " + modelId.toString() + " does not belong to a model");
      }
      properties["type"] = type;
      var node = new NodeElement(id, ElementType.Node, properties);
      node.addModelNeighbour(modelId);
      model.addNodeNeighbour(id);

      this.Elements[node.Id.toString()] = node;
  }

  /**
   * @inheritdoc
   */
  public addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startNodeId:Common.Guid, startConnectorId: Common.Guid, endNodeId: Common.Guid, endConnectorId: Common.Guid, properties: Common.Dictionary<any> = {}) {
      // Validate GUID
      if (this.hasElement(id)) {
          throw new Error("An Element with GUID " + id.toString() + " already exists");
      }

      // Validate modelID
      var model = this.Elements[modelId.toString()];
      if (model == undefined) {
          throw new Error("No model with GUID " + modelId + " could be found");
      }
      if (model.getType() != ElementType.Model) {
          throw new Error("Element with GUID " + modelId.toString() + " is not a Model");
      }

      // Validate startConnector
      var startConnector = this.Elements[startConnectorId.toString()];
      if (startConnector == undefined) {
          throw new Error("No startConnector with GUID " + startConnectorId + " could be found");
      }
      if (startConnector.getType() != ElementType.Connector) {
          throw new Error("Invalid startConnectorId, "  + startConnectorId + " does not belong to a connector");
      }

      // Validate endConnectorId

      // NOTICE
      // Commented because inter-model edges do not work in this construction
      // The end node and thus connector are not yet defined when the source model is the first model to be parsed

     /* var endConnector = this.Elements[endConnectorId.toString()];
      if (endConnector == undefined) {
          throw new Error("No endConnector with GUID " + endConnectorId + " could be found");
      }
     if (endConnector.getType() != ElementType.Connector) {
          throw new Error("Invalid endConnectorId, "  + endConnectorId + " does not belong to a connector");
      }*/
      properties["type"] = type;
      var edge = new EdgeElement(id, ElementType.Edge, properties);
      // By convention, element 0 is the start item, 1 is the end
      edge.addStartConnector(startConnectorId);
      edge.addEndConnector(endConnectorId);

      startConnector.addEdgeNeighbour(id);
      // endConnector.addEdgeNeighbour(id);

      model.addEdgeNeighbour(id);
      edge.addModelNeighbour(modelId);

      this.Elements[id.toString()] = edge;
  }

  /**
   * @inheritdoc
   */
  public addConnector(id: Common.Guid, type: string, nodeId: Common.Guid, properties: Common.Dictionary<any>)
  {
      // Validate GUID
      if (this.hasElement(id)) {
          throw new Error("An Element with GUID " + id.toString() + " already exists");
      }

      // Validate nodeId exists
      var node = this.Elements[nodeId.toString()];
      if (node == undefined) {
          throw new Error("No node with GUID " + nodeId + " could be found");
      }
      if (node.getType() != ElementType.Node) {
          throw new Error("Invalid nodeId, "  + nodeId + " does not belong to a Node")
      }

      properties["type"] = type;
      var connector = new ConnectorElement(id, ElementType.Connector, properties);
      node.addConnectorNeighbour(id);
      connector.addNodeNeighbour(nodeId);

      this.Elements[id.toString()] = connector;
  }

  /**
   * @inheritdoc
   */
   public addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any>)
  {
      // Validate GUID
      if (this.hasElement(id)) {
          throw new Error("An Element with GUID " + id.toString() + " already exists");
      }
      properties["type"] = type;
      var model = new ModelElement(id, ElementType.Model, properties);
      this.Elements[id.toString()] = model;

  }

  /**
   * Creates a Property dictionary from JSON
   *
   * @param jsonProperties JSON object that contains the properties
   */
  private propertiesFromJSON(jsonProperties: Object): Common.Dictionary<any> {
      var properties : Common.Dictionary<any> = {};
      for (var propertyKey in jsonProperties) {
          properties[propertyKey] = jsonProperties[propertyKey];
      }
      return properties;
  }
}
