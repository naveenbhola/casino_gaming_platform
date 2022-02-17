import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecodedTokenService } from './decoded-token.service';
import { AuthService } from './auth.service';
import { LogoutUtilityService } from '../logout-utility.service';
import { catchError } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import * as i0 from "@angular/core";
import * as i1 from "@auth0/angular-jwt";
import * as i2 from "./decoded-token.service";
import * as i3 from "./auth.service";
import * as i4 from "../logout-utility.service";
import * as i5 from "ngx-logger";
/**
 * This service performs the following tasks:
 * 1> Add jwt Token to every call
 * 2> refreshes token if it's about to expire
 */
export class JwtInterceptorService {
    constructor(jwtHelper, decodedTokenService, authService, logoutUtilityService, logger) {
        this.jwtHelper = jwtHelper;
        this.decodedTokenService = decodedTokenService;
        this.authService = authService;
        this.logoutUtilityService = logoutUtilityService;
        this.logger = logger;
        if (location.href.includes('access_token')) {
            this.jwtTokenFromUrl = location.href.split('access_token=')[1];
        }
    }
    intercept(req, next) {
        let jwtToken;
        if (location.href.includes('access_token')) {
            this.jwtTokenFromUrl = location.href.split('access_token=')[1];
        }
        else {
            this.jwtTokenFromUrl = '';
        }
        if (this.jwtTokenFromUrl && this.jwtTokenFromUrl !== '') {
            jwtToken = this.jwtTokenFromUrl.split('&')[0];
            if (localStorage.getItem('authValues')) {
                this.decodedTokenService.setDecodedJwtToken(JSON.parse(localStorage.getItem('authValues')).jwtTokenKey, jwtToken);
            }
        }
        else if (this.decodedTokenService.getJwtToken()) {
            jwtToken = this.decodedTokenService.getJwtToken();
        }
        return this.interceptHeader(req, next, jwtToken).pipe(catchError(err => {
            if (!req.url.includes('table/v1/log?appname')) {
                this.logger.error(err, req.url);
            }
            return throwError(err);
        }));
    }
    interceptHeader(req, next, jwtToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${jwtToken}`
            }
        });
        return next.handle(req);
    }
}
JwtInterceptorService.ɵprov = i0.ɵɵdefineInjectable({ factory: function JwtInterceptorService_Factory() { return new JwtInterceptorService(i0.ɵɵinject(i1.JwtHelperService), i0.ɵɵinject(i2.DecodedTokenService), i0.ɵɵinject(i3.AuthService), i0.ɵɵinject(i4.LogoutUtilityService), i0.ɵɵinject(i5.NGXLogger)); }, token: JwtInterceptorService, providedIn: "root" });
JwtInterceptorService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
JwtInterceptorService.ctorParameters = () => [
    { type: JwtHelperService },
    { type: DecodedTokenService },
    { type: AuthService },
    { type: LogoutUtilityService },
    { type: NGXLogger }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWludGVyY2VwdG9yLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9zZXJ2aWNlcy9BdXRoZW50aWNhdGlvbi9qd3QtaW50ZXJjZXB0b3Iuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBYSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDOzs7Ozs7O0FBR3JDOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8scUJBQXFCO0lBSTlCLFlBQW9CLFNBQTJCLEVBQVUsbUJBQXdDLEVBQzdFLFdBQXdCLEVBQ3hCLG9CQUEwQyxFQUMxQyxNQUFpQjtRQUhqQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFVLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDN0UsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxXQUFNLEdBQU4sTUFBTSxDQUFXO1FBQ2pDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDeEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsRTtJQUNMLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBcUIsRUFBRSxJQUFpQjtRQUM5QyxJQUFJLFFBQWdCLENBQUM7UUFDckIsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN4QyxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xFO2FBQU07WUFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztTQUM3QjtRQUNELElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLEVBQUUsRUFBRTtZQUNyRCxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3JIO1NBQ0o7YUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUMvQyxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUNELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBRUQsZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUTtRQUMvQixHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUNaLFVBQVUsRUFBRTtnQkFDUixhQUFhLEVBQUUsVUFBVSxRQUFRLEVBQUU7YUFDdEM7U0FDSixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7OztZQTlDSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQWhCTyxnQkFBZ0I7WUFDaEIsbUJBQW1CO1lBQ25CLFdBQVc7WUFDWCxvQkFBb0I7WUFFcEIsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBFdmVudCwgSHR0cEhhbmRsZXIsIEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3R9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0p3dEhlbHBlclNlcnZpY2V9IGZyb20gJ0BhdXRoMC9hbmd1bGFyLWp3dCc7XG5pbXBvcnQge0RlY29kZWRUb2tlblNlcnZpY2V9IGZyb20gJy4vZGVjb2RlZC10b2tlbi5zZXJ2aWNlJztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7TG9nb3V0VXRpbGl0eVNlcnZpY2V9IGZyb20gJy4uL2xvZ291dC11dGlsaXR5LnNlcnZpY2UnO1xuaW1wb3J0IHtjYXRjaEVycm9yfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge05HWExvZ2dlcn0gZnJvbSAnbmd4LWxvZ2dlcic7XG5cblxuLyoqXG4gKiBUaGlzIHNlcnZpY2UgcGVyZm9ybXMgdGhlIGZvbGxvd2luZyB0YXNrczpcbiAqIDE+IEFkZCBqd3QgVG9rZW4gdG8gZXZlcnkgY2FsbFxuICogMj4gcmVmcmVzaGVzIHRva2VuIGlmIGl0J3MgYWJvdXQgdG8gZXhwaXJlXG4gKi9cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBKd3RJbnRlcmNlcHRvclNlcnZpY2UgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3Ige1xuXG4gICAgand0VG9rZW5Gcm9tVXJsOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGp3dEhlbHBlcjogSnd0SGVscGVyU2VydmljZSwgcHJpdmF0ZSBkZWNvZGVkVG9rZW5TZXJ2aWNlOiBEZWNvZGVkVG9rZW5TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgbG9nb3V0VXRpbGl0eVNlcnZpY2U6IExvZ291dFV0aWxpdHlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgbG9nZ2VyOiBOR1hMb2dnZXIpIHtcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ2FjY2Vzc190b2tlbicpKSB7XG4gICAgICAgICAgICB0aGlzLmp3dFRva2VuRnJvbVVybCA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJ2FjY2Vzc190b2tlbj0nKVsxXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGludGVyY2VwdChyZXE6IEh0dHBSZXF1ZXN0PGFueT4sIG5leHQ6IEh0dHBIYW5kbGVyKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xuICAgICAgICBsZXQgand0VG9rZW46IHN0cmluZztcbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoJ2FjY2Vzc190b2tlbicpKSB7XG4gICAgICAgICAgICB0aGlzLmp3dFRva2VuRnJvbVVybCA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJ2FjY2Vzc190b2tlbj0nKVsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuand0VG9rZW5Gcm9tVXJsID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuand0VG9rZW5Gcm9tVXJsICYmIHRoaXMuand0VG9rZW5Gcm9tVXJsICE9PSAnJykge1xuICAgICAgICAgICAgand0VG9rZW4gPSB0aGlzLmp3dFRva2VuRnJvbVVybC5zcGxpdCgnJicpWzBdO1xuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoVmFsdWVzJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY29kZWRUb2tlblNlcnZpY2Uuc2V0RGVjb2RlZEp3dFRva2VuKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhWYWx1ZXMnKSkuand0VG9rZW5LZXksIGp3dFRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmRlY29kZWRUb2tlblNlcnZpY2UuZ2V0Snd0VG9rZW4oKSkge1xuICAgICAgICAgICAgand0VG9rZW4gPSB0aGlzLmRlY29kZWRUb2tlblNlcnZpY2UuZ2V0Snd0VG9rZW4oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcmNlcHRIZWFkZXIocmVxLCBuZXh0LCBqd3RUb2tlbikucGlwZShjYXRjaEVycm9yKGVyciA9PiB7XG4gICAgICAgICAgICBpZiAoIXJlcS51cmwuaW5jbHVkZXMoJ3RhYmxlL3YxL2xvZz9hcHBuYW1lJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIsIHJlcS51cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGludGVyY2VwdEhlYWRlcihyZXEsIG5leHQsIGp3dFRva2VuKSB7XG4gICAgICAgIHJlcSA9IHJlcS5jbG9uZSh7XG4gICAgICAgICAgICBzZXRIZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2p3dFRva2VufWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShyZXEpO1xuICAgIH1cbn1cbiJdfQ==