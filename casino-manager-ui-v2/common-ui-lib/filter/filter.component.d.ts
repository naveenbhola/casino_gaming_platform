import { EventEmitter, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TopologyService } from '../services/topology.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as ɵngcc0 from '@angular/core';
export declare class FilterComponent implements OnChanges {
    private translate;
    private topologyService;
    private decimalPipe;
    private datePipe;
    configOptions: Object;
    isDisabled: boolean;
    EMIT_FILTER: EventEmitter<any>;
    EMIT_FILTER_ALL: EventEmitter<any>;
    filterConfigOption: any;
    searchKey: string;
    index: number;
    filterNeedsTranslation: string[];
    filterNeedsCapsUnderscore: string[];
    options: Array<any>;
    disableOption: boolean;
    constructor(translate: TranslateService, topologyService: TopologyService, decimalPipe: DecimalPipe, datePipe: DatePipe);
    ngOnChanges(): void;
    defaultSelectAll(): void;
    selectOption(params: boolean): void;
    selectDeselectAll(params: any, isPromotionPit: any): void;
    selectDeselectOtherOptions(): void;
    emitFilter(params: any): void;
    translateFilterOptions(option: any): string;
    getFormattedValue(option: any, columnName: any, columnType: any): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<FilterComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<FilterComponent, "app-filter", never, { "isDisabled": "isDisabled"; "configOptions": "configOptions"; }, { "EMIT_FILTER": "EMIT_FILTER"; "EMIT_FILTER_ALL": "EMIT_FILTER_ALL"; }, never, never>;
}

//# sourceMappingURL=filter.component.d.ts.map