import { OnInit } from '@angular/core';
import { DecimalPipe } from "@angular/common";
import * as ɵngcc0 from '@angular/core';
export declare class ChipIconsComponent implements OnInit {
    private decimalPipe;
    chipIconKey: string;
    strCss: string;
    strKey: string;
    chipLabel: string;
    constructor(decimalPipe: DecimalPipe);
    ngOnInit(): void;
    getChipIcon(): string;
    getChipLabel(chipKey: any): string;
    isFractionalChipDenom(denom: any): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ChipIconsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ChipIconsComponent, "app-chip-icons", never, { "chipIconKey": "chipIconKey"; }, {}, never, never>;
}

//# sourceMappingURL=chip-icons.component.d.ts.map