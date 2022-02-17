import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {AppService} from '../../app.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import {AlertBoxComponent} from '../../common/alert-box/alert-box.component';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {
  AppTablesService, DecodedTokenService,
  dialogSize
} from 'common-ui';
import {WDTSUtility} from '../../utils/wdts-utils';
import {ChipSecurityService} from '../../services/chip-security.service';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-comparescans-comparison',
  templateUrl: './comparescans-comparison.component.html',
  styleUrls: ['./comparescans-comparison.component.scss']
})
export class ComparescansComparisonComponent implements OnInit, OnDestroy, AfterViewInit {
  tableHeaders: Array<any>;
  filterConfigOption;
  chipTrayScanData: Array<any>;
  gamingDay;
  reqObj;
  languageChanged;
  totalRecords: number;
  selectedRows: Array<any> = [];
  routeParams;
  isPPMaster;
  gamingDaysNum: number;
  chipSecurityTabAccess = false;
  loaded = false;
  tableName;
  compStart;
  compLimit;
  compCurrentPage;

  constructor(private decodedTokenService: DecodedTokenService,
              private logger: NGXLogger,
              private appService: AppService,
              private _router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private matDialog: MatDialog,
              private tableService: AppTablesService,
              private chipSecurityService: ChipSecurityService) {
  }

  checkEditPermission() {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    this.isPPMaster = jwtToken.superuser;
    if (jwtToken) {
      const appIndx = jwtToken.authorities.findIndex(app => app.applicationCode === 'CASINO_MGR');
      if (jwtToken.authorities[appIndx].permissions.indexOf('CHIP_SECURITY_MANAGE') !== -1 || jwtToken.authorities[appIndx].permissions.indexOf('CHIP_SECURITY_VIEW') !== -1 || jwtToken.superuser) {
        this.chipSecurityTabAccess = true;
      }
    }
  }

