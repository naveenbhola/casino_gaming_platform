import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class SortingService {
    constructor() {
    }
    getSortObject(sort) {
        this.sortObj = { sortOrder: sort.direction.toUpperCase(), sortField: sort.active };
        return this.sortObj;
    }
}
SortingService.ɵprov = i0.ɵɵdefineInjectable({ factory: function SortingService_Factory() { return new SortingService(); }, token: SortingService, providedIn: "root" });
SortingService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
SortingService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGluZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvc29ydGluZy9zb3J0aW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFLekMsTUFBTSxPQUFPLGNBQWM7SUFHdkI7SUFDQSxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQUk7UUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQztRQUNqRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQzs7OztZQVpKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU29ydGluZ1NlcnZpY2Uge1xuICAgIHNvcnRPYmo6IG9iamVjdDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIGdldFNvcnRPYmplY3Qoc29ydCk6IG9iamVjdCB7XG4gICAgICAgIHRoaXMuc29ydE9iaiA9IHtzb3J0T3JkZXI6IHNvcnQuZGlyZWN0aW9uLnRvVXBwZXJDYXNlKCksIHNvcnRGaWVsZDogc29ydC5hY3RpdmV9O1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0T2JqO1xuICAgIH1cbn1cbiJdfQ==