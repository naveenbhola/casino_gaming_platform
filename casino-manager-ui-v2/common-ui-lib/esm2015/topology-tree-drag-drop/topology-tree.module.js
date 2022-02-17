import { NgModule } from '@angular/core';
import { TopologytreeService } from '../services/topologytree.service';
import { MaterialComponentModule } from '../material-component/material-component.module';
import { CommonModule } from '@angular/common';
import { TopologyTreeDragDropComponent } from './topology-tree-drag-drop.component';
import { CommonTranslationModule } from '../common-translation/common-translation.module';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { AppTablesModule } from '../app-tables/app-tables.module';
/**
 * this module provide the topology tree component, service etc.. as you will add later like Pipe, Filters etc...
 * exported into the CommonUILib Module.
 */
export class TopologyTreeModule {
}
TopologyTreeModule.decorators = [
    { type: NgModule, args: [{
                imports: [MaterialComponentModule, CommonModule, CommonTranslationModule, MatInputModule, AppTablesModule],
                declarations: [TopologyTreeDragDropComponent, ConfirmDeleteComponent],
                exports: [TopologyTreeDragDropComponent],
                providers: [TopologytreeService],
                entryComponents: [ConfirmDeleteComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wb2xvZ3ktdHJlZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC90b3BvbG9neS10cmVlLWRyYWctZHJvcC90b3BvbG9neS10cmVlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGlEQUFpRCxDQUFDO0FBQ3hGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNsRixPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxpREFBaUQsQ0FBQztBQUN4RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDbkYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBRWhFOzs7R0FHRztBQVFILE1BQU0sT0FBTyxrQkFBa0I7OztZQVA5QixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUM7Z0JBQzFHLFlBQVksRUFBRSxDQUFDLDZCQUE2QixFQUFFLHNCQUFzQixDQUFDO2dCQUNyRSxPQUFPLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztnQkFDeEMsU0FBUyxFQUFFLENBQUMsbUJBQW1CLENBQUM7Z0JBQ2hDLGVBQWUsRUFBRSxDQUFDLHNCQUFzQixDQUFDO2FBQzVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RvcG9sb2d5dHJlZVNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL3RvcG9sb2d5dHJlZS5zZXJ2aWNlJztcbmltcG9ydCB7TWF0ZXJpYWxDb21wb25lbnRNb2R1bGV9IGZyb20gJy4uL21hdGVyaWFsLWNvbXBvbmVudC9tYXRlcmlhbC1jb21wb25lbnQubW9kdWxlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtUb3BvbG9neVRyZWVEcmFnRHJvcENvbXBvbmVudH0gZnJvbSAnLi90b3BvbG9neS10cmVlLWRyYWctZHJvcC5jb21wb25lbnQnO1xuaW1wb3J0IHtDb21tb25UcmFuc2xhdGlvbk1vZHVsZX0gZnJvbSAnLi4vY29tbW9uLXRyYW5zbGF0aW9uL2NvbW1vbi10cmFuc2xhdGlvbi5tb2R1bGUnO1xuaW1wb3J0IHsgTWF0SW5wdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQgeyBDb25maXJtRGVsZXRlQ29tcG9uZW50IH0gZnJvbSAnLi9jb25maXJtLWRlbGV0ZS9jb25maXJtLWRlbGV0ZS5jb21wb25lbnQnO1xuaW1wb3J0IHtBcHBUYWJsZXNNb2R1bGV9IGZyb20gJy4uL2FwcC10YWJsZXMvYXBwLXRhYmxlcy5tb2R1bGUnO1xuXG4vKipcbiAqIHRoaXMgbW9kdWxlIHByb3ZpZGUgdGhlIHRvcG9sb2d5IHRyZWUgY29tcG9uZW50LCBzZXJ2aWNlIGV0Yy4uIGFzIHlvdSB3aWxsIGFkZCBsYXRlciBsaWtlIFBpcGUsIEZpbHRlcnMgZXRjLi4uXG4gKiBleHBvcnRlZCBpbnRvIHRoZSBDb21tb25VSUxpYiBNb2R1bGUuXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW01hdGVyaWFsQ29tcG9uZW50TW9kdWxlLCBDb21tb25Nb2R1bGUsIENvbW1vblRyYW5zbGF0aW9uTW9kdWxlLCBNYXRJbnB1dE1vZHVsZSwgQXBwVGFibGVzTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtUb3BvbG9neVRyZWVEcmFnRHJvcENvbXBvbmVudCwgQ29uZmlybURlbGV0ZUNvbXBvbmVudF0sXG4gICAgZXhwb3J0czogW1RvcG9sb2d5VHJlZURyYWdEcm9wQ29tcG9uZW50XSxcbiAgICBwcm92aWRlcnM6IFtUb3BvbG9neXRyZWVTZXJ2aWNlXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtDb25maXJtRGVsZXRlQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBUb3BvbG9neVRyZWVNb2R1bGUge1xufVxuIl19