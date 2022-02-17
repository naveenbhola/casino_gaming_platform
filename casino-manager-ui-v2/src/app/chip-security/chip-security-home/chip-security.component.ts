import {Component, EventEmitter, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {
  AppTablesService,
  DecodedTokenService,
  dialogSize,
  SortingService,
  TableFiltersInterface,
  TableHeadersInterface,
  TableExpandableRowInterface
} from 'common-ui';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AppService} from '../../app.service';
import {ChipData, ChipSecurityService} from '../../services/chip-security.service';
import {ConfirmationBoxComponent} from '../../common/confirmation-box/confirmation-box.component';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-chip-security',
  templateUrl: './chip-security.component.html',
  styleUrls: ['./chip-security.component.scss']
})
export class ChipSecurityComponent implements OnInit, OnDestroy, AfterViewInit {
  chipData: Array<ChipData> = [];
  totalRecord: number;
  tableHeaders: Array<TableHeadersInterface>;
  filterConfigOption: Array<TableFiltersInterface> = [];
  reqObj;
  languageChanged;
  canChangeStatus = false;
  isPPMaster: boolean;
  filterType = 'missing';
  expandableRowsData: Array<TableExpandableRowInterface>;
  statusChangeButtonEnabled = false;
  selectedChips = {};
  chipsDataWithKeys = {};
  initalTableState;
  chipSecurityTabAccess = false;
  loggedinUserName;
  chipStatusTypes = [];
  defaultActionLabel = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.HYPHEN_ACTION';
  defaultAction = 'select';
  currentActionLabel;
  currentAction;
  currentChipTypeLabel = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_CHIPS';
  chipTypes = [];
  chipSearchFormGroup: FormGroup;
  chipStatusMapping = {};
  loading = 'show';
  dataLoaded = false;
  startInput;
  limitInput;
  currentPageInput;

