import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
  CommonTranslationService, FilterComponent, urls, TopologyService, DecodedTokenService,
  AuthService, protocol, webServerDNS, treasuryPort, CasinomanagerService, CageService, AlertService
} from 'common-ui';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import * as _ from 'lodash';
import {Location} from '@angular/common';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  objectKeys = Object.keys;
  headerMapping = {
    'OPEN_TABLE': 'application.app.common.labels.TOPSUBNAV.OPEN_TABLES',
    'UTILIZATION': 'application.app.common.labels.TOPSUBNAV.UTILIZATION',
    'CASINO_WIN': 'CasinoManager_View1_CASINO_WIN',
    'THEO_WIN': 'application.app.common.labels.TOPSUBNAV.THEO_WIN',
    'HOLD': 'CasinoManager_View1_HOLD',
    'TOTAL_BUY_IN': 'CasinoManager_View1_TOTAL_BUY_IN',
    'AVERAGE_BET': 'CasinoManager_View1_AVERAGE_BET',
    'TURNOVER': 'CasinoManager_view13.TURNOVER',
    'RATED_PLAY': 'application.app.common.labels.TOPSUBNAV.RATED_PLAY'
  };
  // Subscribers
  languageChanged;
  paramMapSub;
  nodesInitializedSub;
  currentGameDaySub;
  topoStatSub;
  topoStatSub_1;
  topoStatSub_2;
  alertCountCateSub;
  topLosingPlayerVGSub;
  topWinningPlayerVGSub;

  globalObj;
  currentScreen;
  sitesData = [];
  gaData = [];
  oaData = [];
  oaChildNodesData = [];
  losingPlayersList;
  winningPlayersList;
  isVirtualGroup;
  advKpis = [];
  hasAdvKpiPermission;
  fetchingData;
  math = Math;
  topoStats;
  refreshTokenSub;
  routeMapSub;
  topologyInitializedSub;
  globalObjSub;
  currentGamingDaySub;
  topologyStatsSub;
  alertCountByCatSub;
  topplogyStatSub;
  topWinningCasinoSub;
  topWinningCasinoSub_1;
  topLosingCasinoSub;
  topLosingCasinoSub_1;
  losingPlayersVGroupSub;
  WinningPlayersVGroupSub;
  loadingTopWinning = false;
  loadingTopLosing = false;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private topologyService: TopologyService,
              private appService: AppService,
              private decodedTokenService: DecodedTokenService,
              private jwtHelper: JwtHelperService,
              private authService: AuthService,
              private casinomanagerService: CasinomanagerService,
              private alertService: AlertService,
              private cageService: CageService,
              private locationService: Location) {
    this.handleSubscription();
  }

  ngOnInit() {
    if (location.href.includes('access_token')) {
      this.locationService.replaceState('overview');
    }
    this.initOverviewData();
    this.advKpis = ['UTILIZATION', 'THEO_WIN', 'HOLD', 'RATED_PLAY'];
    this.hasAdvKpiPermission = this.appService.hasPermissionOf('CASINO_MGR', 'VIEW_ADVANCED_CASINO_KPIS');
  }

  initOverviewData() {

    this.routeMapSub = this._route.paramMap.subscribe(params => {
      this.fetchingData = true;
    });

    this.globalObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      if (this.appService.currentTab === 'openercloser' || this.appService.currentTab === 'tables' || this.appService.currentTab === 'players') {
        return;
      }
      if (this.topologyService.topologyNodes) {
        this.globalObj = globalObj;
        this.renderOverviewScreen();
      } else {
        this.topologyInitializedSub = this.topologyService.initialized.subscribe(res => {
          if (res === 'nodesInitialized') {
            this.globalObj = globalObj;
            this.renderOverviewScreen();
          }
        });
      }

    });
  }

  renderOverviewScreen() {
    if (!this.fetchingData) {
      return;
    }
    if (this.globalObj.currentPitId) {
      this.currentScreen = 'PIT';
      return;
    } else if (this.globalObj.currentOAId) {
      this.currentScreen = 'OA';
      this.getOAOrPitData('OA');
    } else if (this.globalObj.currentGAId) {
      this.currentScreen = 'GA';
      this.getOAOrPitData('GA');
    } else if (this.globalObj.currentSiteId) {
      this.currentScreen = 'SITE';
      this.gaData = this.topologyService.topologyNodes[this.globalObj.currentSiteId];
    } else if (this.globalObj.vgId) {
      this.isVirtualGroup = true;
      this.getOAOrPitDataVG('VG');
    } else {
      this.currentScreen = 'COMPANY';
      this.getCompanyNodeData();
      this.prepareSitesData();
    }
    if (this.fetchingData) {
      this.fetchingData = false;
    }
  }

  // Get Top Most ;i.e; Company Node Data
  getCompanyNodeData() {
    for (const key in this.topologyService.topologyNodeNames) {
      if (this.topologyService.topologyNodeNames[key].type === 100) {
        this.appService.companyNode = {
          'nodeId': this.topologyService.topologyNodeNames[key].nodeId,
          'name': this.topologyService.topologyNodeNames[key].name,
          'shortName': this.topologyService.topologyNodeNames[key].shortName
        };
      }
    }
  }

  prepareSitesData() {
    for (const site in this.topologyService.siteChildren) {
      this.sitesData.push(this.topologyService.topologyNodeNames[this.topologyService.siteChildren[site].id]);
    }
    //Get Company Gaming Day
    if (!this.globalObj.gamingDay) {
      this.currentGamingDaySub = this.cageService.getCurrentGamingDay(this.appService.companyNode.nodeId).subscribe(data => {
        this.globalObj.gamingDay = data;
        this.globalObj.gamingDay = this.globalObj.gamingDay.successObj;
        this.getCompanyLevelData();
      });
    } else {
      this.getCompanyLevelData();
    }
  }

  getCompanyLevelData() {
    // Get Company Sub Nav Topology Statistics
    if (this.globalObj.gamingDay && this.appService.companyNode.nodeId) {
      this.topologyStatsSub = this.casinomanagerService.getTopologyStatistics(this.globalObj.gamingDay, this.appService.companyNode.nodeId, 1, {}).subscribe(data => {
        this.appService.subnavTopologyStatistics = data;
      });
    }

    const alertStatus = 'ACKNOWLEDGED, OPEN';
    this.alertCountByCatSub = this.alertService.getAlertCountsByCategory(alertStatus, this.appService.companyNode.nodeId, 'table').subscribe(data => {
      let temp_data = [];
      temp_data = data;
      if (temp_data.length && temp_data.length > 0) {
        this.appService.alertCounts = temp_data[0];
      }
    });

    this.appService.backButton = {labelName: this.appService.companyNode.name};
  }

  getOAOrPitData(param) {
    this.oaData = [];
    const childTopologyIds = [];
    const childNodes = param === 'GA' ? this.oaChildNodesData = this.topologyService.topologyNodes[this.globalObj.currentGAId] :
      this.oaChildNodesData = this.topologyService.topologyNodes[this.globalObj.currentOAId];

    if (childNodes) {
      for (let i = 0; i < childNodes.length; i++) {
        childTopologyIds.push(childNodes[i].nodeId);
      }
      if (childTopologyIds.length > 0) {
        this.topplogyStatSub = this.casinomanagerService.getTopologyStatistics(this.globalObj.gamingDay, childTopologyIds.join(','), 1, {}).subscribe(response => {
          const OAData = response.data,
            OAHeader = response.statCodes,
            OATopologyIds = response.topologyIds,
            OADataLength = response.data.length;
          for (let i = 0; i < OADataLength; i++) {
            const OAObj = {
              name: this.topologyService.topologyNodeNames[OATopologyIds[i]].name,
              data: {}
            };
            for (let j = 0; j < OAData[i].stats.length; j++) {
              if (OAHeader[j] !== 'OPEN_TABLE') {
                OAObj.data[OAHeader[j]] = OAData[i].stats[j];
              } else {
                OAObj.data[OAHeader[j]] = OAData[i].stats[j];
              }

            }
            this.oaData.push(OAObj);
          }
        });
      }
    }

    // getTopLosingCasino getTopWinningCasino
    if (param === 'GA') {
      this.loadingTopWinning = true;
      this.loadingTopLosing = true;
      this.topLosingCasinoSub = this.casinomanagerService.getTopLosingCasino(this.globalObj.gamingDay, this.globalObj.currentGAId).subscribe(data => {
        this.losingPlayersList = data;
        this.losingPlayersList = this.losingPlayersList.playerSummaryList;
        this.loadingTopLosing = false;
      });
      this.topWinningCasinoSub = this.casinomanagerService.getTopWinningCasino(this.globalObj.gamingDay, this.globalObj.currentGAId).subscribe(data => {
        this.winningPlayersList = data;
        this.winningPlayersList = this.winningPlayersList.playerSummaryList;
        this.loadingTopWinning = false;
      });
    } else if (param === 'OA') {
      this.loadingTopWinning=true;
      this.loadingTopLosing=true;
      this.topLosingCasinoSub_1 = this.casinomanagerService.getTopLosingCasino(this.globalObj.gamingDay, this.globalObj.currentOAId).subscribe(data => {
        this.losingPlayersList = data;
        this.losingPlayersList = this.losingPlayersList.playerSummaryList;
        this.loadingTopLosing = false;
      });
      this.topWinningCasinoSub_1 = this.casinomanagerService.getTopWinningCasino(this.globalObj.gamingDay, this.globalObj.currentOAId).subscribe(data => {
        this.winningPlayersList = data;
        this.winningPlayersList = this.winningPlayersList.playerSummaryList;
        this.loadingTopWinning = false;
      });
    }
  }

  getOAOrPitDataVG(param) {
    this.oaData = [];
    this.oaChildNodesData = [];
    const childTopologyIds = [];
    let childNodes;
    if (_.isArray(this.appService.virtualGroupNodes)) {
      childNodes = this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.globalObj.vgId)).topologyNodeIds;
    }
    if (_.isArray(childNodes) && childNodes.length > 0) {
      for (let i = 0; i < childNodes.length; i++) {
        childTopologyIds.push(childNodes[i]);
      }
    }
    for (let i = 0; i < childTopologyIds.length; i++) {
      this.oaChildNodesData.push(this.getNodeFromTopologyNodes(childTopologyIds[i]));
    }

    if (childTopologyIds.length > 0) {
      this.topoStats = this.casinomanagerService.getTopologyStatistics(this.globalObj.gamingDay, childTopologyIds.join(','), 1, {})
        .subscribe(response => {
          const OAData = response.data,
            OAHeader = response.statCodes,
            OATopologyIds = response.topologyIds,
            OADataLength = response.data.length;
          for (let i = 0; i < OADataLength; i++) {
            const OAObj = {
              name: this.topologyService.topologyNodeNames[OATopologyIds[i]].name,
              data: {}
            };
            for (let j = 0; j < OAData[i].stats.length; j++) {
              if (OAHeader[j] !== 'OPEN_TABLE') {
                OAObj.data[OAHeader[j]] = /*Math.ceil(Number(*/OAData[i].stats[j]/*))*/;
              } else {
                OAObj.data[OAHeader[j]] = OAData[i].stats[j];
              }

            }

            this.oaData.push(OAObj);
          }
        });
    }

    //getTopLosingCasino getTopWinningCasino
    this.loadingTopWinning = true;
    this.loadingTopLosing = true;
    this.losingPlayersVGroupSub = this.casinomanagerService.getTopLosingPlayersVirtualGroup(this.globalObj.gamingDay, this.globalObj.vgId).subscribe(data => {
      this.losingPlayersList = data;
      this.losingPlayersList = this.losingPlayersList.playerSummaryList;
      this.loadingTopLosing = false;
    });
    this.WinningPlayersVGroupSub = this.casinomanagerService.getTopWinningPlayersVirtualGroup(this.globalObj.gamingDay, this.globalObj.vgId).subscribe(data => {
      this.winningPlayersList = data;
      this.winningPlayersList = this.winningPlayersList.playerSummaryList;
      this.loadingTopWinning = false;
    });
  }

  getNodeFromTopologyNodes(childId) {
    for (let tNode in this.topologyService.topologyNodes) {
      for (let j = 0; j < this.topologyService.topologyNodes[tNode].length; j++) {
        if (childId === this.topologyService.topologyNodes[tNode][j].nodeId) {
          return this.topologyService.topologyNodes[tNode][j];
        }
      }
    }
  }

  navigateTochildScreen(nodeData) {
    switch (nodeData.type) {
      case 150:   // site
        this.gaData = this.topologyService.topologyNodes[nodeData.nodeId];
        this._router.navigate(['overview/site/' + nodeData.nodeId + '/' + this.globalObj.gamingDay]);
        return;
      case 200:   // Gaming Area
        if (this.globalObj.vgId) {
          this._router.navigate(['overview/virtualGroup/' + this.globalObj.vgId + '/GA/' +
          nodeData.nodeId + '/' + this.globalObj.gamingDay]);
        } else {
          this._router.navigate(['overview/site/' + this.globalObj.currentSiteId + '/GA/' +
          nodeData.nodeId + '/' + this.globalObj.gamingDay]);
        }
        return;
      case 300:   // Operating Area
        if (this.globalObj.vgId) {
          if (this.globalObj.currentGAId) {
            this._router.navigate(['overview/virtualGroup/' + this.globalObj.vgId + '/GA/' +
            this.globalObj.currentGAId + '/OA/' + nodeData.nodeId + '/' + this.globalObj.gamingDay]);
          } else {
            this._router.navigate(['overview/virtualGroup/' + this.globalObj.vgId +
            '/OA/' + nodeData.nodeId + '/' + this.globalObj.gamingDay]);
          }
        } else {
          this._router.navigate(['overview/site/' + this.globalObj.currentSiteId + '/GA/' +
          this.globalObj.currentGAId + '/OA/' + nodeData.nodeId + '/' + this.globalObj.gamingDay]);
        }
        return;
      case 400:   // Pit
        if (this.globalObj.vgId) {
          this._router.navigate(['overview/virtualGroup/' + this.globalObj.vgId +
          (this.globalObj.currentGAId ? '/GA/' + this.globalObj.currentGAId : '') +
          (this.globalObj.currentOAId ? '/OA/' + this.globalObj.currentOAId : '') + '/pit/' + nodeData.nodeId + '/tables/' + this.globalObj.gamingDay]);
        } else {
          this._router.navigate(['overview/site/' + this.globalObj.currentSiteId +
          (this.globalObj.currentGAId ? '/GA/' + this.globalObj.currentGAId : '') +
          (this.globalObj.currentOAId ? '/OA/' + this.globalObj.currentOAId : '') + '/pit/' + nodeData.nodeId + '/tables/' + this.globalObj.gamingDay]);
        }
        return;
      case 500:   // Treasury
        this.navigateToTreasuryApp(nodeData);
        return;
    }
  }

  checkByTopologyPerm(node) {
    return this.appService.checkPermissionByTopologyID(node.nodeId.toString(), 'CASINO_MGR');
  }

  navigateToTreasuryApp(nodeData) {
    const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    const jwtToken = this.decodedTokenService.getJwtToken();
    if ((loggedInUserInfo.userId || loggedInUserInfo.superuser === true) && !this.jwtHelper.isTokenExpired(jwtToken)) {
      this.refreshTokenSub = this.authService.getRefreshToken('trs').subscribe(res => {
        const treasuryUrl = protocol + webServerDNS + ':' + treasuryPort + '/#/treasury/' +
          nodeData.nodeId + '?access_token=' + res['access_token'];
        window.open(treasuryUrl);
      });
    } else {
      const treasuryUrl = protocol + webServerDNS + ':' + treasuryPort + '/#/treasury/' + nodeData.nodeId;
      window.open(treasuryUrl);
    }
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

  isAdvKpiPermitted(key) {
    if (this.advKpis.indexOf(key) === -1) {
      return true;
    } else {
      return this.hasAdvKpiPermission;
    }
  }

  ngOnDestroy() {
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
    }
    if (this.refreshTokenSub) {
      this.refreshTokenSub.unsubscribe();
    }
    if (this.routeMapSub) {
      this.routeMapSub.unsubscribe();
    }
    if (this.topologyInitializedSub) {
      this.topologyInitializedSub.unsubscribe();
    }
    if (this.topologyStatsSub) {
      this.topologyStatsSub.unsubscribe();
    }
    if (this.alertCountByCatSub) {
      this.alertCountByCatSub.unsubscribe();
    }
    if (this.topplogyStatSub) {
      this.topplogyStatSub.unsubscribe();
    }
    if (this.topWinningCasinoSub) {
      this.topWinningCasinoSub.unsubscribe();
    }
    if (this.topWinningCasinoSub_1) {
      this.topWinningCasinoSub_1.unsubscribe();
    }
    if (this.topLosingCasinoSub) {
      this.topLosingCasinoSub.unsubscribe();
    }
    if (this.topLosingCasinoSub_1) {
      this.topLosingCasinoSub_1.unsubscribe();
    }
    if (this.topoStats) {
      this.topoStats.unsubscribe();
    }
    if (this.WinningPlayersVGroupSub) {
      this.WinningPlayersVGroupSub.unsubscribe();
    }
    if (this.losingPlayersVGroupSub) {
      this.losingPlayersVGroupSub.unsubscribe();
    }
    if (this.globalObjSub) {
      this.globalObjSub.unsubscribe();
    }
    if(this.currentGamingDaySub){
      this.currentGamingDaySub.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

}


