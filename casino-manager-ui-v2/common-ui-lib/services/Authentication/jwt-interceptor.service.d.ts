import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecodedTokenService } from './decoded-token.service';
import { AuthService } from './auth.service';
import { LogoutUtilityService } from '../logout-utility.service';
import { NGXLogger } from 'ngx-logger';
/**
 * This service performs the following tasks:
 * 1> Add jwt Token to every call
 * 2> refreshes token if it's about to expire
 */
import * as ɵngcc0 from '@angular/core';
export declare class JwtInterceptorService implements HttpInterceptor {
    private jwtHelper;
    private decodedTokenService;
    private authService;
    private logoutUtilityService;
    private logger;
    jwtTokenFromUrl: string;
    constructor(jwtHelper: JwtHelperService, decodedTokenService: DecodedTokenService, authService: AuthService, logoutUtilityService: LogoutUtilityService, logger: NGXLogger);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    interceptHeader(req: any, next: any, jwtToken: any): any;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<JwtInterceptorService, never>;
}

//# sourceMappingURL=jwt-interceptor.service.d.ts.map