  constructor(private _router: Router,
              private snackBar: MatSnackBar,
              private matDialog: MatDialog,
              private translate: TranslateService,
              private chipSecurityService: ChipSecurityService,
              private appService: AppService,
              private tableService: AppTablesService,
              private decodedTokenService: DecodedTokenService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.currentAction = this.defaultAction;
    this.currentActionLabel = this.defaultActionLabel;
    this.checkEditPermission();
    this.chipSecurityService.chipStatusChangeResult.subscribe((result) => {
      this.reqObj.params.type = this.filterType;
      this.selectedChips = {};
      this.statusChangeButtonEnabled = false;
      this.currentAction = this.defaultAction;
      this.currentActionLabel = this.defaultActionLabel;
      const res = this.formatData(result);
      if (res === 'error') {
        this.getChipData();
      }
    });

    this.chipSecurityService.loading.subscribe((value) => {
      this.loading = value;
    });
    this.initFilterOptions();
    this.initChipTypes();
    this.initChipStatusTypes();
    this.initChipStatusMapping();
    this.initReqObj();
    this.initSearchForm();
    this.initTableExpandableRowsData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getChipData();
      this.initTableHeaders();
    }, 10);
  }

  checkEditPermission() {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    this.loggedinUserName = jwtToken.lastName + ', ' + jwtToken.firstName + ' (' + jwtToken.employeeId + ')';
    this.isPPMaster = jwtToken.superuser;
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
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_CHIPS',
        'type': 'missing'
      },
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_CHIPS',
        'type': 'suspect'
      },
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.UNEXPECTED_CHIPS',
        'type': 'weak'
      }
    ];
  }

  initChipStatusTypes() {
    this.chipStatusTypes = [
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.HYPHEN_ACTION',
        'action': 'select',
        'className': 'chip-security-action-status--select'
      },
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.NOT_PLAYABLE',
        'action': 'NOT_PLAYABLE',
        'className': 'chip-security-action-status--not-playable'
      },
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.CAGE_EXCHANGE',
        'action': 'CAGE_EXCHANGE',
        'className': 'chip-security-action-status--cage-exchange'
      },
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.STOLEN',
        'action': 'STOLEN',
        'className': 'chip-security-action-status--stolen'
      },
      {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.VALID',
        'action': 'VALID',
        'className': 'chip-security-action-status--valid'
      }
    ];
  }

  initChipStatusMapping() {
    this.chipStatusMapping = {
      'NOT_PLAYABLE': {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.NOT_PLAYABLE'
      },
      'CAGE_EXCHANGE': {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.CAGE_EXCHANGE'
      },
      'STOLEN': {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.STOLEN'
      },
      'Valid': {
        'name': 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.VALID'
      }
    };
  }

  setChipsTypeLabel() {
    if (this.filterType === 'missing') {
      this.currentChipTypeLabel = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_CHIPS';
    } else if (this.filterType === 'suspect') {
      this.currentChipTypeLabel = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_CHIPS';
    } else if (this.filterType === 'weak') {
      this.currentChipTypeLabel = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.UNEXPECTED_CHIPS';
    }
  }

  initReqObj() {
    this.reqObj = this.tableService.reqObj;
    this.initalTableState = this.tableService.reqObj;
    this.reqObj.params.reqFilter = 1;
    this.reqObj.params.start = 1;
    this.reqObj.params.limit = 10;
    this.reqObj.params.sortField = 'createDtm';
    this.reqObj.params.sortOrder = 'desc';
    this.reqObj.params.type = this.filterType;
  }

  initFilterOptions() {
    if (this.filterType === 'missing') {
      this.filterConfigOption = [
        {
          title: 'application.app.common.labels.CHIP_SET',
          column: 'chipSet',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.common.labels.DENOMINATION',
          column: 'denom',
          options: [],
          selectedOptions: [],
          searchOption: true,
          type: 'number'
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_EVENT',
          column: 'missingEvent',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_DATE_TIME',
          column: '',
          options: [],
          selectedOptions: [],
          type: 'date',
          searchOption: true
        },
        {
          title: 'application.app.common.labels.SUPERVISOR',
          column: 'supervisor',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.common.labels.DEALER',
          column: 'dealer',
          options: [],
          selectedOptions: [],
          searchOption: true
        }
      ];
    } else if (this.filterType === 'suspect') {
      this.filterConfigOption = [
        {
          title: 'application.app.common.labels.CHIP_SET',
          column: 'chipSet',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.common.labels.DENOMINATION',
          column: 'denom',
          options: [],
          selectedOptions: [],
          searchOption: true,
          type: 'number'
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_DATE_TIME',
          column: '',
          options: [],
          selectedOptions: [],
          type: 'date',
          searchOption: true
        },
        {
          title: 'application.app.common.labels.SUPERVISOR',
          column: 'supervisor',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.common.labels.DEALER',
          column: 'dealer',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_ACTION_CODE',
          column: 'suspectType',
          options: [],
          selectedOptions: [],
          searchOption: true,
          translatePath: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY'
        }
      ];
    } else if (this.filterType === 'weak') {
      this.filterConfigOption = [
        {
          title: 'application.app.common.labels.CHIP_SET',
          column: 'chipSet',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.common.labels.DENOMINATION',
          column: 'denom',
          options: [],
          selectedOptions: [],
          searchOption: true,
          type: 'number'
        },
        {
          title: 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY',
          column: 'currencyLabel',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.LOCATION',
          column: 'topologyName',
          options: [],
          selectedOptions: [],
          searchOption: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.DATE_TIME',
          column: '',
          options: [],
          selectedOptions: [],
          type: 'date',
          searchOption: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_ACTION_CODE',
          column: 'suspectType',
          options: [],
          selectedOptions: [],
          searchOption: true,
          translatePath: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY'
        }
      ];

    }

    this.tableService.filterConfigOptions = this.filterConfigOption;
  }

  initTableHeaders() {
    if (this.filterType === 'missing') {
      this.tableHeaders = [
        {
          title: 'chbox',
          type: 'checkbox',
          row: '',
          sortable: false
        },
        {
          title: 'application.app.common.labels.CHIP_SET',
          type: 'text',
          row: 'chipsetLabel',
          sortable: true
        },
        {
          title: 'CHIP_ID',
          type: 'text',
          row: 'chipId',
          sortable: false
        },
        {
          title: 'application.app.common.labels.DENOMINATION',
          type: 'number',
          row: 'denom',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_FROM',
          type: 'text',
          row: 'topologyName',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_EVENT',
          type: 'text',
          row: 'missingEvent',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN_TYPE',
          type: 'text',
          row: 'scanTypeInTable',
          sortable: false,
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_DATE_TIME',
          type: 'dateTime',
          row: 'createDtm',
          sortable: true,
          sortOrder: 'desc',
          sortFirst: true
        },
        {
          title: 'application.app.common.labels.SUPERVISOR',
          type: 'text',
          row: 'supervisor',
          sortable: true
        },
        {
          title: 'application.app.common.labels.DEALER',
          type: 'text',
          row: 'dealer',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.ACTION',
          type: 'chip-security-status',
          row: 'action',
          sortable: false
        }
      ];

    } else if (this.filterType === 'suspect') {

      this.tableHeaders = [
        {
          title: 'chbox',
          type: 'checkbox',
          row: '',
          sortable: false
        },
        {
          title: 'application.app.common.labels.CHIP_SET',
          type: 'text',
          row: 'chipsetLabel',
          sortable: true
        },
        {
          title: 'CHIP_ID',
          type: 'text',
          row: 'chipId',
          sortable: false
        },
        {
          title: 'application.app.common.labels.DENOMINATION',
          type: 'number',
          row: 'denom',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_ACTION_CODE',
          type: 'text',
          row: 'suspectTypeInTable',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN_TYPE',
          type: 'text',
          row: 'scanTypeInTable',
          sortable: false,
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_DATE_TIME',
          type: 'dateTime',
          row: 'createDtm',
          sortable: true,
          sortFirst: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.ACTION',
          type: 'chip-security-status',
          row: 'action',
          dependentField: 'suspectTypeInDB',
          sortable: false
        }
      ];

    } else if (this.filterType === 'weak') {

      this.tableHeaders = [
        {
          title: 'chbox',
          type: 'checkbox',
          row: '',
          sortable: false
        },
        {
          title: 'application.app.common.labels.CHIP_SET',
          type: 'text',
          row: 'chipsetLabel',
          sortable: true
        },
        {
          title: 'CHIP_ID',
          type: 'text',
          row: 'chipId',
          sortable: false
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
          row: 'currencyLabel',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.LOCATION',
          type: 'text',
          row: 'topologyName',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.DATE_TIME',
          type: 'dateTime',
          row: 'createDtm',
          sortable: true,
          sortFirst: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_ACTION_CODE',
          type: 'text',
          row: 'suspectTypeInTable',
          sortable: true
        },
        {
          title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.ACTION',
          type: 'chip-security-status',
          row: 'action',
          dependentField: 'suspectTypeInDB',
          sortable: false
        }
      ];

    }
  }

  initTableExpandableRowsData() {

    if (this.filterType === 'missing') {

      this.expandableRowsData = [
        {
          'title': 'application.app.CONFIGURATION_LABELS.CHIPSETS.NEGOTIABILITY',
          'data': 'negotiability',
          'type': 'text'
        },
        {
          'title': 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY',
          'data': 'currencyLabel',
          'type': 'text'
        },
        {
          'title': 'application.app.common.labels.GAMING_DAY',
          'data': 'gamingDay',
          'type': 'date'
        },
      ];

    } else if (this.filterType === 'suspect') {

      this.expandableRowsData = [
        {
          'title': 'application.app.CONFIGURATION_LABELS.CHIPSETS.NEGOTIABILITY',
          'data': 'negotiability',
          'type': 'text'
        },
        {
          'title': 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY',
          'data': 'currencyLabel',
          'type': 'text'
        },
        {
          'title': 'application.app.common.labels.GAMING_DAY',
          'data': 'gamingDay',
          'type': 'date'
        },
        {
          'title': 'application.app.common.labels.SUPERVISOR',
          'data': 'supervisor',
          'type': 'text'
        },
        {
          'title': 'application.app.common.labels.DEALER',
          'data': 'dealer',
          'type': 'text'
        }
      ];
    } else if (this.filterType === 'weak') {
      this.expandableRowsData = [];
    }
  }

  getChipData(): void {
    this.chipSecurityService.getMissingChips(this.reqObj)
      .subscribe((response) => {
        this.formatData(response);
      }, errorMessage => {
        const message = 'application.app.common.httpmessage.500';
        this.snackBar.open(this.translate.instant(message), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
        this.chipData = [];
        this.totalRecord = 0;
        this.loading = 'hide';
      });
  }

  formatData(data) {
    if (data['body'] && data['body']['successObj']) {
      let allResults = [];
      let totalRecords = 0;
      const result = data['body']['successObj'];
      allResults = result.results;
      const allChipsData = [];
      if (allResults.length > 0) {
        let i = 0;
        allResults.map((item) => {

          item.action = this.defaultAction;
          item.index = i;
          item.checked = false;

          const eachRecord = {};
          Object.assign(eachRecord, item);

          item.suspectTypeInDB = item.suspectType;
          if (item.suspectType) {
            if (item.suspectType === null) {
              item.suspectTypeInTable = '-';
            } else {
              item.suspectTypeInTable = this.chipStatusMapping[item.suspectType]['name'];
            }
          }
          if (item.scanType && item.scanType !== null) {
            item.scanTypeInTable = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN_TYPES.' + item.scanType;
          } else {
            item.scanTypeInTable = '-';
          }
          allChipsData[i] = [];
          allChipsData[i] = eachRecord;
          allChipsData[i]['index'] = i;
          i++;
        });

        this.chipsDataWithKeys = allChipsData;

        if (this.filterType === 'missing') {
          this.filterConfigOption[0].options = result.filters.chipSet;
          this.filterConfigOption[1].options = result.filters.denom;
          this.filterConfigOption[2].options = result.filters.missingEvent;
          this.filterConfigOption[4].options = result.filters.supervisor;
          this.filterConfigOption[5].options = result.filters.dealer;
        } else if (this.filterType === 'suspect') {
          this.filterConfigOption[0].options = result.filters.chipSet;
          this.filterConfigOption[1].options = result.filters.denom;
          this.filterConfigOption[3].options = result.filters.supervisor;
          this.filterConfigOption[4].options = result.filters.dealer;
          this.filterConfigOption[5].options = result.filters.suspectType;
        } else if (this.filterType === 'weak') {
          this.filterConfigOption[0].options = result.filters.chipSet;
          this.filterConfigOption[1].options = result.filters.denom;
          this.filterConfigOption[2].options = result.filters.currencyLabel;
          this.filterConfigOption[3].options = result.filters.topologyName;
          this.filterConfigOption[5].options = result.filters.suspectType;
        }
        this.filterConfigOption = JSON.parse(JSON.stringify(this.filterConfigOption));
      }

      if (data['headers']) {
        totalRecords = parseInt(data['headers'].get('TotalRecords'), 10);
      } else {
        totalRecords = allResults.length;
      }
      this.chipData = allResults;
      this.totalRecord = totalRecords;
      this.loading = 'hide';
      this.dataLoaded = true;
      return 'success';
    } else if (data['body'] && data['body']['errors']) {
      const message = 'application.app.common.httpmessage.500';
      this.snackBar.open(this.translate.instant(message), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__warn'
      });
      this.chipData = [];
      this.totalRecord = 0;
      this.loading = 'hide';
      this.dataLoaded = true;
      return 'error';
    } else if (!data['body']) {

      this.chipData = [];
      this.totalRecord = 0;
      this.loading = 'hide';

      return 'error';
    }
  }

  updateChipData(chipsType = this.filterType, refreshData = false, searchData = false): void {

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
      this.initTableHeaders();
      this.setChipsTypeLabel();
      this.initReqObj();
      this.initTableExpandableRowsData();
    } else {
      this.filterType = chipsType;
    }

    this.reqObj.params.type = chipsType;
    this.selectedChips = {};
    this.statusChangeButtonEnabled = false;
    this.currentAction = this.defaultAction;
    this.currentActionLabel = this.defaultActionLabel;

    this.getChipData();
  }

  changeStatusFromTop(obj) {
    const suspectType = obj.action;
    const name = obj.name;

    for (const index in this.selectedChips) {
      if (this.selectedChips.hasOwnProperty(index)) {

        this.selectedChips[index] = this.chipSecurityService.handleStatusSuspectTypeCombo(this.selectedChips[index], suspectType, this.loggedinUserName, this.filterType);
        this.selectedChips[index]['action'] = suspectType;
        this.chipData[index]['action'] = suspectType;

      }
    }
    this.currentAction = suspectType;
    this.currentActionLabel = name;
  }

  submitStatus() {

    const postData = [];
    for (const index in this.selectedChips) {
      if (this.selectedChips.hasOwnProperty(index)) {
        const allData = {};
        Object.assign(allData, this.selectedChips[index]);
        if (allData['action'] !== this.defaultAction) {
          delete allData['alertSeverity'];
          delete allData['checked'];
          delete allData['index'];
          delete allData['action'];
          postData.push(allData);
        }
      }
    }

    if (this.canChangeStatus && postData.length > 0) {
      let dialogBoxData = {};

      dialogBoxData = {
        postData: {'chipMissingDetailList': postData},
        dialogType: 'chip-security-status',
        message: 'application.app.CASINO_MGR_LABELS.MESSAGE.CHANGE_STATUS_MESSAGE',
        title: 'Status Change',
        urlParams: this.reqObj
      };
      const dialogRef = this.matDialog.open(ConfirmationBoxComponent, {
        width: dialogSize.xsmall,
        data: dialogBoxData
      });
    } else {
      let translateMsg;
      if (!this.canChangeStatus) {
        translateMsg = this.translate.instant('application.app.CASINO_MGR_LABELS.MESSAGE.NO_PERMISSION');
      } else if (postData.length === 0) {
        translateMsg = this.translate.instant('application.app.CASINO_MGR_LABELS.MESSAGE.NO_ACTION_TAKEN');
      }
      this.snackBar.open(translateMsg, '', {
        duration: 3000,
        panelClass: 'snack__warn'
      });
    }
  }

  updateEventObj(node) {
    switch (node.type) {
      case 'row-click':
        return;
        break;
      default:
        node.obj.action = node.type;
        node.obj.checked = true;

        const index = node.obj.index;
        this.selectedChips[index] = {};
        Object.assign(this.selectedChips[index], this.chipsDataWithKeys[index]);
        this.selectedChips[index] = this.chipSecurityService.handleStatusSuspectTypeCombo(this.selectedChips[index], node.type, this.loggedinUserName, this.filterType);
        this.selectedChips[index]['action'] = node.obj.action;

        this.statusChangeButtonEnabled = true;

        this.currentAction = this.defaultAction;
        this.currentActionLabel = this.defaultActionLabel;
        break;
    }
  }

  updateCheckedStatus(node) {
    if (!_.isEmpty(node)) {
      const index = node['index'];
      if (node['checked']) {
        this.selectedChips[index] = {};
        Object.assign(this.selectedChips[index], this.chipsDataWithKeys[index]);
        this.chipData[index]['action'] = this.currentAction;
        this.selectedChips[index]['action'] = this.currentAction;
      } else {
        node.action = this.defaultAction;
        delete this.selectedChips[index];
      }

      if (Object.keys(this.selectedChips).length > 0) {
        this.statusChangeButtonEnabled = true;
      } else {
        this.statusChangeButtonEnabled = false;
        this.currentAction = this.defaultAction;
        this.currentActionLabel = this.defaultActionLabel;
      }
    }
  }

  updateAllCheckedStatus(isChecked) {
    if (isChecked === true) {
      this.statusChangeButtonEnabled = true;
      for (const index in this.chipsDataWithKeys) {
        if (this.chipsDataWithKeys.hasOwnProperty(index) && !this.selectedChips.hasOwnProperty(index)) {
          this.selectedChips[index] = this.chipsDataWithKeys[index];
        }
      }

    } else {

      for (const index in this.selectedChips) {
        if (this.selectedChips.hasOwnProperty(index)) {
          this.chipData[index]['action'] = this.defaultAction;
        }
      }
      this.selectedChips = {};
      this.currentAction = this.defaultAction;
      this.currentActionLabel = this.defaultActionLabel;
      this.statusChangeButtonEnabled = false;
    }
  }

  updateFilter(obj): void {
    this.tableService.updateFilter(obj);
    this.filterConfigOption = JSON.parse(JSON.stringify(this.tableService.filterConfigOptions));
    this.reqObj.params.start = 1;
    this.reqObj.params.limit = 10;
    this.updateChipData();
  }

  sortData(sort) {
    if (sort.direction.trim().length) {
      switch (sort.active) {
        case 'application.app.common.labels.CHIP_SET':
          this.reqObj.params['sortField'] = 'chipsetLabel';
          break;
        case 'application.app.common.labels.DENOMINATION':
          this.reqObj.params['sortField'] = 'denom';
          break;
        case 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_FROM':
          this.reqObj.params['sortField'] = 'topologyName';
          break;
        case 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_EVENT':
          this.reqObj.params['sortField'] = 'missingEvent';
          break;
        case 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.MISSING_DATE_TIME':
          this.reqObj.params['sortField'] = 'createDtm';
          break;
        case 'application.app.common.labels.SUPERVISOR':
          this.reqObj.params['sortField'] = 'supervisor';
          break;
        case 'application.app.common.labels.DEALER':
          this.reqObj.params['sortField'] = 'dealer';
          break;
        case 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_DATE_TIME':
          this.reqObj.params['sortField'] = 'createDtm';
          break;
        case 'application.app.CONFIGURATION_LABELS.CHIPSETS.CURRENCY':
          this.reqObj.params['sortField'] = 'currencyLabel';
          break;
        case 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.LOCATION':
          this.reqObj.params['sortField'] = 'topologyName';
          break;
        case 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.DATE_TIME':
          this.reqObj.params['sortField'] = 'createDtm';
          break;
        case 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SUSPECT_ACTION_CODE':
          this.reqObj.params['sortField'] = 'suspectType';
          break;
      }
      this.reqObj.params['sortOrder'] = sort.direction;
    } else {
      delete this.reqObj.params.sortOrder;
      delete this.reqObj.params.sortField;
    }
    this.updateChipData();
  }

  updatePagination(paginationObj) {
    this.startInput = paginationObj.start;
    this.limitInput = paginationObj.limit;
    this.currentPageInput = paginationObj.currentPageInput;
    Object.assign(this.reqObj.params, paginationObj);
    this.updateChipData();
  }

  navigateTocompareScreen() {
    let currentRoute = this._router.url;
    if (currentRoute.indexOf('?') > -1) {
      currentRoute = this._router.url.split('?')[0];
    }
    const url = currentRoute + '/comparescans';
    this._router.navigate([url]);
  }

  initSearchForm() {
    this.chipSearchFormGroup = this._formBuilder.group({
      searchChip: ['', Validators.minLength(1)]
    });
  }

  searchChip() {
    if (this.chipSearchFormGroup.value.searchChip !== '' && this.chipSearchFormGroup.value.searchChip.trim()) {
      this.updateChipData(this.filterType, true, true);
    }
  }

  clearSearchData(): void {
    this.updateChipData(this.filterType, true);
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
  }

  trackByIndex(index: number): number {
    return index;
  }

}
