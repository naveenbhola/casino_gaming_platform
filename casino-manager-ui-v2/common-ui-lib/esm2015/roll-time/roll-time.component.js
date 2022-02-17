import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RollTimeDialogComponent } from './roll-time-diaglog/roll-time-dialog.component';
import { dialogSize } from '../constants/constants';
export class RollTimeComponent {
    constructor(dialog) {
        this.dialog = dialog;
    }
    ngOnInit() {
    }
    openDialog() {
        this.dialog.open(RollTimeDialogComponent, {
            width: dialogSize.medium,
            height: '600px'
        });
    }
}
RollTimeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-roll-time',
                template: "<button mat-menu-item role=\"menuitem\" (click)=\"openDialog()\">\n  <span [translate]=\"'application.app.common.labels.TOPSUBNAV.SHOW_ROLL_TIME'\">Show Roll Time</span>\n</button>\n\n\n\n",
                styles: [""]
            },] }
];
RollTimeComponent.ctorParameters = () => [
    { type: MatDialog }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sbC10aW1lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL3JvbGwtdGltZS9yb2xsLXRpbWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUN2RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFPbEQsTUFBTSxPQUFPLGlCQUFpQjtJQUUxQixZQUFvQixNQUFpQjtRQUFqQixXQUFNLEdBQU4sTUFBTSxDQUFXO0lBQ3JDLENBQUM7SUFFRCxRQUFRO0lBQ1IsQ0FBQztJQUVELFVBQVU7UUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtZQUN0QyxLQUFLLEVBQUUsVUFBVSxDQUFDLE1BQU07WUFDeEIsTUFBTSxFQUFFLE9BQU87U0FDbEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7O1lBbEJKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsd01BQXlDOzthQUU1Qzs7O1lBUlEsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQge1JvbGxUaW1lRGlhbG9nQ29tcG9uZW50fSBmcm9tICcuL3JvbGwtdGltZS1kaWFnbG9nL3JvbGwtdGltZS1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7ZGlhbG9nU2l6ZX0gZnJvbSAnLi4vY29uc3RhbnRzL2NvbnN0YW50cyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYXBwLXJvbGwtdGltZScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3JvbGwtdGltZS5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vcm9sbC10aW1lLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUm9sbFRpbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkaWFsb2c6IE1hdERpYWxvZykge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIG9wZW5EaWFsb2coKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oUm9sbFRpbWVEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgICAgICAgIHdpZHRoOiBkaWFsb2dTaXplLm1lZGl1bSxcbiAgICAgICAgICAgIGhlaWdodDogJzYwMHB4J1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxuIl19