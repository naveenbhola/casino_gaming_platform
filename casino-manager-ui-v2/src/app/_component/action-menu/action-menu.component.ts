import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {dialogSize} from '../../constants/constants';
import {MatDialog} from '@angular/material/dialog';
import {DisplaySearchResultComponent} from '../display-search-result/display-search-result.component';
import {RollTimeComponent} from '../roll-time/roll-time.component';
import {HostCallComponent} from '../host-call/host-call.component';
import {AppService} from '../../app.service';
import {ConfigurationService} from 'common-ui';
import {AdjustRatingOptionsComponent} from '../adjust-rating-options/adjust-rating-options.component';
import {PromotionWinnerComponent} from '../promotion-winner/promotion-winner.component';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit, OnDestroy {
  @Input() appName: string;
  // appName;
  // routeParams;
  pitName;
  pitId;
  hostCall;
  hostCallSystemData;
  hostCallTemplate = {};
  // TODO :: check For permission
  isPlayerAdjustmentPermission: boolean;
  // Subscribers
  hostCallTempSub: Subscription;
  hostCallOnTopologySub: Subscription;
  postHostCallOnTopologySub: Subscription;

  constructor(public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              public appService: AppService,
              private configurationService: ConfigurationService) {
    this.getHostCallTemplate();
  }

  ngOnInit() {
    this.isPlayerAdjustmentPermission = this.appService.hasPermissionOf('CASINO_MGR', 'ADJUST_RATING_OPTIONS');
  }

  getHostCallTemplate() {
    this.hostCallTempSub = this.configurationService.getHostcallTemplate().subscribe(data => {
      this.hostCallTemplate = data[0];
    });
  }

  openHostCallDialog(): void {
    this.pitName = this.appService.nodeNames[this.appService.appGlobalObj.currentPitId].name;
    this.pitId = this.appService.appGlobalObj.currentPitId;
    this.hostCallOnTopologySub = this.configurationService.getHostcallDataOnTopology(this.pitId).subscribe((data) => {
      let tmpData;
      tmpData = data;
      if (tmpData.length > 0) {
        this.hostCallSystemData = data[0];
        this.updateDefaultHostCalObj();
        this.openHostCallDialogModal();
      } else {
        this.hostCallSystemData = this.hostCallTemplate;
        this.hostCallSystemData.topologyId = this.pitId;
        this.hostCallSystemData.type = 'CURRENT';
        this.updateDefaultHostCalObj();
        this.postHostCallOnTopologySub = this.configurationService.postHostcallDataOnTopology(this.hostCallSystemData).subscribe(respData => {
          this.hostCallSystemData = respData[0];
          this.updateDefaultHostCalObj();
          this.openHostCallDialogModal();
        });
      }
    });
  }

  openHostCallDialogModal() {
    let dialogRef = this.dialog.open(HostCallComponent, {
      width: dialogSize.small,
      data: {
        pitName: this.pitName,
        hostCallSystemData: this.hostCallSystemData,
        hostCall: this.hostCall
      }
    }).afterClosed().subscribe(res => {
      dialogRef = null;
    });
  }

  updateDefaultHostCalObj() {
    this.hostCall = {};
    for (const propertyval in this.hostCallSystemData.propertyValues) {
      switch (this.hostCallSystemData.propertyValues[propertyval].propertyCode) {
        case 'com.wdts.anonymous.session.win':
          this.hostCall.win = parseInt(this.hostCallSystemData.propertyValues[propertyval].propertyValue, 10);
          break;
        case 'com.wdts.anonymous.session.lose':
          this.hostCall.loss = parseInt(this.hostCallSystemData.propertyValues[propertyval].propertyValue, 10);
          break;
        case 'com.wdts.anonymous.session.avg.bet':
          this.hostCall.avgBet = parseInt(this.hostCallSystemData.propertyValues[propertyval].propertyValue, 10);
          break;
        case 'com.wdts.anonymous.session.handle':
          this.hostCall.handle = parseInt(this.hostCallSystemData.propertyValues[propertyval].propertyValue, 10);
          break;
        case 'com.wdts.anonymous.session.games.played':
          this.hostCall.gamesPlayed = parseInt(this.hostCallSystemData.propertyValues[propertyval].propertyValue, 10);
          break;
        case 'com.wdts.anonymous.session.theo.win':
          this.hostCall.theoWin = parseInt(this.hostCallSystemData.propertyValues[propertyval].propertyValue, 10);
          break;
      }
    }
  }

  checkIfPit() {
    if (location.href.includes('/pit/')) {
      return true;
    } else {
      return false;
    }
  }

  openPlayerSearch() {
    let dialogRef = this.dialog.open(DisplaySearchResultComponent, {
      width: dialogSize.large,
      data: {type: 'player'},
      panelClass: 'js-player-search'
    });
    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }

  openUserSearch() {
    let dialogRef = this.dialog.open(DisplaySearchResultComponent, {
      width: dialogSize.large,
      data: {type: 'user'},
      panelClass: 'js-user-search'
    });
    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }

  openPromotionWinner() {
    let dialogRef = this.dialog.open(PromotionWinnerComponent, {
      width: dialogSize.fullscreen,
      panelClass: "js-promotion-winner-dialog",
      data: {type: 'user'}
    });
    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }

  openAdjustRating() {
    let dialogRef = this.dialog.open(AdjustRatingOptionsComponent, {
      width: dialogSize.medium,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }


  openShowRollTime() {
    let dialogRef = this.dialog.open(RollTimeComponent, {
      width: dialogSize.large
    });
    const instance = dialogRef.componentInstance;
    instance.topologyId = this.appService.appGlobalObj.currentPitId || this.appService.appGlobalObj.currentOAId
      || this.appService.appGlobalObj.currentGAId || this.appService.appGlobalObj.currentSiteId || this.appService.companyNode.nodeId;
    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }

  ngOnDestroy() {
    if (this.hostCallOnTopologySub) {
      this.hostCallOnTopologySub.unsubscribe();
    }
    if (this.hostCallTempSub) {
      this.hostCallTempSub.unsubscribe();
    }
    if (this.postHostCallOnTopologySub) {
      this.postHostCallOnTopologySub.unsubscribe();
    }
  }
}
