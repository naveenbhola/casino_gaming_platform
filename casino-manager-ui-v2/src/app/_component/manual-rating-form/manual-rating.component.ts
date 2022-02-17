import {Component, Inject, OnInit, ViewChild, AfterViewChecked, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppService} from '../../app.service';
import {OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import {TranslateService} from '@ngx-translate/core';
import {CasinomanagerService} from '../../services/casinomanager.service';
import {WDTSUtility} from '../../utils/wdts-utils';
import {ConfigurationService, TopologyService} from 'common-ui';

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  },
  datePickerInput: {year: 'numeric', month: 'short', day: 'numeric', hour12: false},
  timePickerInput: {hour: 'numeric', minute: 'numeric', hour12: false},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

@Component({
  selector: 'app-manual-rating',
  templateUrl: './manual-rating.component.html',
  styleUrls: ['./manual-rating.component.scss'],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}
  ]
})
export class ManualRatingComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('domStartTime') domStartTime;
  @ViewChild('domStopTime') domStopTime;
  selected = 'option2';
  manualObj: any;
  isCmsUp;
  ppId;
  gamingDay;
  loggedInUser;
  playerName;
  tableName;
  createdBy;
  ratingId;
  seatNo = '1';
  startTime;
  stopTime;
  totalTime;
  irc;
  cashBuyIn;
  avgBet;
  casinoWL;
  playerId;
  selectedPlayer;
  playerNameDisplay;
  isManualRatingApprovedOrReject = false;
  // seatNoArry = ['1', '2', '3', '5', '6', '7', '8'];
  editedUser;
  sessionCreate = false;
  sessionRejectAprove = false;
  playerCreate = false;
  playerExisting = false;
  playerImage = '/assets/images/player.png';
  currentTimeStamp = new Date();
  playerSearchArray = [];
  zoomPlayer = false;
  buttonDisableOnClick = false;
  public isFilterOpen = false;
  public iconToShow = 'arrow_right';
  imageType;
  seatNoArry;
  tableId;
  readonly = true;
  promotionPlaceholder;
  activePromotions = [];
  playerPositions;
  isL6Enabled;
  isL6OnB4;
  filterConfigOption = {
    title: 'application.app.CONFIGURATION_LABELS.TABTEXT.PROMOTIONS',
    column: 'promotion',
    options: [],
    selectedOptions: [],
    searchOption: true,
    isPromotionPit: true
  };
  configSub;
  getPlayersSub;
  playerByIdSub;
  updateManRate;
  createManRatSub;
  createManRatSub_1;
  updateManRateSub_1;
  updateManRateSub;
  playersSub;
  languageChanged;
  constructor (@Inject(MAT_DIALOG_DATA) public data,
               private popUp: MatDialogRef<ManualRatingComponent>,
               public appService: AppService,
               private snackBar: MatSnackBar,
               public translate: TranslateService,
               public casinoManagerService: CasinomanagerService,
               private configService: ConfigurationService,
               private topologyService: TopologyService
  ) {
    this.tableId = data.rowDetails.obj.tableId;
    this.setTableProperties();

    this.loggedInUser = JSON.parse(localStorage.getItem('clonedSupervisorObj'));
    this.tableName = data.tableName;
    this.gamingDay = data.gamingDay;
    switch (data.callFrom) {
      case ('session_create'): {
        this.createdBy = this.loggedInUser.user.lastName + ',' + this.loggedInUser.user.firstName
          + '(' + this.loggedInUser.user.employeeNumber + ')';
        this.sessionCreate = true;
        this.seatNo = data.rowDetails.obj['seatIdx'].toString();
        break;
      }
      case ('session_reject_approve'): {
        this.manualObj = data.rowDetails.obj;
        this.playerId = ( data.rowDetails.obj['casinoPlayerId'] || data.rowDetails.obj.player['casinoPlayer']['casinoPlayerId'] );
        this.isManualRatingApprovedOrReject = data.rowDetails.obj.manuallRatingStatus === 'CLOSED' || data.rowDetails.obj.manuallRatingStatus === 'CANCELED';
        this.initValues();
        this.sessionRejectAprove = true;
        this.seatNo = data.rowDetails.obj['seatIdx'].toString();
        break;
      }
      case ('player_create'): {
        this.createdBy = this.loggedInUser.user.lastName + ',' + this.loggedInUser.user.firstName
          + '(' + this.loggedInUser.user.employeeNumber + ')';
        this.playerCreate = true;
        this.seatNo = data.rowDetails.obj['seatIdx'].toString();
        break;
      }
      case ('player_existing'): {
        if (data.rowDetails) {
          this.manualObj = data.rowDetails;
          this.playerId = data.rowDetails.player.playerId;
          this.ppId = this.playerId;
          this.initValuesMREdit(data.rowDetails.player);
          this.playerExisting = true;
        }
        this.seatNo = data.rowDetails.obj['seatIdx'].toString();
        break;
      }
    }
  }
  setTableProperties() {
    this.configSub = this.configService.getConfigurations(this.tableId).subscribe(msg => {
      for (const obj in msg) {
        if (msg[obj].hasOwnProperty('name') && msg[obj].name === 'DEFAULT_BACCARAT_TEMPLATE'
          && msg[obj].hasOwnProperty('propertyValues')) {
          msg[obj].propertyValues.filter(o => {
            if (o.propertyCode === 'com.wdts.table.num.player.positions' && o.propertyValue) {
              this.playerPositions = Number(o.propertyValue);
            }
            if (o.propertyCode === 'com.wdts.table.lucky6.enabled' && o.propertyValue) {
              o.propertyValue.toLowerCase() === 'true' ? this.isL6Enabled = true : this.isL6Enabled = false;
            }
            if (o.propertyCode === 'com.wdts.table.lucky6.antenna' && o.propertyValue) {
              o.propertyValue.toLowerCase() === 'banker' ? this.isL6OnB4 = true : this.isL6OnB4 = false;
            }
          });
        }
        this.seatNoArry = this.playerPositions === 7 ? (this.isL6Enabled && this.isL6OnB4) ? ['1', '2', '3', '6', '7', '8'] : ['1', '2', '3', '5', '6', '7', '8'] : (this.isL6Enabled && this.isL6OnB4) ? ['1', '2', '5', '6'] : ['1', '2', '3', '5', '6'];
      }
    });
  }

  initValuesMREdit(playerObj) {
    if (playerObj.player.casinoPlayer.lastName && playerObj.player.casinoPlayer.firstName) {
      this.playerName = playerObj.player.casinoPlayer.lastName + ',' + playerObj.player.casinoPlayer.firstName;
    } else if (playerObj.player.casinoPlayer.lastName) {
      this.playerName = playerObj.player.casinoPlayer.lastName;
    } else if (playerObj.player.casinoPlayer.firstName) {
      this.playerName = playerObj.player.casinoPlayer.firstName;
    } else {
      this.playerName = '';
    }
    this.casinoWL = this.manualObj.casinoWin;
    this.avgBet = this.manualObj.avgBet;
    this.cashBuyIn = this.manualObj.cashBuyIn;
    this.irc = this.manualObj.ircNumber;
    this.totalTime = 0.00;
    this.stopTime = this.manualObj.endDtm ? new Date(this.manualObj.endDtm) : '';
    this.startTime = this.manualObj.startDtm ? new Date(this.manualObj.startDtm) : '';
    this.seatNo = this.manualObj.seatIdx;
    this.createdBy = this.manualObj.createdUser.lastName + ',' + this.manualObj.createdUser.firstName
      + '(' + this.manualObj.createdUser.employeeNumber + ')';
    this.tableName = this.manualObj.tableName;
    this.editedUser = this.loggedInUser.user.userId;
    this.calculateTime();
    this.playerSearchArray = [];
    this.selectPlayerMREdit(playerObj);
  }

  updateCurrentTimeStamp() {
    this.currentTimeStamp = new Date();
  }

  initValues() {
    if (this.manualObj.player['casinoPlayer']['image']) {
      this.playerImage = this.manualObj.player['casinoPlayer']['image'];
      this.imageType = this.manualObj.player['casinoPlayer']['imageType'];
    }
    if (this.manualObj.player.casinoPlayer.lastName && this.manualObj.player.casinoPlayer.firstName) {
      this.playerName = this.manualObj.player.casinoPlayer.lastName + ',' + this.manualObj.player.casinoPlayer.firstName;
    } else if (this.manualObj.player.casinoPlayer.lastName) {
      this.playerName = this.manualObj.player.casinoPlayer.lastName;
    } else if (this.manualObj.player.casinoPlayer.firstName) {
      this.playerName = this.manualObj.player.casinoPlayer.firstName;
    } else {
      this.playerName = '';
    }
    this.casinoWL = this.manualObj.casinoWin;
    this.avgBet = this.manualObj.avgBet;
    this.cashBuyIn = this.manualObj.cashBuyIn;
    this.irc = this.manualObj.ircNumber;
    this.totalTime = 0.00;
    this.stopTime = this.manualObj.endDtm ? new Date(this.manualObj.endDtm) : '';
    this.startTime = this.manualObj.startDtm ? new Date(this.manualObj.startDtm) : '';
    this.seatNo = this.manualObj.seatIdx;
    this.createdBy = this.manualObj.createdBy;
    this.tableName = this.manualObj.tableName;
    this.activePromotions = this.manualObj.activePromotions;
    this.filterConfigOption.selectedOptions = this.getFormattedPromotionList(this.manualObj.activePromotions);
    this.filterConfigOption.options = this.filterConfigOption.selectedOptions;
    this.promotionPlaceholder = this.translate.instant('application.app.CONFIGURATION_LABELS.TABTEXT.PROMOTIONS');
    this.calculateTime();
  }

  getFormattedPromotionList(arr) {
    let prmArrList = [];
    if (arr && arr.length > 0) {
      prmArrList = arr.map(i => {
        i = i.promotionName + '(' + i.promotionId + ')';
        return i;
      });
    }
    return prmArrList;
  }

  calculateTime() {
    this.totalTime = this.diff_minutes(this.stopTime, this.startTime);
    this.updateCurrentTimeStamp();
  }

  clearTime() {
    this.stopTime = '';
    this.totalTime = '00:00';
  }

  diff_minutes(dt2, dt1) {
    let finalTime = '00:00';
    if (dt2 && dt1) {
      const tempdt2 = dt2;
      const tempdt1 = dt1;
      tempdt1.setSeconds(0);
      tempdt2.setSeconds(0);
      let diff = ( tempdt2.getTime() - tempdt1.getTime()) / 1000;
      diff /= 60;
      const totalMins = Math.round(Math.abs(diff));
      const hours = Math.abs(Math.floor(totalMins / 60));
      const min = totalMins % 60;
      if (hours < 10) {
        finalTime = '0' + hours;
      } else {
        finalTime = hours.toString();
      }
      if (min < 10) {
        finalTime = finalTime + ':0' + min;
      } else {
        finalTime = finalTime + ':' + min;
      }
    }
    return finalTime;
  }

  dataFromPlayer(evt) {
    this.playerSearchArray = evt.successObj.players;
    this.isCmsUp = evt.successObj.isCMSUp;
    for (const playerRef of this.playerSearchArray) {
      playerRef.selected = false;
    }
  }

  selectPlayer(obj) {
    if (obj.banned) {
      this.playerNameDisplay = '';
      this.snackBar.open(this.translate.instant('application.app.CAM_CASHIER_LABELS.COMMON_LOGGERMESSAGES.BANNEDPLAYER'), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__warn'
      });
    } else {
      // this.playerNameDisplay = this.appService.createNameFormatForPlayerSearch(obj);
      this.playerNameDisplay = '';
      const temp = this.playerSearchArray.find(x => x.selected === true);
      if (temp) {
        temp.selected = false;
      }
      this.playerSearchArray.find(x => x.playerId === obj.playerId).selected = true;
      if (obj.ppId) {
        this.selectedPlayer = obj;
        this.playerImage = this.selectedPlayer.imageUrl;
        this.playerId = this.selectedPlayer.playerId;
        this.ppId = this.selectedPlayer.ppId;
      } else {
        const reqObj: any = {};
        reqObj.params = {};
        reqObj.params.fetch = false;
        reqObj.params.casinoPlayerId = obj.playerId;
        this.getPlayersSub = this.casinoManagerService.getPlayers(reqObj).subscribe((res) => {
          obj.ppId = res['successObj'].players[0].ppId;
          this.selectedPlayer = obj;
          this.playerImage = this.selectedPlayer.imageUrl;
          this.playerId = this.selectedPlayer.playerId;
          this.ppId = this.selectedPlayer.ppId;
        }, (err) => {
          console.log(err);
        });
      }
    }
  }

  selectPlayerMREdit(obj: any) {
    obj['casinoPlayer'].playerId = obj['casinoPlayer'].casinoPlayerId;
    this.playerSearchArray.push(obj['casinoPlayer']);
    this.selectedPlayer = obj['casinoPlayer'];
    // this.playerNameDisplay = this.appService.createNameFormatForPlayerSearch(
    //   {firstName: this.selectedPlayer.firstName,
    //   lastName: this.selectedPlayer.lastName, playerId: this.selectedPlayer.casinoPlayerId});
    this.playerImage = obj.imageUrl;
    this.playerId = this.selectedPlayer.casinoPlayerId;
    this.ppId = obj['playerId'];
    this.isCmsUp = this.selectedPlayer.isCmsUp;
  }

  // preventInput(event) {
  //   const value = this.seatNo;
  //   if (value >= 8) {
  //     event.preventDefault();
  //     const temp = parseInt(value.toString().substring(0, 1), 10)
  //     this.seatNo = temp > 8 ? '' : temp ;
  //   }
  // }
  showFilters(): void {
    this.isFilterOpen = !this.isFilterOpen;

    if (this.isFilterOpen) {
      this.iconToShow = 'arrow_drop_down';
    } else {
      this.iconToShow = 'arrow_right';
    }
  }

  getPlayerInfo() {
    this.playerByIdSub = this.casinoManagerService.getPlayerById(this.playerId, {params: {fetch: true}}).subscribe((res) => {
    }, (err) => {
      console.log(err);
    });
  }

  approveManualRating() {
    //  https://wdts-gateway-dev8.wdtablesystems.com/api/casinomanager/v1/manualRatings/2858
    // // https://wdts-gateway-dev8.wdtablesystems.com/api/casinomanager/v1/manualRatings/2858
    const request = {
      'ratingId': this.manualObj.ratingId,
      'manuallRatingStatus': 'CLOSED',
      'player': {
        'playerId': this.manualObj.playerId ? this.manualObj.playerId : this.manualObj.player.playerId
      },
      'seatIdx': this.seatNo,
      'startDtm': this.startTime,
      'endDtm': this.stopTime,
      'gamingDay': this.gamingDay,
      'cashBuyIn': this.cashBuyIn,
      'avgBet': this.avgBet,
      'casinoWin': this.casinoWL,
      'ircNumber': this.irc,
      'approvedUser': {
        'userId': this.appService && this.appService.globalLoggedInUserInfo && this.appService.globalLoggedInUserInfo.userId ?
          this.appService.globalLoggedInUserInfo.userId : this.data.userID
        // from localstore
      },
      'approvedDtm': new Date().toISOString(),
      'activePromotions': this.activePromotions
    };
    this.updateManualRating(request);
  }

  cancelManalRating() {
    const request = {
      'ratingId': this.manualObj.ratingId,
      'manuallRatingStatus': 'CANCELED',
      'player': {
        'playerId': this.manualObj.playerId ? this.manualObj.playerId : this.manualObj.player.playerId
      },
      'seatIdx': this.seatNo,
      'startDtm': this.startTime,
      'endDtm': this.stopTime,
      'gamingDay': this.gamingDay,
      'cashBuyIn': this.cashBuyIn,
      'avgBet': this.avgBet,
      'casinoWin': this.casinoWL,
      'ircNumber': this.irc,
      'canceledUser': {
        'userId': this.appService && this.appService.globalLoggedInUserInfo && this.appService.globalLoggedInUserInfo.userId ?
          this.appService.globalLoggedInUserInfo.userId : this.data.userID
      },
      'canceledDtm': new Date().toISOString(),
      'activePromotions': this.activePromotions
    };
    this.updateManualRating(request);
  }

  createManalRating(param) {
    const request = {
      'manuallRatingStatus': 'OPEN',
      'provisionalStatus': this.isCmsUp ? 'SUCCESS' : 'PROVISIONAL_PENDING',
      'player': {
        'playerId': this.ppId
      },
      'seatIdx': this.seatNo,
      'startDtm': this.startTime,
      'endDtm': this.stopTime,
      'gamingDay': this.gamingDay,
      'cashBuyIn': this.cashBuyIn,
      'avgBet': this.avgBet,
      'casinoWin': this.casinoWL,
      'ircNumber': this.irc,
      'createDtm': new Date().toISOString(),
      'seatLabel': this.data.seatLabel,
      'createdUser': {
        'userId': this.loggedInUser.user.userId
      }
    };

    if (param === 'submit') {
      if (this.playerExisting) {
        request['editedUser'] = {
          'userId': this.loggedInUser.user.userId
        }
        request['manuallRatingStatus'] = 'PENDING';
        this.updateManualRating(request);
      } else {
        this.onSubmit(request);
      }
    } else {
      if (this.playerExisting) {
        request['editedUser'] = {
          'userId': this.loggedInUser.user.userId
        }
        this.updateManualRating(request);
      } else {
        this.onSave(request);
      }
    }

  }

  updateManualRating(request) {
    this.buttonDisableOnClick = true;
    this.updateManRate = this.casinoManagerService.updateManualRating(request.ratingId, request).subscribe((res) => {
      this.buttonDisableOnClick = false;
      //  this.casinoManagerService.manualRatingUpdate.next(res);
      this.popUp.close();
      //  this.casinoManagerService.closeDialog.emit('close');
    }, (err) => {
      this.buttonDisableOnClick = false;
      console.log(err);
    });
  }

  onClose() {
    this.popUp.close();
  }

  onSave(request) {
    this.buttonDisableOnClick = true;
    this.createManRatSub = this.casinoManagerService.createManualRating(request).subscribe((res: any) => {
      this.ratingId = res.successObj.ratingId;
      this.popUp.close();
      this.snackBar.open(this.translate.instant('MANUAL_RATING_SAVED'), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__success'
      });
      this.buttonDisableOnClick = false;
    }, (err) => {
      this.buttonDisableOnClick = false;
      console.log(err);
    });
  }

  onSubmit(request) {
    this.buttonDisableOnClick = true;
    this.createManRatSub_1 = this.casinoManagerService.createManualRating(request).subscribe((res: any) => {
      const ratingId = res.successObj.ratingId;
      const requestSubmit = {
        'ratingId': ratingId,
        'manuallRatingStatus': 'PENDING',
        'player': {
          'playerId': this.ppId
        },
        'seatIdx': this.seatNo,
        'startDtm': this.startTime,
        'endDtm': this.stopTime,
        'gamingDay': this.gamingDay,
        'cashBuyIn': this.cashBuyIn,
        'avgBet': this.avgBet,
        'casinoWin': this.casinoWL,
        'ircNumber': this.irc,
        'createDtm': new Date().toISOString(),
        'submittedDtm': new Date().toISOString(),
        'createdUser': {
          'userId': this.loggedInUser.user.userId
        },
        'submittedUser': {
          'userId': this.loggedInUser.user.userId
        }
      };
      this.updateManRateSub_1 =  this.casinoManagerService.updateManualRating(requestSubmit, ratingId).subscribe((res1) => {
        this.buttonDisableOnClick = false;
        this.snackBar.open(this.translate.instant('MANUAL_RATING_SUBMITTED.Alert_Type_Title'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__success'
        });
      }, (err1) => {
        this.buttonDisableOnClick = false;
        this.snackBar.open('err1', '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        console.log(err1);
      });
      this.popUp.close();
    }, (err) => {
      this.buttonDisableOnClick = false;
      console.log(err);
    });
  }

  ngOnInit() {
    if (this.appService.hasPermissionOf('CASINO_MGR', 'APPROVE_MANUAL_RATING_CMR') && this.manualObj.manuallRatingStatus !== 'CLOSED' && this.manualObj.manuallRatingStatus !== 'OPEN' && !this.isManualRatingApprovedOrReject && this.sessionRejectAprove) {
      this.readonly = false;
    }
  }

  validateMIDField(event) {
    return WDTSUtility.validateNumberField(event, 13, this.irc);
  }

  onChangeValue(evt, maxlen) {
    return WDTSUtility.isNonZeroRegex(evt, maxlen);
  }

  validateInputs() {
    this.domStartTime.nativeElement.value = this.domStartTime.nativeElement.value.replace('24:', '00:');
    this.domStopTime.nativeElement.value = this.domStopTime.nativeElement.value.replace('24:', '00:');
  }


  ngAfterViewChecked() {
    if (this.domStartTime && this.domStartTime.nativeElement.value) {
      this.domStartTime.nativeElement.value = this.domStartTime.nativeElement.value.replace('24:', '00:');
    }
    if (this.domStopTime && this.domStopTime.nativeElement.value) {
      this.domStopTime.nativeElement.value = this.domStopTime.nativeElement.value.replace('24:', '00:');
    }
  }

  loadDefaultImage(event) {
    event.target.src = '/assets/images/player.png';
  }

  ngOnDestroy() {
    if (this.createManRatSub) {
      this.createManRatSub.unsubscribe();
    }
    if (this.createManRatSub_1) {
      this.createManRatSub_1.unsubscribe();
    }
    if (this.updateManRateSub) {
      this.updateManRateSub.unsubscribe();
    }
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
    }
    if (this.updateManRateSub_1) {
      this.updateManRateSub_1.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
    if (this.playersSub) {
      this.playersSub.unsubscribe();
    }
    if (this.playerByIdSub) {
      this.playerByIdSub.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
