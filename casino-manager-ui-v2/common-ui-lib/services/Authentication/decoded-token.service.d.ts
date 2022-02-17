import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthInterface } from './auth.interface';
import * as ɵngcc0 from '@angular/core';
export declare class DecodedTokenService {
    private jwtHelper;
    authValues: AuthInterface;
    constructor(jwtHelper: JwtHelperService);
    getDecodedJwtToken(): any;
    setDecodedJwtToken(key: any, token: any): void;
    getJwtToken(): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DecodedTokenService, never>;
}

//# sourceMappingURL=decoded-token.service.d.ts.map