import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, OnDestroy} from '@angular/core';
import {CasinomanagerService} from '../../../../common-ui-lib';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from "rxjs/Rx";

export interface UserParam {
  params: any;
}

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit, OnChanges, OnDestroy {

  searchOption = [
    {value: 'employeeId', viewValue: 'application.app.common.labels.TOPSUBNAV.EMPLOYEE_ID'},
    {value: 'firstName', viewValue: 'application.app.common.labels.FIRST_NAME'},
    {value: 'lastName', viewValue: 'application.app.common.labels.LAST_NAME'},
    {value: 'userName', viewValue: 'application.app.common.labels.TOPSUBNAV.USERNAME'}
  ];
  prevKeyCode;
  reqObj: UserParam = {params: {}};
  selectedOption = 'employeeId';
  searchText;
  userType = 'SUPERVISOR';
  @Output() searchObj = new EventEmitter<any>();
  @Input() updateNameAfterSearch;
  @Input() isDisabled = false;
  isInvalidPlayerId = false;
  isInvalidCardId = false;
  isCMSUp = true;
  isInputFromSwipeCard: boolean;
  currentKeyPressTime: number;
  currentKeyPressTimeE;
  currentKeyPressTimeN;
  // Subscribers
  activePlayerSub: Subscription;
  userSeachSub: Subscription;

  constructor(private casinoManagerService: CasinomanagerService,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private dialogRef: MatDialogRef<UserSearchComponent>) {
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
  }

  ngOnChanges() {
    this.searchText = this.updateNameAfterSearch;
  }

  searchUser(searchText) {
    this.reqObj.params = {};
    switch (this.selectedOption) {
      case 'employeeId': {
        if (this.isValidPlayerId(searchText)) {
          this.isInvalidPlayerId = false;
          this.isInvalidCardId = false;
          this.reqObj.params.employeeId = searchText;
        } else {
          this.isInvalidPlayerId = true;
          this.isInvalidCardId = false;
          const invalidMsg = this.translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.INVALID_USER_ID');
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
        this.reqObj.params.lastName = searchText;
        break;
      }
      case 'firstName' : {
        this.isInvalidCardId = false;
        this.isInvalidPlayerId = false;
        this.reqObj.params.firstName = searchText;
        break;
      }
      case 'userName' : {
        this.isInvalidCardId = false;
        this.isInvalidPlayerId = false;
        this.reqObj.params.userName = searchText;
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
    this.reqObj.params.userType = this.userType;
    this.reqObj.params.type = 'LOGIN';
    if (this.userType === 'SUPERVISOR') {
      this.reqObj.params.application = 'TABLE_DASH';
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
    // this.reqObj.params.fetch = false;
    if (!this.isInvalidPlayerId && !this.isInvalidCardId) {
      this.getRequestedPlayers();
    } else {
      this.searchObj.emit();
    }
  }

  getActivePlayers() {
    this.activePlayerSub = this.casinoManagerService.getActivePlayer(this.reqObj).subscribe(res => {
      this.searchObj.emit(res);
    }, err => {
      console.log(err);
    });
  }

  getRequestedPlayers() {
    this.userSeachSub = this.casinoManagerService.getUserSearch(this.reqObj).subscribe((res) => {
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
      if (res && res['successObj']) {
        this.isCMSUp = res['successObj'].isCMSUp;
      }
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
      if (!res || (res && res['successObj'] && res['successObj'].players.length < 1)) {
        this.searchObj.emit();
        this.snackBar.open(this.translate.instant('application.app.common.labels.USER_NOT_FOUND'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        return;
      } else {
        this.searchObj.emit(res);
      }
      // let tempRes;
      // tempRes = res;
      //
      // if (tempRes.length > 1){
      //   let tempResItem;
      //   tempResItem = tempRes[tempRes.length-1];
      //   tempRes = [];
      //   tempRes.push(tempResItem);
      //   res = tempRes;
      // }
      this.searchObj.emit(res);
    }, (err) => {
      this.searchObj.emit('');
      this.snackBar.open(this.translate.instant('application.app.common.labels.USER_NOT_FOUND'), '', {
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
        this.searchUser(this.searchText);
      }
    } else {
      this.searchUser(this.searchText);
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

  /**
   * user search selection change event.
   * //Defect is when we type & and select other options it does not replace & to ''
   * fixed with this story GR-3092
   * @param evt
   *
   */
  selectionChangeHandler(evt) {
    const regEx = new RegExp('[^A-Za-z0-9-_. ]', 'gi');
    this.searchText = this.searchText.replace(regEx, '');
  }

  ngOnDestroy() {
    if (this.activePlayerSub) {
      this.activePlayerSub.unsubscribe();
    }
    if (this.userSeachSub) {
      this.userSeachSub.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
