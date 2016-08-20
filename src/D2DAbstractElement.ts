import * as Common from "cubitt-common"

export abstract class D2DAbstractElement {
  protected id: string;
  protected type: string;
  protected elements: Common.Dictionary<any>;
  protected parentId: Common.Guid;

  /**
   * @param id GUID of the Element that is created
   * @param properties of the Element
   */
   constructor(id: Common.Guid, type: string, elements: Common.Dictionary<any> = [], parentId?: Common.Guid) {
     this.id = id.toString();
     this.type = type;
     this.elements = elements;
     this.parentId = parentId;
   }

  /**
   * Returns identifier of this element
   */
   get Id(): string {
	    return this.id;
   }

   get Elements(): Common.Dictionary<any> {
      return this.elements;
   }

   public toJSON(): Object {
     return this;
   }

   public AddElement(element) {
     this.elements[element.id] = element;
   }

   public appendToArray(arr: Object[], elements: Common.Dictionary<any>): Object[]{
     for(let k in elements){
       let elem = elements[k];
       arr.push(elem.toJSON());
     }
     return arr;
   }

   public appendToObject(obj: Object, elements: Common.Dictionary<any>): Object {
     for(let k in elements){
       obj[k] = elements[k];
     }
     return obj;
   }

   public addConnector(connector: D2DAbstractElement){
     if(typeof this.elements["ports"] === 'undefined'){
       this.elements["ports"] = [];
     }
     this.elements["ports"].push(connector);
   }
}
