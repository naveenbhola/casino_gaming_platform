import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class CurrentTopologyService {
    constructor() {
        this.defaultTopologyID = 3;
        this.topology = new BehaviorSubject(this.defaultTopologyID);
        this.currentTopology = this.topology.asObservable();
        this.gamingDay = new BehaviorSubject(this.defaultGamingDay);
        this.currentGamingDay = this.gamingDay.asObservable();
    }
    updateTopology(topologyID, gamingDay) {
        this.topology.next(topologyID);
        this.gamingDay.next(gamingDay);
    }
}
CurrentTopologyService.ɵprov = i0.ɵɵdefineInjectable({ factory: function CurrentTopologyService_Factory() { return new CurrentTopologyService(); }, token: CurrentTopologyService, providedIn: "root" });
CurrentTopologyService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
CurrentTopologyService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVudC10b3BvbG9neS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvc2VydmljZXMvY3VycmVudC10b3BvbG9neS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFLckMsTUFBTSxPQUFPLHNCQUFzQjtJQU9qQztRQU5RLHNCQUFpQixHQUFHLENBQUMsQ0FBQztRQUV2QixhQUFRLEdBQUcsSUFBSSxlQUFlLENBQVMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0Qsb0JBQWUsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hELGNBQVMsR0FBRyxJQUFJLGVBQWUsQ0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxxQkFBZ0IsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFDakIsY0FBYyxDQUFDLFVBQWtCLEVBQUUsU0FBZTtRQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7O1lBZEYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBDdXJyZW50VG9wb2xvZ3lTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkZWZhdWx0VG9wb2xvZ3lJRCA9IDM7XG4gIHByaXZhdGUgZGVmYXVsdEdhbWluZ0RheTogRGF0ZTtcbiAgcHVibGljIHRvcG9sb2d5ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXI+KHRoaXMuZGVmYXVsdFRvcG9sb2d5SUQpO1xuICBwdWJsaWMgY3VycmVudFRvcG9sb2d5ID0gIHRoaXMudG9wb2xvZ3kuYXNPYnNlcnZhYmxlKCk7XG4gIHB1YmxpYyBnYW1pbmdEYXkgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PERhdGU+KHRoaXMuZGVmYXVsdEdhbWluZ0RheSk7XG4gIHB1YmxpYyBjdXJyZW50R2FtaW5nRGF5ID0gIHRoaXMuZ2FtaW5nRGF5LmFzT2JzZXJ2YWJsZSgpO1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuICB1cGRhdGVUb3BvbG9neSh0b3BvbG9neUlEOiBudW1iZXIsIGdhbWluZ0RheTogRGF0ZSkge1xuICAgIHRoaXMudG9wb2xvZ3kubmV4dCh0b3BvbG9neUlEKTtcbiAgICB0aGlzLmdhbWluZ0RheS5uZXh0KGdhbWluZ0RheSk7XG4gIH1cbn1cbiJdfQ==