import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  CommonTranslationService,
  FilterComponent,
  urls,
  TopologyService,
  CasinomanagerService,
  AppTablesService
} from 'common-ui';
import {tableUIProtocol, tableUIPort, webServerDNS, protocol, webCasinoManagerTLSPort, AlertService} from 'common-ui';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
import {DataService} from '../services/data.service';
import {WDTSUtility} from '../utils/wdts-utils';

@Component({
  selector: 'app-tables-tab',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit, OnDestroy {
  @ViewChildren(FilterComponent) filterComponents: QueryList<FilterComponent>;
  perPageOption: Array<number> = [10, 20, 30, 50, 100];
  totalRecords: number;
  start = 1;
  limit = 10;
  sortField: string;
  sortOrder: string;
  sortObj: any;
  selectedFilters: any;
  isFilterOpen: boolean;
  loading: boolean;
  nodeId;
  noDataAvailable = false;
  tableTopologyIds = [];
  tableHeaders;
  tablesData = [];
  tablesDataForGrid = [];
  gridsData = {};
  gridsLastGameData = {};
  filterConfig = [];
  supervisorMapData = new Map();
  tableNodeMap = new Map();
  pagesMap = new Map();
  pageStarters = new Map();
  titleNotReq = true;
  selectedView = 'table';
  alertsData = {};
  changedPaginationObj;
  topologyIdsWithData = [];
  hasAdvKpiPermission;
  renderFlag = false;
  gridUpdate;
  fetchingData;
  tableStart;
  tableCurrentPage;
  tableLimit;
  selectedPageData = [];
  nodeIdsArr = [];
  upgradeDataSubscription;
  paramMapSub;
  globalObjSub;
  topoStatSub;
  tableFilterSub;
  topoStatGVSub;
  alertCountCateSub;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private topologyService: TopologyService,
              private casinoManagerService: CasinomanagerService,
              private appService: AppService,
              public snackBar: MatSnackBar,
              private tableService: AppTablesService,
              private jwtHelper: JwtHelperService,
              private alertService: AlertService,
              private dataService: DataService) {
    this.isFilterOpen = false;
  }

  ngOnInit() {
    this.paramMapSub = this._route.paramMap.subscribe(params => {
      this.fetchingData = true;
    });
    this.upgradeDataSubscription = this.dataService.updateGridData.subscribe((data) => {
      this.tableTopologyIds = data.topologies;
      this.gridUpdate = true;
      this.getTablesData(data.paginationObj, true, true);
    });
    this.globalObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      const nodeId = globalObj['currentPitId'] || globalObj['currentOAId'];
      if (nodeId !== this.nodeId) {
        this.renderFlag = false;
      }
      this.nodeId = nodeId;
      if (this.appService.currentTab === 'tables') {
        if (this.renderFlag) {
          return;
        }
        this.setTableHeaders();
        this.setFilterConfig();
        this.getTableIds();
      }
    });
    this.hasAdvKpiPermission = this.appService.hasPermissionOf('CASINO_MGR', 'VIEW_ADVANCED_CASINO_KPIS');
  }

  setTableHeaders() {
    if (this.hasAdvKpiPermission) {
      this.tableHeaders = [
        {
          title: 'application.app.common.labels.TABLE',
          type: 'text_no_translation',
          row: 'TABLE_NAME',
          sortable: true,
          sortFirst: true
        },
        {title: 'CasinoManager_view13.PLAYER_POSITIONS', type: 'number', row: 'PLAYER_POSITIONS'},
        {title: 'CasinoManager_view13.STATUS', type: 'text', row: 'STATUS', sortable: true},
        {title: 'CasinoManager_view13.SUPERVISOR', type: 'text_no_translation', row: 'SUPERVISOR', sortable: true},
        {title: 'CasinoManager_view13.DEALER', type: 'text_no_translation', row: 'DEALER', sortable: true},
        {title: 'CasinoManager_view13.TABLE_LIMITS', type: 'text_no_translation', row: 'TABLE_LIMITS'},
        {title: 'CasinoManager_view13.CASINO_WIN', type: 'number-round-up', row: 'CASINO_WIN', sortable: true},
        {title: 'CasinoManager_view13.THEO_WIN', type: 'number-round-up', row: 'THEO_WIN', sortable: true},
        {title: 'CasinoManager_view13.HOLD', type: 'number-round-up', row: 'HOLD', sortable: true},
        {title: 'CasinoManager_view13.TURNOVER', type: 'number-round-up', row: 'TURNOVER', sortable: true},
        {title: 'CasinoManager_view13.CURRENT_VALUE', type: 'number-two-decimal', row: 'CURRENT_VALUE'},
        {title: 'CasinoManager_view13.VARIANCE', type: 'number-two-decimal', row: 'VARIANCE'},
        {title: 'CasinoManager_view13.ADJUSTMENTS', type: 'number-two-decimal', row: 'ADJUSTMENTS'}
      ];
    } else {
      this.tableHeaders = [
        {
          title: 'application.app.common.labels.TABLE',
          type: 'text_no_translation',
          row: 'TABLE_NAME',
          sortable: true,
          sortFirst: true
        },
        {title: 'CasinoManager_view13.PLAYER_POSITIONS', type: 'number', row: 'PLAYER_POSITIONS', sortable: true},
        {title: 'CasinoManager_view13.STATUS', type: 'text', row: 'STATUS', sortable: true},
        {title: 'CasinoManager_view13.SUPERVISOR', type: 'text_no_translation', row: 'SUPERVISOR', sortable: true},
        {title: 'CasinoManager_view13.DEALER', type: 'text_no_translation', row: 'DEALER', sortable: true},
        {title: 'CasinoManager_view13.TABLE_LIMITS', type: 'text_no_translation', row: 'TABLE_LIMITS', sortable: true},
        {title: 'CasinoManager_view13.CASINO_WIN', type: 'number-round-up', row: 'CASINO_WIN', sortable: true},
        {title: 'CasinoManager_view13.TURNOVER', type: 'number-round-up', row: 'TURNOVER', sortable: true},
        {title: 'CasinoManager_view13.CURRENT_VALUE', type: 'number-two-decimal', row: 'CURRENT_VALUE', sortable: true},
        {title: 'CasinoManager_view13.VARIANCE', type: 'number-two-decimal', row: 'VARIANCE', sortable: true},
        {title: 'CasinoManager_view13.ADJUSTMENTS', type: 'number-two-decimal', row: 'ADJUSTMENTS', sortable: true}
      ];
    }
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        title: 'CasinoManager_view13.STATUS',
        column: 'status',
        options: [],
        selectedOptions: '',
        searchOption: true
      },
      {
        title: 'CasinoManager_view13.SUPERVISOR',
        column: 'supervisorEmpIds',
        options: [],
        selectedOptions: '',
        searchOption: true
      },
      {
        title: 'CasinoManager_view13.TABLE_LIMITS',
        column: 'limits',
        options: [],
        selectedOptions: '',
        searchOption: true
      }
    ];
    this.tableService.filterConfigOptions = this.filterConfig;
  }

  getTablesData(paginationObj?, fromGrid?, forGrid?) {
    const selectedFilter = this.selectedFilters;
    const reqObj = {
      observe: 'response',
      params: {}
    };
    reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    // reqObj.params['topologyIds'] = this.tableTopologyIds.toString();
    reqObj.params['topologyId'] = this.nodeId;
    reqObj.params['viewId'] = 13;
    reqObj.params['reqFilter'] = 1;
    if (paginationObj && fromGrid) {
      reqObj.params['start'] = paginationObj.start;
      reqObj.params['limit'] = paginationObj.limit;
    } else {
      reqObj.params['start'] = this.changedPaginationObj && this.changedPaginationObj.start ? this.changedPaginationObj.start : 1;
      reqObj.params['limit'] = this.changedPaginationObj && this.changedPaginationObj.limit ? this.changedPaginationObj.limit : 10;
    }
    reqObj.params['sortField'] = this.sortField ? this.sortField : 'TABLE_NAME';
    reqObj.params['sortOrder'] = this.sortOrder ? this.sortOrder : 'ASC';
    if (selectedFilter && Object.keys(selectedFilter).length > 0) {
      Object.assign(reqObj.params, selectedFilter);
    }
    this.topoStatSub = this.casinoManagerService.getTopologyStatsTabularView(reqObj).subscribe((response) => {
      const resp = response['body'];
      this.topologyIdsWithData = resp['topologyIds'];
      this.nodeIdsArr = resp['topologyIds'];
      const statCodes = resp['statCodes'];
      const respData = resp['data'];
      this.totalRecords = Number(response['headers'].get('TotalRecords'));
      if (this.totalRecords < 1) {
        this.totalRecords = 0;
        this.tablesData = [];
      }
      if (forGrid && this.totalRecords) {
        this.createTableDataForGrid(statCodes, respData, resp['topologyIds']);
      } else {
        this.createTableData(statCodes, respData, resp['topologyIds'], paginationObj);
      }
      this.getGridsData(paginationObj);
    }, (error) => {
      this.totalRecords = 0;
      this.tablesData = [];
      this.tableHeaders = [];
    });
  }

  getTablesFilterData() {
    const reqObj = {
      observe: 'response',
      params: {}
    };
    reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    reqObj.params['topologyIdList'] = this.tableTopologyIds.toString();
    reqObj.params['viewId'] = 16;
    this.tableFilterSub = this.casinoManagerService.getFilterForTable(reqObj).subscribe((response) => {
      this.setFilterConfig();
      this.setTableFilterValues(response['body']);
    });
  }

  setTableFilterValues(filterData) {
    for (let i = 0, iLen = this.filterConfig.length; i < iLen; i++) {
      const filterVal = this.filterConfig[i];
      const col = filterVal['column'];
      if (col === 'supervisorEmpIds') {
        let tempBlankSprvsr;
        // move Blanks to end
        for (let j = 0, jLen = filterData['supervisor'].length; j < jLen; j++) {
          const val = filterData['supervisor'][j];
          if (val['userId'] === -17) {
            tempBlankSprvsr = filterData['supervisor'][j];
            filterData['supervisor'].splice(j, 1);
            filterData['supervisor'].push(tempBlankSprvsr);
            break;
          }
        }
        // move Blanks to end *
        const newArr = [];
        for (let j = 0, jLen = filterData['supervisor'].length; j < jLen; j++) {
          const val = filterData['supervisor'][j];
          let reqName;
          if (val['userId'] === -17) {
            reqName = '(Blanks)';
          } else {
            if (val['lastName'] && val['firstName']) {
              reqName = val['lastName'] + ',' + val['firstName'] + '(' + val['employeeNumber'] + ')';
            } else if (val['lastName'] && !val['firstName']) {
              reqName = val['lastName'] + '(' + val['employeeNumber'] + ')';
            } else if (!val['lastName'] && val['firstName']) {
              reqName = val['firstName'] + '(' + val['employeeNumber'] + ')';
            }
          }
          if (val['userId'] === -17) {
            this.supervisorMapData.set(-17, reqName);
          } else {
            this.supervisorMapData.set(val['employeeNumber'], reqName);
          }
          newArr.push(reqName);
        }
        filterVal['options'] = newArr;
      } else {
        // move Blanks to end
        let tempBlankLimits;
        for (let k = 0, kLen = filterData[col].length; k < kLen; k++) {
          if (!filterData[col][k]) {
            tempBlankLimits = filterData[col][k];
            filterData[col].splice(k, 1);
            filterData[col].push(tempBlankLimits);
            break;
          }
        }
        // move Blanks to end *
        for (let k = 0, kLen = filterData[col].length; k < kLen; k++) {
          if (!filterData[col][k]) {
            filterData[col][k] = '(Blanks)';
          }
        }
        filterVal['options'] = filterData[col];
      }
    }
  }

  getTableIds() {
    if (!this.fetchingData){
      return;
    }
    let noRecordFound = false;
    const nodeId = this.nodeId;
    this.renderFlag = true;
    const keyArr = Object.keys(this.appService.topologyNodes);
    if (keyArr.indexOf(nodeId) > -1) {
      const screenType = this.appService.nodeNames[nodeId].type;
      if (screenType === 300) {
        const tableNodeIds = [];
        const pitArr = this.appService.topologyNodes[nodeId];
        for (let i = 0, iLen = pitArr.length; i < iLen; i++) {
          const pitNodeId = pitArr[i].nodeId.toString();
          if (keyArr.indexOf(pitNodeId) > -1) {
            const tableArr = this.appService.topologyNodes[pitNodeId];
            for (let j = 0, jLen = tableArr.length; j < jLen; j++) {
              tableNodeIds.push(tableArr[j].nodeId);
              this.tableNodeMap.set(tableArr[j].nodeId, tableArr[j]);
            }
          }
        }
        if (tableNodeIds.length > 0) {
          this.tableTopologyIds = tableNodeIds;
          this.noDataAvailable = false;
          this.createPagesMap();
          this.createPageStarters();
          this.getTablesData();
          this.getTablesFilterData();
        } else {
          noRecordFound = true;
        }
      } else if (screenType === 400) {
        const tableTopologiesArr = this.appService.topologyNodes[nodeId];
        const tableNodes = [];
        for (let i = 0, iLen = tableTopologiesArr.length; i < iLen; i++) {
          tableNodes.push(tableTopologiesArr[i].nodeId);
          this.tableNodeMap.set(tableTopologiesArr[i].nodeId, tableTopologiesArr[i]);
        }
        if (tableNodes.length > 0) {
          this.tableTopologyIds = tableNodes;
          this.noDataAvailable = false;
          this.createPagesMap();
          this.createPageStarters();
          this.getTablesData();
          this.getTablesFilterData();
        } else {
          noRecordFound = true;
        }
      }
    } else {
      noRecordFound = true;
    }
    if (noRecordFound) {
      this.noDataAvailable = true;
      this.tablesData = [];
      this.totalRecords = 0;
    }
    if (this.fetchingData){
      this.fetchingData = false;
    }
  }

  createTableData(statCodes, data, topologyIds, paginationObj?) {
    let createdData;
    createdData = this.dataService.createTheTableData(statCodes, data, topologyIds, this.tableNodeMap);
    this.tablesData = JSON.parse(JSON.stringify(createdData));
  }

  createTableDataForGrid(statCodes, data, topologyIds) {
    let createdData;
    createdData = this.dataService.createTheTableData(statCodes, data, topologyIds, this.tableNodeMap);
    this.tablesData = JSON.parse(JSON.stringify(createdData));
    this.tablesDataForGrid = this.getTablesDataForGrid(topologyIds);
  }

  updateFilter(filterObj) {
    const selectedFilter = filterObj.selectedFilter;
    const filterValues = this.refineTableFilterValues(selectedFilter);
    this.selectedFilters = filterValues;
    this.tableService.updateFilter(filterObj);
    switch (filterObj.state) {
      case 'apply': {
        for (const filter in selectedFilter) {
          if (selectedFilter.hasOwnProperty(filter)) {
            const stringedValue = selectedFilter[filter];
            for (let i = 0, iLen = this.filterConfig.length; i < iLen; i++) {
              if (this.filterConfig[i]['column'] === filter) {
                if (this.filterConfig[i]['column'] === 'supervisorEmpIds') {
                  const temp = [];
                  stringedValue.forEach((val) => {
                    temp.push(this.supervisorMapData.get(val));
                  });
                  this.filterConfig[i]['selectedOptions'] = temp;
                } else {
                  this.filterConfig[i]['selectedOptions'] = stringedValue;
                }
              }
            }
          }
        }
        this.filterConfig = JSON.parse(JSON.stringify(this.filterConfig));
        this.getTablesData();
        break;
      }
      case 'clear': {
        this.getTablesData();
        this.getTablesFilterData();
        break;
      }
    }
  }

  refineTableFilterValues(filterSelected) {
    const newfilterSelected = {};
    for (const filter in filterSelected) {
      newfilterSelected[filter] = [];
      if (filter === 'limits') {
        for (let j = 0, jLen = filterSelected[filter].length; j < jLen; j++) {
          if (filterSelected[filter][j] === '(Blanks)') {
            newfilterSelected[filter][j] = -17;
          } else {
            newfilterSelected[filter][j] = filterSelected[filter][j];
          }
        }
      } else if (filter === 'supervisorEmpIds') {
        const newArr = [];

        /**
         * Checked if user selected blank supervisor and it is only one in filterSelected array: GR-3445
         */
        if (filterSelected[filter].length === 1 && (filterSelected[filter][0] === '(Blanks)' || filterSelected[filter][0] === -17)) {
          newArr.push(-17);
        } else {
          for (let i = 0, iLen = filterSelected[filter].length; i < iLen; i++) {
            this.supervisorMapData.forEach(function (key, value) {
              if (filterSelected[filter][i] === key) {
                newArr.push(value);
              }
            });
          }
        }
        filterSelected[filter] = newArr;
        newfilterSelected[filter] = newArr;
      } else {
        for (let k = 0, kLen = filterSelected[filter].length; k < kLen; k++) {
          newfilterSelected[filter][k] = filterSelected[filter][k];
        }
      }
    }
    return newfilterSelected;
  }

  sortData(sort) {
    switch (sort['active']) {
      case 'application.app.common.labels.TABLE' :
        this.sortField = 'TABLE_NAME';
        break;
      case 'CasinoManager_view13.STATUS' :
        this.sortField = 'STATUS';
        break;
      case 'CasinoManager_view13.SUPERVISOR' :
        this.sortField = 'SUPERVISOR';
        break;
      case 'CasinoManager_view13.DEALER' :
        this.sortField = 'DEALER';
        break;
      case 'CasinoManager_view13.CASINO_WIN' :
        this.sortField = 'CASINO_WIN';
        break;
      case 'CasinoManager_view13.THEO_WIN' :
        this.sortField = 'THEO_WIN';
        break;
      case 'CasinoManager_view13.HOLD' :
        this.sortField = 'HOLD';
        break;
      case 'CasinoManager_view13.TURNOVER' :
        this.sortField = 'TURNOVER';
        break;
    }
    this.sortOrder = sort['direction'].toUpperCase();
    this.getTablesData();
  }

  updateEventObj(node) {
    switch (node.type) {
      case 'row-click':
        this.openTableDashboard(node.obj['TABLE_NAME']);
        break;
    }
  }

  openTableDashboard(tableName) {
    let tableObj;
    this.tableNodeMap.forEach((value, key) => {
      if (value['name'] === tableName) {
        tableObj = value;
      }
    });
    if (tableObj.host) {
      const jwtData = localStorage.getItem('jwt_cmr');
      const decodedJwt = this.jwtHelper.decodeToken(jwtData);
      const isPermitted = this.appService.hasPermissionOf('CASINO_MGR', 'ACCESS_TABLE_DASHBOARD');
      WDTSUtility.openTableDash(jwtData, decodedJwt, protocol, webServerDNS, tableObj, tableUIPort, webCasinoManagerTLSPort, tableUIProtocol, this.snackBar, this.translate, isPermitted);
    }
  }


  getGridsData(paginationObj?) {
    const reqObj = {
      observe: 'response',
      params: {}
    };
    reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    reqObj.params['topologyIds'] = this.tableTopologyIds.toString();
    reqObj.params['viewId'] = 14;
    reqObj.params['start'] = paginationObj ? paginationObj.start : 1;
    reqObj.params['limit'] = paginationObj ? paginationObj.limit : 5;
    if (reqObj.params['topologyIds']) {
      this.topoStatGVSub = this.casinoManagerService.getTopologyStatisticsGridView(reqObj).subscribe((response) => {
        this.createGridData(response['body']);
      });
    }

  }

  getTablesDataForGrid(topologyIds) {
    const tableData = JSON.parse(JSON.stringify(this.tablesData));
    const dataArr = [];
    for (let i = 0, iLen = tableData.length; i < iLen; i++) {
      if (this.nodeIdsArr.indexOf(tableData[i]['tableID']) > -1) {
        dataArr.push(tableData[i]);
      }
    }
    return dataArr;
  }

  getGridAlerts() {
    const reqObj = {
      observe: 'response',
      params: {}
    };
    const alertStatus = 'ACKNOWLEDGED, OPEN';
    if (this.tableTopologyIds && this.tableTopologyIds.length > 0) {
      reqObj.params['topologyIds'] = this.tableTopologyIds.toString();
      this.alertCountCateSub = this.alertService.getAlertCountsByCategory(alertStatus, this.tableTopologyIds.toString(), 'table').subscribe((response) => {
        this.createAlertsData(response);
      });
    }
  }

  createPagesMap() {
    const topologyNodesArr = JSON.parse(JSON.stringify(this.tableTopologyIds));
    let chunk, count = 0;
    while (topologyNodesArr.length > 0) {
      count++;
      chunk = topologyNodesArr.splice(0, 3);
      this.pagesMap.set(count, chunk);
    }
  }

  createPageStarters() {
    const nodesArr = JSON.parse(JSON.stringify(this.tableTopologyIds));
    const x = nodesArr.length / 3;
    const pageNum = Math.round(x);
    let count = 1;
    for (let i = 0, iLen = pageNum; i < iLen; i++) {
      if (i === 0) {
        this.pageStarters.set(i + 1, count);
      } else {
        count = (i * 3) + 1;
        this.pageStarters.set(i + 1, count);
      }
    }
  }

  createAlertsData(data) {
    const alertsData = {};
    for (let i = 0, iLen = data.length; i < iLen; i++) {
      this.tableNodeMap.forEach(function (value, key) {
        if (value.nodeId === data[i].topologyId) {
          alertsData[value.nodeId] = data[i];
        }
      });
    }
    this.alertsData = alertsData;
  }

  createGridData(data) {
    this.getGridAlerts();
    const obj = this.dataService.createTheGridData(data);
    this.gridsData = JSON.parse(JSON.stringify(obj.gridData));
    this.tablesDataForGrid = this.getTablesDataForGrid(data['topologyIds']);
    this.gridsLastGameData = JSON.parse(JSON.stringify(obj.lastGameData));
    if (this.gridUpdate) {
      this.dataService.updateLastGameData.next(this.gridsLastGameData);
    }
  }

  selectViewType(viewType) {
    this.selectedView = viewType;
    const gridKeys = this.convertKeyStrToNums(Object.keys(this.gridsData));
    /*if (viewType === 'grid' && this.areTopologyIdsNew(gridKeys)) {
      this.clearGridsData(gridKeys);
    }*/
    if (viewType === 'grid') {
      this.selectedPageData = this.tablesData;
      if (this.areTopologyIdsNew(gridKeys)) {
        this.clearGridsData(gridKeys);
      }
      this.gridUpdate = true;
      this.getTablesData({start: 1, limit: 5}, true, true);
    } else {
      this.tablesData = JSON.parse(JSON.stringify(this.selectedPageData));
      // this.getTablesData({start: this.tableStart, limit: this.tableLimit}, true, false);
    }
  }

  clearGridsData(gridKeys) {
    for (let i = 0, iLen = gridKeys.length; i < iLen; i++) {
      if (this.tableTopologyIds.indexOf(gridKeys[i]) === -1) {
        delete this.gridsData[gridKeys[i]];
        delete this.gridsLastGameData[gridKeys[i]];
      }
    }
  }

  areTopologyIdsNew(keysArr) {
    let isNew = false;
    for (let i = 0, iLen = this.tableTopologyIds.length; i < iLen; i++) {
      if (keysArr.indexOf(this.tableTopologyIds[i]) === -1) {
        isNew = true;
        break;
      }
    }
    return isNew;
  }

  convertKeyStrToNums(gridKeys) {
    const keyNumbs = [];
    for (const keyVal in gridKeys) {
      keyNumbs.push(parseInt(gridKeys[keyVal], 10));
    }
    return keyNumbs;
  }

  updatePaginationEvent(paginationObj) {
    this.changedPaginationObj = paginationObj;
    this.tableStart = paginationObj.start;
    this.tableLimit = paginationObj.limit;
    this.tableCurrentPage = paginationObj.currentPage;
    this.getTablesData();
  }

  ngOnDestroy() {
    this.tableTopologyIds = [];
    if (this.upgradeDataSubscription) {
    this.upgradeDataSubscription.unsubscribe();
  }
    if (this.paramMapSub) {
      this.paramMapSub.unsubscribe();
    }
    if (this.globalObjSub) {
      this.globalObjSub.unsubscribe();
    }
    if (this.topoStatSub) {
      this.topoStatSub.unsubscribe();
    }
    if (this.tableFilterSub) {
      this.tableFilterSub.unsubscribe();
    }
    if (this.topoStatGVSub) {
      this.topoStatGVSub.unsubscribe();
    }
    if (this.alertCountCateSub) {
      this.alertCountCateSub.unsubscribe();
    }
  }

}
