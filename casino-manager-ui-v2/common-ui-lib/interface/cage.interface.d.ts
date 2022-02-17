export interface ChipsInventoryInterface {
    meta: Object;
    tableId: number;
    totalTrayCurrentValue: number;
    totalTrayOpenerValue: number;
    totalVarianceAmount: number;
    fillTotal: number;
    creditTotal: number;
    buyInTotal: number;
    totalAdjustment: number;
    fillTotalAmount: number;
    creditTotalAmount: number;
    buyInTotalAmount: number;
}
export interface LocalGamingDayInterface {
    successObj: string;
    errors: Array<any>;
}
export interface LocalGamingDaysInHeirarchyInterface {
    successObj: string;
    errors: Array<any>;
}
export interface RollTimeInterface {
    nextRollDtm: string;
    nextRollDtmViewValue: Date;
    currentGamingDay: string;
    currentGamingDayViewValue: Date;
    topologyNode: TopologyObjectInterface;
    isChecked: boolean;
}
export interface RollDTMInterface {
    nextRollDtm: string;
    nextRollDtmViewValue: Date;
    currentGamingDay: string;
    currentGamingDayViewValue: Date;
    topologyNode: TopologyObjectInterface;
    isChecked: boolean;
}
export interface TopologyObjectInterface {
    meta: Object;
    nodeId: number;
    name: string;
    shortName: string;
    type: number;
    description: string;
    retired: boolean;
    parentNodeId: number;
    parentNodeHref: string;
    path: string;
    childNodesHrefs: string;
    createdDtm: string;
    updatedDtm: string;
    status: string;
    location: Array<string>;
}
export interface GamingDayDDInterface {
    value: Date;
    viewValue: Date;
}
export interface RollTimePayloadInterface {
    nextRollDtm: string;
    nodeId: number;
}
export interface BuyInTransactionInterface {
    meta: any;
    id: number;
    uuid: string;
    type: string;
    buyInType: any;
    action: string;
    startDtm: string;
    endDtm: string;
    submitDtm: any;
    completeDtm: any;
    status: string;
    userId: any;
    userName: any;
    employeeNumber: any;
    userFullName: any;
    casinoPlayerId: any;
    agentId: any;
    topologyNodeId: number;
    chipsIn: Array<ChipInInterface[]>;
    chipsOut: Array<ChipsOutInterface[]>;
    txnValue: number;
    dealerId: any;
    dealerEmployeeNumber: any;
    supervisorId: number;
    supervisorEmployeeNumber: number;
    dealerName: any;
    supervisorName: string;
    playerId: number;
    playerName: any;
    playerType: string;
    additionalData: {};
}
export interface ChipInInterface {
    meta: any;
}
export interface ChipsOutInterface {
    meta: any;
    chipId: string;
    currency: any;
    denomination: any;
    chipsetId: any;
    wheelChipsetId: any;
    colorCode: any;
    gamingIdCode: any;
    casinoSiteIdCode: any;
    valid: any;
    ownerType: any;
    playerOwnerId: any;
    casinoOwnerId: any;
    toplogyNodeId: any;
    bankrollId: any;
    createdDtm: any;
    updatedDtm: any;
    chipsetLabel: any;
    lastTxnType: any;
    lastTxnDtm: any;
    incompleteData: any;
    lastTxnToplogyNodeId: any;
    negotiability: any;
    agentId: any;
    agentName: any;
}
export interface ChipTrayOpenerCloser {
    GamingDayOpener: any;
    GamingDayCloser: any;
}
export interface OpenerCloserReportData {
    gaming_day: string;
    table_or_cam_name: string;
    ShowPage2: boolean;
    ShowPage3: boolean;
    OPENER2: any;
    OPENER3: any;
    CLOSER1: any;
    CLOSER2: any;
    CLOSER3: any;
    OPENER1: any;
}
export interface FcTxnsInterface {
    errors: Array<any>;
    successObj: string;
    headers: any;
}
