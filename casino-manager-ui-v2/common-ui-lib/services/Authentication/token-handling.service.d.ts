import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';
import { AuthInterface } from './auth.interface';
import { CageService } from '../cage.service';
import { DecodedTokenService } from './decoded-token.service';
import { LogoutUtilityService } from '../logout-utility.service';
import * as ɵngcc0 from '@angular/core';
export declare class TokenHandlingService {
    private jwtHelper;
    private authService;
    private cageService;
    private decodedTokenService;
    private logoutUtilityService;
    authValues: AuthInterface;
    constructor(jwtHelper: JwtHelperService, authService: AuthService, cageService: CageService, decodedTokenService: DecodedTokenService, logoutUtilityService: LogoutUtilityService);
    redirectURI(jwtToken: any): void;
    isTokenValid(jwtToken: any): boolean;
    hasPermission(jwtToken: any): boolean;
    terminalRedirection(app: string): void;
    openApp(clientID: any, baseUrl: any, appPort: any): void;
    HandleTokenExpiration(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TokenHandlingService, never>;
}

//# sourceMappingURL=token-handling.service.d.ts.map