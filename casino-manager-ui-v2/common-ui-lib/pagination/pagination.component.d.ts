import { EventEmitter, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AppTablesService } from '../app-tables/app-tables.service';
import { UtilityService } from '../services/utility.service';
import * as ɵngcc0 from '@angular/core';
export declare class PaginationComponent implements OnInit, OnChanges, OnDestroy {
    private tableService;
    private utilityService;
    perPageOption: Array<number>;
    totalRecord: number;
    inputStart: number;
    inputCurrentPage: number;
    inputLimit: number;
    isTableGrid?: boolean;
    EMIT_PAGINATION: EventEmitter<any>;
    start: number;
    limit: number;
    currentPage: number;
    totalPage: number;
    paginationSubscriber: any;
    constructor(tableService: AppTablesService, utilityService: UtilityService);
    ngOnInit(): void;
    ngOnChanges(): void;
    handleSubscription(): void;
    nextPage(): void;
    previousPage(): void;
    firstPage(): void;
    lastPage(): void;
    changePageLimit(limit: any): void;
    goToAnyPage(event: any, currntPage: any): void;
    emitPagination(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PaginationComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<PaginationComponent, "app-pagination", never, { "isTableGrid": "isTableGrid"; "perPageOption": "perPageOption"; "totalRecord": "totalRecord"; "inputStart": "inputStart"; "inputCurrentPage": "inputCurrentPage"; "inputLimit": "inputLimit"; }, { "EMIT_PAGINATION": "EMIT_PAGINATION"; }, never, never>;
}

//# sourceMappingURL=pagination.component.d.ts.map