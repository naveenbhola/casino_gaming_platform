import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface ITopologyNodes {
    meta: {
        href: string,
        mediaType: string
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
        href: string,
        mediaType: string
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
@Injectable({
  providedIn: 'root'
})
export class TopologytreeService {
  constructor(private _http: HttpClient) { }

    getTopologyNodes(url) {
        return this._http.get(url) as Observable<ITopologyNodes[]>;
    }
    getTopologyTypes(url) {
        return this._http.get(url) as Observable<ITopologyNodes[]>;
    }

    getTopologyNodeByNodeId(url, params: HttpParams = null) {
        return this._http.get(url, { params }) as Observable<ITopologyNodes[]>;
    }
    getAccessOrVirtualGroupNodes(url, params: HttpParams = null) {
        return this._http.get(url, { params }) as Observable<ITopologyAVGNodes[]>;
    }
    getTopologyNodeUnassigned(url) {
        return this._http.get(url) as Observable<ITopologyNodes[]>;
    }
}
