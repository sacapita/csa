import * as Common from "cubitt-common";
import { ElementType } from "./ElementType";
import { AbstractElement } from "./AbstractElement";
export declare class EdgeElement extends AbstractElement {
    protected start: Common.Guid;
    protected end: Common.Guid;
    getType(): ElementType;
    getStartConnector(): Common.Guid;
    getEndConnector(): Common.Guid;
    addStartConnector(connectorId: Common.Guid): void;
    addEndConnector(connectorId: Common.Guid): void;
}
