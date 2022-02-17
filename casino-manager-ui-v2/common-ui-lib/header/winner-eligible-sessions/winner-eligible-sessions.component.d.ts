import { OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PromotionService } from '../../services/promotion.service';
import { TopologyService } from "../../services/topology.service";
import * as ɵngcc0 from '@angular/core';
export declare class WinnerEligibleSessionsComponent implements OnInit {
    dialogRef: MatDialogRef<WinnerEligibleSessionsComponent>;
    data: any;
    private promotionService;
    topologyService: TopologyService;
    command: any;
    perPageOption: Array<number>;
    totalRecord: number;
    displayedColumns_W: string[];
    winners: any[];
    displayedColumns_ES: string[];
    dataSource_ES: {
        promotionId: number;
        name: string;
        creationTime: string;
        prizeName: string;
        totalamount: number;
        pitName: string;
        tableName: string;
        seat: number;
        player: string;
        sessionId: number;
    }[];
    constructor(dialogRef: MatDialogRef<WinnerEligibleSessionsComponent>, data: any, promotionService: PromotionService, topologyService: TopologyService);
    init(data: any): void;
    ngOnInit(): void;
    closeDialog(): void;
    getWinners(): void;
    getTopologyNameById(topologyId: any): string;
    updatePagination(event: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<WinnerEligibleSessionsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<WinnerEligibleSessionsComponent, "app-winner-eligible-sessions", never, {}, {}, never, never>;
}

//# sourceMappingURL=winner-eligible-sessions.component.d.ts.map