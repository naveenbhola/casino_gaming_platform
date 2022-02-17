import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {CasinomanagerService} from '../../services/casinomanager.service';
import {TranslateService} from '@ngx-translate/core';

import {
  AuthService,
  DecodedTokenService, dialogSize,
  urls,
} from '../../../../common-ui-lib';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AppService} from '../../app.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ChangeStatusComponent} from './change-status/change-status.component';
import {forkJoin, Subject} from 'rxjs';
import {PrintWindowWinnerComponent} from './print-window/print-window.component';
import {OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import {DatePipe} from '@angular/common';
import {PromotionVoucherDetailsComponent} from './promotion-voucher-details/promotion-voucher-details.component';
import {PrintWindowErrorComponent} from './print-window-error/print-window-error.component';
import {WDTSUtility} from "../../utils/wdts-utils";
import {Subscription} from "rxjs/Rx";

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
  selector: 'app-promotion-winner',
  templateUrl: './promotion-winner.component.html',
  styleUrls: ['./promotion-winner.component.scss'],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
    DatePipe
  ]
})
export class PromotionWinnerComponent implements OnInit, OnDestroy {
  promotionList = [];
  totalRecords = 0;
  tableHeaders = [];
  gamingDay = '';
  loggedInUserInfo;
  currentWinnerStatus = '';
  initiatedChangeStatusObj = {
    voucherId: 0,
    userId: ''
  };
  isPrintEnabled = false;
  loading = true;
  currDate = new Date(new Date().setHours(0, 0, 0, 0));
  calenderDay: Date = new Date(new Date(this.appService.appGlobalObj.gamingDay).setHours(0, 0, 0, 0));
  todayDate: Date = new Date(this.currDate.getTime());
  maxStartDate: Date = new Date(this.currDate.getTime() - 365 * 24 * 60 * 60 * 1000);
  NO_ACTIVITY_MSG = 'NO_ACTIVITY_IN_LAST_TWO_GAMING_DAYS';
  NO_ACTIVITY_FLAG = false;
  // Subscriber
  promWinnerSub: Subscription;
  promWinnerSub_1: Subscription;
  PDFSub: Subscription;
  isCompApiEnabled = false;

  constructor(private casinoManagerService: CasinomanagerService,
              private appService: AppService,
              private translate: TranslateService,
              private decodedTokenService: DecodedTokenService,
              private authService: AuthService,
              private jwtHelper: JwtHelperService,
              private dialogRef: MatDialogRef<PromotionWinnerComponent>,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.gamingDay = this.appService.appGlobalObj.gamingDay;
    this.loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    this.checkIfCompApiEnabled();
    this.checkPrintPermissions();
    this.initCompApiTableHeader();
    this.getPromotionWinnerData();
  }

  checkPrintPermissions() {
    const jwtToken = this.loggedInUserInfo;
    if (jwtToken) {
      const appIndex = jwtToken['authorities'].findIndex(app => app.applicationCode === 'CASINO_MGR');
      if (jwtToken['authorities'][appIndex]['permissions'].indexOf('ISSUE_PRINT_PROMOTION_VOUCHER') !== -1 || jwtToken['superuser']) {
        this.isPrintEnabled = true;
        // console.log('this.isPrintEnabled::', this.isPrintEnabled);
      }
    }
  }

