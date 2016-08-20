import * as Common from "cubitt-common";
import {GraphInterface} from './GraphInterface'
import {D2DAbstractElement} from "./D2DAbstractElement"
import {ElementType} from "./ElementType"
import {NodeElement} from "./NodeElement"
import {ConnectorElement} from "./ConnectorElement"
import {EdgeElement} from "./EdgeElement"
import {D2DModelElement} from "./D2DModelElement"
import {D2DNodeElement} from "./D2DNodeElement"
import {D2DConnectorElement} from "./D2DConnectorElement"
import {D2DEdgeElement} from "./D2DEdgeElement"

/**
 * Draw2D Graph object
 */
export class Draw2D {
  private  Elements : Common.Dictionary<D2DAbstractElement>;

  constructor() {
      this.Elements = {};
  }

  get elements(): Common.Dictionary<D2DAbstractElement> {
      return this.Elements;
  }

  public deserialize(jsonObject : Object) : Draw2D {
      var draw2d = new Draw2D();
      var models = jsonObject['models'];

      for (var modelKey in models) {
          var model = models[modelKey];
          var id = Common.Guid.parse(model["id"]);
          var properties = this.propertiesFromJSON(model["properties"]);
          draw2d.addModel(id,properties["type"],properties);
      }

      var nodes = jsonObject['nodes'];
      for (var nodeKey in nodes) {
          var node = nodes[nodeKey];
          var id = Common.Guid.parse(node["id"]);
          var properties = this.propertiesFromJSON(node["properties"]);
          var modelId = Common.Guid.parse(node["neighbours"]["models"]["parent"][0]);
          draw2d.addNode(id,properties["type"],modelId,properties)
      }

      var connectors = jsonObject['connectors'];
      for (var connectorKey in connectors) {
          var connector = connectors[connectorKey];
          var id = Common.Guid.parse(connector["id"]);
          var properties = this.propertiesFromJSON(connector["properties"]);
          var nodeId = Common.Guid.parse(connector["neighbours"]["nodes"]["parent"]["0"]);
          draw2d.addConnector(id,properties['type'], properties, nodeId);
      }

      var edges = jsonObject['edges'];
      for (var edgeKey in edges) {
          var edge = edges[edgeKey];
          var id = Common.Guid.parse(edge["id"]);
          var properties = this.propertiesFromJSON(edge["properties"]);
          var modelId = Common.Guid.parse(edge["neighbours"]["models"]["parent"][0]);
          var startConnector = Common.Guid.parse(edge["neighbours"]["connectors"]["parent"][0]);
          var endConnector = Common.Guid.parse(edge["neighbours"]["connectors"]["parent"][1]);
          draw2d.addEdge(id,properties["type"],modelId,startConnector, endConnector, properties);
      }
      return draw2d;
  }

  private addModel(id: Common.Guid, type: string, properties: Common.Dictionary<any> = {}): void {
    if (this.hasElement(id)) {
        throw new Error("An Element with GUID " + id.toString() + " already exists");
    }
    let model = new D2DModelElement(id, type, {});
    this.Elements[id.toString()] = model;
  }

  private addNode(id: Common.Guid, type: string, modelId: Common.Guid, properties: Common.Dictionary<any> = {}): void {
    if (this.hasElement(id)) {
        throw new Error("An Element with GUID " + id.toString() + " already exists");
    }
    let node = new D2DNodeElement(id, type, properties, modelId);
    this.Elements[id.toString()] = node;
    let model: D2DModelElement = this.getElement(modelId);
    model.AddElement(node);
  }

  private addConnector(id: Common.Guid, type: string, properties: Common.Dictionary<any>, nodeId: Common.Guid): void {
    if (this.hasElement(id)) {
        throw new Error("An Element with GUID " + id.toString() + " already exists");
    }
    let connector = new D2DConnectorElement(id, type, properties, nodeId);
    this.Elements[id.toString()] = connector;
    let node: D2DAbstractElement = this.getElement(nodeId);
    node.addConnector(connector);
  }

  private addEdge(id: Common.Guid, type: string, modelId: Common.Guid, startConnectorId: Common.Guid, endConnectorId: Common.Guid, properties: Common.Dictionary<any> = {}): void {
    if (this.hasElement(id)) {
        throw new Error("An Element with GUID " + id.toString() + " already exists");
    }
    let edge = new D2DEdgeElement(id, type, properties, modelId);
    this.Elements[id.toString()] = edge;
    let model: D2DModelElement = this.getElement(modelId);
    model.AddElement(edge);
  }


  /**
   * Returns an element given an GUID
   *
   * @param id GUID representing an element identifier
   */
  public getElement(id: Common.Guid) : D2DAbstractElement {
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

  public toJSON(): Object[] {
    var project = [];
    for(let k in this.Elements){
      let model = this.Elements[k];
      project.push(model.toJSON());
      break;
    }
    return project;
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
