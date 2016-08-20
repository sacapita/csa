import * as Common from "cubitt-common"
import {D2DAbstractElement} from "./D2DAbstractElement"

/**
 * Element representing a Draw2D Node
 */
export class D2DNodeElement extends D2DAbstractElement {
  /**
   * @inheritdoc
   */
   public toJSON(): Object {
     return this.appendToObject({       
       "id": this.Id,
       "type": this.type,
     }, this.elements);
   }
}
