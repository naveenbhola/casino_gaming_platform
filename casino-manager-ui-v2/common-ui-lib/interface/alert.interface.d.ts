export interface Alert {
    alertId: number;
    eventTypeId: number;
    eventType: string;
    displayMeta: string;
    eventSourceApplication: string;
    eventSourceHost: string;
    alertSeverity: string;
    alertStatus: string;
    createdDtm: Date;
    customerKnowledgeBase: string;
    eventData: Array<object>;
    topologyId: number;
    topologyName: string;
    topologyPath: string;
}
export interface AlertCount {
    criticalCount: number;
    highCount: number;
    lowCount: number;
    topologyId: number;
}
