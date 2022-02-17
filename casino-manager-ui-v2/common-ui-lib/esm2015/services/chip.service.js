import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urls } from '../constants/urls';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ChipService {
    constructor(http) {
        this.http = http;
    }
    getChipset(options) {
        const url = `${urls.chipSet.updateChipSet}`;
        return this.http.get(url, options);
    }
}
ChipService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ChipService_Factory() { return new ChipService(i0.ɵɵinject(i1.HttpClient)); }, token: ChipService, providedIn: "root" });
ChipService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ChipService.ctorParameters = () => [
    { type: HttpClient }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvc2VydmljZXMvY2hpcC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFDLFVBQVUsRUFBZSxNQUFNLHNCQUFzQixDQUFDO0FBRTlELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7O0FBS3ZDLE1BQU0sT0FBTyxXQUFXO0lBRXRCLFlBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBRXpDLFVBQVUsQ0FBQyxPQUFXO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM1QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUF1QixHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQzs7OztZQVZGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBTk8sVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt1cmxzfSBmcm9tICcuLi9jb25zdGFudHMvdXJscyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIENoaXBTZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIGdldENoaXBzZXQob3B0aW9uczoge30pOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxPYmplY3Q+PiB7XG4gICAgY29uc3QgdXJsID0gYCR7dXJscy5jaGlwU2V0LnVwZGF0ZUNoaXBTZXR9YDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4odXJsLCBvcHRpb25zKTtcbiAgfVxufVxuIl19