  ngOnInit() {
    this.gamingDay = this.appService.appGlobalObj.gamingDay;
    this.reqObj = {};
    this.checkEditPermission();
    this.initRouteParams();
    this.initReqObj();
    this.initFilterConfigOptions();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initChipTrayData();
      this.initTableHeaders();
    }, 0);
  }

  initChipTrayData() {
    this.getChipTrayData();
  }

  initRouteParams() {
    this.route.paramMap.subscribe(params => {
      this.routeParams = params['params'];
    });
  }

  initReqObj() {
    this.tableName = this.chipSecurityService.getTableName();
    const savedFilters = this.chipSecurityService.getTableScannedDataFilters();
    if (!_.isEmpty(savedFilters)) {
      this.reqObj = savedFilters;
      // this.setFilterConfigOptions();
    } else {
      this.reqObj = this.tableService.reqObj;
      this.reqObj.params.start = 1;
      this.reqObj.params.limit = 10;
      this.reqObj.params.sortField = 'scanDtm';
      this.reqObj.params.sortOrder = 'desc';
      this.reqObj.params.topologyType = 'TABLE';
      const tableId = this.chipSecurityService.getTableId();
      if (tableId) {
        this.reqObj.params.topologyId = tableId;
      } else {
        this.logger.debug('topologyId is missing.');
      }
    }
  }

  setFilterConfigOptions() {
    this.tableService.filterConfigOptions.map((filter) => {
      if (filter.column && this.reqObj['params'][filter.column] && filter.selectedOptions.length === 0) {
        filter.selectedOptions.push(this.reqObj['params'][filter.column]);
      }
    });
  }

  initTableHeaders() {
    this.tableHeaders = [
      {
        title: 'chbox',
        type: 'checkbox',
        row: '',
        sortable: false,
        isBulkDisable: true
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.CHIPTRAY.COLHEADERS.SCAN_TYPE',
        type: 'text',
        row: 'scanType',
        sortable: false
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.GAMING_DAY',
        type: 'date',
        row: 'gamingDay',
        sortable: false
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.DATE_TIME',
        type: 'dateTime',
        row: 'scanDtm',
        sortable: false,
        sortFirst: true,
        defaultSortOrder: 'desc'
      },
      {
        title: 'application.app.common.labels.SUPERVISOR',
        type: 'text_no_translation',
        row: 'supervisorName',
        employeeId: 'supervisorEmployeeCode',
        sortable: false
      },
      {
        title: 'application.app.common.labels.DEALER',
        type: 'text_no_translation',
        row: 'dealerName',
        employeeId: 'dealerEmployeeCode',
        sortable: false
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.CHIPTRAY.COLHEADERS.ACTUAL_VALUE',
        type: 'number',
        row: 'actualDailyBalance',
        sortable: false
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.CHIPTRAY.COLHEADERS.EXPECTED_VALUE',
        type: 'number',
        row: 'expectedDailyBalance',
        sortable: false
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.CHIPTRAY.COLHEADERS.NEW_VARIANCE',
        type: 'number-positive-to-negative',
        row: 'varianceAmount',
        sortable: false
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.CHIPTRAY.COLHEADERS.CARRYOVER_VARIANCE',
        type: 'number-positive-to-negative',
        row: 'carryoverAmount',
        sortable: false
      }
    ];
  }

  initFilterConfigOptions() {
    this.filterConfigOption = [
      {
        title: 'Gaming Day',
        column: 'gamingDay',
        options: [],
        selectedOptions: [],
        searchOption: true
      },
      {
        title: 'From Time',
        column: 'minStartTime',
        options: [],
        selectedOptions: [],
        type: 'from-time',
        searchOption: true
      },
      {
        title: 'To Time',
        column: 'maxStartTime',
        options: [],
        selectedOptions: [],
        type: 'to-time',
        searchOption: true
      }
    ];
    this.tableService.filterConfigOptions = this.filterConfigOption;
  }

  getChipTrayData() {
    this.chipSecurityService.getScanDetailData(this.reqObj).subscribe(res => {
      this.chipTrayScanData = res.body['chipTrayScanDataList'];
      this.chipTrayScanData.map((item) => {
        if (item.scanType !== null) {
          item.title = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN' + ' #number# : ' + 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN_TYPES.' + item.scanType + ' ' + 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN';
          item.scanType = this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN_TYPES.' + item.scanType);
        }
      });
      this.filterConfigOption[0].options = res.body['missingChipsScanFilter'].gamingDay;
      this.gamingDaysNum = ( this.filterConfigOption[0].options && this.filterConfigOption[0].options.length );
      if (res && res.body && _.has(res.body, 'totalNoOfRecords')) {
        this.totalRecords = res.body['totalNoOfRecords'];
      } else {
        this.totalRecords = Number(res.headers.get('TotalRecords'));
      }
      this.loaded = true;
    });
  }

  updateChangedFilters(obj): void {
    if (obj && obj['gamingDay']) {
      this.gamingDaysNum = ( obj['gamingDay'].length !== 0 ? obj['gamingDay'].length : undefined );
    }
  }

  getTranslatedNumOFGamingDay() {

    if (( this.gamingDaysNum === undefined) && this.filterConfigOption[0].options) {
      this.gamingDaysNum = this.filterConfigOption[0].options.length;
    }
    return this.translate
      .instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARISON.SCAN_DATA_GENERIC_DAYS').replace('%s', this.gamingDaysNum);
  }

  updateFilter(obj): void {
    this.tableService.updateFilter(obj);
    this.filterConfigOption = JSON.parse(JSON.stringify(this.tableService.filterConfigOptions));
    this.reqObj.params.start = 1;
    this.reqObj.params.limit = 10;
    this.reqObj.params.sortField = 'scanDtm';
    this.reqObj.params.sortOrder = 'desc';
    this.reqObj.params.topologyType = 'TABLE';
    this.reqObj.params.topologyId = this.chipSecurityService.getTableId();
    if (this.reqObj.params.gamingDay) {
      this.reqObj.params.gamingDay = this.chipSecurityService.transformMultipleDateStr(this.reqObj.params.gamingDay, ',', 'yyyy-MM-dd');
    }
    this.getChipTrayData();
    this.resetSelectionData();
  }


  clearFilter(): void {
    this.getChipTrayData();
  }

  resetSelectionData() {
    this.chipTrayScanData.map(function (a) {
      a['isDisable'] = false;
      delete a['index'];
    });
    this.selectedRows = [];
  }

  updatePagination(paginationObj): void {
    const classList = ( event && event.currentTarget && event.currentTarget['classList'] );
    if (classList && classList.contains('table-filters__filter-button')) {
      return;
    } else {
      Object.assign(this.reqObj.params, paginationObj);
      this.compStart = paginationObj.start;
      this.compCurrentPage = paginationObj.currentPage;
      this.compLimit = paginationObj.limit;
      this.resetSelectionData();
      this.getChipTrayData();
    }
  }

  //  Allow only at max {3} check-box selection and freeze on further selection of the checkbox.
  updateCheckedStatus(node) {
    if (!_.isEmpty(node) && _.has(node, 'isDisable') && node['isDisable'] === true) {
      node.checked = false;
      // Throw alert-box
      this.matDialog.open(AlertBoxComponent, {
        width: dialogSize.xsmall || '30vw',
        /*height: '15vw',*/
        data: {
          statusType: status,
          dialogType: 'Alert',
          buttonText: 'application.app.common.labels.OK',
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARE_SCANS',
          message: 'application.app.CASINO_MGR_LABELS.MESSAGE.MIN_MAX_COMP_SCANS'
        }
      });
      return;
    }
    if (!_.isEmpty(node) && _.has(node, 'index')) {
      const data = this.selectedRows.find(ob => ob === node.index);
      if (data === undefined) {
        this.selectedRows.push(node.index);
      } else {
        _.remove(this.selectedRows, x => x === node.index);
      }
      if (this.selectedRows.length >= 3) {
        // Disable unselected Rows.
        for (let i = 0; i < this.chipTrayScanData.length; i++) {
          if (this.selectedRows.indexOf(this.chipTrayScanData[i]['index']) === -1) {
            this.chipTrayScanData[i]['isDisable'] = true;
          }
        }
      } else {
        this.chipTrayScanData.map(function (a) {
          if (a['isDisable']) {
            delete a['isDisable'];
          }
        });
      }
    }
  }

  // Show prompt if checked are not consecutive check-boxes on update button click
  // and only either 2 or 3 Records to compare {A minimum of 2 and maximum of 3 scans can be compared}.
  compareButtonClick() {
    if (_.isEmpty(this.selectedRows) || this.selectedRows.length < 2) {
      this.matDialog.open(AlertBoxComponent, {
        width: dialogSize.xsmall || '30vw',
        data: {
          statusType: status,
          dialogType: 'Alert',
          buttonText: 'application.app.common.labels.OK',
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARE_SCANS',
          message: 'application.app.CASINO_MGR_LABELS.MESSAGE.MIN_COMP_SCANS'
        }
      });
    } else if (this.selectedRows.length > 3) {
      this.matDialog.open(AlertBoxComponent, {
        width: dialogSize.xsmall || '30vw',
        height: '15vw',
        data: {
          statusType: status,
          dialogType: 'Alert',
          buttonText: 'application.app.common.labels.OK',
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARE_SCANS',
          message: 'application.app.CASINO_MGR_LABELS.MESSAGE.MAX_COMP_SCANS'
        }
      });
    } else {
      const _consecutive = WDTSUtility.areConsecutive(this.selectedRows, this.selectedRows.length);
      if (!_consecutive) {
        this.matDialog.open(AlertBoxComponent, {
          width: dialogSize.xsmall || '30vw',
          data: {
            statusType: status,
            dialogType: 'Alert',
            buttonText: 'application.app.common.labels.OK',
            title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARE_SCANS',
            message: 'application.app.CASINO_MGR_LABELS.MESSAGE.CONSECUTIVE_SCAN'
          }
        });
      } else {
        // Store Scan ids to call api and re-route.
        const selectedChipTrays = {};
        this.chipTrayScanData.filter(function (_row) {
          return ( _row['isDisable'] !== true && _row['checked'] === true );
        }).map(function (record) {
          selectedChipTrays[record['chipTrayScanId']] = record;
        });
        this.chipSecurityService.setChipTrayScans(selectedChipTrays);
        this.chipSecurityService.setTableScannedDataFilters(this.reqObj);
        let currentRoute = this._router.url;
        if (currentRoute.indexOf('?') > -1) {
          currentRoute = this._router.url.split('?')[0];
        }
        const url = currentRoute + '/chipdetail';
        this._router.navigate([url]);
      }
    }
  }

  backClicked() {
    this.resetReqObj();
    const currentRoute = this._router.url;
    const backRoute = WDTSUtility.routeBack(currentRoute, '/compare');
    this._router.navigate([backRoute]);
  }

  ngOnDestroy() {
    this.resetReqObj();
  }

  resetReqObj() {
    this.reqObj = {
      observe: 'response',
      params: {
        start: 1,
        limit: 10
      }
    };
    this.tableService.reqObj = this.reqObj;
  }

}
