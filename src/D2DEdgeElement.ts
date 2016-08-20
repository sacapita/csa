import * as Common from "cubitt-common"
import {D2DAbstractElement} from "./D2DAbstractElement"

/**
 * Element representing a Draw2D Edgel
 */
export class D2DEdgeElement extends D2DAbstractElement {
  /**
   * @inheritdoc
   */
   public toJSON(): Object {
     return this.appendToObject({
       "type": this.type,
       "id": this.Id,
     }, this.elements);
   }
}
