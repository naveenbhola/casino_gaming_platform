import { EventEmitter } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class UtilityService {
    updateDimensions: EventEmitter<any>;
    updatePageNumbers: EventEmitter<any>;
    closeDialog: EventEmitter<any>;
    broadcastGlobalCalendarGamingDay: EventEmitter<any>;
    broadcastBreadCrumClick: EventEmitter<any>;
    gamingDay: any;
    isCBPT: boolean;
    constructor();
    updateGlobalCalendarGamingDay(globalCalendarGamingDay: any): void;
    updateBreadCrumClick(breadcrum: any): void;
    updateCurrentDimensions(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<UtilityService, never>;
}

//# sourceMappingURL=utility.service.d.ts.map