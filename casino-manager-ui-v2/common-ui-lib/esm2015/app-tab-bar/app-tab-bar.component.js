import { Component } from '@angular/core';
const PLAYERS_DATA = [
    { playername: 'Name1', playerwinloss: 9002000 },
    { playername: 'Name1', playerwinloss: 1800 },
    { playername: 'Name1', playerwinloss: 1750 },
    { playername: 'Name1', playerwinloss: 1640 },
    { playername: 'Name1', playerwinloss: 1510 },
    { playername: 'Name1', playerwinloss: 1380 },
    { playername: 'Name1', playerwinloss: 1000 },
    { playername: 'Name1', playerwinloss: 960 },
    { playername: 'Name1', playerwinloss: 815 },
    { playername: 'Name1', playerwinloss: 520 },
];
export class AppTabBarComponent {
    constructor() {
        this.playersListColumns = ['playername', 'playerwinloss'];
        this.winningPlayersList = PLAYERS_DATA;
    }
    ngOnInit() {
    }
}
AppTabBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-app-tab-bar',
                template: "<!--This html is applicable for this common-library only.-->\n<!-- Display Tab Bar Component -->\n<!-- Note: Color can be primary (default) and accent; it can be set as- color: \"accent\" -->\n<mat-tab-group animationDuration=\"0ms\">\n  <!-- This tag 'mat-tab' needs to be replicated while creating new tab.-->\n  <mat-tab label=\"Overview\">\n\n    <!-- Dummy Data -->\n\n    <!-- This overview has two columns:\n    **** column-1 for displaying consolidated data-block;\n    **** column-2 for displaying winning/losing players list. -->\n    <div class=\"row\">\n      <!-- Column-1: Displaying consolidated data-block;-->\n      <div class=\"col-8\">\n        <!-- Content tag put here intentionally to create a top-padding for following element.-->\n        <h2 style=\"padding: 21px 0;\"></h2>\n        <!-- Data-block starts here. -->\n        <mat-card class=\"site__data-card__wrapper\">\n          <mat-card-title class=\"site__data-card__title\">Gaming Area Name</mat-card-title>\n          <mat-divider color=\"primary\"></mat-divider>\n          <mat-card-content>\n            <!-- Show Gaming area data here -->\n            <div class=\"site__data-card__row\">\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Avg Bet</div>\n                <div class=\"site__data-card__value\">875</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Casino W/L</div>\n                <div class=\"site__data-card__value\">(850)</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Hold (%)</div>\n                <div class=\"site__data-card__value\">(11)</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Open Tables</div>\n                <div class=\"site__data-card__value\">2/2</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Rated Play (%)</div>\n                <div class=\"site__data-card__value\">43</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Theo Win</div>\n                <div class=\"site__data-card__value\">41</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Total Buy In</div>\n                <div class=\"site__data-card__value\">4,000</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Handle</div>\n                <div class=\"site__data-card__value\">3,500</div>\n              </div>\n              <div class=\"data-column\">\n                <div class=\"site__data-card__label\">Utilization (%)</div>\n                <div class=\"site__data-card__value\">14</div>\n              </div>\n            </div>\n          </mat-card-content>\n        </mat-card>\n        <!-- Data-block ends here. -->\n      </div>\n\n      <!-- Column-2: Displaying players-list. -->\n      <div class=\"col-4\">\n        <mat-card class=\"players-list__wrapper mat-elevation-z0 px-1\" >\n          <mat-card-title class=\"players-list__title\">Players</mat-card-title>\n          <mat-divider></mat-divider>\n          <mat-card-content class=\"players-list__tables\"\n                            style=\"max-height: 350px; overflow: hidden; overflow-y: auto;\">\n            <div class=\"players-list__table__wrapper text-center border\">\n              <table mat-table\n                     [dataSource]=\"winningPlayersList\"\n                     class=\"players-list__table w-100\">\n                <!-- Casino-Winning-Top-10 Column -->\n                <ng-container matColumnDef=\"playername\">\n                  <th mat-header-cell *matHeaderCellDef> Casino Winning Top 10 </th>\n                  <td mat-cell *matCellDef=\"let element\"> {{element.playername}} </td>\n                </ng-container>\n                <!-- Casino W/L Column -->\n                <ng-container matColumnDef=\"playerwinloss\">\n                  <th mat-header-cell *matHeaderCellDef> Casino W/L </th>\n                  <td mat-cell *matCellDef=\"let element\"> {{element.playerwinloss | roundUp}} </td>\n                </ng-container>\n                <tr mat-header-row *matHeaderRowDef=\"playersListColumns; sticky: true\"\n                    class=\"players-list__table__header-row\"></tr>\n                <tr mat-row *matRowDef=\"let row; columns: playersListColumns;\"\n                    class=\"players-list__table__row\"></tr>\n              </table>\n            </div>\n          </mat-card-content>\n        </mat-card>\n      </div>\n      <!-- Players-list ends here. -->\n    </div>\n\n  </mat-tab>\n\n  <mat-tab label=\"Other Tables\"></mat-tab>\n\n  <mat-tab label=\"Players\"></mat-tab>\n\n  <mat-tab label=\"Performance\"></mat-tab>\n\n  <mat-tab label=\"Manual Ratings\"></mat-tab>\n\n  <mat-tab label=\"Opener/Closer\"></mat-tab>\n\n</mat-tab-group>\n",
                styles: [""]
            },] }
];
AppTabBarComponent.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXRhYi1iYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvYXBwLXRhYi1iYXIvYXBwLXRhYi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFPbEQsTUFBTSxZQUFZLEdBQWtCO0lBQ2xDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFO0lBQzlDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBQzNDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBQzNDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBQzNDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBQzNDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBQzNDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO0lBQzNDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzFDLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFO0NBQzNDLENBQUM7QUFPRixNQUFNLE9BQU8sa0JBQWtCO0lBRTdCO1FBS0EsdUJBQWtCLEdBQWEsQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDL0QsdUJBQWtCLEdBQUcsWUFBWSxDQUFDO0lBTmxCLENBQUM7SUFFakIsUUFBUTtJQUNSLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQiwwaktBQTJDOzthQUU1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVyc0xpc3Qge1xuICBwbGF5ZXJuYW1lOnN0cmluZztcbiAgcGxheWVyd2lubG9zczpudW1iZXI7XG59XG5cbmNvbnN0IFBMQVlFUlNfREFUQTogUGxheWVyc0xpc3RbXSA9IFtcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDkwMDIwMDAgfSxcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDE4MDAgfSxcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDE3NTAgfSxcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDE2NDAgfSxcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDE1MTAgfSxcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDEzODAgfSxcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDEwMDAgfSxcbiAge3BsYXllcm5hbWU6ICdOYW1lMScsIHBsYXllcndpbmxvc3M6IDk2MCB9LFxuICB7cGxheWVybmFtZTogJ05hbWUxJywgcGxheWVyd2lubG9zczogODE1IH0sXG4gIHtwbGF5ZXJuYW1lOiAnTmFtZTEnLCBwbGF5ZXJ3aW5sb3NzOiA1MjAgfSxcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1hcHAtdGFiLWJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAtdGFiLWJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2FwcC10YWItYmFyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQXBwVGFiQmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgcGxheWVyc0xpc3RDb2x1bW5zOiBzdHJpbmdbXSA9IFsncGxheWVybmFtZScsICdwbGF5ZXJ3aW5sb3NzJ107XG4gIHdpbm5pbmdQbGF5ZXJzTGlzdCA9IFBMQVlFUlNfREFUQTtcbn1cbiJdfQ==