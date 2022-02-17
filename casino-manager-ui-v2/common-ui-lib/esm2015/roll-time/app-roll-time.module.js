import { NgModule } from '@angular/core';
import { RollTimeComponent } from './roll-time.component';
import { RollTimeDialogComponent } from './roll-time-diaglog/roll-time-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CommonModule } from '@angular/common';
import { CommonTranslationModule } from '../common-translation/common-translation.module';
export class AppRollTimeModule {
}
AppRollTimeModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    MatSelectModule,
                    OwlDateTimeModule,
                    OwlNativeDateTimeModule,
                    CommonModule,
                    MatTableModule,
                    MatCheckboxModule,
                    CommonTranslationModule,
                    MatInputModule,
                    MatButtonModule,
                    MatMenuModule
                ],
                declarations: [
                    RollTimeComponent,
                    RollTimeDialogComponent
                ],
                exports: [
                    RollTimeComponent,
                    RollTimeDialogComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXJvbGwtdGltZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9yb2xsLXRpbWUvYXBwLXJvbGwtdGltZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxpQkFBaUIsRUFBRSx1QkFBdUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzVFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxpREFBaUQsQ0FBQztBQXdCeEYsTUFBTSxPQUFPLGlCQUFpQjs7O1lBdEI3QixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFO29CQUNMLGVBQWU7b0JBQ2YsaUJBQWlCO29CQUNqQix1QkFBdUI7b0JBQ3ZCLFlBQVk7b0JBQ1osY0FBYztvQkFDZCxpQkFBaUI7b0JBQ2pCLHVCQUF1QjtvQkFDdkIsY0FBYztvQkFDZCxlQUFlO29CQUNmLGFBQWE7aUJBQ2hCO2dCQUNELFlBQVksRUFBRTtvQkFDVixpQkFBaUI7b0JBQ2pCLHVCQUF1QjtpQkFDMUI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLGlCQUFpQjtvQkFDakIsdUJBQXVCO2lCQUMxQjthQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1JvbGxUaW1lQ29tcG9uZW50fSBmcm9tICcuL3JvbGwtdGltZS5jb21wb25lbnQnO1xuaW1wb3J0IHtSb2xsVGltZURpYWxvZ0NvbXBvbmVudH0gZnJvbSAnLi9yb2xsLXRpbWUtZGlhZ2xvZy9yb2xsLXRpbWUtZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHsgTWF0Q2hlY2tib3hNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jaGVja2JveCc7XG5pbXBvcnQgeyBNYXRJbnB1dE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0JztcbmltcG9ydCB7IE1hdE1lbnVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcbmltcG9ydCB7IE1hdFNlbGVjdE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdCc7XG5pbXBvcnQgeyBNYXRUYWJsZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYmxlJztcbmltcG9ydCB7T3dsRGF0ZVRpbWVNb2R1bGUsIE93bE5hdGl2ZURhdGVUaW1lTW9kdWxlfSBmcm9tICduZy1waWNrLWRhdGV0aW1lJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtDb21tb25UcmFuc2xhdGlvbk1vZHVsZX0gZnJvbSAnLi4vY29tbW9uLXRyYW5zbGF0aW9uL2NvbW1vbi10cmFuc2xhdGlvbi5tb2R1bGUnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgICAgICBPd2xEYXRlVGltZU1vZHVsZSxcbiAgICAgICAgT3dsTmF0aXZlRGF0ZVRpbWVNb2R1bGUsXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgTWF0VGFibGVNb2R1bGUsXG4gICAgICAgIE1hdENoZWNrYm94TW9kdWxlLFxuICAgICAgICBDb21tb25UcmFuc2xhdGlvbk1vZHVsZSxcbiAgICAgICAgTWF0SW5wdXRNb2R1bGUsXG4gICAgICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICAgICAgTWF0TWVudU1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFJvbGxUaW1lQ29tcG9uZW50LFxuICAgICAgICBSb2xsVGltZURpYWxvZ0NvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBSb2xsVGltZUNvbXBvbmVudCxcbiAgICAgICAgUm9sbFRpbWVEaWFsb2dDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEFwcFJvbGxUaW1lTW9kdWxlIHtcblxufVxuIl19