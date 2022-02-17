import {Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {
  DecodedTokenService,
  AppTablesService,
  TableFiltersInterface,
  dialogSize
} from 'common-ui';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {WDTSUtility} from '../../utils/wdts-utils';
import {AngularCsv} from 'angular7-csv/dist/Angular-csv';
import {ConfirmationBoxComponent} from '../../common/confirmation-box/confirmation-box.component';
import {ChipSecurityService} from '../../services/chip-security.service';
import * as _ from 'lodash';
import {NGXLogger} from 'ngx-logger';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-chip-details',
  templateUrl: './chip-details.component.html',
  styleUrls: ['./chip-details.component.scss']
})
export class ChipDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  chipSetData: Array<any>;
  totalRecord: number;
  tableHeaders: Array<any>;
  filterConfigOption: Array<TableFiltersInterface> = [];
  reqObj;
  chipSearchFormGroup: FormGroup;
  languageChanged;
  chipTrayScans;
  chipTrayScanIds;
  scanIds;
  isPPMaster: boolean;
  loggedinUserName;
  userNameForCSV;
  filterType = 'suspect';
  loading = 'show';
  chipSecurityTabAccess = false;
  canChangeStatus = false;
  chipTypes = [];
  chipStart;
  chipLimit;
  chipCurrentPage;

  constructor(private logger: NGXLogger,
              private _router: Router,
              private _route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private translate: TranslateService,
              private _formBuilder: FormBuilder,
              private appService: AppService,
              private tableService: AppTablesService,
              private decodedTokenService: DecodedTokenService,
              private chipSecurityService: ChipSecurityService,
              public datepipe: DatePipe) {
  }

  updateChipSetData(chipsType = this.filterType, refreshData = false, searchData = false) {
    if (chipsType !== this.filterType || refreshData) {
      this.reqObj.params = {};
      if (!searchData) {
        this.chipSearchFormGroup.setValue({
          searchChip: ''
        });
      } else {
        this.reqObj.params.chipId = this.chipSearchFormGroup.value.searchChip;
      }
      this.filterType = chipsType;
      this.initFilterOptions();
      this.initReqObj();
    } else {
      const tableId = this.chipSecurityService.getTableId();
      if (tableId) {
        this.reqObj.params.topologyId = tableId;
      } else {
        this.logger.debug('topologyId is missing.');
      }
      this.reqObj.params.chipTrayScanIds = this.chipTrayScanIds;
      this.reqObj.params.compareType = this.filterType;
    }
    this.getChipSetData();
  }

  getChipTrayScans() {
    this.chipTrayScans = this.chipSecurityService.getChipTrayScans();
    if (this.chipTrayScans) {
      const scansIds = [];
      let i = 0;

      Object.keys(this.chipTrayScans).forEach((key, index) => {
        scansIds[i] = key;
        this.chipTrayScans[key]['scanTime'] = new Date(this.chipTrayScans[key]['scanDtm']).toTimeString().split(' ')[0];
        i++;
      })

      this.scanIds = scansIds.sort();
      this.chipTrayScanIds = this.scanIds.toString();
    }
  }

  ngOnInit() {
    this.chipSecurityService.chipStatusChangeScanResultPage.subscribe((result) => {
      const tableId = this.chipSecurityService.getTableId();
      if (tableId) {
        this.reqObj.params.topologyId = tableId;
      } else {
        this.logger.debug('topologyId is missing.');
      }
      this.reqObj.params.chipTrayScanIds = this.chipTrayScanIds;
      this.reqObj.params.compareType = this.filterType;
      const res = this.formatData(result);
      if (res === 'error') {
        this.getChipSetData();
      }
    });
    this.chipSecurityService.loading.subscribe((value) => {
      this.loading = value;
    });
    this.checkActionPermission();
    this.initChipTypes();
    this.getChipTrayScans();
    this.initReqObj();
    this.initFilterOptions();
    this.initSearchForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getChipSetData();
      this.initTableHeaders();
    }, 0);
  }

  checkActionPermission() {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    this.isPPMaster = jwtToken.superuser;
    this.loggedinUserName = jwtToken.lastName + ', ' + jwtToken.firstName + ' (' + jwtToken.employeeId + ')';
    this.userNameForCSV = jwtToken.firstName + ' ' + jwtToken.lastName + ' (' + jwtToken.employeeId + ')';

    if (jwtToken) {
      const appIndx = jwtToken.authorities.findIndex(app => app.applicationCode === 'CASINO_MGR');
      if (jwtToken.authorities[appIndx].permissions.indexOf('CHIP_SECURITY_MANAGE') !== -1 || jwtToken.authorities[appIndx].permissions.indexOf('CHIP_SECURITY_VIEW') !== -1 || jwtToken.superuser) {
        this.chipSecurityTabAccess = true;
      }
      if (jwtToken.authorities[appIndx].permissions.indexOf('CHIP_SECURITY_MANAGE') !== -1 || jwtToken.superuser) {
        this.canChangeStatus = true;
      }
    }
  }

  initChipTypes() {
    this.chipTypes = [
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_CHIPS',
        'type': 'suspect'
      },
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.ALL_CHIPS',
        'type': 'all'
      }
    ];
  }

  initReqObj() {
    this.reqObj = this.tableService.reqObj;
    this.reqObj.params.start = 1;
    this.reqObj.params.limit = 10;
    this.reqObj.params.chipTrayScanIds = this.chipTrayScanIds;

    if (this.filterType === 'suspect') {
      this.reqObj.params.sortField = 'chipId';
      this.reqObj.params.sortOrder = 'desc';
    }
    const tableId = this.chipSecurityService.getTableId();
    if (tableId) {
      this.reqObj.params.topologyId = tableId;
    } else {
      this.logger.debug('topologyId is missing.');
    }
    if (this.filterType) {
      this.reqObj.params.compareType = this.filterType;
    }
  }

  initFilterOptions() {
    this.filterConfigOption = [
      {
        title: 'application.app.common.labels.CHIP_SET',
        column: 'chipSetLabels',
        options: [],
        selectedOptions: [],
        searchOption: true
      },
      {
        title: 'application.app.common.labels.DENOMINATIONS',
        column: 'denoms',
        options: [],
        selectedOptions: [],
        searchOption: true
      },
      {
        title: 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY',
        column: 'currencies',
        options: [],
        selectedOptions: [],
        searchOption: true
      }
    ];
    if (this.scanIds) {
      for (let i = 0; i < this.scanIds.length; i++) {
        const temp = {
          title: this.chipTrayScans[this.scanIds[i]]['title'].replace('#number#', i + 1) + ' (' + this.chipTrayScans[this.scanIds[i]]['scanTime'] + ')',
          column: 'scan' + (i + 1) + 'Filter',
          options: [],
          selectedOptions: [],
          searchOption: true
        };
        this.filterConfigOption.push(temp);
      }
    }
    this.tableService.filterConfigOptions = this.filterConfigOption;
  }

  initTableHeaders() {
    this.tableHeaders = [
      {
        title: 'application.app.CONFIGURATION_LABELS.CHIPSETS.CHIPSET_ID',
        type: 'number',
        row: 'chipId',
        sortable: true
      },
      {
        title: 'application.app.common.labels.CHIP_SET',
        type: 'number',
        row: 'chipsetLabel',
        sortable: true
      },
      {
        title: 'application.app.common.labels.DENOMINATION',
        type: 'number',
        row: 'denom',
        sortable: true
      },
      {
        title: 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY',
        type: 'text',
        row: 'currency',
        sortable: true
      }
    ];

    if (this.scanIds) {
      for (let i = 0; i < this.scanIds.length; i++) {
        const temp = {
          title: this.chipTrayScans[this.scanIds[i]]['title'].replace('#number#', i + 1) + ' (' + this.chipTrayScans[this.scanIds[i]]['scanTime'] + ')',
          row: 'scan' + (i + 1),
          type: 'true-false-tick-cross',
          options: [],
          selectedOptions: [],
          searchOption: true
        };
        this.tableHeaders.push(temp);
      }
    }
    const actions = {
      title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.ACTION',
      type: 'chip-security-status',
      row: 'suspectType',
      sortable: false
      /*,isDisable: !this.canChangeStatus*/
    };
    this.tableHeaders.push(actions);

  }

  initSearchForm() {
    this.chipSearchFormGroup = this._formBuilder.group({
      searchChip: ['', Validators.minLength(1)]
    });
  }

  searchChip() {
    if (this.chipSearchFormGroup.value.searchChip !== '' && this.chipSearchFormGroup.value.searchChip.trim()) {
      this.updateChipSetData(this.filterType, true, true);
    }
  }

  clearSearch(): void {
    this.updateChipSetData(this.filterType, true);
  }

  downloadCSV(): void {

    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: '',
      useBom: true,
      noDownload: false,
      headers: {},
    };

    const tableHeaders = ['application.app.CONFIGURATION_LABELS.CHIPSETS.CHIPSET_ID', 'application.app.common.labels.CHIP_SET', 'application.app.common.labels.DENOMINATION', 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY'];
    csvOptions.title = this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARISON.SCANS_COMPARISON') + '\n\n' + this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARISON.USER') + ':, ' + this.userNameForCSV + '\n';

    const gamingDays = [];
    const map = new Map();

    if (this.scanIds) {
      for (let i = 0; i < this.scanIds.length; i++) {

        const title = this.chipTrayScans[this.scanIds[i]]['title'].replace('#number#', i + 1) + ' (' + this.chipTrayScans[this.scanIds[i]]['scanTime'] + ')';

        tableHeaders.push(title);

        const gamingDay = this.datepipe.transform(this.chipTrayScans[this.scanIds[i]]['gamingDay'], 'dd-MMM');
        if (!map.has(gamingDay)) {
          map.set(gamingDay, true);
          gamingDays.push(gamingDay);
        }
      }
    }

    if (gamingDays.length > 0) {
      gamingDays.sort();
      csvOptions.title += this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARISON.GAMING_DAYS') + ':, ' + gamingDays.join('; ');
    }

    tableHeaders.push('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_ACTION_CODE');
    csvOptions.headers = tableHeaders.map(title => this.translate.instant(title));

    const scanLen = this.chipTrayScanIds.split(',').length;
    const fileName = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.COMPARISON.CHIP_DETAILS';

    const chipStatusMapping = {
      'NOT_PLAYABLE': this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.NOT_PLAYABLE'),
      'CAGE_EXCHANGE': this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.CAGE_EXCHANGE'),
      'STOLEN': this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.STOLEN'),
      'VALID': this.translate.instant('application.app.CASINO_MGR_LABELS.CHIP_SECURITY.VALID'),
    };
    const _items = this.chipSetData.map(function (item) {
      const scanList = [item.scan1, item.scan2];
      if (scanLen === 3) {
        scanList.push(item.scan3);
      }
      return [item.chipId,
        item.chipsetLabel,
        item.denom,
        item.currency,
        scanList,
        chipStatusMapping[item.suspectType]
      ];
    });
    new AngularCsv(_items, this.translate.instant(fileName), csvOptions);
  }

  updateFilter(obj): void {
    this.tableService.updateFilter(obj);
    this.filterConfigOption = JSON.parse(JSON.stringify(this.tableService.filterConfigOptions));
    this.reqObj.params.start = 1;
    this.reqObj.params.limit = 10;
    this.updateChipSetData();
  }

  sortData(sort) {
    if (sort.direction.trim().length) {
      switch (sort.active) {
        case 'application.app.common.labels.CHIP_SET':
          this.reqObj.params['sortField'] = 'chipsetLabel';
          break;
        case 'application.app.CONFIGURATION_LABELS.CHIPSETS.CHIPSET_ID':
          this.reqObj.params['sortField'] = 'chipId';
          break;
        case 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY':
          this.reqObj.params['sortField'] = 'currency';
          break;
        case 'application.app.common.labels.DENOMINATION':
          this.reqObj.params['sortField'] = 'denoms';
          break;
      }
      this.reqObj.params['sortOrder'] = sort.direction;
    } else {
      delete this.reqObj.params.sortOrder;
      delete this.reqObj.params.sortField;
    }
    this.updateChipSetData();
  }

  updatePagination(paginationObj) {
    this.chipStart = paginationObj.start;
    this.chipLimit = paginationObj.limit;
    this.chipCurrentPage = paginationObj.currentPage;
    Object.assign(this.reqObj.params, paginationObj);
    this.updateChipSetData();
  }

  backClicked() {
    const currentRoute = this._router.url;
    const backRoute = WDTSUtility.routeBack(currentRoute, '/chipdetail');
    this._router.navigate([backRoute]);
  }

  updateEventObj(node) {
    switch (node.type) {
      case 'row-click':
        return;
        break;
      default:
        this.changeStatus(node);
        break;
    }
  }

  changeStatus(NODE) {
    if (!this.canChangeStatus) {
      const translateMsg = this.translate.instant('application.app.CASINO_MGR_LABELS.MESSAGE.NO_PERMISSION');
      this.snackBar.open(translateMsg, '', {
        duration: 3000,
        panelClass: 'snack__warn'
      });
    } else {
      const suspectType = NODE['type'];
      const oldSuspectType = NODE['obj']['suspectType'];
      let postData = {};
      Object.assign(postData, NODE['obj']);
      postData = this.chipSecurityService.handleStatusSuspectTypeCombo(postData, suspectType, this.loggedinUserName, this.filterType);


      let dataForUpdation = {};
      if (oldSuspectType === 'VALID') {
        dataForUpdation = {'chipScanDataList': [postData]};
      } else {
        dataForUpdation = {'chipScanDataList': [postData]};
      }
      const dialogBoxData = {
        postData: dataForUpdation,
        dialogType: 'chip-detail-status-change',
        message: 'application.app.CASINO_MGR_LABELS.MESSAGE.CHANGE_STATUS_MESSAGE',
        title: 'Status Change',
        urlParams: this.reqObj,
      };
      let dialogRef = this.dialog.open(ConfirmationBoxComponent, {
        width: dialogSize.xsmall,
        data: dialogBoxData
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateChipSetData();
        }
        dialogRef = null;
      });
    }

  }

  getChipSetData(): void {
    this.chipSecurityService.getMissingChipDetails(this.reqObj)
      .subscribe((response) => {
        this.formatData(response);
      }, errorMessage => {
        const message = 'application.app.common.httpmessage.500';
        this.snackBar.open(this.translate.instant(message), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        this.chipSetData = [];
        this.totalRecord = 0;
        this.loading = 'hide';
      });
  }

  formatData(result) {
    if (result['body'] && result['body']['successObj']) {
      const response = result['body']['successObj'];
      this.chipSetData = response['results'];
      this.chipSetData.map((item) => {
        if (!item.suspectType) {
          item.suspectType = 'VALID';
        }
      });
      if (result['headers']) {
        this.totalRecord = Number(result['headers'].get('TotalRecords'));
      } else {
        this.totalRecord = this.chipSetData.length;
      }
      if (_.has(response, 'filters')) {
        this.filterConfigOption[0].options = response.filters.chipSetLabels;
        this.filterConfigOption[1].options = response.filters.denoms;
        this.filterConfigOption[2].options = response.filters.currencies;
        if (this.filterConfigOption[3] && _.has(response.filters, 'scan1Filter')) {
          this.filterConfigOption[3].options = response.filters.scan1Filter;
        }
        if (this.filterConfigOption[4] && _.has(response.filters, 'scan2Filter')) {
          this.filterConfigOption[4].options = response.filters.scan2Filter;
        }
        if (this.filterConfigOption[5] && _.has(response.filters, 'scan3Filter')) {
          this.filterConfigOption[5].options = response.filters.scan3Filter;
        }
      }
      this.filterConfigOption = JSON.parse(JSON.stringify(this.filterConfigOption));
      this.loading = 'hide';

      return 'success';
    } else if (result['body'] && result['body']['errors']) {
      const message = 'application.app.common.httpmessage.500';
      this.snackBar.open(this.translate.instant(message), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__warn'
      });
      this.chipSetData = [];
      this.totalRecord = 0;
      this.loading = 'hide';

      return 'error';
    }
  }

  ngOnDestroy() {
    this.reqObj = {
      observe: 'response',
      params: {
        start: 1,
        limit: 10
      }
    };
    this.tableService.reqObj = this.reqObj;
    localStorage.removeItem('chipTrayScanIds');
  }

  trackByIndex(index: number): number {
    return index;
  }
}

