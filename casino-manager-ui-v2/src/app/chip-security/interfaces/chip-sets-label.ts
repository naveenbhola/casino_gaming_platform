export interface ChipSetLabelObject {
  body: [
    {
      casinoSiteId: number;
      chipsetId: number;
      currency: number;
      currencyLabel: string;
      gamingCompany: GamingCompanyObject;
      labels: Array<LabelObject>;
      negotiability: string;
    }
    ];
  headers: object;
  ok: boolean;
  status: number;
  statusText: string;
  type: number;
  url: string;
}
export interface ChipSetObject {
  casinoSiteId: number;
  chipsetId: number;
  currency: number;
  currencyLabel: string;
  gamingCompany: GamingCompanyObject;
  labels: Array<LabelObject>;
  negotiability: string;
}

export interface LabelObject {
  chipsetLabel: string;
  denominations: Array<string>;
  isCashable: boolean;
  isValid: boolean;
}

interface GamingCompanyObject {
  companyName: string;
  createdDtm: string;
  gamingCompanyId: number;
  isValid: boolean;
  updatedDtm: string;
}

export interface EditableCompanyObj {
  companyName: string;
  gamingCompanyId: string;
  isValid: boolean;
}

export interface EditableChipSetObject {
  casinoSiteId: string;
  chipsetId: string;
  currency: string;
  gamingCompany: EditableCompanyObj;
  labels: Array<LabelObject>;
  negotiability: string;
}
