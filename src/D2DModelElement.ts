import * as Common from "cubitt-common"
import {D2DAbstractElement} from "./D2DAbstractElement"

/**
 * Element representing a Draw2D Model
 */
export class D2DModelElement extends D2DAbstractElement {
  /**
   * @inheritdoc
   */
   public toJSON(): Object {
     return {
       "id": this.Id,
       "type": this.type,
       "elements": this.appendToArray([], this.elements)
     };
   }
}
