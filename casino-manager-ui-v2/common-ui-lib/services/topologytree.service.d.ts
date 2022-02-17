import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export interface ITopologyNodes {
    meta: {
        href: string;
        mediaType: string;
    };
    nodeId: string;
    name: string;
    shortName: string;
    type: number;
    description: string;
    deleted: boolean;
    retired: boolean;
    parentNodeId: number;
    parentNodeHref: string;
    path: string;
    childNodesHrefs: Array<any>;
    createdDtm: string;
    updatedDtm: string;
    status: string;
    children: Array<any>;
}
/**
 * AVG:(Access or Virtual Group) nodes, this interface has common properties for access and virtual group.
 */
export interface ITopologyAVGNodes {
    createdDtm: string;
    groupName: string;
    groupType: string;
    meta: {
        href: string;
        mediaType: string;
    };
    topologyGroupId: number;
    topologyId: number;
    topologyNodeIds: Array<any>;
    updatedDtm: string;
    userId: number;
}
/**
 * if you need to provide it at global level do not specify the module here just write the 'root', this is restricted to module if you
 * want to use the service need to import TopologyTreeModule.
 */
export declare class TopologytreeService {
    private _http;
    constructor(_http: HttpClient);
    getTopologyNodes(url: any): Observable<ITopologyNodes[]>;
    getTopologyTypes(url: any): Observable<ITopologyNodes[]>;
    getTopologyNodeByNodeId(url: any, params?: HttpParams): Observable<ITopologyNodes[]>;
    getAccessOrVirtualGroupNodes(url: any, params?: HttpParams): Observable<ITopologyAVGNodes[]>;
    getTopologyNodeUnassigned(url: any): Observable<ITopologyNodes[]>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TopologytreeService, never>;
}

//# sourceMappingURL=topologytree.service.d.ts.map