import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { protocol, webCamTLSPort, webCashierTLSPort, webServerDNS, webDashboardPort, webTableDashboardTLSPort } from '../../constants/url.common.constants';
import { CageService } from '../cage.service';
import { DecodedTokenService } from './decoded-token.service';
import { LogoutUtilityService } from '../logout-utility.service';
import * as i0 from "@angular/core";
import * as i1 from "@auth0/angular-jwt";
import * as i2 from "./auth.service";
import * as i3 from "../cage.service";
import * as i4 from "./decoded-token.service";
import * as i5 from "../logout-utility.service";
export class TokenHandlingService {
    constructor(jwtHelper, authService, cageService, decodedTokenService, logoutUtilityService) {
        this.jwtHelper = jwtHelper;
        this.authService = authService;
        this.cageService = cageService;
        this.decodedTokenService = decodedTokenService;
        this.logoutUtilityService = logoutUtilityService;
        this.authValues = JSON.parse(localStorage.getItem('authValues'));
    }
    redirectURI(jwtToken) {
        let CLIENT_ID = 'lgn';
        if (this.authValues && this.authValues.clientId) {
            CLIENT_ID = this.authValues.clientId;
        }
        let decodedToken;
        if (jwtToken) {
            decodedToken = this.jwtHelper.decodeToken(jwtToken);
        }
        if (decodedToken && decodedToken.defaultApplication !== null
            && decodedToken.defaultApplication !== undefined && decodedToken.defaultApplication !== '') {
            CLIENT_ID = 'lgn';
        }
        location.href = `${protocol}${webServerDNS}` + ':' + webDashboardPort + '/login' +
            '?client_id=' + CLIENT_ID + '&redirect_uri=' + location.href;
    }
    isTokenValid(jwtToken) {
        if (jwtToken) {
            return this.hasPermission(jwtToken) && !this.jwtHelper.isTokenExpired(jwtToken);
        }
        else {
            return false;
        }
    }
    hasPermission(jwtToken) {
        const decodedToken = this.jwtHelper.decodeToken(jwtToken);
        if (decodedToken) {
            if (decodedToken.authorities && ((this.authValues.applicationCode === decodedToken.authorities[0].applicationCode &&
                decodedToken.authorities[0].permissions.includes(this.authValues.accessCode)) || decodedToken.superuser)) {
                return true;
            }
            else {
                return !!(this.authValues.clientId === 'lgn' && decodedToken.applications);
            }
        }
        else {
            return false;
        }
    }
    terminalRedirection(app) {
        const baseUrl = protocol + webServerDNS;
        let appPort = '';
        let clientId = '';
        switch (app) {
            case 'CAM':
                appPort = webCamTLSPort;
                clientId = 'cam';
                break;
            case 'CASHIER':
                appPort = webCashierTLSPort;
                clientId = 'cash';
                break;
            case 'TABLE_DASH':
                appPort = webTableDashboardTLSPort;
                clientId = 'tab';
                break;
        }
        if (app !== 'TABLE_DASH') {
            this.openApp(clientId, baseUrl, appPort);
        }
    }
    openApp(clientID, baseUrl, appPort) {
        this.authService.getRefreshToken(clientID).subscribe(tokenData => {
            const accessToken = 'access_token=' + tokenData.access_token + '&token_type=' + tokenData.token_type + '&expires_in=' +
                tokenData.expires_in + '&scope=' + tokenData.scope;
            if (clientID === 'tab') {
                const tableToken = this.jwtHelper.decodeToken(tokenData.access_token);
                const tableId = tableToken.authorities[0].topologyIds[0];
                this.cageService.getLocalGamingDay(tableId).subscribe(res => {
                    if (this.authValues.clientId === 'lgn') {
                        sessionStorage.clear();
                        localStorage.clear();
                    }
                    window.open(`${baseUrl}:${appPort}/#/tabledashboard/${tableId}/${res.successObj}?${accessToken}`, '_self');
                });
            }
            else {
                if (this.authValues.clientId === 'lgn') {
                    sessionStorage.clear();
                    localStorage.clear();
                }
                window.open(`${baseUrl}:${appPort}/#/${accessToken}`, '_self');
            }
        });
    }
    HandleTokenExpiration() {
        setInterval(() => {
            const token = this.decodedTokenService.getJwtToken();
            const tokenExpirationTime = this.jwtHelper.getTokenExpirationDate(token).getTime();
            const currentTime = new Date().getTime();
            if (currentTime > tokenExpirationTime - 200000) {
                this.authValues = JSON.parse(localStorage.getItem('authValues'));
                this.authService.getRefreshToken(this.authValues.clientId).subscribe(tokenData => {
                    const accessToken = tokenData.access_token;
                    this.decodedTokenService.setDecodedJwtToken(JSON.parse(localStorage.getItem('authValues'))
                        .jwtTokenKey, accessToken);
                }, (err) => {
                    this.logoutUtilityService.logout();
                    throw err;
                });
            }
        }, 60000);
    }
}
TokenHandlingService.ɵprov = i0.ɵɵdefineInjectable({ factory: function TokenHandlingService_Factory() { return new TokenHandlingService(i0.ɵɵinject(i1.JwtHelperService), i0.ɵɵinject(i2.AuthService), i0.ɵɵinject(i3.CageService), i0.ɵɵinject(i4.DecodedTokenService), i0.ɵɵinject(i5.LogoutUtilityService)); }, token: TokenHandlingService, providedIn: "root" });
TokenHandlingService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
TokenHandlingService.ctorParameters = () => [
    { type: JwtHelperService },
    { type: AuthService },
    { type: CageService },
    { type: DecodedTokenService },
    { type: LogoutUtilityService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4taGFuZGxpbmcuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL3NlcnZpY2VzL0F1dGhlbnRpY2F0aW9uL3Rva2VuLWhhbmRsaW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUNILFFBQVEsRUFDUixhQUFhLEVBQ2IsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsd0JBQXdCLEVBQzNCLE1BQU0sc0NBQXNDLENBQUM7QUFDOUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7O0FBSy9ELE1BQU0sT0FBTyxvQkFBb0I7SUFHN0IsWUFBb0IsU0FBMkIsRUFDM0IsV0FBd0IsRUFDeEIsV0FBd0IsRUFDeEIsbUJBQXdDLEVBQ3hDLG9CQUEwQztRQUoxQyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMzQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsV0FBVyxDQUFD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OztZQTNISixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQWpCTyxnQkFBZ0I7WUFDaEIsV0FBVztZQVVYLFdBQVc7WUFDWCxtQkFBbUI7WUFDbkIsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Snd0SGVscGVyU2VydmljZX0gZnJvbSAnQGF1dGgwL2FuZ3VsYXItand0JztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7QXV0aEludGVyZmFjZX0gZnJvbSAnLi9hdXRoLmludGVyZmFjZSc7XG5pbXBvcnQge1xuICAgIHByb3RvY29sLFxuICAgIHdlYkNhbVRMU1BvcnQsXG4gICAgd2ViQ2FzaGllclRMU1BvcnQsXG4gICAgd2ViU2VydmVyRE5TLFxuICAgIHdlYkRhc2hib2FyZFBvcnQsXG4gICAgd2ViVGFibGVEYXNoYm9hcmRUTFNQb3J0XG59IGZyb20gJy4uLy4uL2NvbnN0YW50cy91cmwuY29tbW9uLmNvbnN0YW50cyc7XG5pbXBvcnQge0NhZ2VTZXJ2aWNlfSBmcm9tICcuLi9jYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtEZWNvZGVkVG9rZW5TZXJ2aWNlfSBmcm9tICcuL2RlY29kZWQtdG9rZW4uc2VydmljZSc7XG5pbXBvcnQge0xvZ291dFV0aWxpdHlTZXJ2aWNlfSBmcm9tICcuLi9sb2dvdXQtdXRpbGl0eS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUb2tlbkhhbmRsaW5nU2VydmljZSB7XG4gICAgYXV0aFZhbHVlczogQXV0aEludGVyZmFjZTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgand0SGVscGVyOiBKd3RIZWxwZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgY2FnZVNlcnZpY2U6IENhZ2VTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZGVjb2RlZFRva2VuU2VydmljZTogRGVjb2RlZFRva2VuU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGxvZ291dFV0aWxpdHlTZXJ2aWNlOiBMb2dvdXRVdGlsaXR5U2VydmljZSkge1xuICAgICAgICB0aGlzLmF1dGhWYWx1ZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoVmFsdWVzJykpO1xuICAgIH1cblxuICAgIHJlZGlyZWN0VVJJKGp3dFRva2VuKTogdm9pZCB7XG4gICAgICAgIGxldCBDTElFTlRfSUQgPSAnbGduJztcbiAgICAgICAgaWYgKHRoaXMuYXV0aFZhbHVlcyAmJiB0aGlzLmF1dGhWYWx1ZXMuY2xpZW50SWQpIHtcbiAgICAgICAgICAgIENMSUVOVF9JRCA9IHRoaXMuYXV0aFZhbHVlcy5jbGllbnRJZDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGVjb2RlZFRva2VuO1xuICAgICAgICBpZiAoand0VG9rZW4pIHtcbiAgICAgICAgICAgIGRlY29kZWRUb2tlbiA9IHRoaXMuand0SGVscGVyLmRlY29kZVRva2VuKGp3dFRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVjb2RlZFRva2VuICYmIGRlY29kZWRUb2tlbi5kZWZhdWx0QXBwbGljYXRpb24gIT09IG51bGxcbiAgICAgICAgICAgICYmIGRlY29kZWRUb2tlbi5kZWZhdWx0QXBwbGljYXRpb24gIT09IHVuZGVmaW5lZCAmJiBkZWNvZGVkVG9rZW4uZGVmYXVsdEFwcGxpY2F0aW9uICE9PSAnJykge1xuICAgICAgICAgICAgQ0xJRU5UX0lEID0gJ2xnbic7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhdGlvbi5ocmVmID0gYCR7cHJvdG9jb2x9JHt3ZWJTZXJ2ZXJETlN9YCArICc6JyArIHdlYkRhc2hib2FyZFBvcnQgKyAnL2xvZ2luJyArXG4gICAgICAgICAgICAnP2NsaWVudF9pZD0nICsgQ0xJRU5UX0lEICsgJyZyZWRpcmVjdF91cmk9JyArIGxvY2F0aW9uLmhyZWY7XG4gICAgfVxuXG4gICAgaXNUb2tlblZhbGlkKGp3dFRva2VuKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChqd3RUb2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFzUGVybWlzc2lvbihqd3RUb2tlbikgJiYgIXRoaXMuand0SGVscGVyLmlzVG9rZW5FeHBpcmVkKGp3dFRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFzUGVybWlzc2lvbihqd3RUb2tlbik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBkZWNvZGVkVG9rZW4gPSB0aGlzLmp3dEhlbHBlci5kZWNvZGVUb2tlbihqd3RUb2tlbik7XG4gICAgICAgIGlmIChkZWNvZGVkVG9rZW4pIHtcbiAgICAgICAgICAgIGlmIChkZWNvZGVkVG9rZW4uYXV0aG9yaXRpZXMgJiYgKCh0aGlzLmF1dGhWYWx1ZXMuYXBwbGljYXRpb25Db2RlID09PSBkZWNvZGVkVG9rZW4uYXV0aG9yaXRpZXNbMF0uYXBwbGljYXRpb25Db2RlICYmXG4gICAgICAgICAgICAgICAgICAgIGRlY29kZWRUb2tlbi5hdXRob3JpdGllc1swXS5wZXJtaXNzaW9ucy5pbmNsdWRlcyh0aGlzLmF1dGhWYWx1ZXMuYWNjZXNzQ29kZSkpIHx8IGRlY29kZWRUb2tlbi5zdXBlcnVzZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAhISh0aGlzLmF1dGhWYWx1ZXMuY2xpZW50SWQgPT09ICdsZ24nICYmIGRlY29kZWRUb2tlbi5hcHBsaWNhdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGVybWluYWxSZWRpcmVjdGlvbihhcHA6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gcHJvdG9jb2wgKyB3ZWJTZXJ2ZXJETlM7XG4gICAgICAgIGxldCBhcHBQb3J0ID0gJyc7XG4gICAgICAgIGxldCBjbGllbnRJZCA9ICcnO1xuICAgICAgICBzd2l0Y2ggKGFwcCkge1xuICAgICAgICAgICAgY2FzZSAnQ0FNJzpcbiAgICAgICAgICAgICAgICBhcHBQb3J0ID0gd2ViQ2FtVExTUG9ydDtcbiAgICAgICAgICAgICAgICBjbGllbnRJZCA9ICdjYW0nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnQ0FTSElFUic6XG4gICAgICAgICAgICAgICAgYXBwUG9ydCA9IHdlYkNhc2hpZXJUTFNQb3J0O1xuICAgICAgICAgICAgICAgIGNsaWVudElkID0gJ2Nhc2gnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnVEFCTEVfREFTSCc6XG4gICAgICAgICAgICAgICAgYXBwUG9ydCA9IHdlYlRhYmxlRGFzaGJvYXJkVExTUG9ydDtcbiAgICAgICAgICAgICAgICBjbGllbnRJZCA9ICd0YWInO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcHAgIT09ICdUQUJMRV9EQVNIJykge1xuICAgICAgICAgICAgdGhpcy5vcGVuQXBwKGNsaWVudElkLCBiYXNlVXJsLCBhcHBQb3J0KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgb3BlbkFwcChjbGllbnRJRCwgYmFzZVVybCwgYXBwUG9ydCkge1xuICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmdldFJlZnJlc2hUb2tlbihjbGllbnRJRCkuc3Vic2NyaWJlKHRva2VuRGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9ICdhY2Nlc3NfdG9rZW49JyArIHRva2VuRGF0YS5hY2Nlc3NfdG9rZW4gKyAnJnRva2VuX3R5cGU9JyArIHRva2VuRGF0YS50b2tlbl90eXBlICsgJyZleHBpcmVzX2luPScgK1xuICAgICAgICAgICAgICAgIHRva2VuRGF0YS5leHBpcmVzX2luICsgJyZzY29wZT0nICsgdG9rZW5EYXRhLnNjb3BlO1xuICAgICAgICAgICAgaWYgKGNsaWVudElEID09PSAndGFiJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhYmxlVG9rZW4gPSB0aGlzLmp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbkRhdGEuYWNjZXNzX3Rva2VuKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWJsZUlkID0gdGFibGVUb2tlbi5hdXRob3JpdGllc1swXS50b3BvbG9neUlkc1swXTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhZ2VTZXJ2aWNlLmdldExvY2FsR2FtaW5nRGF5KHRhYmxlSWQpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRoVmFsdWVzLmNsaWVudElkID09PSAnbGduJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGAke2Jhc2VVcmx9OiR7YXBwUG9ydH0vIy90YWJsZWRhc2hib2FyZC8ke3RhYmxlSWR9LyR7cmVzLnN1Y2Nlc3NPYmp9PyR7YWNjZXNzVG9rZW59YCwgJ19zZWxmJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dGhWYWx1ZXMuY2xpZW50SWQgPT09ICdsZ24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihgJHtiYXNlVXJsfToke2FwcFBvcnR9LyMvJHthY2Nlc3NUb2tlbn1gLCAnX3NlbGYnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgSGFuZGxlVG9rZW5FeHBpcmF0aW9uKCkge1xuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuZGVjb2RlZFRva2VuU2VydmljZS5nZXRKd3RUb2tlbigpO1xuICAgICAgICAgICAgY29uc3QgdG9rZW5FeHBpcmF0aW9uVGltZSA9IHRoaXMuand0SGVscGVyLmdldFRva2VuRXhwaXJhdGlvbkRhdGUodG9rZW4pLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgPiB0b2tlbkV4cGlyYXRpb25UaW1lIC0gMjAwMDAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoVmFsdWVzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFZhbHVlcycpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmdldFJlZnJlc2hUb2tlbih0aGlzLmF1dGhWYWx1ZXMuY2xpZW50SWQpLnN1YnNjcmliZSh0b2tlbkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSB0b2tlbkRhdGEuYWNjZXNzX3Rva2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNvZGVkVG9rZW5TZXJ2aWNlLnNldERlY29kZWRKd3RUb2tlbihKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoVmFsdWVzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmp3dFRva2VuS2V5LCBhY2Nlc3NUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nb3V0VXRpbGl0eVNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIDYwMDAwKTtcbiAgICB9XG59XG4iXX0=