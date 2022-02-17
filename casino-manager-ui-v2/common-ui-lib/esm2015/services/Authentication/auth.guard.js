import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenHandlingService } from './token-handling.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecodedTokenService } from './decoded-token.service';
import { LogoutUtilityService } from '../logout-utility.service';
import { TopNavBarService } from '../top-nav-bar.service';
import { TableUIService } from '../table-ui.service';
import { tableUIProtocol } from '../../constants/url.common.constants';
import { tableUIPort } from '../../constants/url.common.constants';
import * as i0 from "@angular/core";
import * as i1 from "./token-handling.service";
import * as i2 from "@auth0/angular-jwt";
import * as i3 from "./decoded-token.service";
import * as i4 from "../logout-utility.service";
import * as i5 from "../top-nav-bar.service";
import * as i6 from "@angular/router";
import * as i7 from "../table-ui.service";
export class AuthGuard {
    constructor(tokenHandlingService, jwtHelper, decodedTokenService, logoutUtilityService, topNavBarService, router, tableUIService) {
        this.tokenHandlingService = tokenHandlingService;
        this.jwtHelper = jwtHelper;
        this.decodedTokenService = decodedTokenService;
        this.logoutUtilityService = logoutUtilityService;
        this.topNavBarService = topNavBarService;
        this.router = router;
        this.tableUIService = tableUIService;
        this.jwtToken = location.href.split('access_token=')[1];
        this.authValues = JSON.parse(localStorage.getItem('authValues'));
        if (this.jwtToken) {
            this.jwtToken = this.jwtToken.split('&')[0];
            this.decodedTokenService.setDecodedJwtToken(this.authValues.jwtTokenKey, this.jwtToken);
            const decodedToken = this.decodedTokenService.getDecodedJwtToken();
            const uerDetails = {
                'firstName': decodedToken.firstName,
                'lastName': decodedToken.lastName,
                'userId': decodedToken.userId
            };
            topNavBarService.updateUserDetails(uerDetails);
        }
        if (this.jwtToken || this.decodedTokenService.getDecodedJwtToken()) {
            this.firstLoad = true;
            if (this.decodedTokenService.getDecodedJwtToken().firstName === 'PP') {
                localStorage.setItem('pp', 'yes');
                // console.log("auth gaurd pp");
            }
            else {
                localStorage.setItem('pp', 'no');
                // console.log("auth gaurd non pp");
            }
            logoutUtilityService.logOutInactiveUser();
        }
    }
    canActivate(next, state) {
        this.isTokenValid = this.tokenHandlingService.isTokenValid(this.jwtToken);
        const decodedToken = this.decodedTokenService.getDecodedJwtToken();
        if (decodedToken && (!decodedToken.authorities || decodedToken.authorities && decodedToken.applications.length === 1 &&
            ['CAM', 'CASHIER'].indexOf(decodedToken.applications[0]) >= 0) && ((decodedToken.applications.length === 1 &&
            ['CAM', 'CASHIER', 'TABLE_DASH'].indexOf(decodedToken.applications[0]) >= 0) ||
            (decodedToken.applications.length === 3 && ['TABLE_DASH', 'ALERTS', 'PLAYER_DASH']
                .every((val, i) => val === decodedToken.applications[i])))) {
            if (decodedToken.applications[0] === 'TABLE_DASH' && !state.url.includes('unauthorized-access')) {
                // console.log('tableUIProtocol', tableUIProtocol);
                if (tableUIProtocol !== undefined && tableUIProtocol !== null) {
                    window.open(`${tableUIProtocol}tableui:${tableUIPort}/single-table-view`, '_self');
                }
                else {
                    if (location.href.includes('ppmaster') || location.href.includes('login')) {
                        const token = localStorage.getItem(this.authValues.jwtTokenKey);
                        if (token !== null) {
                            this.tokenHandlingService.HandleTokenExpiration();
                        }
                        return true;
                    }
                }
            }
            else if (decodedToken.applications[0] !== 'TABLE_DASH' && !state.url.includes('unauthorized-access')) {
                this.tokenHandlingService.terminalRedirection(decodedToken.applications[0]);
                return false;
            }
        }
        else if (state.url.includes('unauthorized-access')) {
            return true;
        }
        else if ((this.jwtToken && this.isTokenValid) ||
            (this.decodedTokenService.getJwtToken() && this.tokenHandlingService.isTokenValid(this.decodedTokenService.getJwtToken())) ||
            location.href.includes('ppmaster') || location.href.includes('login')) {
            if (this.firstLoad) {
            }
            this.firstLoad = false;
            let token;
            if (this.authValues && this.authValues.jwtTokenKey) {
                token = localStorage.getItem(this.authValues.jwtTokenKey);
            }
            if (token !== null && token !== undefined) {
                this.tokenHandlingService.HandleTokenExpiration();
            }
            return true;
        }
        else {
            let token;
            if (this.authValues && this.authValues.jwtTokenKey) {
                token = localStorage.getItem(this.authValues.jwtTokenKey);
            }
            this.tokenHandlingService.redirectURI(token);
            sessionStorage.clear();
            localStorage.clear();
            return false;
        }
    }
}
AuthGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthGuard_Factory() { return new AuthGuard(i0.ɵɵinject(i1.TokenHandlingService), i0.ɵɵinject(i2.JwtHelperService), i0.ɵɵinject(i3.DecodedTokenService), i0.ɵɵinject(i4.LogoutUtilityService), i0.ɵɵinject(i5.TopNavBarService), i0.ɵɵinject(i6.Router), i0.ɵɵinject(i7.TableUIService)); }, token: AuthGuard, providedIn: "root" });
AuthGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
AuthGuard.ctorParameters = () => [
    { type: TokenHandlingService },
    { type: JwtHelperService },
    { type: DecodedTokenService },
    { type: LogoutUtilityService },
    { type: TopNavBarService },
    { type: Router },
    { type: TableUIService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5ndWFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL3NlcnZpY2VzL0F1dGhlbnRpY2F0aW9uL2F1dGguZ3VhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQXNDLE1BQU0sRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUVqRyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUU1RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7Ozs7Ozs7O0FBS2pFLE1BQU0sT0FBTyxTQUFTO0lBTWxCLFlBQW9CLG9CQUEwQyxFQUMxQyxTQUEyQixFQUMzQixtQkFBd0MsRUFDeEMsb0JBQTBDLEVBQzFDLGdCQUFrQyxFQUNsQyxNQUFjLEVBQ2QsY0FBOEI7UUFOOUIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxXQUFNLEdBQU4sTUFBTSxDQUFR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LE1BQU07YUFDckI7OztZQVpPLG9CQUFvQjtZQUNwQixnQkFBZ0I7WUFDaEIsbUJBQW1CO1lBRW5CLG9CQUFvQjtZQUNwQixnQkFBZ0I7WUFQcUIsTUFBTTtZQVEzQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGUsIFJvdXRlciwgUm91dGVyU3RhdGVTbmFwc2hvdH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1Rva2VuSGFuZGxpbmdTZXJ2aWNlfSBmcm9tICcuL3Rva2VuLWhhbmRsaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHtKd3RIZWxwZXJTZXJ2aWNlfSBmcm9tICdAYXV0aDAvYW5ndWxhci1qd3QnO1xuaW1wb3J0IHtEZWNvZGVkVG9rZW5TZXJ2aWNlfSBmcm9tICcuL2RlY29kZWQtdG9rZW4uc2VydmljZSc7XG5pbXBvcnQge0F1dGhJbnRlcmZhY2V9IGZyb20gJy4vYXV0aC5pbnRlcmZhY2UnO1xuaW1wb3J0IHtMb2dvdXRVdGlsaXR5U2VydmljZX0gZnJvbSAnLi4vbG9nb3V0LXV0aWxpdHkuc2VydmljZSc7XG5pbXBvcnQge1RvcE5hdkJhclNlcnZpY2V9IGZyb20gJy4uL3RvcC1uYXYtYmFyLnNlcnZpY2UnO1xuaW1wb3J0IHtUYWJsZVVJU2VydmljZX0gZnJvbSAnLi4vdGFibGUtdWkuc2VydmljZSc7XG5pbXBvcnQge3RhYmxlVUlQcm90b2NvbH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzL3VybC5jb21tb24uY29uc3RhbnRzJztcbmltcG9ydCB7dGFibGVVSVBvcnR9IGZyb20gJy4uLy4uL2NvbnN0YW50cy91cmwuY29tbW9uLmNvbnN0YW50cyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuICAgIGp3dFRva2VuOiBzdHJpbmc7XG4gICAgaXNUb2tlblZhbGlkO1xuICAgIGF1dGhWYWx1ZXM6IEF1dGhJbnRlcmZhY2U7XG4gICAgZmlyc3RMb2FkOiBCb29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB0b2tlbkhhbmRsaW5nU2VydmljZTogVG9rZW5IYW5kbGluZ1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBqd3RIZWxwZXI6IEp3dEhlbHBlclNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBkZWNvZGVkVG9rZW5TZXJ2aWNlOiBEZWNvZGVkVG9rZW5TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgbG9nb3V0VXRpbGl0eVNlcnZpY2U6IExvZ291dFV0aWxpdHlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgdG9wTmF2QmFyU2VydmljZTogVG9wTmF2QmFyU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgdGFibGVVSVNlcnZpY2U6IFRhYmxlVUlTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuand0VG9rZW4gPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCdhY2Nlc3NfdG9rZW49JylbMV07XG4gICAgICAgIHRoaXMuYXV0aFZhbHVlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhWYWx1ZXMnKSk7XG4gICAgICAgIGlmICh0aGlzLmp3dFRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmp3dFRva2VuID0gdGhpcy5qd3RUb2tlbi5zcGxpdCgnJicpWzBdO1xuICAgICAgICAgICAgdGhpcy5kZWNvZGVkVG9rZW5TZXJ2aWNlLnNldERlY29kZWRKd3RUb2tlbih0aGlzLmF1dGhWYWx1ZXMuand0VG9rZW5LZXksIHRoaXMuand0VG9rZW4pO1xuICAgICAgICAgICAgY29uc3QgZGVjb2RlZFRva2VuID0gdGhpcy5kZWNvZGVkVG9rZW5TZXJ2aWNlLmdldERlY29kZWRKd3RUb2tlbigpO1xuICAgICAgICAgICAgY29uc3QgdWVyRGV0YWlscyA9IHtcbiAgICAgICAgICAgICAgICAnZmlyc3ROYW1lJzogZGVjb2RlZFRva2VuLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgICAnbGFzdE5hbWUnOiBkZWNvZGVkVG9rZW4ubGFzdE5hbWUsXG4gICAgICAgICAgICAgICAgJ3VzZXJJZCc6IGRlY29kZWRUb2tlbi51c2VySWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0b3BOYXZCYXJTZXJ2aWNlLnVwZGF0ZVVzZXJEZXRhaWxzKHVlckRldGFpbHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmp3dFRva2VuIHx8IHRoaXMuZGVjb2RlZFRva2VuU2VydmljZS5nZXREZWNvZGVkSnd0VG9rZW4oKSkge1xuICAgICAgICAgICAgdGhpcy5maXJzdExvYWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVjb2RlZFRva2VuU2VydmljZS5nZXREZWNvZGVkSnd0VG9rZW4oKS5maXJzdE5hbWUgPT09ICdQUCcpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHAnLCAneWVzJyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJhdXRoIGdhdXJkIHBwXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncHAnLCAnbm8nKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImF1dGggZ2F1cmQgbm9uIHBwXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9nb3V0VXRpbGl0eVNlcnZpY2UubG9nT3V0SW5hY3RpdmVVc2VyKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNhbkFjdGl2YXRlKG5leHQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsXG4gICAgICAgICAgICAgICAgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgUHJvbWlzZTxib29sZWFuPiB8IGJvb2xlYW4ge1xuICAgICAgICB0aGlzLmlzVG9rZW5WYWxpZCA9IHRoaXMudG9rZW5IYW5kbGluZ1NlcnZpY2UuaXNUb2tlblZhbGlkKHRoaXMuand0VG9rZW4pO1xuICAgICAgICBjb25zdCBkZWNvZGVkVG9rZW4gPSB0aGlzLmRlY29kZWRUb2tlblNlcnZpY2UuZ2V0RGVjb2RlZEp3dFRva2VuKCk7XG4gICAgICAgIGlmIChkZWNvZGVkVG9rZW4gJiYgKCFkZWNvZGVkVG9rZW4uYXV0aG9yaXRpZXMgfHwgZGVjb2RlZFRva2VuLmF1dGhvcml0aWVzICYmIGRlY29kZWRUb2tlbi5hcHBsaWNhdGlvbnMubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICAgICAgWydDQU0nLCAnQ0FTSElFUiddLmluZGV4T2YoZGVjb2RlZFRva2VuLmFwcGxpY2F0aW9uc1swXSkgPj0gMCkgJiYgKChkZWNvZGVkVG9rZW4uYXBwbGljYXRpb25zLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgICAgICAgIFsnQ0FNJywgJ0NBU0hJRVInLCAnVEFCTEVfREFTSCddLmluZGV4T2YoZGVjb2RlZFRva2VuLmFwcGxpY2F0aW9uc1swXSkgPj0gMCkgfHxcbiAgICAgICAgICAgICAgICAoZGVjb2RlZFRva2VuLmFwcGxpY2F0aW9ucy5sZW5ndGggPT09IDMgJiYgWydUQUJMRV9EQVNIJywgJ0FMRVJUUycsICdQTEFZRVJfREFTSCddXG4gICAgICAgICAgICAgICAgICAgIC5ldmVyeSgodmFsLCBpKSA9PiB2YWwgPT09IGRlY29kZWRUb2tlbi5hcHBsaWNhdGlvbnNbaV0pKSkpIHtcbiAgICAgICAgICAgIGlmIChkZWNvZGVkVG9rZW4uYXBwbGljYXRpb25zWzBdID09PSAnVEFCTEVfREFTSCcgJiYgIXN0YXRlLnVybC5pbmNsdWRlcygndW5hdXRob3JpemVkLWFjY2VzcycpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RhYmxlVUlQcm90b2NvbCcsIHRhYmxlVUlQcm90b2NvbCk7XG4gICAgICAgICAgICAgICAgaWYgKHRhYmxlVUlQcm90b2NvbCAhPT0gdW5kZWZpbmVkICYmIHRhYmxlVUlQcm90b2NvbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihgJHt0YWJsZVVJUHJvdG9jb2x9dGFibGV1aToke3RhYmxlVUlQb3J0fS9zaW5nbGUtdGFibGUtdmlld2AsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKCdwcG1hc3RlcicpIHx8IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ2xvZ2luJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5hdXRoVmFsdWVzLmp3dFRva2VuS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW5IYW5kbGluZ1NlcnZpY2UuSGFuZGxlVG9rZW5FeHBpcmF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVjb2RlZFRva2VuLmFwcGxpY2F0aW9uc1swXSAhPT0gJ1RBQkxFX0RBU0gnICYmICFzdGF0ZS51cmwuaW5jbHVkZXMoJ3VuYXV0aG9yaXplZC1hY2Nlc3MnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW5IYW5kbGluZ1NlcnZpY2UudGVybWluYWxSZWRpcmVjdGlvbihkZWNvZGVkVG9rZW4uYXBwbGljYXRpb25zWzBdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUudXJsLmluY2x1ZGVzKCd1bmF1dGhvcml6ZWQtYWNjZXNzJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCh0aGlzLmp3dFRva2VuICYmIHRoaXMuaXNUb2tlblZhbGlkKSB8fFxuICAgICAgICAgICAgKHRoaXMuZGVjb2RlZFRva2VuU2VydmljZS5nZXRKd3RUb2tlbigpICYmIHRoaXMudG9rZW5IYW5kbGluZ1NlcnZpY2UuaXNUb2tlblZhbGlkKHRoaXMuZGVjb2RlZFRva2VuU2VydmljZS5nZXRKd3RUb2tlbigpKSkgfHxcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ3BwbWFzdGVyJykgfHwgbG9jYXRpb24uaHJlZi5pbmNsdWRlcygnbG9naW4nKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RMb2FkKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZpcnN0TG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHRva2VuO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXV0aFZhbHVlcyAmJiB0aGlzLmF1dGhWYWx1ZXMuand0VG9rZW5LZXkpIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuYXV0aFZhbHVlcy5qd3RUb2tlbktleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4gIT09IG51bGwgJiYgdG9rZW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9rZW5IYW5kbGluZ1NlcnZpY2UuSGFuZGxlVG9rZW5FeHBpcmF0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dGhWYWx1ZXMgJiYgdGhpcy5hdXRoVmFsdWVzLmp3dFRva2VuS2V5KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmF1dGhWYWx1ZXMuand0VG9rZW5LZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50b2tlbkhhbmRsaW5nU2VydmljZS5yZWRpcmVjdFVSSSh0b2tlbik7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgIH1cbn1cblxuIl19