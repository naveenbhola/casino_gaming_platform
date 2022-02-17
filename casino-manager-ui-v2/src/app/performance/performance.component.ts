import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {CommonTranslationService, urls, CasinomanagerService} from 'common-ui';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
@Component({
  selector: 'app-performance-tab',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PerformanceComponent implements OnInit, OnDestroy {
  // @ts-ignore
  performanceData = [];
  totalRecords: number;
  filterConfigOption = [];
  isFilterOpen: boolean;
  tableHeaders = [];
  gamingDay;
  pitId;
  titleNotReq = true;
  headerMapping;
  hasAdvKpiPermission;
  languageChanged;
  renderFlag;
  topolgyStatsSub;
  globalObjSub;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private casinomanagerService: CasinomanagerService,
              private appService: AppService) {
    this.isFilterOpen = false;
  }

  ngOnInit() {
    this.hasAdvKpiPermission = this.appService.hasPermissionOf('CASINO_MGR', 'VIEW_ADVANCED_CASINO_KPIS');
    if (!this.hasAdvKpiPermission) {
      this.headerMapping = {
        'OPEN_TABLE_TABLE_TYPE': 'application.app.common.labels.TOPSUBNAV.OPEN_TABLES',
        'TOTAL_TABLE_TABLE_TYPE': 'TOTAL_TABLE_TABLE_TYPE',
        /*'UTILIZATION': 'application.app.common.labels.TOPSUBNAV.UTILIZATION',*/
        'CASINO_WIN': 'CasinoManager_View1_CASINO_WIN',
        /*'THEO_WIN': 'application.app.common.labels.TOPSUBNAV.THEO_WIN',*/
        /*'HOLD': 'CasinoManager_View1_HOLD',*/
        'TOTAL_BUY_IN': 'CasinoManager_View1_TOTAL_BUY_IN',
        'AVERAGE_BET': 'CasinoManager_View1_AVERAGE_BET',
        'TURNOVER': 'CasinoManager_view13.TURNOVER',
        /*'RATED_PLAY': 'application.app.common.labels.TOPSUBNAV.RATED_PLAY'*/
      };
    } else {
      this.headerMapping = {
        'OPEN_TABLE_TABLE_TYPE': 'application.app.common.labels.TOPSUBNAV.OPEN_TABLES',
        'TOTAL_TABLE_TABLE_TYPE': 'TOTAL_TABLE_TABLE_TYPE',
        'UTILIZATION': 'application.app.common.labels.TOPSUBNAV.UTILIZATION',
        'CASINO_WIN': 'CasinoManager_View1_CASINO_WIN',
        'THEO_WIN': 'application.app.common.labels.TOPSUBNAV.THEO_WIN',
        'HOLD': 'CasinoManager_View1_HOLD',
        'TOTAL_BUY_IN': 'CasinoManager_View1_TOTAL_BUY_IN',
        'AVERAGE_BET': 'CasinoManager_View1_AVERAGE_BET',
        'TURNOVER': 'CasinoManager_view13.TURNOVER',
        'RATED_PLAY': 'application.app.common.labels.TOPSUBNAV.RATED_PLAY'
      };
    }
    this.handleSubscription();
    this.initPerformanceData();
  }

  initTableHeaders(response) {
    const statCodes = response.statCodes;
    this.tableHeaders = [{
      title: 'CasinoManager_View1_TABLE_TYPE',
      type: 'text_no_translation',
      row: 'CasinoManager_View1_TABLE_TYPE'
    }];
    const statCodesLength = statCodes.length;
    for (let i = 0; i < statCodesLength; i++) {
      if (this.headerMapping[statCodes[i]]) {
        const headerObj = {
          title: this.headerMapping[statCodes[i]],
          type: 'number-round-up',
          row: statCodes[i]
        };
        this.tableHeaders.push(headerObj);
      }
    }
    this.processPerformanceData(statCodes, response.data, response['tableTypes']);
  }

  initPerformanceData() {
    this.globalObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      if (this.appService.currentTab === 'performance') {
        if (this.renderFlag) {
          return;
        }
        this.gamingDay = globalObj.gamingDay;
        this.pitId = this.getTopologyId(globalObj);
        this.getPerformanceData();
      }
    });
  }

  getTopologyId(dataObj) {
    let topologyID;
    topologyID = dataObj.currentPitId ? dataObj.currentPitId : dataObj.currentOAId ? dataObj.currentOAId :
      dataObj.currentGAId ? dataObj.currentGAId : dataObj.currentSiteId;
    return topologyID;
  }

  getPerformanceData() {
    this.renderFlag = true;
    const performanceParams = `?gamingDay=${this.gamingDay}&topologyId=${this.pitId}&viewId=11`;
    this.topolgyStatsSub = this.casinomanagerService.getTopologyStatsByTableType({}, performanceParams)
      .subscribe(response => {
        this.initTableHeaders(response);
      }, error => {
        this.totalRecords = 0;
      });
  }

  processPerformanceData(statCodes, data, tableTypes) {
    for (let i = 0; i < data.length; i++) {
      const performanceDObj = {
        'CasinoManager_View1_TABLE_TYPE': tableTypes[i]
      };
      for (let j = 0; j < data[i].stats.length; j++) {
        performanceDObj[statCodes[j]] = data[i].stats[j];
      }
      this.performanceData.push(performanceDObj);
    }
    this.performanceData = JSON.parse(JSON.stringify(this.performanceData));
    this.totalRecords = this.performanceData.length;
  }

  handleSubscription() {
    const language = sessionStorage.getItem('language');
    if (language) {
      this.translate.setDefaultLang(language);
    }
    this.languageChanged = this.appService.languageChanged
      .subscribe((translation) => {
        this.translate.setDefaultLang(translation);
      });
  }

  ngOnDestroy() {
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
    }
    if (this.topolgyStatsSub) {
      this.topolgyStatsSub.unsubscribe();
    }
    if (this.globalObjSub) {
      this.globalObjSub.unsubscribe();
    }
  }
}


