import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, OnDestroy} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {CasinomanagerService} from '../../../../common-ui-lib';
import {AppService} from '../../app.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Subscription} from "rxjs/Rx";

export interface PlayerParam {
  params: any;
}

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.scss']
})
export class PlayerSearchComponent implements OnInit, OnChanges, OnDestroy {
  searchOption = [
    {value: 'casinoPlayerId', viewValue: 'application.app.common.labels.PLAYERID'},
    {value: 'firstName', viewValue: 'application.app.common.labels.FIRST_NAME'},
    {value: 'lastName', viewValue: 'application.app.common.labels.LAST_NAME'}

  ];
  prevKeyCode;
  reqObj: PlayerParam = {params: {}};
  selectedOption = 'casinoPlayerId';
  searchText;
  @Output() searchObj = new EventEmitter<any>();
  @Input() updateNameAfterSearch;
  @Input() isDisabled = false;
  @Input() activePlayerApi = false;
  @Input() gamingDay = this.appService.appGlobalObj.gamingDay;
  isCMSUp = true;
  isInvalidPlayerId = false;
  isInvalidCardId = false;
  isInputFromSwipeCard: boolean;
  currentKeyPressTime: number;
  currentKeyPressTimeE;
  currentKeyPressTimeN;
  activePlayerSub: Subscription;
  activePlayerSub_1: Subscription;

  constructor(private casinoManagerService: CasinomanagerService,
              private snackBar: MatSnackBar,
              private appService: AppService,
              private translate: TranslateService,
              private dialogRef: MatDialogRef<PlayerSearchComponent>) {
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && new Date().getMilliseconds() - this.currentKeyPressTime < 40) {
    } else {
      this.currentKeyPressTime = new Date().getMilliseconds();
    }

    if (event.key != 'Enter') {
      this.currentKeyPressTimeN = new Date();
    }
    if (event.key === 'Enter') {
      this.currentKeyPressTimeE = new Date();
      if ((this.currentKeyPressTimeE - this.currentKeyPressTimeN) < 40) {
        this.isInputFromSwipeCard = true;
      } else {
        this.isInputFromSwipeCard = false;
      }
    }
    if (event.keyCode === 13) {
      this.checkEvent();
    } else {
      this.prevKeyCode = event.keyCode;
    }
  }

  ngOnInit() {
    this.gamingDay = this.appService.appGlobalObj.gamingDay;
  }

  ngOnChanges() {
    this.searchText = this.updateNameAfterSearch;
  }

  searchPlayer(searchText) {
    // console.log('this.selectedOption', this.selectedOption, '   this.isInputFromSwipeCard', this.isInputFromSwipeCard)
    this.reqObj.params = {};
    switch (this.selectedOption) {
      case 'casinoPlayerId': {
        if (this.isValidPlayerId(searchText)) {
          this.isInvalidPlayerId = false;
          this.isInvalidCardId = false;
          this.reqObj.params.casinoPlayerId = searchText;
        } else {
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
      case 'lastName' : {
        this.isInvalidCardId = false;
        this.isInvalidPlayerId = false;
        if (this.activePlayerApi) {
          this.reqObj.params.playerLastName = searchText;
        } else {
          this.reqObj.params.lastName = searchText;
        }

        break;
      }
      case 'firstName' : {
        this.isInvalidCardId = false;
        this.isInvalidPlayerId = false;
        if (this.activePlayerApi) {
          this.reqObj.params.playerFirstName = searchText;
        } else {
          this.reqObj.params.firstName = searchText;
        }
        break;
      }
      case 'casinoCardData' : {
        this.searchText = '';
        if (this.isValidCardId(searchText)) {
          this.isInvalidCardId = false;
          this.isInvalidPlayerId = false;
          this.reqObj.params.casinoCardData = searchText;
        } else {
          this.isInvalidCardId = true;
          this.isInvalidPlayerId = false;
        }
        break;
      }
    }
    if (this.selectedOption === 'firstName' || this.selectedOption === 'lastName') {
      if (searchText.trim().length < 2) {
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
      } else {
        this.getRequestedPlayers();
      }
    }
  }

  getActivePlayers() {
    this.reqObj.params['gamingDay'] = this.gamingDay;
    this.activePlayerSub = this.casinoManagerService.getActivePlayer(this.reqObj).subscribe(res => {
      const result = res as any;
      if (result.length < 1) {
        this.snackBar.open(this.translate.instant('application.app.common.labels.PLAYERNOTFOUND'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
      }
      this.searchObj.emit(res);
    }, err => {

    });
  }

  getRequestedPlayers() {
    this.activePlayerSub_1 = this.casinoManagerService.getActivePlayer(this.reqObj).subscribe((res) => {
      this.isCMSUp = ( res['successObj'] && res['successObj'].isCMSUp);
      if (res && res['errors'] && res['errors'].length > 0 && res['errors'][0].code === 40501) {
        const errorsBody = res['errors'];
        if (errorsBody && errorsBody[0].message) {
          const errMsg = this.translate.instant('PLAYER_SEARCH_MSG.' + errorsBody[0].message.replace(/ /g, '_').toUpperCase());
          if (errMsg !== '' && errMsg !== undefined && errMsg !== null) {
            this.snackBar.open(errMsg, '', {
              duration: 3000,
              horizontalPosition: 'right',
              panelClass: 'snack__warn'
            });
          }
          return;
        }
      } else if ((this.selectedOption === 'casinoPlayerId' || this.selectedOption === 'casinoCardData') && res['successObj'].players.banned) {
        this.selectedOption = 'casinoPlayerId';
        const bannedMsg = this.translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.BANNEDPLAYER');
        this.snackBar.open(bannedMsg, '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        return false;
      } else if (this.selectedOption === 'casinoCardData' && res['successObj'].players.length > 0
        && res['successObj'].players[0].playerId === null) {
        res['successObj'].players[0].playerId = this.getLastSixDigits(res['successObj'].players[0].cardId);
        res['successObj'].players[0].cardId = res['successObj'].players[0].cardId;
        this.selectedOption = 'casinoPlayerId';
      } else if (this.selectedOption === 'firstName' || this.selectedOption === 'lastName') {
        if (!this.isCMSUp) {
          this.snackBar.open(this.translate.instant('application.app.common.labels.SEARCH_PLAYER_BY_ID_CARD'), '', {
            duration: 4000,
            horizontalPosition: 'right',
            panelClass: 'snack__info'
          });
          return;
        }
      } else if (res['successObj'].players.length < 1) {
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
    if (this.prevKeyCode > 57 && this.isInputFromSwipeCard) {
      this.selectedOption = 'casinoCardData';
      if (this.searchText) {
        this.searchPlayer(this.searchText);
      }
    } else {
      this.searchPlayer(this.searchText)
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
    } else {
      const strLen = cardValue.length;
      if (cardValue[0] === ';' && cardValue[strLen - 1] === '?') {
        let cardVal = cardValue.replace(';', '').replace('?', '');
        cardVal = cardVal.replace(/[&\/\\#,+()$~%.'":*?<>{}=]/g, '');
        if (!isNaN(cardVal)) {
          isValidCard = true;
        } else {
          isValidCard = false;
        }
      } else {
        isValidCard = false;
      }
    }
    return isValidCard;
  }

  onKeyPressSearchText(event: any) {
    if (event.target.value.length > 8) {
      event.preventDefault();
    }
  };

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.activePlayerSub) {
      this.activePlayerSub.unsubscribe();
    }
    if (this.activePlayerSub_1) {
      this.activePlayerSub_1.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
