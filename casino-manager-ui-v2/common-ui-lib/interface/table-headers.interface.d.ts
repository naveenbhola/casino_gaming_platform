export interface TableHeadersInterface {
    title: string;
    type: string;
    row: string;
    sortable: boolean;
    translate?: string;
    rowLink?: string;
    sortFirst?: boolean;
    dateFormat?: string;
    isDisable?: boolean;
    isBulkDisable?: boolean;
    dependentField?: string;
    sortOrder?: string;
}
