import { OnInit } from '@angular/core';
import { AuthService } from '../services/Authentication/auth.service';
import { UserService } from '../services/user.service';
import { DecodedTokenService } from '../services/Authentication/decoded-token.service';
import { UtilityService } from '../services/utility.service';
import { ConfigurationService } from '../services/configuration.service';
import * as ɵngcc0 from '@angular/core';
export declare class AppListComponent implements OnInit {
    private authService;
    private userService;
    private utilities;
    private configurationService;
    private decodedTokenService;
    utilService: UtilityService;
    currentAppCode: any;
    appSwitcher: any;
    applicationCodesFromJwt: Array<string>;
    loading: boolean;
    callInProg: boolean;
    constructor(authService: AuthService, userService: UserService, utilities: UtilityService, configurationService: ConfigurationService, decodedTokenService: DecodedTokenService, utilService: UtilityService);
    ngOnInit(): void;
    initMenuItems(): void;
    divideMenuItems(): void;
    checkGlobalCbpt(): import("rxjs").Observable<import("@angular/common/http").HttpResponse<Object>>;
    setFavoriteApp(event: any, appCode: any): void;
    openApp(clientID: any): void;
    currentApp(clientID: any, tokenData: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AppListComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<AppListComponent, "app-list", never, { "currentAppCode": "currentAppCode"; }, {}, never, never>;
}

//# sourceMappingURL=app-list.component.d.ts.map