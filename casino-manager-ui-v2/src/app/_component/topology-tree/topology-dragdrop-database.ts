/*
 * Topology Drag-Drop Item database, it can build a tree structured Json object.
 * Each node in Json object represents a drag drop item or a category(different item may be nested).
 * If a node is a category(different item may be nested), it has children items and new items
 * can be added under the category(different item may be nested).
 */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
/*
 * Node for drag drop item
 */
export class DragDropItemNode {
    children: DragDropItemNode[];
    item: string;
    dataSourceName: string;
    nodeId: number;
    parentName: string;
}

/* Flat drag drop item node with expandable and level information */
export class DragDropItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
    dataSourceName: string;
    nodeId: number;
    parentName: string;
}

const ASSIGNEDDATA = new Map();
ASSIGNEDDATA.set(3, 4);

@Injectable()
export class TreeDragDropItemDataBase {
    dataChangeAssigned = new BehaviorSubject<DragDropItemNode[]>([]);
    dataChangeUnassigned = new BehaviorSubject<DragDropItemNode[]>([]);
    dataChangeAG = new BehaviorSubject<DragDropItemNode[]>([]);
    dataChangeVG = new BehaviorSubject<DragDropItemNode[]>([]);
    data(node: DragDropItemNode): DragDropItemNode[] {
        // console.log('data::', node.dataSourceName);
        if (node.dataSourceName === 'assignednode') {
            return this.dataChangeAssigned.value;
        } else if (node.dataSourceName === 'unassignednode') {
            return this.dataChangeUnassigned.value;
        } else if ( node.dataSourceName === 'accessgroup') {
            return this.dataChangeAG.value;
        } else if ( node.dataSourceName === 'virtualgroup') {
            return this.dataChangeVG.value;
        }
    }

    dispatchNextData(data: DragDropItemNode[], node: DragDropItemNode) {
        // console.log('dispatchNextData::', data, node.dataSourceName);
        if ( node.dataSourceName) {
            if (node.dataSourceName === 'assignednode') {
                this.dataChangeAssigned.next(data);
            } else if (node.dataSourceName === 'unassignednode') {
                this.dataChangeUnassigned.next(data);
            } else if ( node.dataSourceName === 'accessgroup') {
                this.dataChangeAG.next(data);
            } else if ( node.dataSourceName === 'virtualgroup') {
                this.dataChangeVG.next(data);
            }
        }
    }

    constructor() {
        this.initialize();
    }

    initialize() {
        // Build the tree nodes from Json object. The result is a list of `DragDropItemNode` with nested
        //     file node as children.
        const dataAssigned = this.buildFileTree(ASSIGNEDDATA, 0, 'assignednode');
        this.dataChangeAssigned.next(dataAssigned);

    }

    /*
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `DragDropItemNode`.
     */
    buildFileTree(obj: object, level: number, dataSourceName: string): DragDropItemNode[] {
        return Object.keys(obj).reduce<DragDropItemNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new DragDropItemNode();
            node.item = key;
            node.dataSourceName = dataSourceName;
            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1, node.dataSourceName);
                } else {
                    node.item = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

    /* Add an item to drag drop list */
    insertItem(parent: DragDropItemNode, name: string): DragDropItemNode {
        if (!parent.children) {
            parent.children = [];
        }
        const newItem = { item: name, dataSourceName: parent.dataSourceName } as DragDropItemNode;
        parent.children.push(newItem);
        this.dispatchNextData(this.data(newItem), newItem);
        return newItem;
    }

    insertItemAbove(node: DragDropItemNode, name: string): DragDropItemNode {
        const parentNode = this.getParentFromNodes(node);
        const newItem = { item: name, dataSourceName: node.dataSourceName } as DragDropItemNode;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
        } else {
            this.data(node).splice(this.data(node).indexOf(node), 0, newItem);
        }
        this.dispatchNextData(this.data(newItem), newItem);
        return newItem;
    }

    insertItemBelow(node: DragDropItemNode, name: string): DragDropItemNode {
        const parentNode = this.getParentFromNodes(node);
        const newItem = { item: name, dataSourceName: node.dataSourceName } as DragDropItemNode;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
        } else {
            this.data(node).splice(this.data(node).indexOf(node) + 1, 0, newItem);
        }
        this.dispatchNextData(this.data(newItem), newItem);
        return newItem;
    }

    getParentFromNodes(node: DragDropItemNode): DragDropItemNode {
        for (let i = 0; i < this.data(node).length; ++i) {
            const currentRoot = this.data(node)[i];
            const parent = this.getParent(currentRoot, node);
            if (parent != null) {
                return parent;
            }
        }
        return null;
    }

    getParent(currentRoot: DragDropItemNode, node: DragDropItemNode): DragDropItemNode {
        if (currentRoot.children && currentRoot.children.length > 0) {
            for (let i = 0; i < currentRoot.children.length; ++i) {
                const child = currentRoot.children[i];
                if (child === node) {
                    return currentRoot;
                } else if (child.children && child.children.length > 0) {
                    const parent = this.getParent(child, node);
                    if (parent != null) {
                        return parent;
                    }
                }
            }
        }
        return null;
    }

    updateItem(node: DragDropItemNode, name: string) {
        node.item = name;
        node.dataSourceName = node.dataSourceName
        this.dispatchNextData(this.data(node), node);
    }

    deleteItem(node: DragDropItemNode) {
        this.deleteNode(this.data(node), node);
        this.dispatchNextData(this.data(node), node);
    }

    copyPasteItem(from: DragDropItemNode, to: DragDropItemNode): DragDropItemNode {
        // console.log('in copyPasteItem to is', to, 'from is', from);
        const newItem = this.insertItem(to, from.item);
        if (from.children) {
            from.children.forEach(child => {
                this.copyPasteItem(child, newItem);
            });
        }
        return newItem;
    }

    copyPasteItemAbove(from: DragDropItemNode, to: DragDropItemNode): DragDropItemNode {
        // console.log('in copyPasteItemAbove to is', to, 'from is', from);
        const newItem = this.insertItemAbove(to, from.item);
        if (from.children) {
            from.children.forEach(child => {
                this.copyPasteItem(child, newItem);
            });
        }
        return newItem;
    }

    copyPasteItemBelow(from: DragDropItemNode, to: DragDropItemNode): DragDropItemNode {
        // console.log('in copyPasteItemBelow to is', to, 'from is', from);
        const newItem = this.insertItemBelow(to, from.item);
        if (from.children) {
            from.children.forEach(child => {
                this.copyPasteItem(child, newItem);
            });
        }
        return newItem;
    }

    deleteNode(nodes: DragDropItemNode[], nodeToDelete: DragDropItemNode) {
        const index = nodes.indexOf(nodeToDelete, 0);
        if (index > -1) {
            nodes.splice(index, 1);
        } else {
            nodes.forEach(node => {
                if (node.children && node.children.length > 0) {
                    this.deleteNode(node.children, nodeToDelete);
                }
            });
        }
    }
}