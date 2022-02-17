import {EventEmitter, Injectable} from '@angular/core';
import {TopologyService, DecodedTokenService, AuthService, protocol, webServerDNS, treasuryPort} from 'common-ui';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {cage} from '../../common-ui-lib/constants/url-cage.constants';
import {webPlayerDashboardTLSPort} from '../../common-ui-lib';

@Injectable()
export class AppService {
  languageChanged = new EventEmitter();
  broadcastGlobalObj = new EventEmitter();
  broadcastBreadCrumb = new EventEmitter();
  companyNode;
  gamingDay;
  nextRollDTM;
  localGamingDays;
  showGamingDay;
  alertCounts;
  subnavTopologyStatistics;
  backButton;
  nodeNames;
  topologyNodes;
  isGlobalAnonymousHostEnabled;
  isPlayerAdjustmentEnabled;
  isPromotionWinnerEnabled;
  isCBPT = true;
  checkFctxnEnabled = false;
  gamingDayPresentInUrl;
  currentRouteGamingDay;
  appGlobalObj = {
    gamingDay: '',
    globalCalendarGamingDay: '',
    currentSiteId: '',
    currentPitId: '',
    currentGAId: '',
    currentOAId: '',
    vgId: '',
    currentTopologyId: '',
    breadCrumbList: []
  };
  tabsData = [];
  currentTab;
  selectedLanguage: string;
  globalLoggedInUserInfo;
  virtualGroupNodes;
  lastVisitedSiteId;
  lastVisitedTopologyId;

  constructor(public _topologyService: TopologyService,
              private translate: TranslateService,
              public decodedTokenService: DecodedTokenService,
              private jwtHelper: JwtHelperService,
              private authService: AuthService) {
    this.selectedLanguage = this.translate.getDefaultLang();
    this.globalLoggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
  }

  updateGlobalObj(globalObj) {
    this.appGlobalObj.gamingDay = globalObj.gamingDay;
    this.appGlobalObj.currentSiteId = globalObj.siteId;
    this.appGlobalObj.currentPitId = globalObj.pitId;
    this.appGlobalObj.currentGAId = globalObj.GAId;
    this.appGlobalObj.currentOAId = globalObj.OAId;
    this.appGlobalObj.vgId = globalObj.vgId;
    this.broadcastGlobalObj.emit(this.appGlobalObj);
  }

  updateBreadCrumb(breadCrumb) {
    this.broadcastBreadCrumb.emit(breadCrumb);
  }

  getTypeName(typeId) {
    return this._topologyService.topologyTypes.get(typeId).topologyType;
  }

  getParentObject() {
    let temp = {};
    for (const ref in this._topologyService.topologyNodeNames) {
      if (this._topologyService.topologyNodeNames.hasOwnProperty(ref)) {
        if (!this._topologyService.topologyNodeNames[Number(ref)].parentNodeId) {
          temp = this._topologyService.topologyNodeNames[Number(ref)];
          break;
        }
      }

    }
    return temp;
  }

  openPlayerDashboard(ppId, gamingDay) {
    if (!this.isCBPT) {
      return;
    }
    const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    const jwtToken = this.decodedTokenService.getJwtToken();
    if ((loggedInUserInfo.userId || loggedInUserInfo.superuser === true) && !this.jwtHelper.isTokenExpired(jwtToken)) {
      this.authService.getRefreshToken('plr').subscribe(res => {
        const playerDashboardURL = protocol + webServerDNS + ':' + webPlayerDashboardTLSPort + '/#/player/session/'
          + ppId + '/' + gamingDay + '?access_token=' + res.access_token;
        window.open(playerDashboardURL);
      });
    } else {
      const playerDashboardURL = protocol + webServerDNS + ':' + webPlayerDashboardTLSPort
        + '/#/player/session/' + ppId + '/' + gamingDay;
      window.open(playerDashboardURL);
    }
  }

