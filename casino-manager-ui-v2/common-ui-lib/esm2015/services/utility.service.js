import { EventEmitter, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class UtilityService {
    constructor() {
        this.updateDimensions = new EventEmitter();
        this.updatePageNumbers = new EventEmitter();
        this.closeDialog = new EventEmitter();
        this.broadcastGlobalCalendarGamingDay = new EventEmitter();
        this.broadcastBreadCrumClick = new EventEmitter();
        this.isCBPT = true;
        this.updateCurrentDimensions();
    }
    updateGlobalCalendarGamingDay(globalCalendarGamingDay) {
        this.broadcastGlobalCalendarGamingDay.emit(globalCalendarGamingDay);
    }
    updateBreadCrumClick(breadcrum) {
        this.broadcastBreadCrumClick.emit(breadcrum);
    }
    updateCurrentDimensions() {
        window.addEventListener('resize', () => {
            this.updateDimensions.next({
                scrnWidth: window.innerWidth,
                scrnHeight: window.innerHeight
            });
        });
    }
}
UtilityService.ɵprov = i0.ɵɵdefineInjectable({ factory: function UtilityService_Factory() { return new UtilityService(); }, token: UtilityService, providedIn: "root" });
UtilityService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
UtilityService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvc2VydmljZXMvdXRpbGl0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQU12RCxNQUFNLE9BQU8sY0FBYztJQVN2QjtRQVJBLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEMsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN2QyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMscUNBQWdDLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RCw0QkFBdUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTdDLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFHVixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsNkJBQTZCLENBQUMsdUJBQXVCO1FBQ2pELElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsb0JBQW9CLENBQUMsU0FBUztRQUMxQixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCx1QkFBdUI7UUFDbkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztnQkFDdkIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxVQUFVO2dCQUM1QixVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVc7YUFDakMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzs7O1lBL0JKLFVBQVUsU0FBQztnQkFDSixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgICAgIHByb3ZpZGVkSW46ICdyb290J1xuICAgIH0pXG5leHBvcnQgY2xhc3MgVXRpbGl0eVNlcnZpY2Uge1xuICAgIHVwZGF0ZURpbWVuc2lvbnMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdXBkYXRlUGFnZU51bWJlcnMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgY2xvc2VEaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgYnJvYWRjYXN0R2xvYmFsQ2FsZW5kYXJHYW1pbmdEYXkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgYnJvYWRjYXN0QnJlYWRDcnVtQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgZ2FtaW5nRGF5O1xuICAgIGlzQ0JQVCA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50RGltZW5zaW9ucygpO1xuICAgIH1cblxuICAgIHVwZGF0ZUdsb2JhbENhbGVuZGFyR2FtaW5nRGF5KGdsb2JhbENhbGVuZGFyR2FtaW5nRGF5KSB7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0R2xvYmFsQ2FsZW5kYXJHYW1pbmdEYXkuZW1pdChnbG9iYWxDYWxlbmRhckdhbWluZ0RheSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQnJlYWRDcnVtQ2xpY2soYnJlYWRjcnVtKSB7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0QnJlYWRDcnVtQ2xpY2suZW1pdChicmVhZGNydW0pO1xuICAgIH1cblxuICAgIHVwZGF0ZUN1cnJlbnREaW1lbnNpb25zKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEaW1lbnNpb25zLm5leHQoe1xuICAgICAgICAgICAgICAgIHNjcm5XaWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgc2NybkhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG4iXX0=