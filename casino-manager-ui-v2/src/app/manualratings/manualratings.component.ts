import {Component, OnInit, QueryList, ViewChildren, OnDestroy} from '@angular/core';
import {AppTablesService, CommonTranslationService, dialogSize, FilterComponent, DecodedTokenService} from 'common-ui';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
import {CasinomanagerService} from '../services/casinomanager.service';
import {NotesComponent} from '../_component/notes/notes.component';
import {MatDialog} from '@angular/material/dialog';
import {ManualRatingComponent} from '../_component/manual-rating-form/manual-rating.component';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-manualratings-tab',
  templateUrl: './manualratings.component.html',
  styleUrls: ['./manualratings.component.scss']
})
export class ManualratingsComponent implements OnInit, OnDestroy {
  @ViewChildren(FilterComponent) filterComponents: QueryList<FilterComponent>;
  perPageOption: Array<number> = [10, 20, 30, 50, 100];
  totalRecord: number;
  manualRatingList = [];
  defaultStart = 1;
  defaultLimit = 10;
  start = this.defaultStart;
  limit = this.defaultLimit;
  tableHeaders = [];
  filterConfigOption = [];
  sortField = '';
  sortOrder = '';
  sortObj: any;
  selectedFilter: any = {};
  isFilterOpen: boolean;
  languageChanged;
  requestObj = {};
  filterUpdatedObject: any = {};
  tableIds = [];
  topolodyId;
  renderFlag = false;
  ratingStart;
  ratingLimit;
  ratingCurrentPage;
  // Subscribers
  globalObjSub: Subscription;
  paginatedSMRForCMRSub: Subscription;
  dialogRefSub: Subscription;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private translate: TranslateService,
              private appFilterTableService: AppTablesService,
              private commonTranslation: CommonTranslationService,
              private appService: AppService,
              public decodedTokenService: DecodedTokenService,
              private casinoManager: CasinomanagerService,
              private dialog: MatDialog) {
    this.isFilterOpen = false;
  }

  ngOnInit() {
    this.globalObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      if (this.appService.currentTab === 'mratings') {
        if (this.renderFlag) {
          return;
        }
        this.setUpTableHeader();
        this.resetfilter();
        this.getDataForSessions();
      }
    });
  }

  setUpTableHeader() {
    this.renderFlag = true;
    this.tableHeaders = [
      {
        title: 'application.app.common.labels.STATUS',
        type: 'manualRatingStatus',
        row: 'manuallRatingStatus',
        sortable: true
      },
      {
        title: 'application.app.common.labels.TABLE',
        type: 'text_no_translation',
        row: 'tableName',
        sortable: true
      },
      {
        title: 'application.app.common.labels.PLAYER',
        type: 'text_no_translation',
        row: 'playerFullName',
        sortable: true
      },
      {title: 'application.app.PLAYER_DASH_LABELS.START_TIME', type: 'time', row: 'startDtm', sortable: true},
      {title: 'application.app.PLAYER_DASH_LABELS.END_TIME', type: 'time', row: 'endDtm', sortable: true},
      {title: 'application.app.PLAYER_DASH_LABELS.TOTAL_TIME', type: 'text', row: 'totalTime', sortable: false},
      {
        title: 'application.app.CASINO_MGR_LABELS.SEAT_NUMBER',
        type: 'text_no_translation',
        row: 'seatIdx',
        sortable: true
      },
      {
        title: 'application.app.TREASURY_LABELS.TRANSACTION_TYPES.BUY_IN',
        type: 'casinoWL',
        row: 'cashBuyIn',
        sortable: true
      },
      {title: 'application.app.PLAYER_DASH_LABELS.AVERAGE_BET', type: 'casinoWL', row: 'avgBet', sortable: true},
      {title: 'application.app.PLAYER_DASH_LABELS.CASINO_WL', type: 'casinoWL', row: 'casinoWin', sortable: true},
      {
        title: 'application.app.TABLE_DASH_LABELS.SESSIONS.COLHEADERS.IRC', type: 'text_no_translation',
        row: 'ircNumber', sortable: false
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.COLHEADERS.CREATED_BY',
        type: 'text',
        row: 'createdBy',
        sortable: true
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.COLHEADERS.APPROVED_BY',
        type: 'text',
        row: 'approvedBy',
        sortable: true
      },
      {
        title: 'application.app.PLAYER_DASH_LABELS.RATING_ID',
        type: 'text',
        row: 'casinoRatingId',
        sortable: false
      },
      {
        title: 'application.app.PLAYER_DASH_LABELS.RATING_STATUS',
        type: 'text',
        row: 'provisionalStatus',
        sortable: false
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.SESSIONS.COLHEADERS.NOTES',
        type: 'note',
        row: 'noteObj',
        sortable: false
      }
    ];
  }

  resetfilter() {
    this.filterConfigOption = [
      {
        title: 'application.app.CONFIGURATION_LABELS.PROMOTION.PLAYER',
        column: 'playerId',
        options: [],
        selectedOptions: [],
        searchOption: true,
        translatePath: ''
      },
      {
        title: 'Status',
        column: 'fStatus',
        options: [],
        selectedOptions: [],
        searchOption: true,
        translatePath: ''
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.SEAT_NUMBER',
        column: 'seatNo',
        options: [],
        selectedOptions: [],
        searchOption: true,
        translatePath: ''
      },
      {
        title: 'application.app.CONFIGURATION_LABELS.PROMOTION.CREATED_BY',
        column: 'createdByUser',
        options: [],
        selectedOptions: [],
        searchOption: true,
        translatePath: ''
      },
      {
        title: 'application.app.PLAYER_DASH_LABELS.APPROVED_BY',
        column: 'approvedByUser',
        options: [],
        selectedOptions: [],
        searchOption: true,
        translatePath: ''
      }
    ];
    this.appFilterTableService.filterConfigOptions = this.filterConfigOption;
  }

  sortData(evntObj) {
    switch (evntObj.sortField) {
      case 'application.app.common.labels.TABLE' : {
        this.sortField = 'TABLE_NAME';
        break;
      }
      case 'application.app.common.labels.PLAYER' : {
        this.sortField = 'PLAYER_NAME';
        break;
      }
      case 'application.app.PLAYER_DASH_LABELS.START_TIME' : {
        this.sortField = 'SESSION_START_DTM';
        break;
      }
      case 'application.app.PLAYER_DASH_LABELS.END_TIME' : {
        this.sortField = 'SESSION_END_DTM';
        break;
      }
      case 'application.app.CASINO_MGR_LABELS.SEAT_NUMBER' :
      case 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.COLHEADERS.SEAT' : {
        this.sortField = 'POSITION_LABEL';
        break;
      }
      case 'application.app.TREASURY_LABELS.TRANSACTION_TYPES.BUY_IN' : {
        this.sortField = 'BUYIN';
        break;
      }
      case 'application.app.PLAYER_DASH_LABELS.AVERAGE_BET' : {
        this.sortField = 'AVG_BET';
        break;
      }
      case 'application.app.PLAYER_DASH_LABELS.CASINO_WL' : {
        this.sortField = 'PLAYER_WIN';
        break;
      }
      case 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.COLHEADERS.CREATED_BY' : {
        this.sortField = 'CREATED_USER_NAME';
        break;
      }
      case 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.COLHEADERS.APPROVED_BY' : {
        this.sortField = 'APPROVED_USER_USERNAME';
        break;
      }
      case 'application.app.common.labels.STATUS' : {
        this.sortField = 'RATING_STATUS';
        break;
      }
    }
    this.sortOrder = evntObj.sortOrder;
    this.getDataForSessions();
  }

  msToTime(s) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = ((s - mins) / 60) < 10 ? ('0' + ((s - mins) / 60)) : ((s - mins) / 60);
    const minsString = mins < 10 ? ('0' + mins) : mins;
    return hrs + ':' + minsString;
  }

  getDataForSessions() {
    this.topolodyId = this.appService.appGlobalObj.currentPitId || this.appService.appGlobalObj.currentOAId ||
      this.appService.appGlobalObj.currentGAId || this.appService.appGlobalObj.currentSiteId;

    this.tableIds = this.appService.getTableIds(this.topolodyId);
    this.requestObj = {
      gamingDay: this.appService.appGlobalObj.gamingDay,
      start: this.start,
      limit: this.limit
    };

    if (this.tableIds.length > 0) {
      this.requestObj['tableIds'] = this.tableIds.toString();
    } else {
      this.requestObj['tableIds'] = this.appService.appGlobalObj.currentPitId;
    }

    if (this.sortField) {
      this.requestObj['sortField'] = this.sortField;
    }
    if (this.sortOrder) {
      this.requestObj['sortOrder'] = this.sortOrder;
    }
    this.paginatedSMRForCMRSub = this.casinoManager.getPaginatedSearchManualRatingsForCasinoManager(this.requestObj, this.selectedFilter).subscribe((res: any) => {
      this.totalRecord = parseInt(res.headers.get('TotalRecords'), 10);
      this.manualRatingList = res.body.successObj.manualRatingList;
      this.updateFilterAfterCall(res.body.successObj.Filters);
      this.manualRatingList.forEach((val: any) => {
        if (val.player.casinoPlayer.lastName || val.player.casinoPlayer.firstName) {
          val['playerFullName'] = val.player.casinoPlayer.lastName + ', ' + val.player.casinoPlayer.firstName
            + ' (' + val.player.casinoPlayer.casinoPlayerId + ')';
        } else {
          val['playerFullName'] = '(' + val.player.casinoPlayer.casinoPlayerId + ')';
        }
        if (val.endDtm) {
          val['totalTime'] = this.msToTime(new Date(val.endDtm).getTime() - new Date(val.startDtm).getTime());
        } else {
          val['totalTime'] = '00:00';
        }
        val['createdBy'] = val.createdUser ? val.createdUser.lastName + ', ' + val.createdUser.firstName
          + ' (' + val.createdUser.employeeNumber + ')' : null;
        if (val.manuallRatingStatus === 'CANCELED') {
          val['approvedBy'] = val.canceledUser ? val.canceledUser.lastName + ', ' + val.canceledUser.firstName
            + ' (' + val.canceledUser.employeeNumber + ')' : null;
        } else {
          val['approvedBy'] = val.approvedUser ? val.approvedUser.lastName + ', ' + val.approvedUser.firstName
            + ' (' + val.approvedUser.employeeNumber + ')' : null;
        }
      });
    }, err => {
      this.totalRecord = 0;
    });
  }

  updateFilterAfterCall(filterObject) {
    this.filterUpdatedObject = filterObject;
    let temp = [];
    filterObject.playerId.forEach((val, idx) => {
      if (val.casinoPlayer.lastName !== null && val.casinoPlayer.firstName !== null) {
        temp.push(val.casinoPlayer.lastName + ',' + val.casinoPlayer.firstName + '(' + val.casinoPlayer.casinoPlayerId + ')');
      } else {
        temp.push('(' + val.casinoPlayer.casinoPlayerId + ')');
      }
    });
    this.filterConfigOption[0].options = temp;
    this.filterConfigOption[1].options = filterObject.fStatus;
    this.filterConfigOption[2].options = filterObject.seatNo;
    temp = [];
    filterObject.createdByUser.forEach((val, idx) => {
      if (val !== null) {
        if (val.userId === -17) {
          temp.push(this.translate.instant('(Blanks)'));
        } else {
          temp.push(val.lastName + ',' + val.firstName + ' (' + val.employeeNumber + ')');
        }
      }
    });
    this.filterConfigOption[3].options = temp;
    temp = [];
    filterObject.approvedByUser.forEach((val, idx) => {
      if (val.userId === -17) {
        temp.push(this.translate.instant('(Blanks)'));
      } else {
        temp.push(val.lastName + ',' + val.firstName + ' (' + val.employeeNumber + ')');
      }
    });
    this.filterConfigOption[4].options = temp;
    this.filterConfigOption = JSON.parse(JSON.stringify(this.filterConfigOption));
  }

  openNotes(eventData) {
    const currentLoggedInUserId = this.getRequiredUserId();
    const objToSend = {
      userId: currentLoggedInUserId,
      rowDetails: eventData
    };
    let dialogRef = this.dialog.open(NotesComponent, {
      width: '65vw',
      data: objToSend
    });
    this.dialogRefSub = dialogRef.componentInstance.sessionNoteSaved.subscribe((res) => {
      this.getDataForSessions();
    }, (err) => {
      console.log(err);
    });
    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }

  openManualRating(eventData) {
    const reqUserID = this.getRequiredUserId();
    const objToSend = {
      rowDetails: eventData,
      callFrom: 'session_reject_approve',
      tableName: eventData.tableName,
      gamingDay: this.appService.appGlobalObj.globalCalendarGamingDay,
      userID: reqUserID
    };
    let dialogRef = this.dialog.open(ManualRatingComponent, {
      width: dialogSize.fullscreen,
      panelClass: 'js-man-rating-overlay',
      data: objToSend
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDataForSessions();
      dialogRef = null;
    });
  }

  getRequiredUserId() {
    const userData = this.decodedTokenService.getDecodedJwtToken();
    return userData.userId;
  }

  getUserIdFromString(obj, str) {
    if (str === '(Blanks)') {
      return -17;
    }
    const val = obj.filter((res: any) => {
      if (res.casinoPlayer) {
        return res.casinoPlayer.casinoPlayerId === str.substring(str.indexOf('(') + 1, str.indexOf(')'));
      } else {
        return res.employeeNumber === str.substring(str.indexOf('(') + 1, str.indexOf(')'));
      }
    });
    if (val[0].playerId) {
      return val[0].playerId;
    } else {
      return val[0].userId;
    }
  }

  updatePagination(evt) {
    this.ratingStart = evt.start;
    this.ratingLimit = evt.limit;
    this.ratingCurrentPage = evt.currentPage;
    this.start = evt.start;
    this.limit = evt.limit;
    this.getDataForSessions();
  }

  updateFilter(evt) {
    if (evt.state === 'apply') {
      if (evt.selectedFilter.playerId) {
        const temp = [];
        const tempValArry = [];
        evt.selectedFilter.playerId.forEach((val, id) => {
          temp.push({playerId: this.getUserIdFromString(this.filterUpdatedObject.playerId, val)});
          tempValArry.push(this.filterConfigOption[0].options[this.filterConfigOption[0].options.indexOf(val)]);
        });
        this.selectedFilter.playerId = temp;
        this.filterConfigOption[0].selectedOptions = tempValArry;
      }
      if (evt.selectedFilter.fStatus) {
        this.selectedFilter.fStatus = evt.selectedFilter.fStatus;
        this.filterConfigOption[1].selectedOptions = evt.selectedFilter.fStatus;
      }
      if (evt.selectedFilter.seatNo) {
        this.selectedFilter.seatNo = evt.selectedFilter.seatNo;
        this.filterConfigOption[2].selectedOptions = evt.selectedFilter.seatNo;
      }
      if (evt.selectedFilter.createdByUser) {
        const temp = [];
        const tempValArry = [];
        evt.selectedFilter.createdByUser.forEach((val, id) => {
          temp.push({userId: this.getUserIdFromString(this.filterUpdatedObject.createdByUser, val)});
          tempValArry.push(this.filterConfigOption[3].options[this.filterConfigOption[3].options.indexOf(val)]);
        });
        this.selectedFilter.createdByUser = temp;
        this.filterConfigOption[3].selectedOptions = tempValArry;
      }
      if (evt.selectedFilter.approvedByUser) {
        const temp = [];
        const tempValArry = [];
        evt.selectedFilter.approvedByUser.forEach((val, id) => {
          temp.push({userId: this.getUserIdFromString(this.filterUpdatedObject.approvedByUser, val)});
          tempValArry.push(this.filterConfigOption[4].options[this.filterConfigOption[4].options.indexOf(val)]);
        });
        this.selectedFilter.approvedByUser = temp;
        this.filterConfigOption[4].selectedOptions = tempValArry;
      }
      this.filterConfigOption = JSON.parse(JSON.stringify(this.filterConfigOption));
      this.getDataForSessions();
      this.appFilterTableService.updateFilter(evt);
    } else if (evt.state === 'clear') {
      this.selectedFilter = {};
      this.start = this.defaultStart;
      this.limit = this.defaultLimit;
      this.resetfilter();
      this.getDataForSessions();
      this.appFilterTableService.updateFilter(evt);
    }
  }

  updateEventObj(evt) {
    if (evt.type === 'notes') {
      this.openNotes(evt);
    }
    if (evt.type === 'row-click') {
      this.openManualRating(evt);
    }
  }

  ngOnDestroy() {
    if (this.paginatedSMRForCMRSub) {
      this.paginatedSMRForCMRSub.unsubscribe();
    }
    if (this.dialogRefSub) {
      this.dialogRefSub.unsubscribe();
    }
    if (this.globalObjSub) {
      this.globalObjSub.unsubscribe();
    }
  }
}