  createRouteUrl(obj) {
    let temp = '';
    let getCurrentType;
    let getCurrentTypeName;
    let urlMap;
    let level;
    let objNodeId;
    if (obj.nodeClicked) {
      level = obj.nodeClicked.level;
      getCurrentType = obj.nodeDetails[obj.nodeClicked.item].type;
      getCurrentTypeName = this.getTypeName(getCurrentType);
      urlMap = this.urlMaker(obj);
      objNodeId = obj.nodeClicked.item;
    } else {
      level = obj.level;
      getCurrentType = obj.type;
      getCurrentTypeName = this.getTypeName(getCurrentType);
      urlMap = this.urlMaker(obj);
      objNodeId = obj.nodeId;
    }

    switch (level) {
      case 0 : {
        temp = '/overview';
        break;
      }
      case 1 : {
        temp = '/overview/site/' + objNodeId + '/' + this.appGlobalObj.gamingDay;
        break;
      }
      case 2 : {
        if (getCurrentTypeName === 'CAGE_AREAS') {
          temp = getCurrentTypeName;
          this.navigateToTreasuryApp(obj);
        } else {
          temp = 'overview/site/' + urlMap.get('SITE') + '/GA/' + urlMap.get('GAMING_AREAS') + '/' + this.appGlobalObj.gamingDay;
        }
        break;
      }
      case 3 :
        if (getCurrentTypeName === 'OPERATING_AREA') {
          temp = 'overview/site/' + urlMap.get('SITE') + '/GA/' +
            urlMap.get('GAMING_AREAS') + '/OA/' + urlMap.get('OPERATING_AREA') + '/' + this.appGlobalObj.gamingDay;
        } else if (getCurrentTypeName === 'PIT') {
          temp = 'overview/site/' + urlMap.get('SITE') + '/GA/' +
            urlMap.get('GAMING_AREAS') + '/pit/' + urlMap.get('PIT') + '/tables' + '/' + this.appGlobalObj.gamingDay;
          this.tabsData = [];
          this.tabsData.push({content: 'Table', url: '/configuration/areas', selected: true, isDisable: false});
          this.tabsData.push({content: 'Player', url: '/configuration/areas', selected: true, isDisable: false});
          this.tabsData.push({content: 'Performance', url: '/configuration/areas', selected: true, isDisable: false});
          this.tabsData.push({content: 'Manual Rating', url: '/configuration/areas', selected: true, isDisable: false});
          this.tabsData.push({content: 'Opener/Closer', url: '/configuration/areas', selected: true, isDisable: false});
          this.tabsData.push({content: 'Chip Security', url: '/configuration/areas', selected: true, isDisable: false});
        } else if (getCurrentTypeName === 'CAGE') {
          temp = getCurrentTypeName;
          this.navigateToTreasuryApp(obj);
        }
        break;
      case 4 : {
        if (getCurrentTypeName === 'PIT') {
          temp = 'overview/site/' + urlMap.get('SITE') + '/GA/' + urlMap.get('GAMING_AREAS') + '/OA/' + urlMap.get('OPERATING_AREA')
            + '/pit/' + urlMap.get('PIT') + '/tables/' + this.appGlobalObj.gamingDay;
        }
        if (getCurrentTypeName === 'TERMINAL') {
        }
        break;
      }
      case 5 : {
        if (getCurrentTypeName === 'BACCARAT') {
        }
        if (getCurrentTypeName === 'TERMINAL') {
        }
        break;
      }

    }
    return temp;
  }

  navigateToTreasuryApp(nodeData) {
    const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    const jwtToken = this.decodedTokenService.getJwtToken();
    let cageType;
    if (nodeData.nodeDetails[nodeData.nodeClicked.item].type === 510) {
      cageType = nodeData.nodeDetails[nodeData.nodeClicked.item].parentNodeId + '/cages/';
    } else {
      cageType = '';
    }
    if ((loggedInUserInfo.userId || loggedInUserInfo.superuser === true) && !this.jwtHelper.isTokenExpired(jwtToken)) {
      this.authService.getRefreshToken('trs').subscribe(res => {
        const treasuryUrl = protocol + webServerDNS + ':' + treasuryPort + '/#/treasury/' + cageType +
          nodeData.nodeClicked.item + '?access_token=' + res.access_token;
        window.open(treasuryUrl);
      });
    } else {
      const treasuryUrl = protocol + webServerDNS + ':' + treasuryPort + '/#/treasury/' + cageType + nodeData.nodeClicked.item;
      window.open(treasuryUrl);
    }
  }

