import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PromotionService } from '../../services/promotion.service';
import { TopologyService } from "../../services/topology.service";
const ELEMENT_DATA_W = [
    { promotionId: 1001, name: 'Promotion1', creationTime: '11:22', prizeName: 'Iphone', totalamount: 30000,
        pitName: 'PIT1', tableName: 'TAB1', seat: 4, player: 'Pandey, Rakesh (1002)', sessionId: 1223 },
    { promotionId: 1002, name: 'Promotion2', creationTime: '13:32', prizeName: 'Ipad', totalamount: 50000,
        pitName: 'PIT2', tableName: 'TAB2', seat: 3, player: 'Kumar, Ankur (1006)', sessionId: 1345 },
];
const ELEMENT_DATA_ES = [
    { promotionId: 1001, name: 'Promotion1', pitName: 'PIT1', tableName: 'TAB1', seat: 4, player: 'Pandey, Rakesh (1002)', sessionId: 1223 },
    { promotionId: 1002, name: 'Promotion2', pitName: 'PIT2', tableName: 'TAB2', seat: 3, player: 'Kumar, Ankur (1006)', sessionId: 1345 },
];
export class WinnerEligibleSessionsComponent {
    constructor(dialogRef, data, promotionService, topologyService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.promotionService = promotionService;
        this.topologyService = topologyService;
        this.perPageOption = [10, 20, 30, 50, 100];
        this.totalRecord = 19;
        this.displayedColumns_W = ['promotionId', 'promotionName', 'timeOfWin', 'prizeName', 'prizeValue', 'pit', 'tableId',
            'seat', 'player', 'sessionId'];
        this.winners = [];
        this.displayedColumns_ES = ['promotionId', 'name', 'pitName', 'tableName', 'seat', 'player', 'sessionId'];
        this.dataSource_ES = ELEMENT_DATA_W;
        this.init(data);
    }
    init(data) {
        this.command = data;
        if (this.command.cmd === 'WINNER') {
            this.getWinners();
        }
    }
    ngOnInit() {
    }
    closeDialog() {
        this.dialogRef.close();
    }
    getWinners() {
        const requestObj = {
            observe: 'response',
            params: {}
        };
        this.promotionService.getWinners(requestObj)
            .subscribe(response => {
            this.winners = response.body['winners'];
        });
    }
    getTopologyNameById(topologyId) {
        if (this.topologyService.topologyNodeNames[topologyId]) {
            return this.topologyService.topologyNodeNames[topologyId].name;
        }
    }
    updatePagination(event) {
    }
}
WinnerEligibleSessionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-winner-eligible-sessions',
                template: "<!--\n** Showing Title for the Dialog component.\n-->\n<h2 mat-dialog-title class=\"d-flex border-bottom dialog__title-color\">\n  <span *ngIf=\"command.cmd === 'WINNER'\">Promotions - Winners List</span>\n\n  <span class=\"space-filler\"></span>\n\n  <button mat-button tabindex=\"-1\" class=\"close-btn\">\n    <mat-icon (click)=\"closeDialog()\">close</mat-icon>\n  </button>\n\n</h2>\n\n<div mat-dialog-content *ngIf=\"command.cmd === 'WINNER' && winners.length > 0\">\n  <div class=\"row\">\n    <div class=\"col-12\">\n      <table mat-table [dataSource]=\"winners\" class=\"w-100\">\n\n\n        <ng-container matColumnDef=\"promotionId\">\n          <th mat-header-cell *matHeaderCellDef> Promotion Id </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.promotionId}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"promotionName\">\n          <th mat-header-cell *matHeaderCellDef> Promotion Name </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.promotionName}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"timeOfWin\">\n          <th mat-header-cell *matHeaderCellDef> Time </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.timeOfWin | date: 'hh:mm'}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"prizeName\">\n          <th mat-header-cell *matHeaderCellDef> Prize Name </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.prizeName}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"prizeValue\">\n          <th mat-header-cell *matHeaderCellDef> Prize Value </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.prizeValue}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"pit\">\n          <th mat-header-cell *matHeaderCellDef> Pit Name </th>\n          <td mat-cell *matCellDef=\"let element\"> {{getTopologyNameById(element.pit)}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"tableId\">\n          <th mat-header-cell *matHeaderCellDef> Table Name </th>\n          <td mat-cell *matCellDef=\"let element\"> {{getTopologyNameById(element.tableId)}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"seat\">\n          <th mat-header-cell *matHeaderCellDef> Seat </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.seat}} </td>\n        </ng-container>\n\n        <ng-container matColumnDef=\"player\">\n          <th mat-header-cell *matHeaderCellDef> Player </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.player}} </td>\n        </ng-container>\n\n\n        <ng-container matColumnDef=\"sessionId\">\n          <th mat-header-cell *matHeaderCellDef> Session ID </th>\n          <td mat-cell *matCellDef=\"let element\"> {{element.sessionId}} </td>\n        </ng-container>\n\n        <tr mat-header-row *matHeaderRowDef=\"displayedColumns_W\"></tr>\n        <tr mat-row *matRowDef=\"let row; columns: displayedColumns_W;\"></tr>\n      </table>\n    </div>\n  </div>\n</div>\n",
                styles: [":root{--accent:#9c1c23;--accent-bright:#ff562d;--accent-dark:#7d161b;--black:#000;--blue:#00ceff;--blue-dark:#00a3cc;--cyan:#23a6ad;--danger:#dc3545;--dark:#333;--dark-light:grey;--gray30:#5a5858;--gray50:#817e7e;--gray80:#d9d8d8;--green-dark:#1c925d;--green-darker:#0a3321;--green-light:#b2f0d5;--info:#0facd2;--primary:#bb9156;--primary-beige:#f0edca;--primary-bg:#eee7dd;--primary-dark:#ab7348;--primary-light:#d9cb9e;--primary-lighten:#e0cdb2;--secondary:#ccc;--secondary-light:#e6e6e6;--success:#22b573;--success-bright:#24ff00;--warning:#fbb03b;--white:#fff;--white-text:#f5f5f5;--yellow:#ff0;--yellow-bright:#ffea00;--yellow-dark:#cc0}.dialog__title-color{color:#9c1c23}.close-btn{color:rgba(51,51,51,.6)}.close-btn:hover{color:#333}"]
            },] }
];
WinnerEligibleSessionsComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] },
    { type: PromotionService },
    { type: TopologyService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lubmVyLWVsaWdpYmxlLXNlc3Npb25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL2hlYWRlci93aW5uZXItZWxpZ2libGUtc2Vzc2lvbnMvd2lubmVyLWVsaWdpYmxlLXNlc3Npb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUVoRSxNQUFNLGNBQWMsR0FBRztJQUNyQixFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEtBQUs7UUFDcEcsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUM7SUFDaEcsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLO1FBQ2xHLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDO0NBQy9GLENBQUM7QUFFRixNQUFNLGVBQWUsR0FBRztJQUN0QixFQUFDLFdB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dWxhci9jb3JlJztcbmltcG9ydCB7IE1hdERpYWxvZ1JlZiwgTUFUX0RJQUxPR19EQVRBIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7UHJvbW90aW9uU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcHJvbW90aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtUb3BvbG9neVNlcnZpY2V9IGZyb20gXCIuLi8uLi9zZXJ2aWNlcy90b3BvbG9neS5zZXJ2aWNlXCI7XG5cbmNvbnN0IEVMRU1FTlRfREFUQV9XID0gW1xuICB7cHJvbW90aW9uSWQ6IDEwMDEsIG5hbWU6ICdQcm9tb3Rpb24xJywgY3JlYXRpb25UaW1lOiAnMTE6MjInLCBwcml6ZU5hbWU6ICdJcGhvbmUnLCB0b3RhbGFtb3VudDogMzAwMDAsXG4gICAgcGl0TmFtZTogJ1BJVDEnLCB0YWJsZU5hbWU6ICdUQUIxJywgc2VhdDogNCwgcGxheWVyOiAnUGFuZGV5LCBSYWtlc2ggKDEwMDIpJywgc2Vzc2lvbklkOiAxMjIzfSxcbiAge3Byb21vdGlvbklkOiAxMDAyLCBuYW1lOiAnUHJvbW90aW9uMicsIGNyZWF0aW9uVGltZTogJzEzOjMyJywgcHJpemVOYW1lOiAnSXBhZCcsIHRvdGFsYW1vdW50OiA1MDAwMCxcbiAgICBwaXROYW1lOiAnUElUMicsIHRhYmxlTmFtZTogJ1RBQjInLCBzZWF0OiAzLCBwbGF5ZXI6ICdLdW1hciwgQW5rdXIgKDEwMDYpJywgc2Vzc2lvbklkOiAxMzQ1fSxcbl07XG5cbmNvbnN0IEVMRU1FTlRfREFUQV9FUyA9IFtcbiAge3Byb21vdGlvbklkOiAxMDAxLCBuYW1lOiAnUHJvbW90aW9uMScsIHBpdE5hbWU6ICdQSVQxJywgdGFibGVOYW1lOiAnVEFCMScsIHNlYXQ6IDQsIHBsYXllcjogJ1BhbmRleSwgUmFrZXNoICgxMDAyKScsIHNlc3Npb25JZDogMTIyM30sXG4gIHtwcm9tb3Rpb25JZDogMTAwMiwgbmFtZTogJ1Byb21vdGlvbjInLCBwaXROYW1lOiAnUElUMicsIHRhYmxlTmFtZTogJ1RBQjInLCBzZWF0OiAzLCBwbGF5ZXI6ICdLdW1hciwgQW5rdXIgKDEwMDYpJywgc2Vzc2lvbklkOiAxMzQ1fSxcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC13aW5uZXItZWxpZ2libGUtc2Vzc2lvbnMnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2lubmVyLWVsaWdpYmxlLXNlc3Npb25zLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2lubmVyLWVsaWdpYmxlLXNlc3Npb25zLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cblxuXG5leHBvcnQgY2xhc3MgV2lubmVyRWxpZ2libGVTZXNzaW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGNvbW1hbmQ6IGFueTtcbiAgcGVyUGFnZU9wdGlvbjogQXJyYXk8bnVtYmVyPiA9IFsxMCwgMjAsIDMwLCA1MCwgMTAwXTtcbiAgdG90YWxSZWNvcmQgPSAxOTtcbiAgZGlzcGxheWVkQ29sdW1uc19XOiBzdHJpbmdbXSA9IFsncHJvbW90aW9uSWQnLCAncHJvbW90aW9uTmFtZScsICd0aW1lT2ZXaW4nLCAncHJpemVOYW1lJywgJ3ByaXplVmFsdWUnLCAncGl0JywgJ3RhYmxlSWQnLFxuICAgICdzZWF0JywgJ3BsYXllcicsICdzZXNzaW9uSWQnXTtcbiAgd2lubmVycyA9IFtdO1xuXG4gIGRpc3BsYXllZENvbHVtbnNfRVM6IHN0cmluZ1tdID0gWydwcm9tb3Rpb25JZCcsICduYW1lJywgJ3BpdE5hbWUnLCAndGFibGVOYW1lJywgJ3NlYXQnLCAncGxheWVyJywgJ3Nlc3Npb25JZCddO1xuICBkYXRhU291cmNlX0VTID0gRUxFTUVOVF9EQVRBX1c7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPFdpbm5lckVsaWdpYmxlU2Vzc2lvbnNDb21wb25lbnQ+LFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9ESUFMT0dfREFUQSkgcHVibGljIGRhdGE6IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm9tb3Rpb25TZXJ2aWNlOiBQcm9tb3Rpb25TZXJ2aWNlLFxuICAgICAgICAgICAgICBwdWJsaWMgdG9wb2xvZ3lTZXJ2aWNlOiBUb3BvbG9neVNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5pbml0KGRhdGEpO1xuICB9XG5cbiAgaW5pdChkYXRhKTogdm9pZCB7XG4gICAgdGhpcy5jb21tYW5kID0gZGF0YTtcbiAgICBpZiAodGhpcy5jb21tYW5kLmNtZCA9PT0gJ1dJTk5FUicpIHtcbiAgICAgIHRoaXMuZ2V0V2lubmVycygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgY2xvc2VEaWFsb2coKTogdm9pZCB7XG4gICAgdGhpcy5kaWFsb2dSZWYuY2xvc2UoKTtcbiAgfVxuXG4gIGdldFdpbm5lcnMoKTogdm9pZCB7XG4gICAgY29uc3QgcmVxdWVzdE9iaiA9IHtcbiAgICAgIG9ic2VydmU6ICdyZXNwb25zZScsXG4gICAgICBwYXJhbXM6IHt9XG4gICAgfTtcbiAgICB0aGlzLnByb21vdGlvblNlcnZpY2UuZ2V0V2lubmVycyhyZXF1ZXN0T2JqKVxuICAgICAgICAuc3Vic2NyaWJlKCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgdGhpcy53aW5uZXJzID0gcmVzcG9uc2UuYm9keVsnd2lubmVycyddO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGdldFRvcG9sb2d5TmFtZUJ5SWQodG9wb2xvZ3lJZCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMudG9wb2xvZ3lTZXJ2aWNlLnRvcG9sb2d5Tm9kZU5hbWVzW3RvcG9sb2d5SWRdKSB7XG4gICAgICByZXR1cm4gdGhpcy50b3BvbG9neVNlcnZpY2UudG9wb2xvZ3lOb2RlTmFtZXNbdG9wb2xvZ3lJZF0ubmFtZTtcbiAgICB9XG5cbiAgfVxuXG4gIHVwZGF0ZVBhZ2luYXRpb24oZXZlbnQpOiB2b2lkIHtcblxuICB9XG5cbn1cbiJdfQ==