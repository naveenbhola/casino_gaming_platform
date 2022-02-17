import { Injectable } from '@angular/core';
import { Idle } from 'idlejs/dist';
import { protocol, webDashboardPort, webServerDNS } from '../constants/url.common.constants';
import { AuthService } from './Authentication/auth.service';
import { DecodedTokenService } from './Authentication/decoded-token.service';
import { ConfigurationService } from './configuration.service';
import * as i0 from "@angular/core";
import * as i1 from "./Authentication/auth.service";
import * as i2 from "./Authentication/decoded-token.service";
import * as i3 from "./configuration.service";
export class LogoutUtilityService {
    constructor(authService, decodedTokenService, configurationService) {
        this.authService = authService;
        this.decodedTokenService = decodedTokenService;
        this.configurationService = configurationService;
    }
    logOutInactiveUser() {
        let logoOutTime;
        if (!this.logOutClicked) {
            this.configurationService.getSystemData().subscribe(data => {
                logoOutTime = parseInt(data[0].propertyValues.filter(val => val.propertyId === 1001)[0].propertyValue, 10);
                new Idle().whenNotInteractive().within(logoOutTime, 1000).do(() => {
                    this.logout();
                }).start();
            });
        }
    }
    logout() {
        this.logOutClicked = true;
        const authValues = JSON.parse(localStorage.getItem('authValues'));
        if (authValues) {
            this.authService.logout()
                .subscribe(() => {
                this.removeAndRedirect();
            }, () => {
                this.removeAndRedirect();
            });
        }
        else {
            this.removeAndRedirect();
        }
    }
    removeAndRedirect() {
        const loginUrl = protocol + webServerDNS + ':' + webDashboardPort;
        const ppMasterUrl = loginUrl + '/ppmaster';
        const isPP = localStorage.getItem('pp');
        const authValues = JSON.parse(localStorage.getItem('authValues'));
        if (authValues) {
            localStorage.removeItem(authValues.jwtTokenKey);
        }
        sessionStorage.removeItem('language');
        localStorage.removeItem('authValues');
        //We need to check both GR-2777 and GR-2903
        localStorage.removeItem('lastRefresh');
        if (isPP === 'yes') {
            this.redirectAfterLogout(ppMasterUrl);
        }
        else {
            this.redirectAfterLogout(loginUrl);
        }
    }
    redirectAfterLogout(url) {
        location.href = url;
    }
}
LogoutUtilityService.ɵprov = i0.ɵɵdefineInjectable({ factory: function LogoutUtilityService_Factory() { return new LogoutUtilityService(i0.ɵɵinject(i1.AuthService), i0.ɵɵinject(i2.DecodedTokenService), i0.ɵɵinject(i3.ConfigurationService)); }, token: LogoutUtilityService, providedIn: "root" });
LogoutUtilityService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
LogoutUtilityService.ctorParameters = () => [
    { type: AuthService },
    { type: DecodedTokenService },
    { type: ConfigurationService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nb3V0LXV0aWxpdHkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL3NlcnZpY2VzL2xvZ291dC11dGlsaXR5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDM0YsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDOzs7OztBQUs3RCxNQUFNLE9BQU8sb0JBQW9CO0lBRzdCLFlBQ1ksV0FBd0IsRUFDeEIsbUJBQXdDLEVBQ3hDLG9CQUEwQztRQUYxQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7SUFFdEQsQ0FBQztJQUVELGtCQUFrQjtRQUNkLElBQUksV0FBbUIsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNyQixJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2RCxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNHLElBQUksSUFBSSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7b0JBQzlELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztTQUNOO0lBRUwsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixNQUFNLFVBQVUsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLFVBQVUsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO2lCQUNwQixTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNaLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzdCLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ0osSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7U0FDVjthQUFNO1lBQ0gsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDNUI7SUFDTCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsTUFBTSxRQUFRLEdBQUcsUUFBUSxHQUFHLFlBQVksR0FBRyxHQUFHLEdBQUcsZ0JBQWdCLENBQUM7UUFDbEUsTUFBTSxXQUFXLEdBQUcsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUMzQyxNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksVUFBVSxFQUFFO1lBQ1osWUFBWSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxjQUFjLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLFlBQVksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEMsMkNBQTJDO1FBQzNDLFlBQVksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFdkMsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN6QzthQUFNO1lBQ0gsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQztJQUNELG1CQUFtQixDQUFFLEdBQUc7UUFDcEIsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDeEIsQ0FBQzs7OztZQTlESixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQU5PLFdBQVc7WUFDWCxtQkFBbUI7WUFDbkIsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SWRsZX0gZnJvbSAnaWRsZWpzL2Rpc3QnO1xuaW1wb3J0IHtwcm90b2NvbCwgd2ViRGFzaGJvYXJkUG9ydCwgd2ViU2VydmVyRE5TfSBmcm9tICcuLi9jb25zdGFudHMvdXJsLmNvbW1vbi5jb25zdGFudHMnO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi9BdXRoZW50aWNhdGlvbi9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHtEZWNvZGVkVG9rZW5TZXJ2aWNlfSBmcm9tICcuL0F1dGhlbnRpY2F0aW9uL2RlY29kZWQtdG9rZW4uc2VydmljZSc7XG5pbXBvcnQge0NvbmZpZ3VyYXRpb25TZXJ2aWNlfSBmcm9tICcuL2NvbmZpZ3VyYXRpb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTG9nb3V0VXRpbGl0eVNlcnZpY2Uge1xuICAgIGxvZ091dENsaWNrZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgZGVjb2RlZFRva2VuU2VydmljZTogRGVjb2RlZFRva2VuU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uU2VydmljZTogQ29uZmlndXJhdGlvblNlcnZpY2VcbiAgICApIHtcbiAgICB9XG5cbiAgICBsb2dPdXRJbmFjdGl2ZVVzZXIoKTogdm9pZCB7XG4gICAgICAgIGxldCBsb2dvT3V0VGltZTogbnVtYmVyO1xuICAgICAgICBpZiAoIXRoaXMubG9nT3V0Q2xpY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRTeXN0ZW1EYXRhKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGxvZ29PdXRUaW1lID0gcGFyc2VJbnQoZGF0YVswXS5wcm9wZXJ0eVZhbHVlcy5maWx0ZXIodmFsID0+IHZhbC5wcm9wZXJ0eUlkID09PSAxMDAxKVswXS5wcm9wZXJ0eVZhbHVlLCAxMCk7XG4gICAgICAgICAgICAgICAgbmV3IElkbGUoKS53aGVuTm90SW50ZXJhY3RpdmUoKS53aXRoaW4obG9nb091dFRpbWUsIDEwMDApLmRvKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICB9KS5zdGFydCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGxvZ291dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2dPdXRDbGlja2VkID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgYXV0aFZhbHVlczogYW55ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFZhbHVlcycpKTtcbiAgICAgICAgaWYgKGF1dGhWYWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KClcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBbmRSZWRpcmVjdCgpO1xuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBbmRSZWRpcmVjdCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbmRSZWRpcmVjdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQW5kUmVkaXJlY3QoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxvZ2luVXJsID0gcHJvdG9jb2wgKyB3ZWJTZXJ2ZXJETlMgKyAnOicgKyB3ZWJEYXNoYm9hcmRQb3J0O1xuICAgICAgICBjb25zdCBwcE1hc3RlclVybCA9IGxvZ2luVXJsICsgJy9wcG1hc3Rlcic7XG4gICAgICAgIGNvbnN0IGlzUFAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHAnKTtcbiAgICAgICAgY29uc3QgYXV0aFZhbHVlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhWYWx1ZXMnKSk7XG4gICAgICAgIGlmIChhdXRoVmFsdWVzKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShhdXRoVmFsdWVzLmp3dFRva2VuS2V5KTtcbiAgICAgICAgfVxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdsYW5ndWFnZScpO1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYXV0aFZhbHVlcycpO1xuICAgICAgICAvL1dlIG5lZWQgdG8gY2hlY2sgYm90aCBHUi0yNzc3IGFuZCBHUi0yOTAzXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdsYXN0UmVmcmVzaCcpO1xuXG4gICAgICAgIGlmIChpc1BQID09PSAneWVzJykge1xuICAgICAgICAgICAgdGhpcy5yZWRpcmVjdEFmdGVyTG9nb3V0KHBwTWFzdGVyVXJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVkaXJlY3RBZnRlckxvZ291dChsb2dpblVybCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVkaXJlY3RBZnRlckxvZ291dCAodXJsKSB7XG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgfVxuXG59XG4iXX0=