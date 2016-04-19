import * as Common from "cubitt-common";
import * as Commands from 'cubitt-commands';
import { Graph } from './Graph';
export declare class CommandGenerator {
    private Commands;
    private sessionId;
    constructor(sessionId: Common.Guid);
    process(graph: Graph): Commands.Command[];
}
