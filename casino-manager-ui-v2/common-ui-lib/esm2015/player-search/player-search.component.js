import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CasinomanagerService } from '../services/casinomanager.service';
export class PlayerSearchComponent {
    constructor(casinoManagerService, snackBar, translate) {
        this.casinoManagerService = casinoManagerService;
        this.snackBar = snackBar;
        this.translate = translate;
        this.searchOption = [
            { value: 'casinoPlayerId', viewValue: 'application.app.common.labels.PLAYERID' },
            { value: 'firstName', viewValue: 'application.app.common.labels.FIRST_NAME' },
            { value: 'lastName', viewValue: 'application.app.common.labels.LAST_NAME' }
        ];
        this.reqObj = { params: {} };
        this.selectedOption = 'casinoPlayerId';
        this.searchObj = new EventEmitter();
        this.isDisabled = false;
        this.activePlayerApi = false;
        this.isCMSUp = true;
        this.isInvalidPlayerId = false;
        this.isInvalidCardId = false;
        // this.translate.setDefaultLang('en_US');
    }
    handleKeyboardEvent(event) {
        if (event.keyCode === 13) {
            this.checkEvent();
        }
        else {
            this.prevKeyCode = event.keyCode;
        }
    }
    ngOnInit() {
    }
    ngOnChanges() {
        this.searchText = this.updateNameAfterSearch;
    }
    searchPlayer(searchText) {
        this.reqObj.params = {};
        switch (this.selectedOption) {
            case 'casinoPlayerId': {
                if (this.isValidPlayerId(searchText)) {
                    this.isInvalidPlayerId = false;
                    this.isInvalidCardId = false;
                    this.reqObj.params.casinoPlayerId = searchText;
                }
                else {
                    this.isInvalidPlayerId = true;
                    this.isInvalidCardId = false;
                    const invalidMsg = this.translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.INVALID_PLAYER_ID');
                    this.snackBar.open(invalidMsg, '', {
                        duration: 3000,
                        horizontalPosition: 'right',
                        panelClass: 'snack__warn'
                    });
                }
                break;
            }
            case 'lastName': {
                this.isInvalidCardId = false;
                this.isInvalidPlayerId = false;
                if (this.activePlayerApi) {
                    this.reqObj.params.playerLastName = searchText;
                }
                else {
                    this.reqObj.params.lastName = searchText;
                }
                break;
            }
            case 'firstName': {
                this.isInvalidCardId = false;
                this.isInvalidPlayerId = false;
                if (this.activePlayerApi) {
                    this.reqObj.params.playerFirstName = searchText;
                }
                else {
                    this.reqObj.params.firstName = searchText;
                }
                break;
            }
            case 'casinoCardData': {
                this.searchText = '';
                if (this.isValidCardId(searchText)) {
                    this.isInvalidCardId = false;
                    this.isInvalidPlayerId = false;
                    this.reqObj.params.casinoCardData = searchText;
                }
                else {
                    this.isInvalidCardId = true;
                    this.isInvalidPlayerId = false;
                }
                break;
            }
        }
        if (this.selectedOption === 'firstName' || this.selectedOption === 'lastName') {
            if (searchText.trim().length < 3) {
                this.snackBar.open(this.translate.instant('application.app.common.labels.MIN_LENGTH_VALIDITY'), '', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    panelClass: 'snack__warn'
                });
                return;
            }
        }
        this.reqObj.params.fetch = false;
        if (!this.isInvalidPlayerId && !this.isInvalidCardId) {
            if (this.activePlayerApi) {
                this.getActivePlayers();
            }
            else {
                this.getRequestedPlayers();
            }
        }
    }
    getActivePlayers() {
        this.reqObj.params.gamingDay = this.gamingDay;
        this.casinoManagerService.getActivePlayer(this.reqObj).subscribe(res => {
            this.searchObj.emit(res);
        }, err => {
            console.log(err);
        });
    }
    getRequestedPlayers() {
        this.casinoManagerService.getActivePlayer(this.reqObj).subscribe((res) => {
            if ((this.selectedOption === 'casinoPlayerId' || this.selectedOption === 'casinoCardData') && res['successObj'].players.banned) {
                this.selectedOption = 'casinoPlayerId';
                const bannedMsg = this.translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.BANNEDPLAYER');
                this.snackBar.open(bannedMsg, '', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    panelClass: 'snack__warn'
                });
                return false;
            }
            if (this.selectedOption === 'casinoCardData' && res['successObj'].players.length > 0
                && res['successObj'].players[0].playerId === null) {
                res['successObj'].players[0].playerId = this.getLastSixDigits(res['successObj'].players[0].cardId);
                res['successObj'].players[0].cardId = res['successObj'].players[0].cardId;
                this.selectedOption = 'casinoPlayerId';
            }
            this.isCMSUp = res['successObj'].isCMSUp;
            if (this.selectedOption === 'firstName' || this.selectedOption === 'lastName') {
                if (!this.isCMSUp) {
                    this.snackBar.open(this.translate.instant('application.app.common.labels.SEARCH_PLAYER_BY_ID_CARD'), '', {
                        duration: 4000,
                        horizontalPosition: 'right',
                        panelClass: 'snack__info'
                    });
                    return;
                }
            }
            if (res['successObj'].players.length < 1) {
                this.snackBar.open(this.translate.instant('application.app.common.labels.PLAYERNOTFOUND'), '', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    panelClass: 'snack__warn'
                });
                return;
            }
            this.searchObj.emit(res);
        }, (err) => {
            this.snackBar.open(this.translate.instant('application.app.common.labels.PLAYERNOTFOUND'), '', {
                duration: 3000,
                horizontalPosition: 'right',
                panelClass: 'snack__warn'
            });
            console.log(err);
        });
    }
    getLastSixDigits(val) {
        val = val.replace(';', '').replace('?', '');
        return val.substr(-6);
    }
    checkEvent() {
        if (this.prevKeyCode > 57) {
            this.selectedOption = 'casinoCardData';
            if (this.searchText) {
                this.searchPlayer(this.searchText);
            }
        }
        else {
            // this.doSearch();
        }
    }
    isValidPlayerId(playerId) {
        return playerId.length > 0 && playerId.length <= 9 && !isNaN(playerId) && parseInt(playerId, 10) > 0
            && Number.isInteger(parseInt(playerId, 10));
    }
    isValidCardId(cardValue) {
        let isValidCard;
        if (cardValue.match(/[a-z]/i)) {
            isValidCard = false;
        }
        else {
            const strLen = cardValue.length;
            if (cardValue[0] === ';' && cardValue[strLen - 1] === '?') {
                let cardVal = cardValue.replace(';', '').replace('?', '');
                cardVal = cardVal.replace(/[&\/\\#,+()$~%.'":*?<>{}=]/g, '');
                if (!isNaN(cardVal)) {
                    isValidCard = true;
                }
                else {
                    isValidCard = false;
                }
            }
            else {
                isValidCard = false;
            }
        }
        return isValidCard;
    }
    onKeyPressSearchText(event) {
        if (event.target.value.length > 8) {
            event.preventDefault();
        }
    }
    ;
}
PlayerSearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-player-search',
                template: "<div class=\"search-form-group mat-elevation-z2\">\n  <mat-form-field>\n    <mat-label [translate]=\"'application.app.common.labels.SEARCHBY'\">Search Option</mat-label>\n    <mat-select [(ngModel)]=\"selectedOption\" [disabled]=\"isDisabled\">\n      <mat-option *ngFor=\"let option of searchOption\" [value]=\"option.value\">\n        {{option.viewValue | translate}}\n      </mat-option>\n    </mat-select>\n  </mat-form-field>\n  <mat-form-field>\n    <input matInput placeholder=\"{{'application.app.common.labels.ENTER_PLAYERIDRNAME' | translate}}\"\n           *ngIf=\"(selectedOption === 'casinoPlayerId' || (selectedOption === 'casinoCardData'))\"\n           [disabled]=\"isDisabled\" [(ngModel)]=\"searchText\" appAppAutoFocus autocomplete=\"off\"/>\n    <input matInput placeholder=\"{{'application.app.common.labels.ENTER_PLAYERIDRNAME' | translate}}\"\n           *ngIf=\"(selectedOption === 'firstName' || (selectedOption === 'lastName'))\"\n           [disabled]=\"isDisabled\" [(ngModel)]=\"searchText\" appAppAutoFocus autocomplete=\"off\"/>\n  </mat-form-field>\n  <button mat-raised-button\n          class=\"button--search\"\n          type=\"button\" [disabled]=\"!searchText || isDisabled\"\n          color='primary' (click)=\"searchPlayer(searchText)\">\n    <i class=\"material-icons\">search</i>\n  </button>\n</div>\n\n<div class=\"d-flex\" *ngIf=\"!isCMSUp\">\n  <small class=\"text-danger\">{{'application.app.common.labels.PLAYER_INFO_NOT_AVAILABLE' | translate}}</small>\n</div>\n",
                styles: [""]
            },] }
];
PlayerSearchComponent.ctorParameters = () => [
    { type: CasinomanagerService },
    { type: MatSnackBar },
    { type: TranslateService }
];
PlayerSearchComponent.propDecorators = {
    searchObj: [{ type: Output }],
    updateNameAfterSearch: [{ type: Input }],
    isDisabled: [{ type: Input }],
    activePlayerApi: [{ type: Input }],
    gamingDay: [{ type: Input }],
    handleKeyboardEvent: [{ type: HostListener, args: ['document:keypress', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLXNlYXJjaC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9wbGF5ZXItc2VhcmNoL3BsYXllci1zZWFyY2guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFTdkUsTUFBTSxPQUFPLHFCQUFxQjtJQW9CaEMsWUFBb0Isb0JBQTBDLEVBQzFDLFFBQXFCLEVBQ3JCLFNBQTJCO1FBRjNCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDMUMsYUFBUSxHQUFSLFFBQVEsQ0FBYTtRQUNyQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQXJCL0MsaUJBQVksR0FBRztZQUNiLEVBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSx3Q0FBd0MsRUFBQztZQUM5RSxFQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLDBDQUEwQyxFQUFDO1lBQzNFLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUseUNBQXlDLEVBQUM7U0FFMUUsQ0FBQztRQUVGLFdBQU0sR0FBZ0IsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDckMsbUJBQWMsR0FBRyxnQkFBZ0IsQ0FBQztRQUV4QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVyQyxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBRWpDLFlB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QUs7a0NBV0wsWUFBWSxTQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRTbmFja0JhciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XG5pbXBvcnQge1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHtDYXNpbm9tYW5hZ2VyU2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvY2FzaW5vbWFuYWdlci5zZXJ2aWNlJztcbmV4cG9ydCBpbnRlcmZhY2UgUGxheWVyUGFyYW0ge1xuICBwYXJhbXM6IGFueTtcbn1cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1wbGF5ZXItc2VhcmNoJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BsYXllci1zZWFyY2guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wbGF5ZXItc2VhcmNoLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGxheWVyU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBzZWFyY2hPcHRpb24gPSBbXG4gICAge3ZhbHVlOiAnY2FzaW5vUGxheWVySWQnLCB2aWV3VmFsdWU6ICdhcHBsaWNhdGlvbi5hcHAuY29tbW9uLmxhYmVscy5QTEFZRVJJRCd9LFxuICAgIHt2YWx1ZTogJ2ZpcnN0TmFtZScsIHZpZXdWYWx1ZTogJ2FwcGxpY2F0aW9uLmFwcC5jb21tb24ubGFiZWxzLkZJUlNUX05BTUUnfSxcbiAgICB7dmFsdWU6ICdsYXN0TmFtZScsIHZpZXdWYWx1ZTogJ2FwcGxpY2F0aW9uLmFwcC5jb21tb24ubGFiZWxzLkxBU1RfTkFNRSd9XG5cbiAgXTtcbiAgcHJldktleUNvZGU7XG4gIHJlcU9iajogUGxheWVyUGFyYW0gPSB7IHBhcmFtczoge30gfTtcbiAgc2VsZWN0ZWRPcHRpb24gPSAnY2FzaW5vUGxheWVySWQnO1xuICBzZWFyY2hUZXh0O1xuICBAT3V0cHV0KCkgc2VhcmNoT2JqID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBJbnB1dCgpIHVwZGF0ZU5hbWVBZnRlclNlYXJjaDtcbiAgQElucHV0KCkgaXNEaXNhYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBhY3RpdmVQbGF5ZXJBcGkgPSBmYWxzZTtcbiAgQElucHV0KCkgZ2FtaW5nRGF5O1xuICBpc0NNU1VwID0gdHJ1ZTtcbiAgaXNJbnZhbGlkUGxheWVySWQgPSBmYWxzZTtcbiAgaXNJbnZhbGlkQ2FyZElkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjYXNpbm9NYW5hZ2VyU2VydmljZTogQ2FzaW5vbWFuYWdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgc25hY2tCYXI6IE1hdFNuYWNrQmFyLFxuICAgICAgICAgICAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZVxuICApIHtcbiAgIC8vIHRoaXMudHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKCdlbl9VUycpO1xuICB9XG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleXByZXNzJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5Ym9hcmRFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgdGhpcy5jaGVja0V2ZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJldktleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIH1cbiAgfVxuICBuZ09uSW5pdCgpIHtcbiAgfVxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnNlYXJjaFRleHQgPSB0aGlzLnVwZGF0ZU5hbWVBZnRlclNlYXJjaDtcbiAgfVxuICBzZWFyY2hQbGF5ZXIoc2VhcmNoVGV4dCkge1xuICAgIHRoaXMucmVxT2JqLnBhcmFtcyA9IHt9O1xuICAgIHN3aXRjaCAodGhpcy5zZWxlY3RlZE9wdGlvbikge1xuICAgICAgY2FzZSAnY2FzaW5vUGxheWVySWQnOiB7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWRQbGF5ZXJJZChzZWFyY2hUZXh0KSkge1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkUGxheWVySWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZENhcmRJZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMucmVxT2JqLnBhcmFtcy5jYXNpbm9QbGF5ZXJJZCA9IHNlYXJjaFRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5pc0ludmFsaWRQbGF5ZXJJZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pc0ludmFsaWRDYXJkSWQgPSBmYWxzZTtcbiAgICAgICAgICBjb25zdCBpbnZhbGlkTXNnID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudCgnYXBwbGljYXRpb24uYXBwLkNBTV9DQVNISUVSX0xBQkVMUy5DT01NT05fTE9HR0VSTUVTU0FHRVMuSU5WQUxJRF9QTEFZRVJfSUQnKTtcbiAgICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oaW52YWxpZE1zZywgJycsIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAwLFxuICAgICAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uOiAncmlnaHQnLFxuICAgICAgICAgICAgcGFuZWxDbGFzczogJ3NuYWNrX193YXJuJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnbGFzdE5hbWUnIDoge1xuICAgICAgICB0aGlzLmlzSW52YWxpZENhcmRJZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzSW52YWxpZFBsYXllcklkID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVBsYXllckFwaSkge1xuICAgICAgICAgIHRoaXMucmVxT2JqLnBhcmFtcy5wbGF5ZXJMYXN0TmFtZSA9IHNlYXJjaFRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXFPYmoucGFyYW1zLmxhc3ROYW1lID0gc2VhcmNoVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnZmlyc3ROYW1lJyA6IHtcbiAgICAgICAgdGhpcy5pc0ludmFsaWRDYXJkSWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0ludmFsaWRQbGF5ZXJJZCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVQbGF5ZXJBcGkpIHtcbiAgICAgICAgICB0aGlzLnJlcU9iai5wYXJhbXMucGxheWVyRmlyc3ROYW1lID0gc2VhcmNoVGV4dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlcU9iai5wYXJhbXMuZmlyc3ROYW1lID0gc2VhcmNoVGV4dDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Nhc2lub0NhcmREYXRhJyA6IHtcbiAgICAgICAgdGhpcy5zZWFyY2hUZXh0ID0gJyc7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWRDYXJkSWQoc2VhcmNoVGV4dCkpIHtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZENhcmRJZCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkUGxheWVySWQgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnJlcU9iai5wYXJhbXMuY2FzaW5vQ2FyZERhdGEgPSBzZWFyY2hUZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaXNJbnZhbGlkQ2FyZElkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmlzSW52YWxpZFBsYXllcklkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdGVkT3B0aW9uID09PSAnZmlyc3ROYW1lJyB8fCB0aGlzLnNlbGVjdGVkT3B0aW9uID09PSAnbGFzdE5hbWUnKSB7XG4gICAgICBpZiAoc2VhcmNoVGV4dC50cmltKCkubGVuZ3RoIDwgMykge1xuICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4odGhpcy50cmFuc2xhdGUuaW5zdGFudCgnYXBwbGljYXRpb24uYXBwLmNvbW1vbi5sYWJlbHMuTUlOX0xFTkdUSF9WQUxJRElUWScpLCAnJywge1xuICAgICAgICAgIGR1cmF0aW9uOiAzMDAwLFxuICAgICAgICAgIGhvcml6b250YWxQb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICBwYW5lbENsYXNzOiAnc25hY2tfX3dhcm4nXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVxT2JqLnBhcmFtcy5mZXRjaCA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5pc0ludmFsaWRQbGF5ZXJJZCAmJiAhdGhpcy5pc0ludmFsaWRDYXJkSWQpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZVBsYXllckFwaSkge1xuICAgICAgICB0aGlzLmdldEFjdGl2ZVBsYXllcnMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0UmVxdWVzdGVkUGxheWVycygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXRBY3RpdmVQbGF5ZXJzKCkge1xuICAgIHRoaXMucmVxT2JqLnBhcmFtcy5nYW1pbmdEYXkgPSB0aGlzLmdhbWluZ0RheTtcbiAgICB0aGlzLmNhc2lub01hbmFnZXJTZXJ2aWNlLmdldEFjdGl2ZVBsYXllcih0aGlzLnJlcU9iaikuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICB0aGlzLnNlYXJjaE9iai5lbWl0KHJlcyk7XG4gICAgfSwgZXJyID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH1cbiAgZ2V0UmVxdWVzdGVkUGxheWVycygpIHtcbiAgICB0aGlzLmNhc2lub01hbmFnZXJTZXJ2aWNlLmdldEFjdGl2ZVBsYXllcih0aGlzLnJlcU9iaikuc3Vic2NyaWJlKCAocmVzKSA9PiB7XG4gICAgICBpZiAoKHRoaXMuc2VsZWN0ZWRPcHRpb24gPT09ICdjYXNpbm9QbGF5ZXJJZCcgfHwgdGhpcy5zZWxlY3RlZE9wdGlvbiA9PT0gJ2Nhc2lub0NhcmREYXRhJykgJiYgcmVzWydzdWNjZXNzT2JqJ10ucGxheWVycy5iYW5uZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbiA9ICdjYXNpbm9QbGF5ZXJJZCc7XG4gICAgICAgIGNvbnN0IGJhbm5lZE1zZyA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2FwcGxpY2F0aW9uLmFwcC5DQU1fQ0FTSElFUl9MQUJFTFMuQ09NTU9OX0xPR0dFUk1FU1NBR0VTLkJBTk5FRFBMQVlFUicpO1xuICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oYmFubmVkTXNnLCAnJywge1xuICAgICAgICAgIGR1cmF0aW9uOiAzMDAwLFxuICAgICAgICAgIGhvcml6b250YWxQb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICBwYW5lbENsYXNzOiAnc25hY2tfX3dhcm4nXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkT3B0aW9uID09PSAnY2FzaW5vQ2FyZERhdGEnICYmIHJlc1snc3VjY2Vzc09iaiddLnBsYXllcnMubGVuZ3RoID4gMFxuICAgICAgICAgICYmIHJlc1snc3VjY2Vzc09iaiddLnBsYXllcnNbMF0ucGxheWVySWQgPT09IG51bGwpIHtcbiAgICAgICAgICByZXNbJ3N1Y2Nlc3NPYmonXS5wbGF5ZXJzWzBdLnBsYXllcklkID0gdGhpcy5nZXRMYXN0U2l4RGlnaXRzKHJlc1snc3VjY2Vzc09iaiddLnBsYXllcnNbMF0uY2FyZElkKTtcbiAgICAgICAgICByZXNbJ3N1Y2Nlc3NPYmonXS5wbGF5ZXJzWzBdLmNhcmRJZCA9IHJlc1snc3VjY2Vzc09iaiddLnBsYXllcnNbMF0uY2FyZElkO1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPcHRpb24gPSAnY2FzaW5vUGxheWVySWQnO1xuICAgICAgICB9XG4gICAgICB0aGlzLmlzQ01TVXAgPSByZXNbJ3N1Y2Nlc3NPYmonXS5pc0NNU1VwO1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPcHRpb24gPT09ICdmaXJzdE5hbWUnIHx8IHRoaXMuc2VsZWN0ZWRPcHRpb24gPT09ICdsYXN0TmFtZScpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ01TVXApIHtcbiAgICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4odGhpcy50cmFuc2xhdGUuaW5zdGFudCgnYXBwbGljYXRpb24uYXBwLmNvbW1vbi5sYWJlbHMuU0VBUkNIX1BMQVlFUl9CWV9JRF9DQVJEJyksICcnLCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogNDAwMCxcbiAgICAgICAgICAgIGhvcml6b250YWxQb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIHBhbmVsQ2xhc3M6ICdzbmFja19faW5mbydcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICBpZiAocmVzWydzdWNjZXNzT2JqJ10ucGxheWVycy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2FwcGxpY2F0aW9uLmFwcC5jb21tb24ubGFiZWxzLlBMQVlFUk5PVEZPVU5EJyksICcnLCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICAgIGhvcml6b250YWxQb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIHBhbmVsQ2xhc3M6ICdzbmFja19fd2FybidcbiAgICAgICAgICB9KTtcbiAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlYXJjaE9iai5lbWl0KHJlcyk7XG4gICAgfSwgKGVycikgPT4ge1xuICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2FwcGxpY2F0aW9uLmFwcC5jb21tb24ubGFiZWxzLlBMQVlFUk5PVEZPVU5EJyksICcnLCB7XG4gICAgICAgIGR1cmF0aW9uOiAzMDAwLFxuICAgICAgICBob3Jpem9udGFsUG9zaXRpb246ICdyaWdodCcsXG4gICAgICAgIHBhbmVsQ2xhc3M6ICdzbmFja19fd2FybidcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgfVxuICBnZXRMYXN0U2l4RGlnaXRzKHZhbCkge1xuICAgIHZhbCA9IHZhbC5yZXBsYWNlKCc7JywgJycpLnJlcGxhY2UoJz8nLCAnJyk7XG4gICAgcmV0dXJuIHZhbC5zdWJzdHIoLTYpO1xuICB9XG4gIGNoZWNrRXZlbnQoKSB7XG4gICAgaWYgKHRoaXMucHJldktleUNvZGUgPiA1Nykge1xuICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbiA9ICdjYXNpbm9DYXJkRGF0YSc7XG4gICAgICBpZiAodGhpcy5zZWFyY2hUZXh0KSB7XG4gICAgICAgIHRoaXMuc2VhcmNoUGxheWVyKHRoaXMuc2VhcmNoVGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRoaXMuZG9TZWFyY2goKTtcbiAgICB9XG4gIH1cbiAgaXNWYWxpZFBsYXllcklkKHBsYXllcklkKSB7XG4gICAgcmV0dXJuIHBsYXllcklkLmxlbmd0aCA+IDAgJiYgcGxheWVySWQubGVuZ3RoIDw9IDkgJiYgIWlzTmFOKHBsYXllcklkKSAmJiBwYXJzZUludChwbGF5ZXJJZCwgMTApID4gMFxuICAgICAgJiYgTnVtYmVyLmlzSW50ZWdlcihwYXJzZUludChwbGF5ZXJJZCwgMTApKTtcbiAgfVxuICBpc1ZhbGlkQ2FyZElkKGNhcmRWYWx1ZSkge1xuICAgIGxldCBpc1ZhbGlkQ2FyZDtcbiAgICBpZiAoY2FyZFZhbHVlLm1hdGNoKC9bYS16XS9pKSkge1xuICAgICAgaXNWYWxpZENhcmQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc3RyTGVuID0gY2FyZFZhbHVlLmxlbmd0aDtcbiAgICAgIGlmIChjYXJkVmFsdWVbMF0gPT09ICc7JyAmJiBjYXJkVmFsdWVbc3RyTGVuIC0gMV0gPT09ICc/Jykge1xuICAgICAgICBsZXQgY2FyZFZhbCA9IGNhcmRWYWx1ZS5yZXBsYWNlKCc7JywgJycpLnJlcGxhY2UoJz8nLCAnJyk7XG4gICAgICAgIGNhcmRWYWwgPSBjYXJkVmFsLnJlcGxhY2UoL1smXFwvXFxcXCMsKygpJH4lLidcIjoqPzw+e309XS9nLCAnJyk7XG4gICAgICAgIGlmICghaXNOYU4oY2FyZFZhbCkpIHtcbiAgICAgICAgICBpc1ZhbGlkQ2FyZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNWYWxpZENhcmQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNWYWxpZENhcmQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzVmFsaWRDYXJkO1xuICB9XG4gIG9uS2V5UHJlc3NTZWFyY2hUZXh0KGV2ZW50OiBhbnkpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlLmxlbmd0aD44KXtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xufVxuIl19