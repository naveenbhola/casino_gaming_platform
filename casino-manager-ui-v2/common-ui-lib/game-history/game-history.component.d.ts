import { OnInit } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    description: string;
}
export declare class GameHistoryComponent implements OnInit {
    dataSource: PeriodicElement[];
    columnsToDisplay: string[];
    expandedElement: PeriodicElement | null;
    constructor();
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<GameHistoryComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<GameHistoryComponent, "app-game-history", never, {}, {}, never, never>;
}

//# sourceMappingURL=game-history.component.d.ts.map