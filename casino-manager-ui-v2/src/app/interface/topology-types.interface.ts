export interface TopologyTypesInterface {
    meta: {
        href: string,
        mediaType: string
    };
    canStoreChips: boolean;
    childTypeIds: Array<number>;
    deleted: boolean;
    labelCode: string;
    topologyType: string;
    topologyTypeId: number;
    virtualDevice: boolean;
}

export interface TopologyNodeInterface {
    nodeId: number;
    name: string;
    shortName: string;
    type: number;
    description: string;
    deleted: boolean;
    retired: boolean;
    childNodesHrefs: Array<string>;
    childNodes: Array<ChildNode>;
    createdDtm: string;
    updatedDtm: string;
    status: string;
}

export interface ChildNode {
    nodeId: number;
    name: string;
    shortName: string;
    type: number;
    description: string;
    deleted: boolean;
    retired: boolean;
    parentNodeId: number;
    childNodesHrefs: Array<string>;
    childNodes: Array<ChildNode>;
    createdDtm: string;
    updatedDtm: string;
    status: string;
}

export interface TopologyStatistics {
    count: number;
    data: Array<StatisticsData>;
    statCodes: Array<string>;
    topologyIds: Array<number>;
}
interface Stats {
    stats: Array<string>;
}
export interface TopologyStatisticsTabularView {
    count: number;
    topologyIds: Array<number>;
    statCodes: Array<string>;
    data: Array<Stats>;
}


export interface StatisticsData {
    stats: Array<string>;
}