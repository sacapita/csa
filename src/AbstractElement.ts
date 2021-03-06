import * as Common from "cubitt-common"
import {ElementType} from "./ElementType"
import {Graph} from "./Graph"

export abstract class AbstractElement {
    protected id: Common.Guid;
	protected type: ElementType;
	protected properties: Common.Dictionary<any>;
    protected nodeNeighbours: Common.Dictionary<Common.Guid>;
    protected edgeNeighbours: Common.Dictionary<Common.Guid>;
    protected connectorNeighbours: Common.Dictionary<Common.Guid>;
    protected modelNeighbours: Common.Dictionary<Common.Guid>;

  /**
   * @param id GUID of the Element that is created
   * @param properties of the Element
   */
   constructor(id: Common.Guid, type: ElementType, properties: Common.Dictionary<any> = {}) {
        this.id = id;
        this.type = type;
        this.properties = properties;
        this.nodeNeighbours = {};
        this.edgeNeighbours = {};
        this.connectorNeighbours = {};
        this.modelNeighbours = {};
   }

   /**
    * Returns identifier of this element
    */
    get Id(): Common.Guid {
		    return this.id;
	  }

    /**
     * Returns type of this element
     */
    public abstract getType(): ElementType;

    /**
     * Adds a neighbour of type Node to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addNodeNeighbour(id : Common.Guid) {
        this.nodeNeighbours[id.toString()] = id;
    }

    /**
     * Adds a Neighbour of type Edge to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addEdgeNeighbour(id : Common.Guid) {
        this.edgeNeighbours[id.toString()] = id;
    }

    /**
     * Adds a neighbour of type Connector to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addConnectorNeighbour(id : Common.Guid) {
        this.connectorNeighbours[id.toString()] = id;
    }

    /**
     * Adds a neighbour of type Model to this Element
     *
     * @param id Guid of the element that should be added
     */
    public addModelNeighbour(id: Common.Guid) {
        this.modelNeighbours[id.toString()] = id;
    }

    /**
     * Returns all neighbours, optionally filtered by ElementType
     *
     * @param type The elementtype to filter by, by default all elements are returned
     */
    protected internalGetNeighbours(type ?: ElementType) : Common.Guid[] {
        if (type == ElementType.Node) {
            return this.toArray(this.nodeNeighbours);
        } else if (type == ElementType.Edge) {
            return this.toArray(this.edgeNeighbours);
        } else if (type == ElementType.Connector) {
            return this.toArray(this.connectorNeighbours);
        } else if (type == ElementType.Model) {
            return this.toArray(this.modelNeighbours);
        } else {
            var types : Array<Common.Dictionary<Common.Guid>> = [];
            types.push(this.nodeNeighbours);
            types.push(this.edgeNeighbours);
            types.push(this.connectorNeighbours);
            types.push(this.modelNeighbours);
            var result = [];
            for (var elems of types) {
                for (var key in elems) {
                    result.push(elems[key]);
                }
            }
            return result;
        }
    }

    /**
     * Returns all neighbours
     */
    public getNeighbours() : Common.Guid[] {
        return this.internalGetNeighbours();
    }

    /**
     * Returns all neighbours of type Node
     */
    public getNodeNeighbours() : Common.Guid[] {
        return this.internalGetNeighbours(ElementType.Node);
    }

    /**
     * Returns all neighbours of type Edge
     */
    public getEdgeNeighbours() : Common.Guid[] {
        return this.internalGetNeighbours(ElementType.Edge);
    }

    /**
     * Returns all neighbours of type Connector
     */
    public getConnectorNeighbours() : Common.Guid[] {
        return this.internalGetNeighbours(ElementType.Connector);
    }

    /**
     * Returns all neighbours of type Model
     */
    public getModelNeighbours() : Common.Guid[] {
        return this.internalGetNeighbours(ElementType.Model);
    }

    /**
     * Sets a property on this Element
     *
     * @param name Name of the property to set
     * @param value desired value
     */
    public setProperty(name: string, value: any) {
        this.properties[name] = value;
    }

    /**
     * Returns a value of a property of this Element
     *
     * @param name Name of the property to retrieve
     */
    public getProperty(name: string) : any {
        return this.properties[name];
    }

    /**
     * Returns all properties of this Element
     */
    public getProperties() : Common.Dictionary<any> {
        return this.properties;
    }

    /**
     * Converts a Dictionary to an Array
     *
     * @param dictionary The dictionary to convert
     */
    private toArray(dictionary : Common.Dictionary<Common.Guid>) : Common.Guid[] {
        var result : Common.Guid[] = [];
        for (var key in dictionary) {
            var elem = dictionary[key]
            result.push(elem);
        }
        return result;
    }
}
