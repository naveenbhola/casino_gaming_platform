import {Component, OnInit, QueryList, ViewChildren, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import {
  CommonTranslationService, FilterComponent, dialogSize, TopologyService, CasinomanagerService, AppTablesService,
  CageService, DecodedTokenService
} from 'common-ui';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
import {OpenerCloserDetailsComponent} from './opener-closer-details/opener-closer-details.component';
import {PrintWindowComponent} from './print-window/print-window.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NGXLogger} from 'ngx-logger';
import {DataService} from '../services/data.service';
import * as _ from 'lodash';
import {WDTSUtility} from '../utils/wdts-utils';

@Component({
  selector: 'app-opener-closer-tab',
  templateUrl: './openercloser.component.html',
  styleUrls: ['./openercloser.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class OpenercloserComponent implements OnInit, OnDestroy {
  @ViewChildren(FilterComponent) filterComponents: QueryList<FilterComponent>;
  perPageOption: Array<number> = [10, 20, 30, 50, 100];
  totalRecords: number;
  totalUnrolledTables: number;
  totalRolledTables: number;
  topologyID: number;
  alternateTitleObj: Object = {};
  start = 1;
  limit = 10;
  sortField: string;
  sortOrder: string;
  sortObj: any;
  selectedFilters: any;
  isFilterOpen: boolean;
  languageChanged;
  tableHeaders;
  openerCloserData = [];
  currentScreen: string;
  filterConf = [];
  rowsChecked = [];
  selectedTopologyIds = [];
  supervisorMap = new Map();
  dealerMap = new Map();
  reportURL: string;
  urlSafe: SafeResourceUrl;
  isPrintEnabled = false;
  noTableRolled = false;
  renderFlag = false;
  globalObjSub;
  openerCloserSub;
  openerCloserRptSub;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private appService: AppService,
              public snackBar: MatSnackBar,
              private casinoMngrService: CasinomanagerService,
              private cageService: CageService,
              private topologyService: TopologyService,
              private matDialog: MatDialog,
              private tableService: AppTablesService,
              private sanitizer: DomSanitizer,
              private decodedTokenService: DecodedTokenService,
              private nGXLogger: NGXLogger,
              private dataService: DataService) {
    this.isFilterOpen = false;
    this.handleSubscription();
  }

  ngOnInit() {
    this.checkPrintPermissions();
    this.globalObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      if (this.appService.currentTab === 'openercloser') {
        if (this.renderFlag) {
          return;
        }
        this.getTopologyId(globalObj);
      }
    });
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

  setOpenerCloserTableHeaders() {
    this.tableHeaders = [
      {title: 'checkbox', type: 'checkbox', isDisable: !this.isPrintEnabled},
      {
        title: 'application.app.common.labels.GA_OPERATING_AREA', type: 'text_no_translation',
        row: 'gaming_area_name', sortable: true, sortFirst: this.currentScreen === 'GA'
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.PIT', type: 'text_no_translation',
        row: 'pit_name', sortable: true, sortFirst: this.currentScreen === 'OA'
      },
      {
        title: 'application.app.common.labels.TABLE', type: 'text_no_translation',
        row: 'location_name', sortable: true, sortFirst: this.currentScreen === 'PIT'
      },
      {title: 'CasinoManager_view13.SUPERVISOR', type: 'text_no_translation', row: 'supervisorName', sortable: true},
      {title: 'application.app.common.labels.DEALER', type: 'text_no_translation', row: 'dealerName', sortable: true},
      {title: 'application.app.common.labels.ROLLED', type: 'text', row: 'rolled', sortable: false},
      {title: 'application.app.common.labels.OPENER', type: 'number-two-decimal', row: 'opener', sortable: true},
      {title: 'application.app.common.labels.CLOSER', type: 'number-two-decimal', row: 'closer', sortable: true},
      {title: 'CasinoManager_View1_CASINO_WIN', type: 'number-round-up', row: 'casino_win_loss', sortable: true},
      {title: 'CasinoManager_View1_RATED_WIN', type: 'number-round-up', row: 'rated_win_loss', sortable: false},
      {title: 'CasinoManager_View1_UNRATED_WIN', type: 'number-round-up', row: 'unrated_win_loss', sortable: false},
      {title: 'application.app.CAM_CASHIER_LABELS.BUYIN.LABEL', type: 'number-round-up', row: 'buy_in', sortable: true}
    ];
  }

  setFilterConfiguration() {
    this.filterConf = [
      // {
      //   title: 'application.app.common.labels.GA_OPERATING_AREA',
      //   column: 'gamingAreaName',
      //   options: [],
      //   selectedOptions: '',
      //   searchOption: true
      // },
      {
        title: 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.PIT',
        column: 'pitName',
        options: [],
        selectedOptions: '',
        searchOption: true
      },
      {
        title: 'application.app.common.labels.TABLE',
        column: 'tableName',
        options: [],
        selectedOptions: '',
        searchOption: true
      },
      {
        title: 'CasinoManager_view13.SUPERVISOR',
        column: 'supervisor',
        options: [],
        selectedOptions: '',
        searchOption: true
      },
      {
        title: 'application.app.common.labels.DEALER',
        column: 'dealer',
        options: [],
        selectedOptions: '',
        searchOption: true
      },
      {
        title: 'application.app.common.labels.ROLLED',
        column: 'rolled',
        options: [],
        selectedOptions: '',
        searchOption: true
      },
    ];
    this.tableService.filterConfigOptions = this.filterConf;
  }

  setOpenerCloserTableData(topologyID, filterVal?) {
    if (topologyID === undefined) {
      this.nGXLogger.log(topologyID, 'topologyID is undefined. setOpenerCloserTableData');
      return;
    }
    const selectedFilter = filterVal && Object.keys(filterVal).length > 0 ? filterVal : this.selectedFilters;
    const reqObj = {
      observe: 'response',
      params: {}
    };
    reqObj.params['limit'] = 10;
    reqObj.params['sortField'] = this.sortField ? this.sortField : this.currentScreen === 'GA' ? 'GAMING_AREA' :
      this.currentScreen === 'OA' ? 'pit' : 'TABLE_NAME';
    reqObj.params['sortOrder'] = this.sortOrder ? this.sortOrder : 'ASC';
    reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    reqObj.params['topologyId'] = topologyID;
    if (selectedFilter && Object.keys(selectedFilter).length > 0) {
      Object.assign(reqObj.params, selectedFilter);
    }
    this.openerCloserSub = this.casinoMngrService.getPaginatedOpenerCloser(reqObj).subscribe((response) => {
      const respData = response['body'];
      this.openerCloserData = respData.successObj['results'];
      this.processOpenerCloserData();
      if (!this.selectedFilters) {
        this.setFilterConfiguration();
        this.setFilterData(respData.successObj['filters']);
      }
      this.totalRecords = this.openerCloserData.length === 0 ? 0 : parseInt(response['headers'].get('TotalRecords'), 10);
      this.totalUnrolledTables = parseInt(response['headers'].get('TotalNoOfUnrolledTables'), 10);
      this.totalRolledTables = parseInt(response['headers'].get('TotalNoOfRolledTables'), 10);
      this.alternateTitleObj = {
        'title': 'application.app.common.labels.TABLES_ROLLED',
        'unrolledTables': this.totalUnrolledTables,
        'rolledTables': this.totalRolledTables
      };
    }, (error) => {
      this.totalRecords = 0;
      this.tableHeaders = [];
      this.openerCloserData = [];
    });
  }

  processOpenerCloserData() {
    let rolledCount = 0;
    if (this.openerCloserData.length > 0) {
      for (let i = 0; i < this.openerCloserData.length; i++) {
        if (WDTSUtility.equalIgnoreCase(this.openerCloserData[i]['rolled'], 'NO', true, false)) {
          this.openerCloserData[i]['isDisable'] = true;
        } else {
          rolledCount = rolledCount + 1;
        }
      }
      if (rolledCount === 0) {
        this.noTableRolled = true;
      }
    }
  }


  checkBoxEvent(node) {
    if (!_.isEmpty(node) && _.has(node, 'isDisable') && node['isDisable'] === true) {
      node.checked = false;
      return;
    } else {
      if (node.checked) {
        this.rowsChecked.push(node);
      }
      this.deleteUnCheckedRows();
    }
  }

  getTopologyId(dataObj) {
    this.renderFlag = true;
    let topologyID;
    if (dataObj.currentPitId) {
      this.currentScreen = 'PIT';
    } else if (dataObj.currentOAId) {
      this.currentScreen = 'OA';
      // this.tableHeaders = JSON.parse(JSON.stringify(this.dataService.getOALevelHeaders(this.isPrintEnabled)));
    } else if (dataObj.currentGAId) {
      this.currentScreen = 'GA';
    } else {
      this.currentScreen = 'SITE';
    }
    topologyID = dataObj.currentPitId ? dataObj.currentPitId : dataObj.currentOAId ? dataObj.currentOAId :
      dataObj.currentGAId ? dataObj.currentGAId : dataObj.currentSiteId;
    this.topologyID = topologyID;
    this.setOpenerCloserTableHeaders();
    this.deleteHeader(this.currentScreen, topologyID);
  }

  deleteHeader(topologyType, topologyID) {
    if (topologyType === 'OA') {
      this.tableHeaders.forEach((item, index) => {
        if (item.row === 'gaming_area_name') {
          this.tableHeaders.splice(index, 1);
        }
      });
    } else if (topologyType === 'PIT') {
      for (let i = 0, iLen = this.tableHeaders.length; i < iLen; i++) {
        if (this.tableHeaders[i] && this.tableHeaders[i].row && (this.tableHeaders[i].row === 'pit_name' ||
            this.tableHeaders[i].row === 'gaming_area_name')) {
          this.tableHeaders.splice(i, 1);
          i--;
        }
      }
    }
    this.setOpenerCloserTableData(topologyID);
  }

  setFilterData(data) {
    this.filterConf = this.deleteFilterConf();
    for (let i = 0, iLen = this.filterConf.length; i < iLen; i++) {
      const filterVal = this.filterConf[i];
      const colName = filterVal['column'];
      if (colName !== 'supervisor' && colName !== 'dealer') {
        filterVal['options'] = data[colName];
      } else if (colName === 'supervisor') {
        filterVal['options'] = this.setFilterValues(data[colName], data['supervisorUsers'], colName);
      } else if (colName === 'dealer') {
        filterVal['options'] = this.setFilterValues(data[colName], data['dealerUsers'], colName);
      }
    }
  }

  setFilterValues(filterArr, valueArr, colName) {
    const newArr = [];
    for (let i = 0, iLen = filterArr.length; i < iLen; i++) {
      for (let j = 0, jLen = valueArr.length; j < jLen; j++) {
        if (filterArr[i] && valueArr[j] && filterArr[i] === valueArr[j]['userId']) {
          let reqName;
          if (valueArr[j]['userId'] === -17) {
            reqName = '(Blanks)';
          } else {
            if (valueArr[j]['lastName'] && valueArr[j]['firstName']) {
              reqName = valueArr[j]['lastName'] + ', ' + valueArr[j]['firstName'] + ' (' + valueArr[j]['employeeNumber'] + ')';
            } else if (valueArr[j]['lastName'] && !valueArr[j]['firstName']) {
              reqName = valueArr[j]['lastName'] + ' (' + valueArr[j]['employeeNumber'] + ')';
            } else if (!valueArr[j]['lastName'] && valueArr[j]['firstName']) {
              reqName = valueArr[j]['firstName'] + ' (' + valueArr[j]['employeeNumber'] + ')';
            }
          }
          if (colName === 'supervisor') {
            this.supervisorMap.set(valueArr[j]['userId'], reqName);
          } else {
            this.dealerMap.set(valueArr[j]['userId'], reqName);
          }
          newArr.push(reqName);
        }
      }
    }
    return newArr;
  }

  deleteFilterConf() {
    const filterConfValues = this.filterConf;
    if (this.currentScreen === 'OA') {
      filterConfValues.forEach((item, index) => {
        if (item.row === 'gamingAreaName' || item.column === 'gamingAreaName') {
          filterConfValues.splice(index, 1);
        }
      });
    } else if (this.currentScreen === 'PIT') {
      filterConfValues.forEach((item, index) => {
        if (item.column === 'gamingAreaName' || item.row === 'gamingAreaName'
          || item.column === 'pitName' || item.row === 'pitName') {
          filterConfValues.splice(index, 1);
        }
      });
    }
    return filterConfValues;
  }

  updateEventObj(node) {
    switch (node.type) {
      case 'row-click':
        this.matDialog.open(OpenerCloserDetailsComponent, {
          width: dialogSize.fullscreen,
          panelClass: 'js-opener-closer-dialog',
          data: {topologyId: node.obj['locationId'], gamingDay: this.appService.appGlobalObj.gamingDay}
        });
        break;
    }
  }

  updateFilter(filterObj) {
    this.rowsChecked = [];
    const selectedFilter = filterObj.selectedFilter;
    const filterValues = this.refineFilterValues(selectedFilter);
    this.selectedFilters = filterValues;
    this.tableService.updateFilter(filterObj);
    switch (filterObj.state) {
      case 'apply': {
        for (const filter in selectedFilter) {
          if (selectedFilter.hasOwnProperty(filter)) {
            const stringedValue = selectedFilter[filter];
            for (let i = 0, iLen = this.filterConf.length; i < iLen; i++) {
              if (this.filterConf[i]['column'] === filter) {
                this.filterConf[i]['selectedOptions'] = stringedValue;
              }
            }
          }
        }
        this.filterConf = JSON.parse(JSON.stringify(this.filterConf));
        this.setOpenerCloserTableData(this.topologyID, filterValues);
        break;
      }
      case 'clear': {
        this.selectedFilters = undefined;
        this.setOpenerCloserTableData(this.topologyID);
        break;
      }
    }
  }

  refineFilterValues(filterSelected) {
    for (const filter in filterSelected) {
      if (filter === 'supervisor' || filter === 'dealer') {
        filterSelected[filter] = this.getReqFilterValues(filter, filterSelected[filter]);
      }
    }
    return filterSelected;
  }

  getReqFilterValues(filterName, filterArr) {
    const newValuesArr = [];
    if (filterName === 'supervisor') {
      for (let i = 0, iLen = filterArr.length; i < iLen; i++) {
        this.supervisorMap.forEach(function (key, value) {
          if (value === filterArr[i]) {
            newValuesArr.push(key);
          }
        });
      }
    } else {
      for (let j = 0, jLen = filterArr.length; j < jLen; j++) {
        this.dealerMap.forEach(function (key, value) {
          if (value === filterArr[j]) {
            newValuesArr.push(key);
          }
        });
      }
    }
    return newValuesArr;
  }

  sortData(sort) {
    switch (sort['active']) {
      case 'application.app.common.labels.GA_OPERATING_AREA' :
        this.sortField = 'GAMING_AREA';
        break;
      case 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.PIT':
        this.sortField = 'PIT';
        break;
      case 'application.app.common.labels.TABLE':
        this.sortField = 'TABLE_NAME';
        break;
      case 'CasinoManager_view13.SUPERVISOR':
        this.sortField = 'SUPERVISOR_NAME';
        break;
      case 'application.app.common.labels.DEALER':
        this.sortField = 'DEALER_NAME';
        break;
      case 'application.app.common.labels.OPENER':
        this.sortField = 'OPENER';
        break;
      case 'application.app.common.labels.CLOSER':
        this.sortField = 'CLOSER';
        break;
      case 'CasinoManager_View1_CASINO_WIN':
        this.sortField = 'CASINO_WL';
        break;
      case 'application.app.CAM_CASHIER_LABELS.BUYIN.LABEL':
        this.sortField = 'TOTAL_BUY_IN';
        break;
    }
    this.sortOrder = sort['direction'].toUpperCase();
    this.setOpenerCloserTableData(this.topologyID);
  }

  checkAllRows(nodes) {
    const checkedRows = [];
    for (let i = 0, iLen = nodes.length; i < iLen; i++) {
      if (nodes[i].checked) {
        checkedRows.push(nodes[i]);
      }
    }
    this.rowsChecked = checkedRows;
  }

  deleteUnCheckedRows() {
    for (let i = 0, iLen = this.rowsChecked.length; i < iLen; i++) {
      if (!this.rowsChecked[i] || !this.rowsChecked[i].checked) {
        this.rowsChecked.splice(i, 1);
      }
    }
  }

  initiatePrint() {
    this.selectedTopologyIds = [];
    if (this.rowsChecked.length === 0) {
      this.snackBar.open('Please select the rows', '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__warn'
      });
    } else {
      for (let i = 0, iLen = this.rowsChecked.length; i < iLen; i++) {
        if (this.selectedTopologyIds.indexOf(this.rowsChecked[i]['locationId']) === -1) {
          this.selectedTopologyIds.push(this.rowsChecked[i]['locationId']);
        }
      }
      this.proceedPrinting();
    }
  }

  proceedPrinting() {
    const reqObj = {
      observe: 'response',
      params: {}
    };
    reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    reqObj.params['topologyId'] = this.selectedTopologyIds.join();
    this.openerCloserRptSub = this.cageService.getOpenerCloserReportData(reqObj).subscribe((response) => {
      const data = response['body']['successObj'];
      this.cageService.getReportData(data).subscribe(res => {
        const file = new Blob([res as any], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.reportURL = fileURL as any;
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportURL);
        this.matDialog.open(PrintWindowComponent, {
          width: dialogSize.large,
          height: dialogSize.large,
          data: this.reportURL
        });

      }, err => {
        console.log(err);
      });

    });
  }

  checkPrintPermissions() {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    if (jwtToken) {
      const appIndex = jwtToken['authorities'].findIndex(app => app.applicationCode === 'CASINO_MGR');
      if (jwtToken['authorities'][appIndex]['permissions'].indexOf('PRINT_OPENER_CLOSER') !== -1 || jwtToken['superuser']) {
        this.isPrintEnabled = true;
      }
    }
  }

  ngOnDestroy() {
    if (this.openerCloserRptSub) {
      this.openerCloserRptSub.unsubscribe();
    }
    if(this.globalObjSub){
      this.globalObjSub.unsubscribe();
    }
    if(this.languageChanged){
      this.languageChanged.unsubscribe();
    }
    if(this.openerCloserSub){
      this.openerCloserSub.unsubscribe();
    }
  }
}


