import { BehaviorSubject } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class DragDropItemNode {
    children: DragDropItemNode[];
    item: string;
    dataSourceName: string;
    nodeId: number;
    parentName: string;
}
export declare class DragDropItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
    dataSourceName: string;
    nodeId: number;
    parentName: string;
}
export declare class TreeDragDropItemDataBase {
    dataChangeAssigned: BehaviorSubject<DragDropItemNode[]>;
    dataChangeUnassigned: BehaviorSubject<DragDropItemNode[]>;
    dataChangeAG: BehaviorSubject<DragDropItemNode[]>;
    dataChangeVG: BehaviorSubject<DragDropItemNode[]>;
    data(node: DragDropItemNode): DragDropItemNode[];
    /**
     * if tree.expandAll called and get an erro of dataNodes we need to set
        this.treeControl.dataNodes = data; in all four group.
     * @param data
     * @param node
     */
    dispatchNextData(data: DragDropItemNode[], node: DragDropItemNode): void;
    constructor();
    initialize(): void;
    buildFileTree(obj: object, level: number, dataSourceName: string): DragDropItemNode[];
    insertItem(parent: DragDropItemNode, name: string): DragDropItemNode;
    insertItemAbove(node: DragDropItemNode, name: string): DragDropItemNode;
    insertItemBelow(node: DragDropItemNode, name: string): DragDropItemNode;
    getParentFromNodes(node: DragDropItemNode): DragDropItemNode;
    getParent(currentRoot: DragDropItemNode, node: DragDropItemNode): DragDropItemNode;
    updateItem(node: DragDropItemNode, name: string): void;
    deleteItem(node: DragDropItemNode): void;
    copyPasteItem(from: DragDropItemNode, to: DragDropItemNode): DragDropItemNode;
    copyPasteItemAbove(from: DragDropItemNode, to: DragDropItemNode): DragDropItemNode;
    copyPasteItemBelow(from: DragDropItemNode, to: DragDropItemNode): DragDropItemNode;
    deleteNode(nodes: DragDropItemNode[], nodeToDelete: DragDropItemNode): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TreeDragDropItemDataBase, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TreeDragDropItemDataBase>;
}

//# sourceMappingURL=topology-dragdrop-database.d.ts.map