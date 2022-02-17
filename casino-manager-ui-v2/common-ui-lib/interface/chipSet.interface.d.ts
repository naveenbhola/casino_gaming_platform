export interface ChipSetType {
    headerTexts: Array<string>;
    headerValues: Array<any>;
    denominationHeaders: Array<string>;
    body: Array<ChipSetDenomType>;
    totalCount: number;
    totalValue: number;
}
export interface ChipSetDenomType {
    denom: number;
    count: number;
    value: number;
}
