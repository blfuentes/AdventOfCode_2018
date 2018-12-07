export class Node {
    element: string;
    parentNodes: Array<Node>;
    childNodes: Array<Node>;

    constructor(value: string, parent: Node | undefined) {
        this.element = value;
        this.parentNodes = [];
        if (parent != undefined) {
            this.parentNodes.push();
        }
        this.childNodes = [];
    }
}