  getStringOfTopologyId(obj) {
    const temp = [];
    for (const ref of this._topologyService.topologyNodes[obj.nodeId]) {
      temp.push(ref.nodeId);
    }
    return temp.join();
  }

  urlMaker(obj) {
    const urlMap = new Map();
    let currentObj;
    let parentObj;
    if (obj.nodeDetails) {
      currentObj = obj.nodeDetails[obj.nodeClicked.item];
      parentObj = obj.nodeDetails[currentObj.parentNodeId];
    } else {
      currentObj = obj;
      parentObj = this._topologyService.topologyNodeNames[currentObj.parentNodeId];
    }
    while (currentObj.parentNodeId) {
      switch (this.getTypeName(currentObj.type)) {
        case 'GAMING_AREAS': {
          urlMap.set('GAMING_AREAS', currentObj.nodeId);
          break;
        }
        case 'PIT': {
          urlMap.set('PIT', currentObj.nodeId);
          break;
        }
        case 'OPERATING_AREA': {
          urlMap.set('OPERATING_AREA', currentObj.nodeId);
          break;
        }
        case 'SITE': {
          urlMap.set('SITE', currentObj.nodeId);
          break;
        }
      }
      currentObj = parentObj;
      parentObj = this.getParentNode(this._topologyService.topologyNodes, currentObj.parentNodeId)
    }
    return urlMap;
  }

  getParentNode(nodesObj, parentNodeId) {
    if (!parentNodeId) {
      return;
    }
    for (let obj in nodesObj) {
      for (let i = 0; i < nodesObj[obj].length; i++) {
        if (parseInt(nodesObj[obj][i].nodeId) === parentNodeId) {
          return nodesObj[obj][i];
        }
      }
    }
  }

  hasPermissionOf(paramApplicationCode, permissionCode) {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    if (jwtToken && jwtToken.authorities) {
      const appIndx = jwtToken.authorities.findIndex(app => app.applicationCode === paramApplicationCode);
      if (jwtToken.authorities[appIndx]) {
        if (jwtToken.authorities[appIndx].permissions.indexOf(permissionCode) < 0 && !jwtToken.superuser) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }

  getTableIds(nodeId) {
    let tableTopologyIdsArr = [];
    const keyArr = Object.keys(this._topologyService.topologyNodes);
    if (keyArr.indexOf(nodeId) > -1) {
      const screenType = this._topologyService.topologyNodeNames[nodeId].type;
      if (screenType === 300) {
        const tableNodeIds = [];
        const pitArr = this._topologyService.topologyNodes[nodeId];
        for (let i = 0, iLen = pitArr.length; i < iLen; i++) {
          const pitNodeId = pitArr[i].nodeId.toString();
          if (keyArr.indexOf(pitNodeId) > -1) {
            const tableArr = this._topologyService.topologyNodes[pitNodeId];
            for (let j = 0, jLen = tableArr.length; j < jLen; j++) {
              tableNodeIds.push(tableArr[j].nodeId);
            }
          }
        }
        if (tableNodeIds.length > 0) {
          tableTopologyIdsArr = tableNodeIds;
        }
      } else if (screenType === 400) {
        const tableTopologiesArr = this._topologyService.topologyNodes[nodeId];
        const tableNodes = [];
        for (let i = 0, iLen = tableTopologiesArr.length; i < iLen; i++) {
          tableNodes.push(tableTopologiesArr[i].nodeId);
        }
        if (tableNodes.length > 0) {
          tableTopologyIdsArr = tableNodes;
        }
      }
    }
    return tableTopologyIdsArr;
  }

  checkPermissionByTopologyID(TOPOLOGY_ID, paramApplicationCode) {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    if (jwtToken) {
      const appIndx = jwtToken.authorities.findIndex(app => app.applicationCode === paramApplicationCode);
      if (jwtToken.authorities[appIndx].topologyIds.indexOf(TOPOLOGY_ID) < 0 && !jwtToken.superuser) {
        return false;
      } else {
        return true;
      }
    }
  }

  getTopologyNodeNameFromId(nodeId) {
    for (let tNode in this._topologyService.topologyNodeNames) {
      if (this._topologyService.topologyNodeNames[tNode].nodeId === parseInt(nodeId)) {
        return this._topologyService.topologyNodeNames[tNode].name;
      }
    }
  }
}
