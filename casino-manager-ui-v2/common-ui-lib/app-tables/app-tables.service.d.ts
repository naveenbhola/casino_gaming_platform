import { EventEmitter } from '@angular/core';
import { TableFiltersInterface } from '../interface/table-filters.interface';
import * as ɵngcc0 from '@angular/core';
export declare class AppTablesService {
    reqObj: {
        observe: string;
        params: {
            start: number;
            limit: number;
        };
    };
    initPagination: EventEmitter<any>;
    filterConfigOptions: Array<TableFiltersInterface>;
    clearPreFilters(): void;
    clearFilter(): TableFiltersInterface[];
    setFilterOptions(options: any): void;
    clearEmptyParams(): void;
    updateFilter(obj: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AppTablesService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<AppTablesService>;
}

//# sourceMappingURL=app-tables.service.d.ts.map