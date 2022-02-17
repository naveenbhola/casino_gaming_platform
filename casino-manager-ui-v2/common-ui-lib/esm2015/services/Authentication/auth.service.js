import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { urls } from '../../constants/urls';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class AuthService {
    constructor(httpBackend) {
        this.http = new HttpClient(httpBackend);
    }
    getRefreshToken(clientId) {
        const authValues = JSON.parse(localStorage.getItem('authValues'));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json', 'Authorization': 'Bearer ' +
                    localStorage.getItem(authValues.jwtTokenKey)
            }),
            params: {
                client_id: clientId
            }
        };
        return this.http.post(urls.auth.refresh, null, httpOptions);
    }
    logout() {
        const authValues = JSON.parse(localStorage.getItem('authValues'));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json', 'Authorization': 'Bearer ' +
                    localStorage.getItem(authValues.jwtTokenKey)
            })
        };
        return this.http.post(urls.auth.logout, null, httpOptions);
    }
}
AuthService.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthService_Factory() { return new AuthService(i0.ɵɵinject(i1.HttpBackend)); }, token: AuthService, providedIn: "root" });
AuthService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
AuthService.ctorParameters = () => [
    { type: HttpBackend }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvc2VydmljZXMvQXV0aGVudGljYXRpb24vYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFMUUsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7QUFLMUMsTUFBTSxPQUFPLFdBQVc7SUFFcEIsWUFBWSxXQUF3QjtRQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxlQUFlLENBQUMsUUFBUTtRQUNwQixNQUFNLFVBQVUsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2RSxNQUFNLFdBQVcsR0FBRztZQUNoQixPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUM7Z0JBQ3JCLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsU0FBUztvQkFDMUQsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO2FBQ25ELENBQUM7WUFDRixNQUFNLEVBQUU7Z0JBQ0osU0FBUyxFQUFFLFFBQVE7YUFDdEI7U0FDSixDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELE1BQU07UUFDRixNQUFNLFVBQVUsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2RSxNQUFNLFdBQVcsR0FBRztZQUNoQixPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUM7Z0JBQ3JCLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsU0FBUztvQkFDMUQsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO2FBQ25ELENBQUM7U0FDTCxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7OztZQWhDSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQU5PLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQmFja2VuZCwgSHR0cENsaWVudCwgSHR0cEhlYWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3VybHN9IGZyb20gJy4uLy4uL2NvbnN0YW50cy91cmxzJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50O1xuICAgIGNvbnN0cnVjdG9yKGh0dHBCYWNrZW5kOiBIdHRwQmFja2VuZCkge1xuICAgICAgICB0aGlzLmh0dHAgPSBuZXcgSHR0cENsaWVudChodHRwQmFja2VuZCk7XG4gICAgfVxuXG4gICAgZ2V0UmVmcmVzaFRva2VuKGNsaWVudElkKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgY29uc3QgYXV0aFZhbHVlczogYW55ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFZhbHVlcycpKTtcbiAgICAgICAgY29uc3QgaHR0cE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oYXV0aFZhbHVlcy5qd3RUb2tlbktleSlcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgY2xpZW50X2lkOiBjbGllbnRJZFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJscy5hdXRoLnJlZnJlc2gsIG51bGwsIGh0dHBPcHRpb25zKTtcbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIGNvbnN0IGF1dGhWYWx1ZXM6IGFueSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhWYWx1ZXMnKSk7XG4gICAgICAgIGNvbnN0IGh0dHBPcHRpb25zID0ge1xuICAgICAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLCAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGF1dGhWYWx1ZXMuand0VG9rZW5LZXkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJscy5hdXRoLmxvZ291dCwgbnVsbCwgaHR0cE9wdGlvbnMpO1xuICAgIH1cbn1cbiJdfQ==