import {Component, OnDestroy, OnInit, OnChanges, AfterViewInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  CommonTranslationService,
  TopologyService,
  AppAddNodeTopologyComponent,
  UtilityService,
  dialogSize,
  BreadcrumbComponent
} from 'common-ui';
import {AppService} from './app.service';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  title = 'casino-manager';
  authValues: any;
  lastRefresh: string;
  translationSubscriber;
  nodeClicked;
  tabsData = [];
  alertCounts;
  globalObj;
  breadcrumbList;
  arrTrees = [
    {treegroup: 'assignednode', isPlusIconToShow: false, label: 'application.app.CONFIGURATION_LABELS.TABTEXT.AREAS'},
    {treegroup: 'virtualgroup', isPlusIconToShow: true, label: 'application.app.common.labels.VIRTUAL_GROUP'}
  ];
  gamingDay;
  selectedGamingDay;
  globalObjSub: Subscription;

  constructor(public _router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private commonTranslationService: CommonTranslationService,
              public appService: AppService,
              public _topologyService: TopologyService,
              private utilityService: UtilityService,
              private activatedRoute: ActivatedRoute,
              public snackBar: MatSnackBar,
              public dialog: MatDialog) {
    this.handleSubscription();
    this.setAuthValues();
    this.getUpdatedGlobalObj();
    this.getGlobalCalendarGamingDay();
    this.getBreadCrumClick();
    // this.getClickedNode(); // commented due to GR-2145
    this.tabsData = this.appService.tabsData;
  }

  ngOnInit() {
    this.getLastRefresh();
    this.gamingDay = this.appService.gamingDay;
  }

  ngOnChanges() {
    this.gamingDay = this.appService.gamingDay;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getUpdatedBreadCrumb();
    }, 0);
  }

  getUpdatedGlobalObj() {
    this.globalObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      this.globalObj = globalObj;
      this.selectedGamingDay = globalObj.gamingDay;
    });
  }

  getUpdatedBreadCrumb() {
    this.appService.broadcastBreadCrumb.subscribe(breadCrumb => {
      // console.log('breadCrumb == ' + JSON.stringify(breadCrumb));
      this.breadcrumbList = breadCrumb;
      this.appService.appGlobalObj.breadCrumbList = this.breadcrumbList;
      //Site
      if (this.breadcrumbList.length === 1) {
        this.appService.backButton = this.breadcrumbList[this.breadcrumbList.length - 1];
        this.appService.backButton.url = '';
        this.appService.backButton['root'] = false;
      } else if (this.breadcrumbList.length > 0) {
        this.appService.backButton = this.breadcrumbList[this.breadcrumbList.length - 1];
        this.appService.backButton.url = this.breadcrumbList[this.breadcrumbList.length - 2].url;
        this.appService.backButton['root'] = false;
      } else {
        if (this.appService.companyNode) {
          this.appService.backButton = {labelName: this.appService.companyNode.name, root: true};
        }
      }
    });
  }


  getGlobalCalendarGamingDay() {
    this.utilityService.broadcastGlobalCalendarGamingDay.subscribe(globalCalendarGamingDay => {
      this.globalObj.gamingDay = globalCalendarGamingDay;
      this.refreshWithCalendarDay();
    });
  }

  getBreadCrumClick() {
    this.utilityService.broadcastBreadCrumClick.subscribe(breadCrum => {
      this._router.navigate([breadCrum.url]);
    });
  }

  // getClickedNode() {
  //   this._topologyService.nodeClicked.subscribe((obj) => {
  //     if (obj.nodeClicked.dataSourceName === 'accessgroup') {
  //       const urlForVirtual = '/overview/virtualGroup/' + obj.topologyGroupId;
  //       this._router.navigate([urlForVirtual]).then(res => {
  //       }, err => {
  //         // console.log(err);
  //       });
  //     } else {
  //       this._router.navigate([this.appService.createRouteUrl(obj)]).then(res => {
  //       }, err => {
  //         // console.log(err);
  //       });
  //     }
  //   });
  // }

  setAuthValues() {
    this.authValues = {
      jwtTokenKey: 'jwt_cmr',
      clientId: 'cmr',
      applicationCode: 'CASINO_MGR',
      accessCode: 'ACCESS_CASINO_MGR_APP'
    };
    localStorage.setItem('authValues', JSON.stringify(this.authValues));
  }

  getLastRefresh(): void {
    this.lastRefresh = localStorage.getItem('lastRefresh');
  }

  toggleTranslation(): void {
    this.translate.setDefaultLang(this.translate.getDefaultLang() === 'en_US' ? 'zh_Hant' : 'en_US');
  }

  refreshWithCalendarDay(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    const currentUrl = this._router.url + '?';
    this._router.navigateByUrl(currentUrl)
      .then(() => {
        const currentTime = new Date();
        this.getLastRefresh();
        this._router.navigated = false;
        this._router.navigate([this._router.url.replace(this.appService.gamingDayPresentInUrl, this.globalObj.gamingDay)]);
      });
  }

  updateEventObj(event) {
    this.openDialogToAddNode(event.obj.treegroup);
  }

  onClickTab(evnt) {
    this._router.navigate([this.getUrlToNavigate(evnt.url)]);
  }

  getUrlToNavigate(val) {
    const currentUrlString = this._router.url;
    const urlArray = currentUrlString.split('/');
    if (Number(urlArray[urlArray.length - 1])) {
      urlArray.push(val);
    } else {
      urlArray[urlArray.length - 1] = val;
    }
    return urlArray.join('/');
  }

  openDialogToAddNode(calledFrom): void {
    let dialogRef = this.dialog.open(AppAddNodeTopologyComponent, {
      width: dialogSize.medium,
      data: {clickedNode: this.nodeClicked, typeMap: this._topologyService.topologyTypes, called: calledFrom}
    });
    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;
    });
  }

  handleSubscription() {
    this.translationSubscriber = this.commonTranslationService.languageChanged
      .subscribe((translation) => {
        this.appService.languageChanged.next(translation);
      });
  }

  ngOnDestroy() {
    if (this.translationSubscriber) {
      this.translationSubscriber.unsubscribe();
    }
    if (this.globalObjSub) {
      this.globalObjSub.unsubscribe();
    }
  }
}
