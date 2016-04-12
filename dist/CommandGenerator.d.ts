import * as Common from "cubitt-common";
import { Graph } from './Graph';
export declare class CommandGenerator {
    private Commands;
    private sessionId;
    constructor(sessionId: Common.Guid);
    process(graph: Graph): void;
}
