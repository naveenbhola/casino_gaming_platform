import { AuthService } from './Authentication/auth.service';
import { DecodedTokenService } from './Authentication/decoded-token.service';
import { ConfigurationService } from './configuration.service';
import * as ɵngcc0 from '@angular/core';
export declare class LogoutUtilityService {
    private authService;
    private decodedTokenService;
    private configurationService;
    logOutClicked: boolean;
    constructor(authService: AuthService, decodedTokenService: DecodedTokenService, configurationService: ConfigurationService);
    logOutInactiveUser(): void;
    logout(): void;
    removeAndRedirect(): void;
    redirectAfterLogout(url: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<LogoutUtilityService, never>;
}

//# sourceMappingURL=logout-utility.service.d.ts.map