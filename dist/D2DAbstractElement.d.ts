import * as Common from "cubitt-common";
export declare abstract class D2DAbstractElement {
    protected id: string;
    protected type: string;
    protected elements: Common.Dictionary<any>;
    protected parentId: Common.Guid;
    constructor(id: Common.Guid, type: string, elements?: Common.Dictionary<any>, parentId?: Common.Guid);
    Id: string;
    Elements: Common.Dictionary<any>;
    toJSON(): Object;
    AddElement(element: any): void;
    appendToArray(arr: Object[], elements: Common.Dictionary<any>): Object[];
    appendToObject(obj: Object, elements: Common.Dictionary<any>): Object;
    addConnector(connector: D2DAbstractElement): void;
}
