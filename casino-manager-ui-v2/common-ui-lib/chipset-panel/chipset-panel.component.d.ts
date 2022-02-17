import { OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as ɵngcc0 from '@angular/core';
export declare class ChipsetPanelComponent implements OnInit {
    private translate;
    panelOpenState: boolean;
    chipSetData: any[];
    csPanelHeaderHeight: string;
    constructor(translate: TranslateService);
    ngOnInit(): void;
    isFractionalChipDenom(denom: any): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ChipsetPanelComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ChipsetPanelComponent, "app-chipset-panel", never, { "chipSetData": "chipSetData"; }, {}, never, never>;
}

//# sourceMappingURL=chipset-panel.component.d.ts.map