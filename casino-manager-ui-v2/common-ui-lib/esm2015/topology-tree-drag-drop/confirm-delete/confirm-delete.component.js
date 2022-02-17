import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
export class ConfirmDeleteComponent {
    constructor(dialogRef, data, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.translate = translate;
        this.nodeToDelete = this.data.nodeToDelete;
    }
    ngOnInit() {
    }
    closeDialogBox() {
        this.dialogRef.closeAll();
    }
}
ConfirmDeleteComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-confirm-delete',
                template: "<h2 mat-dialog-title class=\"d-flex border-bottom\">\n  <span translate=\"application.app.CONFIGURATION_LABELS.AREAS.CONFIRM_MSG\"></span>\n  <span class=\"space-filler\"></span>\n</h2>\n<div mat-dialog-content>\n  <h6 *ngIf=\"nodeToDelete.level === 0\" translate=\"application.app.CONFIGURATION_LABELS.AREAS.THIS_AG_ASSN_ACTIVE_USERS\">\n  </h6>\n  <h6 *ngIf=\"nodeToDelete.level === 1\" translate=\"application.app.CONFIGURATION_LABELS.AREAS.THIS_LAST_LOCATION\">\n  </h6>\n  <p *ngIf=\"nodeToDelete.level === 0\">\n    <strong translate=\"application.app.CONFIGURATION_LABELS.AREAS.ARE_U_SURE_WANNA_DELETE\">\n    </strong>\n  </p>\n  <p *ngIf=\"nodeToDelete.level === 1\">\n    <strong translate=\"application.app.CONFIGURATION_LABELS.AREAS.ARE_U_SURE_WANNA_DELETE_location\">\n    </strong>\n  </p>\n</div>\n<div mat-dialog-actions class=\"confirm__action__buttons\">\n  <button mat-button\n          color=\"primary\"\n          mat-stroked-button\n          class=\"common-button mr-2\"\n          (click)=\"closeDialogBox()\">\n          <span [translate]=\"'application.app.common.labels.CANCEL'\">Cancel</span>\n  </button>\n  <button mat-button\n          color=\"primary\"\n          mat-raised-button\n          [mat-dialog-close]=\"true\"\n          class=\"common-button\"\n          cdkFocusInitial>\n          <span [translate]=\"'application.app.common.labels.OK'\">Ok</span>\n  </button>\n</div>",
                styles: [".text__info{font:500 13.62px/18px Lato;margin:0 0 12px}.confirm__action__buttons{float:right}"]
            },] }
];
ConfirmDeleteComponent.ctorParameters = () => [
    { type: MatDialog },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] },
    { type: TranslateService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybS1kZWxldGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvdG9wb2xvZ3ktdHJlZS1kcmFnLWRyb3AvY29uZmlybS1kZWxldGUvY29uZmlybS1kZWxldGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFPckQsTUFBTSxPQUFPLHNCQUFzQjtJQUVqQyxZQUNhLFNBQW9CLEVBQ0ssSUFBSSxFQUM3QixTQUEyQjtRQUYzQixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ0ssU0FBSSxHQUFKLElBQUksQ0FBQTtRQUM3QixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQ2pELENBQUM7SUFFRCxRQUFRO0lBQ1IsQ0FBQztJQUVELGNBQWM7UUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlCLENBQUM7OztZQW5CRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsazVDQUE4Qzs7YUFFL0M7OztZQVB5QixTQUFTOzRDQVkxQixNQUFNLFNBQUMsZUFBZTtZQVh2QixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5qZWN0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHtUcmFuc2xhdGVTZXJ2aWNlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWNvbmZpcm0tZGVsZXRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbmZpcm0tZGVsZXRlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY29uZmlybS1kZWxldGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb25maXJtRGVsZXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHVibGljIG5vZGVUb0RlbGV0ZTtcbiAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZyxcbiAgICAgICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIHB1YmxpYyBkYXRhLFxuICAgICAgICBwdWJsaWMgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMubm9kZVRvRGVsZXRlID0gdGhpcy5kYXRhLm5vZGVUb0RlbGV0ZTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgY2xvc2VEaWFsb2dCb3goKTogdm9pZCB7XG4gICAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZUFsbCgpO1xuICB9XG59XG4iXX0=