import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CageService } from '../../services/cage.service';
import { CurrentTopologyService } from '../../services/current-topology.service';
import { TranslateService } from '@ngx-translate/core';
export class RollTimeDialogComponent {
    constructor(dialog, dialogRef, cageService, currentTopologyService, snackBar, translate) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.cageService = cageService;
        this.currentTopologyService = currentTopologyService;
        this.snackBar = snackBar;
        this.translate = translate;
        this.displayedColumns = ['topologyNode', 'nextRollDtm'];
        this.currentGamingDays = [];
        this.rollTimeTopologyMap = {};
        this.selectedNodeIds = [];
        this.rollTimePayloadData = [];
        this.setCurrentData();
        this.getRollTimeData();
    }
    setCurrentData() {
        this.currentTopologyService.currentTopology.subscribe(topologyID => {
            this.requestObject = {
                params: {
                    topologyId: topologyID
                }
            };
        });
        this.currentTopologyService.currentGamingDay.subscribe(gamingDay => {
            this.currentGamingDay = gamingDay;
        });
    }
    ngOnInit() {
        this.dateTime = new Date(); // setting default date
    }
    getRollTimeData() {
        this.cageService.getRollTimeData(this.requestObject).subscribe(data => {
            this.rollTimeData = data;
            this.processTopology(this.rollTimeData);
            this.selectedGamingDay = this.currentGamingDays[0].value;
            this.userConditions();
            this.renderView();
        });
    }
    userConditions() {
        this.disableRollTimeSelection = new Date(this.selectedGamingDay).getTime() > this.currentGamingDay.getTime();
    }
    setTimeOnCalender(selectedRollTime) {
        const maxDate = new Date();
        this.startAt = selectedRollTime;
        this.minStartTime = new Date();
        maxDate.setDate(maxDate.getDate() + 1);
        this.maxDateTime = maxDate;
    }
    selectedRollTime(rollTime) {
        this.rollTimePayloadData = [];
        for (let i = 0; i < this.selectedNodeIds.length; i++) {
            this.rollTimePayloadData.push({ 'nextRollDtm': new Date(rollTime).toISOString(), 'nodeId': this.selectedNodeIds[i] });
        }
        this.cageService.postRollTimeData(this.rollTimePayloadData);
    }
    selectLocation(location) {
        const childrenNodeMap = {};
        this.childrenNodes(childrenNodeMap);
        for (const key in childrenNodeMap) {
            if (childrenNodeMap.hasOwnProperty(key)) {
                if (childrenNodeMap[key].length > 0) {
                    const allChildrenNodes = [];
                    this.callRecursively(childrenNodeMap, childrenNodeMap[key], allChildrenNodes);
                    this.rollTimeTopologyMap[key] = allChildrenNodes;
                }
                else {
                    this.rollTimeTopologyMap[key] = [];
                }
            }
        }
        this.locationSelection(location);
    }
    locationSelection(location) {
        location.isChecked = !location.isChecked;
        if (location.isChecked) {
            if (this.selectedNodeIds.indexOf(location.topologyNode.nodeId) === -1) {
                this.selectedNodeIds.push(location.topologyNode.nodeId);
            }
        }
        else {
            this.selectedNodeIds = this.selectedNodeIds.filter(e => e !== location.topologyNode.nodeId);
        }
        this.renderedRollTimeData.map(node => {
            if (this.rollTimeTopologyMap[location.topologyNode.nodeId].indexOf(node.topologyNode.nodeId.toString()) > -1) {
                node.isChecked = location.isChecked;
                if (node.isChecked) {
                    if (this.selectedNodeIds.indexOf(node.topologyNode.nodeId) === -1) {
                        this.selectedNodeIds.push(node.topologyNode.nodeId);
                    }
                }
                else {
                    this.selectedNodeIds = this.selectedNodeIds.filter(e => e !== node.topologyNode.nodeId);
                }
            }
        });
    }
    childrenNodes(childrenNodeMap) {
        let topologyNode;
        let childrenIds;
        for (let i = 0; i < this.rollTimeData.length; i++) {
            topologyNode = this.rollTimeData[i].topologyNode;
            childrenIds = this.extractNodeIdFromHref(topologyNode.childNodesHrefs);
            childrenNodeMap[topologyNode.nodeId] = childrenIds;
        }
    }
    callRecursively(childrenNodeMap, currentChildrenNodes, allChildrenNodes) {
        for (let i = 0; i < currentChildrenNodes.length; i++) {
            allChildrenNodes.push(currentChildrenNodes[i]);
            for (const key in childrenNodeMap) {
                if (childrenNodeMap.hasOwnProperty(key) &&
                    (key === currentChildrenNodes[i] && childrenNodeMap[key].length > 0)) {
                    this.callRecursively(childrenNodeMap, childrenNodeMap[key], allChildrenNodes);
                }
            }
        }
    }
    extractNodeIdFromHref(hrefArray) {
        const idArr = [];
        let ids = [];
        for (let i = 0; i < hrefArray.length; i++) {
            ids = hrefArray[i].split('/');
            idArr.push(ids[ids.length - 1]);
        }
        return idArr;
    }
    processTopology(topologyObj) {
        const allGamingDays = [];
        for (let i = 0; i < topologyObj.length; i++) {
            topologyObj[i].topologyNode.location = this.locationPath(topologyObj[i].topologyNode.name, topologyObj[i].topologyNode.path);
            topologyObj[i].currentGamingDayViewValue = new Date(topologyObj[i].currentGamingDay);
            topologyObj[i].nextRollDtmViewValue = new Date(topologyObj[i].nextRollDtm);
            topologyObj[i].isChecked = false;
            allGamingDays.push(topologyObj[i].currentGamingDay);
        }
        const uniqueGamingDays = (Array.from(new Set(allGamingDays))).sort();
        for (let i = 0; i < uniqueGamingDays.length; i++) {
            this.currentGamingDays.push({
                value: uniqueGamingDays[i],
                viewValue: new Date(uniqueGamingDays[i])
            });
        }
    }
    locationPath(currentTopologyName, path) {
        let formattedPath = [];
        if (path.length <= 2) {
            formattedPath = currentTopologyName.split();
        }
        else {
            path = currentTopologyName + ',' + path.slice(1, -1);
            formattedPath = path.split(',').reverse();
        }
        return formattedPath;
    }
    onClose() {
        this.dialogRef.close();
    }
    onGamingDaySelection() {
        this.selectedNodeIds = [];
        this.renderView();
    }
    renderView() {
        this.renderedRollTimeData = this.sortDataObj(this.rollTimeData.filter(data => data.currentGamingDay === this.selectedGamingDay.toString()));
    }
    sortDataObj(obj) {
        return obj.sort((a, b) => (a.topologyNode.parentNodeId > b.topologyNode.parentNodeId) ? 1 :
            ((b.topologyNode.parentNodeId > a.topologyNode.parentNodeId) ? -1 : 0));
    }
    submitRollTime() {
        this.cageService.postRollTimeData(this.rollTimePayloadData).subscribe(res => {
            const key = 'application.app.common.labels.TOPSUBNAV.ROLL_TIME_UPDATED';
            this.snackBar.open(this.translate.instant(key), '', {
                duration: 3000,
                horizontalPosition: 'right',
                panelClass: 'snack__success'
            });
            this.dialogRef.close();
        });
    }
}
RollTimeDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-roll-time-dialog',
                template: "<mat-form-field>\n  <mat-select [(value)]=\"selectedGamingDay\" (selectionChange)=\"onGamingDaySelection()\">\n    <mat-option *ngFor=\"let currentGamingDay of currentGamingDays\" [value]=\"currentGamingDay.value\">\n      {{currentGamingDay.viewValue | date: 'shortDate'}}\n    </mat-option>\n  </mat-select>\n</mat-form-field>\n\n\n<div class=\"table-alerts__container table-alerts__container__height\">\n  <table class=\"w-100\" mat-table  [dataSource]=\"renderedRollTimeData\" >\n      <ng-container matColumnDef=\"topologyNode\">\n        <th mat-header-cell *matHeaderCellDef  mat-sort-header>\n          <span [translate]=\"'application.app.common.labels.TOPSUBNAV.LOCATION'\">Location</span>\n        </th>\n        <td mat-cell *matCellDef=\"let element\">\n          <mat-checkbox color=\"primary\" class=\"mr-3\" [checked]=\"element.isChecked\" [disabled]=\"disableRollTimeSelection\" (change)=\"selectLocation(element)\">\n            <li class=\"rollTimeList\" *ngFor=\"let item of element.topologyNode.location\">{{item}}</li>\n          </mat-checkbox>\n\n        </td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"nextRollDtm\" >\n        <th mat-header-cell *matHeaderCellDef>\n          <span [translate]=\"'application.app.common.labels.TOPSUBNAV.ROLL_DATE_TIME'\">Roll Date Time</span></th>\n        <!--<td mat-cell *matCellDef=\"let element\">{{element.nextRollDtmViewValue | date: 'd-MM-y hh:MM'}}</td>-->\n        <td mat-cell *matCellDef=\"let element\">\n          <!--{{element.nextRollDtmViewValue | date: 'short'}}-->\n          <mat-form-field color=\"primary\" class=\"w-100\">\n              <input matInput #matInput\n                     placeholder=\"{{'application.app.common.labels.DATE' | translate}}\"\n                     [value]=\"element.nextRollDtmViewValue | date:'short'\"\n                     [owlDateTimeTrigger]=\"dt\"\n                     [owlDateTime]=\"dt\"\n                     [min] = \"minStartTime\"\n                     [max] = \"maxDateTime\"\n                     [readonly]=\"!element.isChecked\"\n                     autocomplete=\"off\"\n\n              >\n              <owl-date-time #dt\n                             [stepMinute]=\"'1'\"\n                             [startAt]=\"startAt\"\n                             (afterPickerOpen)=\"setTimeOnCalender(element.nextRollDtmViewValue)\"\n                             (afterPickerClosed)=\"selectedRollTime(matInput.value)\"\n                             [disabled]=\"!element.isChecked\"\n              >\n\n              </owl-date-time>\n          </mat-form-field>\n        </td>\n      </ng-container>\n\n    <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\n    <tr mat-row *matRowDef=\"let rowData; columns: displayedColumns;\"></tr>\n\n  </table>\n</div>\n<!-- Dialog Footer controls -->\n<div mat-dialog-actions class=\"d-flex\">\n  <span class=\"space-filler\"></span>\n\n  <button class=\"dialog__button-close mr-3\" mat-stroked-button (click)=\"onClose()\" >\n    <span [translate]=\"'application.app.common.labels.CLOSE'\" > Close </span>\n  </button>\n\n  <button class=\"dialog__button-save\" [disabled]=\"selectedNodeIds.length < 1\" mat-stroked-button (click)=\"submitRollTime()\" tabindex=\"-1\">\n    <span [translate]=\"'application.app.common.labels.TOPSUBNAV.CHANGE_ROLL_TIME'\"> Change Roll Time </span>\n  </button>\n\n</div>\n",
                styles: [".rollTimeList{color:#555;display:inline}.rollTimeList+li:before{color:#ccc;content:\"/\";padding:0 10px}.rollTimeList+li:last-child{color:#9c1c23}"]
            },] }
];
RollTimeDialogComponent.ctorParameters = () => [
    { type: MatDialog },
    { type: MatDialogRef },
    { type: CageService },
    { type: CurrentTopologyService },
    { type: MatSnackBar },
    { type: TranslateService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sbC10aW1lLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9yb2xsLXRpbWUvcm9sbC10aW1lLWRpYWdsb2cvcm9sbC10aW1lLWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDeEQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0seUNBQXlDLENBQUM7QUFDL0UsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFRckQsTUFBTSxPQUFPLHVCQUF1QjtJQWtCaEMsWUFDWSxNQUFpQixFQUNqQixTQUE0QixFQUM1QixXQUF3QixFQUN4QixzQkFBOEMsRUFDOUMsUUFBcUIsRUFDckIsU0FBMkI7UUFMM0IsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFtQjtRQUM1QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLGFBQVEsR0FBUixRQUFRLENBQWE7UUFDckIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFmaEMscUJBQWdCLEdBQWtCLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2xFLHNCQUFpQixHQUFnQyxFQUFFLENBQUM7UUFJbkQsd0JBQW1CLEdBQUcsRUFBRSxDQUFDO1FBQzFCLG9CQUFlLEdBQWtCLEVBQUUsQ0FBQztRQUNuQyx3QkFBbUIsR0FBb0MsRUFBRSxDQUFDO1FBVTlE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O0lBQ3BGLENBQUM7SUFFRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDeEUsTUFBTSxHQUFHLEdBQUcsMkRBQTJELENBQUM7WUFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFO2dCQUNoRCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxrQkFBa0IsRUFBRSxPQUFPO2dCQUMzQixVQUFVLEVBQUUsZ0JBQWdCO2FBQy9CLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzs7WUEzTkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLHUxR0FBZ0Q7O2FBRW5EOzs7WUFYUSxTQUFTO1lBQUUsWUFBWTtZQUV4QixXQUFXO1lBQ1gsc0JBQXNCO1lBRnJCLFdBQVc7WUFHWixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdERpYWxvZywgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7IE1hdFNuYWNrQmFyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc25hY2stYmFyJztcbmltcG9ydCB7Q2FnZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge0N1cnJlbnRUb3BvbG9neVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2N1cnJlbnQtdG9wb2xvZ3kuc2VydmljZSc7XG5pbXBvcnQge1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHtHYW1pbmdEYXlEREludGVyZmFjZSwgUm9sbFRpbWVJbnRlcmZhY2UsIFJvbGxUaW1lUGF5bG9hZEludGVyZmFjZSwgVG9wb2xvZ3lPYmplY3RJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZS9jYWdlLmludGVyZmFjZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYXBwLXJvbGwtdGltZS1kaWFsb2cnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yb2xsLXRpbWUtZGlhbG9nLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9yb2xsLXRpbWUtZGlhbG9nLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUm9sbFRpbWVEaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgcHJpdmF0ZSBkYXRlVGltZTogRGF0ZTtcbiAgICBwdWJsaWMgc3RhcnRBdDogRGF0ZTtcbiAgICBwdWJsaWMgbWluU3RhcnRUaW1lOiBEYXRlO1xuICAgIHB1YmxpYyBtYXhEYXRlVGltZTogRGF0ZTtcbiAgICBwcml2YXRlIHJlcXVlc3RPYmplY3Q6IE9iamVjdDtcbiAgICBwcml2YXRlIHJvbGxUaW1lRGF0YTogQXJyYXk8Um9sbFRpbWVJbnRlcmZhY2U+O1xuICAgIHB1YmxpYyByZW5kZXJlZFJvbGxUaW1lRGF0YTogQXJyYXk8Um9sbFRpbWVJbnRlcmZhY2U+O1xuICAgIHB1YmxpYyBkaXNwbGF5ZWRDb2x1bW5zOiBBcnJheTxzdHJpbmc+ID0gWyd0b3BvbG9neU5vZGUnLCAnbmV4dFJvbGxEdG0nXTtcbiAgICBwdWJsaWMgY3VycmVudEdhbWluZ0RheXM6IEFycmF5PEdhbWluZ0RheURESW50ZXJmYWNlPiA9IFtdO1xuICAgIHB1YmxpYyBzZWxlY3RlZEdhbWluZ0RheTogRGF0ZTtcbiAgICBwcml2YXRlIGN1cnJlbnRHYW1pbmdEYXk6IERhdGU7XG4gICAgcHVibGljIGRpc2FibGVSb2xsVGltZVNlbGVjdGlvbjogQm9vbGVhbjtcbiAgICBwcml2YXRlIHJvbGxUaW1lVG9wb2xvZ3lNYXAgPSB7fTtcbiAgICBwdWJsaWMgc2VsZWN0ZWROb2RlSWRzOiBBcnJheTxudW1iZXI+ID0gW107XG4gICAgcHJpdmF0ZSByb2xsVGltZVBheWxvYWREYXRhOiBBcnJheTxSb2xsVGltZVBheWxvYWRJbnRlcmZhY2U+ID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBkaWFsb2c6IE1hdERpYWxvZyxcbiAgICAgICAgcHJpdmF0ZSBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxhbnk+LFxuICAgICAgICBwcml2YXRlIGNhZ2VTZXJ2aWNlOiBDYWdlU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50VG9wb2xvZ3lTZXJ2aWNlOiBDdXJyZW50VG9wb2xvZ3lTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHNuYWNrQmFyOiBNYXRTbmFja0JhcixcbiAgICAgICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RGF0YSgpO1xuICAgICAgICB0aGlzLmdldFJvbGxUaW1lRGF0YSgpO1xuICAgIH1cbiAgICBzZXRDdXJyZW50RGF0YSAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudFRvcG9sb2d5U2VydmljZS5jdXJyZW50VG9wb2xvZ3kuc3Vic2NyaWJlKHRvcG9sb2d5SUQgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0T2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICB0b3BvbG9neUlkOiB0b3BvbG9neUlEXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY3VycmVudFRvcG9sb2d5U2VydmljZS5jdXJyZW50R2FtaW5nRGF5LnN1YnNjcmliZShnYW1pbmdEYXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtaW5nRGF5ID0gZ2FtaW5nRGF5O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRlVGltZSA9IG5ldyBEYXRlKCk7IC8vIHNldHRpbmcgZGVmYXVsdCBkYXRlXG4gICAgfVxuXG4gICAgZ2V0Um9sbFRpbWVEYXRhKCkge1xuICAgICAgICB0aGlzLmNhZ2VTZXJ2aWNlLmdldFJvbGxUaW1lRGF0YSh0aGlzLnJlcXVlc3RPYmplY3QpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMucm9sbFRpbWVEYXRhID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1RvcG9sb2d5KHRoaXMucm9sbFRpbWVEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRHYW1pbmdEYXkgPSB0aGlzLmN1cnJlbnRHYW1pbmdEYXlzWzBdLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy51c2VyQ29uZGl0aW9ucygpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJWaWV3KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVzZXJDb25kaXRpb25zKCkge1xuICAgICAgICB0aGlzLmRpc2FibGVSb2xsVGltZVNlbGVjdGlvbiA9IG5ldyBEYXRlKHRoaXMuc2VsZWN0ZWRHYW1pbmdEYXkpLmdldFRpbWUoKSA+IHRoaXMuY3VycmVudEdhbWluZ0RheS5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgc2V0VGltZU9uQ2FsZW5kZXIoc2VsZWN0ZWRSb2xsVGltZTogRGF0ZSkge1xuICAgICAgICBjb25zdCBtYXhEYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5zdGFydEF0ID0gc2VsZWN0ZWRSb2xsVGltZTtcbiAgICAgICAgdGhpcy5taW5TdGFydFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBtYXhEYXRlLnNldERhdGUobWF4RGF0ZS5nZXREYXRlKCkgKyAxKTtcbiAgICAgICAgdGhpcy5tYXhEYXRlVGltZSA9IG1heERhdGU7XG4gICAgfVxuXG4gICAgc2VsZWN0ZWRSb2xsVGltZShyb2xsVGltZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucm9sbFRpbWVQYXlsb2FkRGF0YSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWROb2RlSWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJvbGxUaW1lUGF5bG9hZERhdGEucHVzaCh7J25leHRSb2xsRHRtJzogbmV3IERhdGUocm9sbFRpbWUpLnRvSVNPU3RyaW5nKCksICdub2RlSWQnOiB0aGlzLnNlbGVjdGVkTm9kZUlkc1tpXX0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FnZVNlcnZpY2UucG9zdFJvbGxUaW1lRGF0YSh0aGlzLnJvbGxUaW1lUGF5bG9hZERhdGEpO1xuICAgIH1cblxuICAgIHNlbGVjdExvY2F0aW9uKGxvY2F0aW9uOiBSb2xsVGltZUludGVyZmFjZSkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbk5vZGVNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbk5vZGVzKGNoaWxkcmVuTm9kZU1hcCk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNoaWxkcmVuTm9kZU1hcCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkcmVuTm9kZU1hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuTm9kZU1hcFtrZXldLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsQ2hpbGRyZW5Ob2RlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxSZWN1cnNpdmVseShjaGlsZHJlbk5vZGVNYXAsIGNoaWxkcmVuTm9kZU1hcFtrZXldLCBhbGxDaGlsZHJlbk5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb2xsVGltZVRvcG9sb2d5TWFwW2tleV0gPSBhbGxDaGlsZHJlbk5vZGVzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9sbFRpbWVUb3BvbG9neU1hcFtrZXldID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9jYXRpb25TZWxlY3Rpb24obG9jYXRpb24pO1xuXG4gICAgfVxuICAgIGxvY2F0aW9uU2VsZWN0aW9uKGxvY2F0aW9uOiBSb2xsVGltZUludGVyZmFjZSkge1xuICAgICAgICBsb2NhdGlvbi5pc0NoZWNrZWQgPSAhbG9jYXRpb24uaXNDaGVja2VkO1xuICAgICAgICBpZiAobG9jYXRpb24uaXNDaGVja2VkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGVJZHMuaW5kZXhPZihsb2NhdGlvbi50b3BvbG9neU5vZGUubm9kZUlkKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTm9kZUlkcy5wdXNoKGxvY2F0aW9uLnRvcG9sb2d5Tm9kZS5ub2RlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGVJZHMgPSB0aGlzLnNlbGVjdGVkTm9kZUlkcy5maWx0ZXIoZSA9PiBlICE9PSBsb2NhdGlvbi50b3BvbG9neU5vZGUubm9kZUlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcmVkUm9sbFRpbWVEYXRhLm1hcChub2RlID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJvbGxUaW1lVG9wb2xvZ3lNYXBbbG9jYXRpb24udG9wb2xvZ3lOb2RlLm5vZGVJZF0uaW5kZXhPZihub2RlLnRvcG9sb2d5Tm9kZS5ub2RlSWQudG9TdHJpbmcoKSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIG5vZGUuaXNDaGVja2VkID0gbG9jYXRpb24uaXNDaGVja2VkO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGVJZHMuaW5kZXhPZihub2RlLnRvcG9sb2d5Tm9kZS5ub2RlSWQpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGVJZHMucHVzaChub2RlLnRvcG9sb2d5Tm9kZS5ub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGVJZHMgPSB0aGlzLnNlbGVjdGVkTm9kZUlkcy5maWx0ZXIoZSA9PiBlICE9PSBub2RlLnRvcG9sb2d5Tm9kZS5ub2RlSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2hpbGRyZW5Ob2RlcyhjaGlsZHJlbk5vZGVNYXA6IE9iamVjdCkge1xuICAgICAgICBsZXQgdG9wb2xvZ3lOb2RlOiBUb3BvbG9neU9iamVjdEludGVyZmFjZTtcbiAgICAgICAgbGV0IGNoaWxkcmVuSWRzOiBudW1iZXJbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvbGxUaW1lRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9wb2xvZ3lOb2RlID0gdGhpcy5yb2xsVGltZURhdGFbaV0udG9wb2xvZ3lOb2RlO1xuICAgICAgICAgICAgY2hpbGRyZW5JZHMgPSB0aGlzLmV4dHJhY3ROb2RlSWRGcm9tSHJlZih0b3BvbG9neU5vZGUuY2hpbGROb2Rlc0hyZWZzKTtcbiAgICAgICAgICAgIGNoaWxkcmVuTm9kZU1hcFt0b3BvbG9neU5vZGUubm9kZUlkXSA9IGNoaWxkcmVuSWRzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsbFJlY3Vyc2l2ZWx5KGNoaWxkcmVuTm9kZU1hcDogT2JqZWN0LCBjdXJyZW50Q2hpbGRyZW5Ob2RlcywgYWxsQ2hpbGRyZW5Ob2Rlczogc3RyaW5nW10pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Q2hpbGRyZW5Ob2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYWxsQ2hpbGRyZW5Ob2Rlcy5wdXNoKGN1cnJlbnRDaGlsZHJlbk5vZGVzW2ldKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNoaWxkcmVuTm9kZU1hcCkge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbk5vZGVNYXAuaGFzT3duUHJvcGVydHkoa2V5KSAmJlxuICAgICAgICAgICAgICAgICAgICAoa2V5ID09PSBjdXJyZW50Q2hpbGRyZW5Ob2RlcyBbaV0gJiYgY2hpbGRyZW5Ob2RlTWFwW2tleV0ubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxsUmVjdXJzaXZlbHkoY2hpbGRyZW5Ob2RlTWFwLCBjaGlsZHJlbk5vZGVNYXBba2V5XSwgYWxsQ2hpbGRyZW5Ob2Rlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXh0cmFjdE5vZGVJZEZyb21IcmVmKGhyZWZBcnJheTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGlkQXJyOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBsZXQgaWRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaHJlZkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZHMgPSBocmVmQXJyYXlbaV0uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgIGlkQXJyLnB1c2goaWRzW2lkcy5sZW5ndGggLSAxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlkQXJyO1xuICAgIH1cblxuICAgIHByb2Nlc3NUb3BvbG9neSh0b3BvbG9neU9iajogQXJyYXk8Um9sbFRpbWVJbnRlcmZhY2U+KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFsbEdhbWluZ0RheXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvcG9sb2d5T2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b3BvbG9neU9ialtpXS50b3BvbG9neU5vZGUubG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uUGF0aCh0b3BvbG9neU9ialtpXS50b3BvbG9neU5vZGUubmFtZSwgdG9wb2xvZ3lPYmpbaV0udG9wb2xvZ3lOb2RlLnBhdGgpO1xuICAgICAgICAgICAgdG9wb2xvZ3lPYmpbaV0uY3VycmVudEdhbWluZ0RheVZpZXdWYWx1ZSA9IG5ldyBEYXRlKHRvcG9sb2d5T2JqW2ldLmN1cnJlbnRHYW1pbmdEYXkpO1xuICAgICAgICAgICAgdG9wb2xvZ3lPYmpbaV0ubmV4dFJvbGxEdG1WaWV3VmFsdWUgPSBuZXcgRGF0ZSh0b3BvbG9neU9ialtpXS5uZXh0Um9sbER0bSk7XG4gICAgICAgICAgICB0b3BvbG9neU9ialtpXS5pc0NoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGFsbEdhbWluZ0RheXMucHVzaCh0b3BvbG9neU9ialtpXS5jdXJyZW50R2FtaW5nRGF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVuaXF1ZUdhbWluZ0RheXMgPSAoQXJyYXkuZnJvbShuZXcgU2V0KGFsbEdhbWluZ0RheXMpKSkuc29ydCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5pcXVlR2FtaW5nRGF5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtaW5nRGF5cy5wdXNoKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHVuaXF1ZUdhbWluZ0RheXNbaV0sXG4gICAgICAgICAgICAgICAgICAgIHZpZXdWYWx1ZTogbmV3IERhdGUodW5pcXVlR2FtaW5nRGF5c1tpXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYXRpb25QYXRoKGN1cnJlbnRUb3BvbG9neU5hbWUsIHBhdGgpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgbGV0IGZvcm1hdHRlZFBhdGg6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoIDw9IDIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFBhdGggPSBjdXJyZW50VG9wb2xvZ3lOYW1lLnNwbGl0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXRoID0gY3VycmVudFRvcG9sb2d5TmFtZSArICcsJyArIHBhdGguc2xpY2UoMSwgLTEpO1xuICAgICAgICAgICAgZm9ybWF0dGVkUGF0aCA9IHBhdGguc3BsaXQoJywnKS5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFBhdGg7XG4gICAgfVxuXG4gICAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaWFsb2dSZWYuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBvbkdhbWluZ0RheVNlbGVjdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE5vZGVJZHMgPSBbXTtcbiAgICAgICAgdGhpcy5yZW5kZXJWaWV3KCk7XG4gICAgfVxuXG4gICAgcmVuZGVyVmlldygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZFJvbGxUaW1lRGF0YSA9IHRoaXMuc29ydERhdGFPYmooXG4gICAgICAgICAgICB0aGlzLnJvbGxUaW1lRGF0YS5maWx0ZXIoZGF0YSA9PlxuICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudEdhbWluZ0RheSA9PT0gdGhpcy5zZWxlY3RlZEdhbWluZ0RheS50b1N0cmluZygpXG4gICAgICAgICAgICApKTtcbiAgICB9XG5cbiAgICBzb3J0RGF0YU9iaihvYmopOiBBcnJheTxSb2xsVGltZUludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gb2JqLnNvcnQoKGEsIGIpID0+XG4gICAgICAgICAgICAoYS50b3BvbG9neU5vZGUucGFyZW50Tm9kZUlkID4gYi50b3BvbG9neU5vZGUucGFyZW50Tm9kZUlkKSA/IDEgOlxuICAgICAgICAgICAgICAgICgoYi50b3BvbG9neU5vZGUucGFyZW50Tm9kZUlkID4gYS50b3BvbG9neU5vZGUucGFyZW50Tm9kZUlkKSA/IC0xIDogMCkpO1xuICAgIH1cblxuICAgIHN1Ym1pdFJvbGxUaW1lKCkge1xuICAgICAgICB0aGlzLmNhZ2VTZXJ2aWNlLnBvc3RSb2xsVGltZURhdGEodGhpcy5yb2xsVGltZVBheWxvYWREYXRhKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9ICdhcHBsaWNhdGlvbi5hcHAuY29tbW9uLmxhYmVscy5UT1BTVUJOQVYuUk9MTF9USU1FX1VQREFURUQnO1xuICAgICAgICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoa2V5KSwgJycsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsUG9zaXRpb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgcGFuZWxDbGFzczogJ3NuYWNrX19zdWNjZXNzJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbiJdfQ==