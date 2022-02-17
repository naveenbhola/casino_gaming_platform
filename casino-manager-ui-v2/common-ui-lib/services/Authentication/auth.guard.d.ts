import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenHandlingService } from './token-handling.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DecodedTokenService } from './decoded-token.service';
import { AuthInterface } from './auth.interface';
import { LogoutUtilityService } from '../logout-utility.service';
import { TopNavBarService } from '../top-nav-bar.service';
import { TableUIService } from '../table-ui.service';
import * as ɵngcc0 from '@angular/core';
export declare class AuthGuard implements CanActivate {
    private tokenHandlingService;
    private jwtHelper;
    private decodedTokenService;
    private logoutUtilityService;
    private topNavBarService;
    private router;
    private tableUIService;
    jwtToken: string;
    isTokenValid: any;
    authValues: AuthInterface;
    firstLoad: Boolean;
    constructor(tokenHandlingService: TokenHandlingService, jwtHelper: JwtHelperService, decodedTokenService: DecodedTokenService, logoutUtilityService: LogoutUtilityService, topNavBarService: TopNavBarService, router: Router, tableUIService: TableUIService);
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AuthGuard, never>;
}

//# sourceMappingURL=auth.guard.d.ts.map