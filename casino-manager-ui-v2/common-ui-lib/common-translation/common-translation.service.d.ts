import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DecodedTokenService } from '../services/Authentication/decoded-token.service';
import * as ɵngcc0 from '@angular/core';
export declare class CommonTranslationService {
    private translate;
    private tokenService;
    languageChanged: EventEmitter<any>;
    constructor(translate: TranslateService, tokenService: DecodedTokenService);
    handleSubscription(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CommonTranslationService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<CommonTranslationService>;
}

//# sourceMappingURL=common-translation.service.d.ts.map