import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialComponentModule } from './material-component/material-component.module';
import { AppSwitcherComponent } from './app-switcher/app-switcher.component';
import { AppMenuComponent } from './app-switcher/app-menu.component';
import { AppListComponent } from './app-switcher/app-list.component';
import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
import { CageService } from './services/cage.service';
import { CasinomanagerService } from './services/casinomanager.service';
import { SortingService } from './sorting/sorting.service';
import { CommonTranslationModule } from './common-translation/common-translation.module';
import { LoaderComponent } from './loader/loader.component';
import { TopNavBarComponent } from './header/top-nav-bar/top-nav-bar.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { configRxLogoutStompConfig } from './web-sockets/ws-auth.config';
import { ChipIconsComponent } from './chip-icons/chip-icons.component';
import { UtilityService } from './services/utility.service';
import { TopologyService } from './services/topology.service';
import { SubnavBarComponent } from './header/subnav-bar/subnav-bar.component';
import { PromotionService } from './services/promotion.service';
import { SubnavDataBarComponent } from './header/subnav-data-bar/subnav-data-bar.component';
import { CommonTranslationService } from './common-translation/common-translation.service';
import { ActionMenuComponent } from './action-menu/action-menu.component';
import { AppRollTimeModule } from './roll-time/app-roll-time.module';
import { WinnerEligibleSessionsComponent } from './header/winner-eligible-sessions/winner-eligible-sessions.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AppAddNodeTopologyComponent } from './app-add-node-topology/app-add-node-topology.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppTabBarComponent } from './app-tab-bar/app-tab-bar.component';
import { BuyInsComponent } from './buy-ins/buy-ins.component';
import { OpenerCloserComponent } from './opener-closer/opener-closer.component';
import { FillCreditComponent } from './fill-credit/fill-credit.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ChipsetPanelComponent } from './chipset-panel/chipset-panel.component';
import { PlayerSearchComponent } from './player-search/player-search.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptorService } from "./services/Authentication/jwt-interceptor.service";
const ɵ0 = configRxLogoutStompConfig, ɵ1 = rxStompServiceFactory;
export class CommonUiLibModule {
}
CommonUiLibModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AppSwitcherComponent,
                    AppMenuComponent,
                    AppListComponent,
                    LoaderComponent,
                    TopNavBarComponent,
                    ChipIconsComponent,
                    SubnavBarComponent,
                    SubnavDataBarComponent,
                    ActionMenuComponent,
                    WinnerEligibleSessionsComponent,
                    AccessDeniedComponent,
                    AppAddNodeTopologyComponent,
                    AppTabBarComponent,
                    BuyInsComponent,
                    OpenerCloserComponent,
                    FillCreditComponent,
                    GameHistoryComponent,
                    BreadcrumbComponent,
                    ChipsetPanelComponent,
                    PlayerSearchComponent
                ],
                imports: [
                    CommonModule,
                    MaterialComponentModule,
                    CommonTranslationModule,
                    AppRollTimeModule,
                    MatProgressBarModule,
                    LoggerModule.forRoot({
                        serverLoggingUrl: '',
                        level: NgxLoggerLevel.OFF,
                        serverLogLevel: NgxLoggerLevel.OFF,
                        disableConsoleLogging: false
                    }),
                ],
                providers: [
                    AlertService,
                    UserService,
                    DatePipe,
                    DecimalPipe,
                    CageService,
                    CasinomanagerService,
                    TopologyService,
                    SortingService,
                    UtilityService,
                    PromotionService,
                    CommonTranslationService,
                    {
                        provide: InjectableRxStompConfig,
                        useValue: ɵ0
                    },
                    {
                        provide: RxStompService,
                        useFactory: ɵ1,
                        deps: [InjectableRxStompConfig]
                    },
                    {
                        provide: HTTP_INTERCEPTORS,
                        useClass: JwtInterceptorService,
                        multi: true
                    }
                ],
                entryComponents: [],
                exports: [
                    MaterialComponentModule,
                    CommonTranslationModule,
                    HttpClientModule,
                    AppSwitcherComponent,
                    AppMenuComponent,
                    AppListComponent,
                    LoaderComponent,
                    TopNavBarComponent,
                    ChipIconsComponent,
                    SubnavBarComponent,
                    SubnavDataBarComponent,
                    WinnerEligibleSessionsComponent,
                    AccessDeniedComponent,
                    AppTabBarComponent,
                    BuyInsComponent,
                    OpenerCloserComponent,
                    FillCreditComponent,
                    GameHistoryComponent,
                    BreadcrumbComponent,
                    ChipsetPanelComponent
                ]
            },] }
];
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLXVpLWxpYi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9jb21tb24tdWktbGliLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUN2RixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNuRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNuRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUN0RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDdkYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQzlFLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxjQUFjLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRyxPQUFPLEVBQUMseUJBQXlCLEVB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WCxRQUFRO29CQUNSLFdBQVc7b0JBQ1gsV0FBVztvQkFDWCxvQkFBb0I7b0JBQ3BCLGVBQWU7b0JBQ2YsY0FBYztvQkFDZCxjQUFjO29CQUNkLGdCQUFnQjtvQkFDaEIsd0JBQXdCO29CQUN4Qjt3QkFDSSxPQUFPLEVBQUUsdUJBQXVCO3dCQUNoQyxRQUFRLElBQTJCO3FCQUN0QztvQkFDRDt3QkFDSSxPQUFPLEVBQUUsY0FBYzt3QkFDdkIsVUFBVSxJQUF1Qjt3QkFDakMsSUFBSSxFQUFFLENBQUMsdUJBQXVCLENBQUM7cUJBQ2xDO29CQUNEO3dCQUNJLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLFFBQVEsRUFBRSxxQkFBcUI7d0JBQy9CLEtBQUssRUFBRSxJQUFJO3FCQUNkO2lCQUNKO2dCQUNELGVBQWUsRUFBRSxFQUFFO2dCQUNuQixPQUFPLEVBQUU7b0JBQ0wsdUJBQXVCO29CQUN2Qix1QkFBdUI7b0JBQ3ZCLGdCQUFnQjtvQkFDaEIsb0JBQW9CO29CQUNwQixnQkFBZ0I7b0JBQ2hCLGdCQUFnQjtvQkFDaEIsZUFBZTtvQkFDZixrQkFBa0I7b0JBQ2xCLGtCQUFrQjtvQkFDbEIsa0JBQWtCO29CQUNsQixzQkFBc0I7b0JBQ3RCLCtCQUErQjtvQkFDL0IscUJBQXFCO29CQUNyQixrQkFBa0I7b0JBQ2xCLGVBQWU7b0JBQ2YscUJBQXFCO29CQUNyQixtQkFBbUI7b0JBQ25CLG9CQUFvQjtvQkFDcEIsbUJBQW1CO29CQUNuQixxQkFBcUI7aUJBQ3hCO2FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge01hdGVyaWFsQ29tcG9uZW50TW9kdWxlfSBmcm9tICcuL21hdGVyaWFsLWNvbXBvbmVudC9tYXRlcmlhbC1jb21wb25lbnQubW9kdWxlJztcbmltcG9ydCB7QXBwU3dpdGNoZXJDb21wb25lbnR9IGZyb20gJy4vYXBwLXN3aXRjaGVyL2FwcC1zd2l0Y2hlci5jb21wb25lbnQnO1xuaW1wb3J0IHtBcHBNZW51Q29tcG9uZW50fSBmcm9tICcuL2FwcC1zd2l0Y2hlci9hcHAtbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHtBcHBMaXN0Q29tcG9uZW50fSBmcm9tICcuL2FwcC1zd2l0Y2hlci9hcHAtbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHtBbGVydFNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvYWxlcnQuc2VydmljZSc7XG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5pbXBvcnQge0NhZ2VTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL2NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge0Nhc2lub21hbmFnZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL2Nhc2lub21hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQge1NvcnRpbmdTZXJ2aWNlfSBmcm9tICcuL3NvcnRpbmcvc29ydGluZy5zZXJ2aWNlJztcbmltcG9ydCB7Q29tbW9uVHJhbnNsYXRpb25Nb2R1bGV9IGZyb20gJy4vY29tbW9uLXRyYW5zbGF0aW9uL2NvbW1vbi10cmFuc2xhdGlvbi5tb2R1bGUnO1xuaW1wb3J0IHtMb2FkZXJDb21wb25lbnR9IGZyb20gJy4vbG9hZGVyL2xvYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHtUb3BOYXZCYXJDb21wb25lbnR9IGZyb20gJy4vaGVhZGVyL3RvcC1uYXYtYmFyL3RvcC1uYXYtYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0luamVjdGFibGVSeFN0b21wQ29uZmlnLCBSeFN0b21wU2VydmljZSwgcnhTdG9tcFNlcnZpY2VGYWN0b3J5fSBmcm9tICdAc3RvbXAvbmcyLXN0b21wanMnO1xuaW1wb3J0IHtjb25maWdSeExvZ291dFN0b21wQ29uZmlnfSBmcm9tICcuL3dlYi1zb2NrZXRzL3dzLWF1dGguY29uZmlnJztcbmltcG9ydCB7Q2hpcEljb25zQ29tcG9uZW50fSBmcm9tICcuL2NoaXAtaWNvbnMvY2hpcC1pY29ucy5jb21wb25lbnQnO1xuaW1wb3J0IHtVdGlsaXR5U2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy91dGlsaXR5LnNlcnZpY2UnO1xuaW1wb3J0IHtUb3BvbG9neVNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvdG9wb2xvZ3kuc2VydmljZSc7XG5pbXBvcnQge1N1Ym5hdkJhckNvbXBvbmVudH0gZnJvbSAnLi9oZWFkZXIvc3VibmF2LWJhci9zdWJuYXYtYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQge1Byb21vdGlvblNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvcHJvbW90aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtTdWJuYXZEYXRhQmFyQ29tcG9uZW50fSBmcm9tICcuL2hlYWRlci9zdWJuYXYtZGF0YS1iYXIvc3VibmF2LWRhdGEtYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQge0NvbW1vblRyYW5zbGF0aW9uU2VydmljZX0gZnJvbSAnLi9jb21tb24tdHJhbnNsYXRpb24vY29tbW9uLXRyYW5zbGF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtBY3Rpb25NZW51Q29tcG9uZW50fSBmcm9tICcuL2FjdGlvbi1tZW51L2FjdGlvbi1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQge0FwcFJvbGxUaW1lTW9kdWxlfSBmcm9tICcuL3JvbGwtdGltZS9hcHAtcm9sbC10aW1lLm1vZHVsZSc7XG5pbXBvcnQge1dpbm5lckVsaWdpYmxlU2Vzc2lvbnNDb21wb25lbnR9IGZyb20gJy4vaGVhZGVyL3dpbm5lci1lbGlnaWJsZS1zZXNzaW9ucy93aW5uZXItZWxpZ2libGUtc2Vzc2lvbnMuY29tcG9uZW50JztcbmltcG9ydCB7QWNjZXNzRGVuaWVkQ29tcG9uZW50fSBmcm9tICcuL2FjY2Vzcy1kZW5pZWQvYWNjZXNzLWRlbmllZC5jb21wb25lbnQnO1xuaW1wb3J0IHtBcHBBZGROb2RlVG9wb2xvZ3lDb21wb25lbnR9IGZyb20gJy4vYXBwLWFkZC1ub2RlLXRvcG9sb2d5L2FwcC1hZGQtbm9kZS10b3BvbG9neS5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9wcm9ncmVzcy1iYXInO1xuaW1wb3J0IHtBcHBUYWJCYXJDb21wb25lbnR9IGZyb20gJy4vYXBwLXRhYi1iYXIvYXBwLXRhYi1iYXIuY29tcG9uZW50JztcbmltcG9ydCB7QnV5SW5zQ29tcG9uZW50fSBmcm9tICcuL2J1eS1pbnMvYnV5LWlucy5jb21wb25lbnQnO1xuaW1wb3J0IHtPcGVuZXJDbG9zZXJDb21wb25lbnR9IGZyb20gJy4vb3BlbmVyLWNsb3Nlci9vcGVuZXItY2xvc2VyLmNvbXBvbmVudCc7XG5pbXBvcnQge0ZpbGxDcmVkaXRDb21wb25lbnR9IGZyb20gJy4vZmlsbC1jcmVkaXQvZmlsbC1jcmVkaXQuY29tcG9uZW50JztcbmltcG9ydCB7R2FtZUhpc3RvcnlDb21wb25lbnR9IGZyb20gJy4vZ2FtZS1oaXN0b3J5L2dhbWUtaGlzdG9yeS5jb21wb25lbnQnO1xuaW1wb3J0IHtCcmVhZGNydW1iQ29tcG9uZW50fSBmcm9tICcuL2JyZWFkY3J1bWIvYnJlYWRjcnVtYi5jb21wb25lbnQnO1xuaW1wb3J0IHtDaGlwc2V0UGFuZWxDb21wb25lbnR9IGZyb20gJy4vY2hpcHNldC1wYW5lbC9jaGlwc2V0LXBhbmVsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQbGF5ZXJTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL3BsYXllci1zZWFyY2gvcGxheWVyLXNlYXJjaC5jb21wb25lbnQnO1xuaW1wb3J0IHtMb2dnZXJNb2R1bGUsIE5neExvZ2dlckxldmVsfSBmcm9tICduZ3gtbG9nZ2VyJztcbmltcG9ydCB7RGF0ZVBpcGUsIERlY2ltYWxQaXBlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtIVFRQX0lOVEVSQ0VQVE9SU30gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XG5pbXBvcnQge0p3dEludGVyY2VwdG9yU2VydmljZX0gZnJvbSBcIi4vc2VydmljZXMvQXV0aGVudGljYXRpb24vand0LWludGVyY2VwdG9yLnNlcnZpY2VcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgQXBwU3dpdGNoZXJDb21wb25lbnQsXG4gICAgICAgIEFwcE1lbnVDb21wb25lbnQsXG4gICAgICAgIEFwcExpc3RDb21wb25lbnQsXG4gICAgICAgIExvYWRlckNvbXBvbmVudCxcbiAgICAgICAgVG9wTmF2QmFyQ29tcG9uZW50LFxuICAgICAgICBDaGlwSWNvbnNDb21wb25lbnQsXG4gICAgICAgIFN1Ym5hdkJhckNvbXBvbmVudCxcbiAgICAgICAgU3VibmF2RGF0YUJhckNvbXBvbmVudCxcbiAgICAgICAgQWN0aW9uTWVudUNvbXBvbmVudCxcbiAgICAgICAgV2lubmVyRWxpZ2libGVTZXNzaW9uc0NvbXBvbmVudCxcbiAgICAgICAgQWNjZXNzRGVuaWVkQ29tcG9uZW50LFxuICAgICAgICBBcHBBZGROb2RlVG9wb2xvZ3lDb21wb25lbnQsXG4gICAgICAgIEFwcFRhYkJhckNvbXBvbmVudCxcbiAgICAgICAgQnV5SW5zQ29tcG9uZW50LFxuICAgICAgICBPcGVuZXJDbG9zZXJDb21wb25lbnQsXG4gICAgICAgIEZpbGxDcmVkaXRDb21wb25lbnQsXG4gICAgICAgIEdhbWVIaXN0b3J5Q29tcG9uZW50LFxuICAgICAgICBCcmVhZGNydW1iQ29tcG9uZW50LFxuICAgICAgICBDaGlwc2V0UGFuZWxDb21wb25lbnQsXG4gICAgICAgIFBsYXllclNlYXJjaENvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIE1hdGVyaWFsQ29tcG9uZW50TW9kdWxlLFxuICAgICAgICBDb21tb25UcmFuc2xhdGlvbk1vZHVsZSxcbiAgICAgICAgQXBwUm9sbFRpbWVNb2R1bGUsXG4gICAgICAgIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxuICAgICAgICBMb2dnZXJNb2R1bGUuZm9yUm9vdCh7XG4gICAgICAgICAgICBzZXJ2ZXJMb2dnaW5nVXJsOiAnJyxcbiAgICAgICAgICAgIGxldmVsOiBOZ3hMb2dnZXJMZXZlbC5PRkYsXG4gICAgICAgICAgICBzZXJ2ZXJMb2dMZXZlbDogTmd4TG9nZ2VyTGV2ZWwuT0ZGLFxuICAgICAgICAgICAgZGlzYWJsZUNvbnNvbGVMb2dnaW5nOiBmYWxzZVxuICAgICAgICB9KSxcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBBbGVydFNlcnZpY2UsXG4gICAgICAgIFVzZXJTZXJ2aWNlLFxuICAgICAgICBEYXRlUGlwZSxcbiAgICAgICAgRGVjaW1hbFBpcGUsXG4gICAgICAgIENhZ2VTZXJ2aWNlLFxuICAgICAgICBDYXNpbm9tYW5hZ2VyU2VydmljZSxcbiAgICAgICAgVG9wb2xvZ3lTZXJ2aWNlLFxuICAgICAgICBTb3J0aW5nU2VydmljZSxcbiAgICAgICAgVXRpbGl0eVNlcnZpY2UsXG4gICAgICAgIFByb21vdGlvblNlcnZpY2UsXG4gICAgICAgIENvbW1vblRyYW5zbGF0aW9uU2VydmljZSxcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogSW5qZWN0YWJsZVJ4U3RvbXBDb25maWcsXG4gICAgICAgICAgICB1c2VWYWx1ZTogY29uZmlnUnhMb2dvdXRTdG9tcENvbmZpZ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlOiBSeFN0b21wU2VydmljZSxcbiAgICAgICAgICAgIHVzZUZhY3Rvcnk6IHJ4U3RvbXBTZXJ2aWNlRmFjdG9yeSxcbiAgICAgICAgICAgIGRlcHM6IFtJbmplY3RhYmxlUnhTdG9tcENvbmZpZ11cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXG4gICAgICAgICAgICB1c2VDbGFzczogSnd0SW50ZXJjZXB0b3JTZXJ2aWNlLFxuICAgICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfVxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIE1hdGVyaWFsQ29tcG9uZW50TW9kdWxlLFxuICAgICAgICBDb21tb25UcmFuc2xhdGlvbk1vZHVsZSxcbiAgICAgICAgSHR0cENsaWVudE1vZHVsZSxcbiAgICAgICAgQXBwU3dpdGNoZXJDb21wb25lbnQsXG4gICAgICAgIEFwcE1lbnVDb21wb25lbnQsXG4gICAgICAgIEFwcExpc3RDb21wb25lbnQsXG4gICAgICAgIExvYWRlckNvbXBvbmVudCxcbiAgICAgICAgVG9wTmF2QmFyQ29tcG9uZW50LFxuICAgICAgICBDaGlwSWNvbnNDb21wb25lbnQsXG4gICAgICAgIFN1Ym5hdkJhckNvbXBvbmVudCxcbiAgICAgICAgU3VibmF2RGF0YUJhckNvbXBvbmVudCxcbiAgICAgICAgV2lubmVyRWxpZ2libGVTZXNzaW9uc0NvbXBvbmVudCxcbiAgICAgICAgQWNjZXNzRGVuaWVkQ29tcG9uZW50LFxuICAgICAgICBBcHBUYWJCYXJDb21wb25lbnQsXG4gICAgICAgIEJ1eUluc0NvbXBvbmVudCxcbiAgICAgICAgT3BlbmVyQ2xvc2VyQ29tcG9uZW50LFxuICAgICAgICBGaWxsQ3JlZGl0Q29tcG9uZW50LFxuICAgICAgICBHYW1lSGlzdG9yeUNvbXBvbmVudCxcbiAgICAgICAgQnJlYWRjcnVtYkNvbXBvbmVudCxcbiAgICAgICAgQ2hpcHNldFBhbmVsQ29tcG9uZW50XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBDb21tb25VaUxpYk1vZHVsZSB7XG59XG4iXX0=