import { NgModule } from '@angular/core';
import { AppTablesComponent } from './app-tables.component';
import { MaterialComponentModule } from '../material-component/material-component.module';
import { CommonModule } from '@angular/common';
import { CommonTranslationModule } from '../common-translation/common-translation.module';
import { FilterComponent } from '../filter/filter.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AppTablesService } from './app-tables.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
export class AppTablesModule {
}
AppTablesModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    MaterialComponentModule,
                    CommonModule,
                    CommonTranslationModule,
                    OwlDateTimeModule,
                    OwlNativeDateTimeModule,
                    MatProgressSpinnerModule,
                    MatSortModule
                ],
                declarations: [
                    AppTablesComponent,
                    FilterComponent,
                    PaginationComponent
                ],
                exports: [
                    AppTablesComponent,
                    FilterComponent,
                    PaginationComponent
                ],
                providers: [AppTablesService]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXRhYmxlcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9hcHAtdGFibGVzL2FwcC10YWJsZXMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFDeEYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGlEQUFpRCxDQUFDO0FBQ3hGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM1RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUEyQnZELE1BQU0sT0FBTyxlQUFlOzs7WUF0QjNCLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUU7b0JBQ0wsdUJBQXVCO29CQUN2QixZQUFZO29CQUNaLHVCQUF1QjtvQkFDdkIsaUJBQWlCO29CQUNqQix1QkFBdUI7b0JBQ3ZCLHdCQUF3QjtvQkFDeEIsYUFBYTtpQkFDaEI7Z0JBQ0QsWUFBWSxFQUFFO29CQUNWLGtCQUFrQjtvQkFDbEIsZUFBZTtvQkFDZixtQkFBbUI7aUJBQ3RCO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxrQkFBa0I7b0JBQ2xCLGVBQWU7b0JBQ2YsbUJBQW1CO2lCQUN0QjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQzthQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBcHBUYWJsZXNDb21wb25lbnR9IGZyb20gJy4vYXBwLXRhYmxlcy5jb21wb25lbnQnO1xuaW1wb3J0IHtNYXRlcmlhbENvbXBvbmVudE1vZHVsZX0gZnJvbSAnLi4vbWF0ZXJpYWwtY29tcG9uZW50L21hdGVyaWFsLWNvbXBvbmVudC5tb2R1bGUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0NvbW1vblRyYW5zbGF0aW9uTW9kdWxlfSBmcm9tICcuLi9jb21tb24tdHJhbnNsYXRpb24vY29tbW9uLXRyYW5zbGF0aW9uLm1vZHVsZSc7XG5pbXBvcnQge0ZpbHRlckNvbXBvbmVudH0gZnJvbSAnLi4vZmlsdGVyL2ZpbHRlci5jb21wb25lbnQnO1xuaW1wb3J0IHtQYWdpbmF0aW9uQ29tcG9uZW50fSBmcm9tICcuLi9wYWdpbmF0aW9uL3BhZ2luYXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7T3dsRGF0ZVRpbWVNb2R1bGUsIE93bE5hdGl2ZURhdGVUaW1lTW9kdWxlfSBmcm9tICduZy1waWNrLWRhdGV0aW1lJztcbmltcG9ydCB7QXBwVGFibGVzU2VydmljZX0gZnJvbSAnLi9hcHAtdGFibGVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvcHJvZ3Jlc3Mtc3Bpbm5lcic7XG5pbXBvcnQgeyBNYXRTb3J0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc29ydCc7XG5pbXBvcnQge1dkdHNTcGVjaWFsQ2hhckRpcmVjdGl2ZX0gZnJvbSAnLi4vZGlyZWN0aXZlcy93ZHRzLXNwZWNpYWwtY2hhci5kaXJlY3RpdmUnO1xuaW1wb3J0IHtXZHRzU3BlY2lhbENoYXJQaXBlfSBmcm9tICcuLi9waXBlcy93ZHRzLXNwZWNpYWwtY2hhci5waXBlJztcbmltcG9ydCB7QW1vdW50Rm9ybWF0UGlwZX0gZnJvbSBcIi4uL3BpcGVzL2Ftb3VudC1mb3JtYXQucGlwZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgTWF0ZXJpYWxDb21wb25lbnRNb2R1bGUsXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgQ29tbW9uVHJhbnNsYXRpb25Nb2R1bGUsXG4gICAgICAgIE93bERhdGVUaW1lTW9kdWxlLFxuICAgICAgICBPd2xOYXRpdmVEYXRlVGltZU1vZHVsZSxcbiAgICAgICAgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlLFxuICAgICAgICBNYXRTb3J0TW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgQXBwVGFibGVzQ29tcG9uZW50LFxuICAgICAgICBGaWx0ZXJDb21wb25lbnQsXG4gICAgICAgIFBhZ2luYXRpb25Db21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgQXBwVGFibGVzQ29tcG9uZW50LFxuICAgICAgICBGaWx0ZXJDb21wb25lbnQsXG4gICAgICAgIFBhZ2luYXRpb25Db21wb25lbnRcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW0FwcFRhYmxlc1NlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIEFwcFRhYmxlc01vZHVsZSB7XG5cbn1cbiJdfQ==