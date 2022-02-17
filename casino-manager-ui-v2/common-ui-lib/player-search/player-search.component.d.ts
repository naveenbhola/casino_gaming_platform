import { EventEmitter, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CasinomanagerService } from '../services/casinomanager.service';
import * as ɵngcc0 from '@angular/core';
export interface PlayerParam {
    params: any;
}
export declare class PlayerSearchComponent implements OnInit, OnChanges {
    private casinoManagerService;
    private snackBar;
    private translate;
    searchOption: {
        value: string;
        viewValue: string;
    }[];
    prevKeyCode: any;
    reqObj: PlayerParam;
    selectedOption: string;
    searchText: any;
    searchObj: EventEmitter<any>;
    updateNameAfterSearch: any;
    isDisabled: boolean;
    activePlayerApi: boolean;
    gamingDay: any;
    isCMSUp: boolean;
    isInvalidPlayerId: boolean;
    isInvalidCardId: boolean;
    constructor(casinoManagerService: CasinomanagerService, snackBar: MatSnackBar, translate: TranslateService);
    handleKeyboardEvent(event: KeyboardEvent): void;
    ngOnInit(): void;
    ngOnChanges(): void;
    searchPlayer(searchText: any): void;
    getActivePlayers(): void;
    getRequestedPlayers(): void;
    getLastSixDigits(val: any): any;
    checkEvent(): void;
    isValidPlayerId(playerId: any): boolean;
    isValidCardId(cardValue: any): any;
    onKeyPressSearchText(event: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PlayerSearchComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<PlayerSearchComponent, "app-player-search", never, { "isDisabled": "isDisabled"; "activePlayerApi": "activePlayerApi"; "updateNameAfterSearch": "updateNameAfterSearch"; "gamingDay": "gamingDay"; }, { "searchObj": "searchObj"; }, never, never>;
}

//# sourceMappingURL=player-search.component.d.ts.map