import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterNavComponent } from './footer-nav.component';
import { MaterialComponentModule } from '../material-component/material-component.module';
import { MinusSignToParenthesisPipe } from '../pipes/minussigntoparenthesis.pipe';
import { CommonTranslationModule } from '../common-translation/common-translation.module';
export class FooterNavModule {
}
FooterNavModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MaterialComponentModule,
                    CommonTranslationModule
                ],
                declarations: [FooterNavComponent, MinusSignToParenthesisPipe],
                exports: [FooterNavComponent, MinusSignToParenthesisPipe]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLW5hdi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9mb290ZXIvZm9vdGVyLW5hdi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFDeEYsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDaEYsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFXeEYsTUFBTSxPQUFPLGVBQWU7OztZQVQzQixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osdUJBQXVCO29CQUN2Qix1QkFBdUI7aUJBQ3hCO2dCQUNELFlBQVksRUFBRSxDQUFDLGtCQUFrQixFQUFFLDBCQUEwQixDQUFDO2dCQUM5RCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSwwQkFBMEIsQ0FBQzthQUMxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9vdGVyTmF2Q29tcG9uZW50IH0gZnJvbSAnLi9mb290ZXItbmF2LmNvbXBvbmVudCc7XG5pbXBvcnQge01hdGVyaWFsQ29tcG9uZW50TW9kdWxlfSBmcm9tICcuLi9tYXRlcmlhbC1jb21wb25lbnQvbWF0ZXJpYWwtY29tcG9uZW50Lm1vZHVsZSc7XG5pbXBvcnQge01pbnVzU2lnblRvUGFyZW50aGVzaXNQaXBlfSBmcm9tICcuLi9waXBlcy9taW51c3NpZ250b3BhcmVudGhlc2lzLnBpcGUnO1xuaW1wb3J0IHtDb21tb25UcmFuc2xhdGlvbk1vZHVsZX0gZnJvbSAnLi4vY29tbW9uLXRyYW5zbGF0aW9uL2NvbW1vbi10cmFuc2xhdGlvbi5tb2R1bGUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdGVyaWFsQ29tcG9uZW50TW9kdWxlLFxuICAgIENvbW1vblRyYW5zbGF0aW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0Zvb3Rlck5hdkNvbXBvbmVudCwgTWludXNTaWduVG9QYXJlbnRoZXNpc1BpcGVdLFxuICBleHBvcnRzOiBbRm9vdGVyTmF2Q29tcG9uZW50LCBNaW51c1NpZ25Ub1BhcmVudGhlc2lzUGlwZV1cbn0pXG5leHBvcnQgY2xhc3MgRm9vdGVyTmF2TW9kdWxlIHsgfVxuIl19