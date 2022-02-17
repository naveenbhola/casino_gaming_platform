export interface SystemProperty {
    meta: {
        href: string;
        mediaType: string;
    };
    configurationId: number;
    userId: number;
    state: string;
    type: string;
    name: string;
    templateTypeCode: string;
    propertyValues: Array<PropertyValues>;
}
interface PropertyValues {
    propertyValueId: number;
    propertyId: number;
    propertyCode: string;
    dataType: string;
    configurationId: number;
    propertyValue: string;
    createdDtm: string;
    updatedDtm: string;
}
export {};
