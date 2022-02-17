import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as i0 from "@angular/core";
import * as i1 from "@auth0/angular-jwt";
export class DecodedTokenService {
    constructor(jwtHelper) {
        this.jwtHelper = jwtHelper;
        this.authValues = JSON.parse(localStorage.getItem('authValues'));
    }
    getDecodedJwtToken() {
        this.authValues = JSON.parse(localStorage.getItem('authValues'));
        if (this.authValues) {
            const token = localStorage.getItem(this.authValues.jwtTokenKey);
            if (token) {
                return this.jwtHelper.decodeToken(token);
            }
        }
    }
    setDecodedJwtToken(key, token) {
        localStorage.setItem(key, token);
    }
    getJwtToken() {
        this.authValues = JSON.parse(localStorage.getItem('authValues'));
        if (this.authValues) {
            return localStorage.getItem(this.authValues.jwtTokenKey);
        }
    }
}
DecodedTokenService.ɵprov = i0.ɵɵdefineInjectable({ factory: function DecodedTokenService_Factory() { return new DecodedTokenService(i0.ɵɵinject(i1.JwtHelperService)); }, token: DecodedTokenService, providedIn: "root" });
DecodedTokenService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DecodedTokenService.ctorParameters = () => [
    { type: JwtHelperService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb2RlZC10b2tlbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvc2VydmljZXMvQXV0aGVudGljYXRpb24vZGVjb2RlZC10b2tlbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7OztBQU1wRCxNQUFNLE9BQU8sbUJBQW1CO0lBRTVCLFlBQW9CLFNBQTJCO1FBQTNCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUNELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRSxJQUFJLEtBQUssRUFBRTtnQkFDUCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzVDO1NBQ0o7SUFDTCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsR0FBRyxFQUFFLEtBQUs7UUFDekIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM1RDtJQUNMLENBQUM7Ozs7WUEzQkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFMTyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtKd3RIZWxwZXJTZXJ2aWNlfSBmcm9tICdAYXV0aDAvYW5ndWxhci1qd3QnO1xuaW1wb3J0IHtBdXRoSW50ZXJmYWNlfSBmcm9tICcuL2F1dGguaW50ZXJmYWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBEZWNvZGVkVG9rZW5TZXJ2aWNlIHtcbiAgICBhdXRoVmFsdWVzOiBBdXRoSW50ZXJmYWNlO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgand0SGVscGVyOiBKd3RIZWxwZXJTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuYXV0aFZhbHVlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhWYWx1ZXMnKSk7XG4gICAgfVxuICAgIGdldERlY29kZWRKd3RUb2tlbigpIHtcbiAgICAgICAgdGhpcy5hdXRoVmFsdWVzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFZhbHVlcycpKTtcbiAgICAgICAgaWYgKHRoaXMuYXV0aFZhbHVlcykge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmF1dGhWYWx1ZXMuand0VG9rZW5LZXkpO1xuICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuand0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldERlY29kZWRKd3RUb2tlbihrZXksIHRva2VuKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdG9rZW4pO1xuICAgIH1cblxuICAgIGdldEp3dFRva2VuKCkge1xuICAgICAgICB0aGlzLmF1dGhWYWx1ZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoVmFsdWVzJykpO1xuICAgICAgICBpZiAodGhpcy5hdXRoVmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5hdXRoVmFsdWVzLmp3dFRva2VuS2V5KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==