  initTableHeader() {
    this.tableHeaders = [
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.STATUS',
        type: 'winner-status',
        row: 'status',
        isDisable: !this.isPrintEnabled
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PROMOTION_ID',
        type: 'text_no_translation',
        row: 'promotionId'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PROMOTION_NAME',
        type: 'text_no_translation',
        row: 'promotionName'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.DATE_TIME',
        type: 'date',
        dateFormat: 'dd-MMM-yyyy HH:mm',
        row: 'timeOfWin'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PRIZE_NAME',
        type: 'text_no_translation',
        row: 'prizeName'
      },
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PRIZE_VALUE', type: 'number', row: 'prizeValue'},
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PIT', type: 'text_no_translation', row: 'pit'},
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.TABLE', type: 'text_no_translation', row: 'table'},
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.EXPIRATION',
        type: 'text_no_translation',
        row: 'voucherExpirationTime'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.ISSUED_BY',
        type: 'text_no_translation',
        row: 'voucherIssuedBy'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.ISSUE_TIME',
        type: 'date',
        dateFormat: 'dd-MMM-yyyy HH:mm',
        row: 'voucherIssueTime'
      },
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.SEAT', type: 'text_no_translation', row: 'seat'},
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PLAYER', type: 'text_no_translation', row: 'player'},
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.SESSION_ID',
        type: 'text_no_translation',
        row: 'sessionId'
      },
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.VOUCHER_ID', type: 'promotion_voucher', row: 'id'},
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PRINT',
        type: 'print',
        row: 'status',
        isDisable: !this.isPrintEnabled
      }
    ];
  }

  initCompApiTableHeader() {
    this.tableHeaders = [
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.STATUS',
        type: 'winner-status',
        row: 'status',
        isDisable: !this.isPrintEnabled
      },
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PLAYER',
        type: 'text_no_translation',
        row: 'player'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.DATE_TIME',
        type: 'date',
        dateFormat: 'dd-MMM-yyyy HH:mm',
        row: 'timeOfWin'
      },
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.SEAT', type: 'text_no_translation', row: 'seat'},
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.SESSION_ID',
        type: 'text_no_translation',
        row: 'sessionId'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PROMOTION_ID',
        type: 'text_no_translation',
        row: 'promotionId'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PROMOTION_NAME',
        type: 'text_no_translation',
        row: 'promotionName'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.TABLE',
        type: 'text_no_translation',
        row: 'table'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.EXPIRATION',
        type: 'text_no_translation',
        row: 'voucherExpirationTime'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PROPERTY',
        type: 'text_no_translation',
        row: 'propertyDescription'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PRIZE',
        type: 'text_no_translation',
        row: 'prizeName'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.COMP_TYPE_CATEGORY',
        type: 'text_no_translation',
        row: 'compTypeNCategory'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.ISSUED_BY_TIME',
        type: 'text_no_translation',
        row: 'issuedByNTime'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.VOUCHER_COMP_ID',
        type: 'promotion_voucher',
        row: 'id'
      },
      {title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.REDEMPTION', type: 'boolean', row: 'compRedeem', isDisable: !this.isPrintEnabled},
    ];
  }

  updateEventObj(evt) {
    if (evt.type === 'row-click') {
      if (!this.NO_ACTIVITY_FLAG) {
        this.appService.openPlayerDashboard(evt.obj.playerId, this.gamingDay);
      } else {
        this.snackBar.open(this.translate.instant
        (this.NO_ACTIVITY_MSG), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
      }
    }
    if (evt.type === 'winner-status') {
      this.initiateChangeStatus(evt.obj.id, evt.status);
    }
    if (evt.type === 'print') {
      this.initiateChangeStatus(evt.obj.id, 'PRINT');
    }

    if (evt.type === 'promotion_voucher') {
      this.initiateVoucherDetails(evt.obj.id);
    }
  }

  changeStatus(changeStatusObj): void {
    let url = '';
    if (this.currentWinnerStatus === 'ISSUED') {
      url = 'issue-winner-voucher';
      this.proceedPrinting(url);
    } else if (this.currentWinnerStatus === 'VOIDED') {
      url = 'void-winner-voucher';
      this.voidWinner(url);
    } else if (this.currentWinnerStatus === 'PRINT') {
      url = 'print-winner-voucher';
      this.proceedPrinting(url);
    }
  }

  voidWinner(url) {
    const reqObj = {
      params: {
        voucherId: this.initiatedChangeStatusObj.voucherId,
        userId: this.initiatedChangeStatusObj.userId
      }
    }
    this.promWinnerSub = this.casinoManagerService.getPromotionWinnerOnStatusChange(reqObj, url).subscribe(res => {
      this.getPromotionWinnerData();
    });
  }

  initiateVoucherDetails(voucherId): void {
    let dialogRef = this.dialog.open(PromotionVoucherDetailsComponent, {
      width: dialogSize.small,
      data: {voucherId: voucherId}
    });

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }

  initiateChangeStatus(voucherId, status): void {
    this.currentWinnerStatus = status;
    this.initiatedChangeStatusObj.voucherId = voucherId;
    this.initiatedChangeStatusObj.userId = this.loggedInUserInfo.userId;
    let dialogRef = this.dialog.open(ChangeStatusComponent, {
      width: '500px',
      data: {changeStatusObj: this.initiatedChangeStatusObj, status: this.currentWinnerStatus}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.changeStatus(this.initiatedChangeStatusObj);
      } else if (result === 'No') {
        this.initiatedChangeStatusObj.voucherId = 0;
        this.initiatedChangeStatusObj.userId = '';
      }
      dialogRef = null;
    });
  }

  getPromotionWinnerData() {
    this.loading = true;
    const req = {
      params: {
        calenderDate: this.gamingDay
      }
    };
    this.promWinnerSub_1 = this.casinoManagerService.getPromotionWinnerData(req).subscribe((res: any) => {
      this.promotionList = res.winners;
      this.totalRecords = this.promotionList.length;
      this.createCombinedHeader();
      this.loading = false;
    }, error1 => {
      console.log(error1);
      this.totalRecords = 0;
      this.promotionList = [];
    });
  }

  /**
   * create property : compTypeNCategory,issuedByNTime,
   */
  createCombinedHeader() {
    this.promotionList = this.promotionList.map(data => {
      if (data['compTypeDescription'] || data['compCategoryDescription']) {
        data['compTypeNCategory'] = data['compTypeDescription'] + '/' + data['compCategoryDescription'];
      }
      if (data['voucherIssuedBy'] || data['voucherIssueTime']) {
        const formattedDate = this.datePipe.transform(data['voucherIssueTime'], 'dd-MMM-yyyy HH:mm');
        data['issuedByNTime'] = data['voucherIssuedBy'] + ' ' + formattedDate;
      }
      // data['voucherPrintCount'] = 2;
      return data;
    });
  }

  proceedPrinting(urlTemp) {
    const url = urls.promotion.promotionsWinnerVoucher + urlTemp + '?' + 'voucherId=' + this.initiatedChangeStatusObj.voucherId
      + '&userId=' + this.initiatedChangeStatusObj.userId;
    this.PDFSub = this.casinoManagerService.getPDF(url).subscribe(data => {
      const url1 = window.URL.createObjectURL(data);
      const sub = new Subject<{}>();
      this.dialog.open(PrintWindowWinnerComponent, {
        width: dialogSize.xlarge,
        height: dialogSize.large,
        data: {url: url1, sub: sub}
      });
      sub.subscribe(item => {
        this.getPromotionWinnerData();
      });
    }, (error) => {
      console.error('error caught in component', error);
      this.dialog.open(PrintWindowErrorComponent, {
        data: {message: 'application.app.common.httpmessage.500'}
      });
    });

  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  onDateSelected(event): void {
    this.calenderDay = new Date(new Date(event.value).setHours(0, 0, 0, 0));
    const selectedDate = this.datePipe.transform(this.calenderDay, 'yyyy-MM-dd');
    this.gamingDay = selectedDate;
    const diff = WDTSUtility.dateDiffInDays(this.gamingDay, this.appService.appGlobalObj.gamingDay);
    this.getPromotionWinnerData();
    if (diff < 2) {
      this.NO_ACTIVITY_FLAG = false;
    } else {
      this.NO_ACTIVITY_FLAG = true;
    }
  }

  ngOnDestroy() {
    if (this.promWinnerSub) {
      this.promWinnerSub.unsubscribe();
    }
    if (this.promWinnerSub_1) {
      this.promWinnerSub_1.unsubscribe();
    }

  }

  //Comp Api start
  /**
   * check if comp api is enabled or disabled.
   */
  private checkIfCompApiEnabled() {
    const obj1 = this.casinoManagerService.getConfigProperty('com.wdts.prize.redemption.interface.enabled');
    const obj2 = this.casinoManagerService.getConfigProperty('com.wdts.prize.redemption.interface.available');
    const apiCalls = [obj1, obj2];
    //use forkJoin that takes array of observables not direct observaible.
    forkJoin(apiCalls).subscribe(res => {
      if (res[0][0] && res[0][0]['propertyValues']) {
        const propValueAvailable = JSON.parse(res[0][0]['propertyValues'][0]['propertyValue'].toLowerCase());
        const propValueEnabled = JSON.parse(res[1][0]['propertyValues'][0]['propertyValue'].toLowerCase());
        this.isCompApiEnabled = propValueEnabled && propValueAvailable;
        // console.log('this.isCompApiEnabled::', this.isCompApiEnabled);
      }
    });
  }
  //
}
