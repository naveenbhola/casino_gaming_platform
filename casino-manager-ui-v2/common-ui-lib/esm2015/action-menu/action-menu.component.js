import { Component, Input } from '@angular/core';
import { dialogSize } from './../constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { WinnerEligibleSessionsComponent } from '../header/winner-eligible-sessions/winner-eligible-sessions.component';
import { PlayerSearchComponent } from '../player-search/player-search.component';
export class ActionMenuComponent {
    constructor(dialog) {
        this.dialog = dialog;
    }
    winnerEligibleSessions(cmd) {
        const dialogRef = this.dialog.open(WinnerEligibleSessionsComponent, {
            width: dialogSize.large,
            height: '45vw',
            data: { cmd: cmd }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    openPlayerSearch() {
        const dialogRef = this.dialog.open(PlayerSearchComponent, {
            width: dialogSize.large,
            height: '45vw',
            data: { cmd: '' }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
ActionMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-action-menu',
                template: "<button mat-button\n        [matMenuTriggerFor]=\"usermenu\"\n        color=\"primary\"\n        aria-hasPopup=\"true\"\n        role=\"menu\">\n  <mat-icon>more_vert</mat-icon>\n</button>\n\n<mat-menu #usermenu=\"matMenu\" [overlapTrigger]=\"false\">\n  <app-roll-time ></app-roll-time>\n  <mat-divider></mat-divider>\n  <button mat-menu-item role=\"menuitem\" (click)=\"openPlayerSearch()\">\n    <span>Player Search</span>\n  </button>\n  <mat-divider></mat-divider>\n  <button mat-menu-item role=\"menuitem\">\n    <span>User Search</span>\n  </button>\n  <button mat-menu-item (click)=\"winnerEligibleSessions('WINNER')\" *ngIf=\"appName === 'CASINO_MGR'\">\n    <span>Promotions - Winners</span>\n  </button>\n  <button mat-menu-item (click)=\"winnerEligibleSessions('ELIGIBLE_SESSION')\" *ngIf=\"appName === 'CASINO_MGR'\">\n    <span>Promotions - Eligible Sessions</span>\n  </button>\n</mat-menu>\n",
                styles: [""]
            },] }
];
ActionMenuComponent.ctorParameters = () => [
    { type: MatDialog }
];
ActionMenuComponent.propDecorators = {
    appName: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvYWN0aW9uLW1lbnUvYWN0aW9uLW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sdUVBQXVFLENBQUM7QUFDdEgsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFRL0UsTUFBTSxPQUFPLG1CQUFtQjtJQUc5QixZQUNXLE1BQWlCO1FBQWpCLFdBQU0sR0FBTixNQUFNLENBQVc7SUFDNUIsQ0FBQztJQUNELHNCQUFzQixDQUFDLEdBQUc7UUFDeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLEVBQUU7WUFDbEUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLO1lBQ3ZCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQztTQUNqQixDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBRTNDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNDLGdCQUFnQjtRQUNaLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQ3RELEtBQUssRUFBRSxVQUFVLENBQUMsS0FBSztZQUN2QixNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUM7U0FDbEIsQ0FBQyxDQUFDO1FBQ0gsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUUzQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7OztZQTlCSixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsdTVCQUEyQzs7YUFFNUM7OztZQVRRLFNBQVM7OztzQkFXZixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZGlhbG9nU2l6ZX0gZnJvbSAnLi8uLi9jb25zdGFudHMvY29uc3RhbnRzJztcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQge1dpbm5lckVsaWdpYmxlU2Vzc2lvbnNDb21wb25lbnR9IGZyb20gJy4uL2hlYWRlci93aW5uZXItZWxpZ2libGUtc2Vzc2lvbnMvd2lubmVyLWVsaWdpYmxlLXNlc3Npb25zLmNvbXBvbmVudCc7XG5pbXBvcnQge1BsYXllclNlYXJjaENvbXBvbmVudH0gZnJvbSAnLi4vcGxheWVyLXNlYXJjaC9wbGF5ZXItc2VhcmNoLmNvbXBvbmVudCc7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWFjdGlvbi1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2FjdGlvbi1tZW51LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYWN0aW9uLW1lbnUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBBY3Rpb25NZW51Q29tcG9uZW50IHtcbiAgQElucHV0KCkgYXBwTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGRpYWxvZzogTWF0RGlhbG9nKSB7XG4gIH1cbiAgd2lubmVyRWxpZ2libGVTZXNzaW9ucyhjbWQpOiB2b2lkIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKFdpbm5lckVsaWdpYmxlU2Vzc2lvbnNDb21wb25lbnQsIHtcbiAgICAgIHdpZHRoOiBkaWFsb2dTaXplLmxhcmdlLFxuICAgICAgaGVpZ2h0OiAnNDV2dycsXG4gICAgICBkYXRhOiB7Y21kOiBjbWR9XG4gICAgfSk7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG5cbiAgICB9KTtcbiAgfVxuICAgIG9wZW5QbGF5ZXJTZWFyY2goKSB7XG4gICAgICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oUGxheWVyU2VhcmNoQ29tcG9uZW50LCB7XG4gICAgICAgICAgICB3aWR0aDogZGlhbG9nU2l6ZS5sYXJnZSxcbiAgICAgICAgICAgIGhlaWdodDogJzQ1dncnLFxuICAgICAgICAgICAgZGF0YToge2NtZDogJyd9XG4gICAgICAgIH0pO1xuICAgICAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcblxuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=