import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class TopNavBarService {
    constructor() {
        this.userDetailsSubject = new BehaviorSubject(this.userDetails);
        this.userDetailsObservable = this.userDetailsSubject.asObservable();
    }
    updateUserDetails(userDetails) {
        this.userDetailsSubject.next(userDetails);
    }
}
TopNavBarService.ɵprov = i0.ɵɵdefineInjectable({ factory: function TopNavBarService_Factory() { return new TopNavBarService(); }, token: TopNavBarService, providedIn: "root" });
TopNavBarService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
TopNavBarService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wLW5hdi1iYXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL3NlcnZpY2VzL3RvcC1uYXYtYmFyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQU1yQyxNQUFNLE9BQU8sZ0JBQWdCO0lBSTNCO1FBRk8sdUJBQWtCLEdBQUcsSUFBSSxlQUFlLENBQXNCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRiwwQkFBcUIsR0FBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUNqQixpQkFBaUIsQ0FBQyxXQUFnQztRQUNoRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7Ozs7WUFWRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1VzZXJEZXRhaWxJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZS91c2VyLWRldGFpbC5pbnRlcmZhY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUb3BOYXZCYXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSB1c2VyRGV0YWlsczogVXNlckRldGFpbEludGVyZmFjZTtcbiAgcHVibGljIHVzZXJEZXRhaWxzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8VXNlckRldGFpbEludGVyZmFjZT4odGhpcy51c2VyRGV0YWlscyk7XG4gIHB1YmxpYyB1c2VyRGV0YWlsc09ic2VydmFibGUgPSAgdGhpcy51c2VyRGV0YWlsc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHVwZGF0ZVVzZXJEZXRhaWxzKHVzZXJEZXRhaWxzOiBVc2VyRGV0YWlsSW50ZXJmYWNlKSB7XG4gICAgdGhpcy51c2VyRGV0YWlsc1N1YmplY3QubmV4dCh1c2VyRGV0YWlscyk7XG4gIH1cbn1cbiJdfQ==