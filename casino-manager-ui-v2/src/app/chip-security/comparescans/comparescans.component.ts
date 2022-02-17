import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {WDTSUtility} from '../../utils/wdts-utils';
import {
  AppTablesService,
  DecodedTokenService,
  SortingService,
} from 'common-ui';
import {AppService} from '../../app.service';
import {ChipSecurityService} from '../../services/chip-security.service';

@Component({
  selector: 'app-comparescans',
  templateUrl: './comparescans.component.html',
  styleUrls: ['./comparescans.component.scss']
})
export class ComparescansComponent implements OnInit, OnDestroy, AfterViewInit {
  reqObj;
  lastScanDetails: Array<any>;
  tableHeaders: Array<any>;
  languageChanged;
  isPPMaster;
  totalRecord: number;
  routeParams;
  chipSecurityTabAccess = false;
  loaded = false;
  inputStart;
  inputLimit;
  inputCurrentPage;

  constructor(private decodedTokenService: DecodedTokenService,
              private _router: Router,
              private route: ActivatedRoute,
              private tableService: AppTablesService,
              private appService: AppService,
              private chipSecurityService: ChipSecurityService) {
  }

  ngOnInit() {
    this.checkEditPermission();
    this.initRouteParams();
    this.initReqObj();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getLastScanDetails();
      this.initTableHeaders();
    }, 0);
  }

  initRouteParams() {
    this.route.paramMap.subscribe(params => {
      this.routeParams = params['params'];
    });
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

  updateEventObj(node) {
    if (node.type === 'row-click') {
      let currentRoute = this._router.url;
      if (currentRoute.indexOf('?') > -1) {
        currentRoute = this._router.url.split('?')[0];
      }
      const url = currentRoute + '/compare';
      this.chipSecurityService.setTableId(node.obj.tableId);
      this.chipSecurityService.setTableName(node.obj.tableName);
      const scanData = {};
      this.chipSecurityService.setTableScannedDataFilters(scanData);
      this._router.navigate([url]);
    }
  }

  initReqObj() {
    this.reqObj = this.tableService.reqObj;
    this.reqObj.params.topologyType = 'PIT';
    this.reqObj.params.topologyId = this.routeParams.pitId;
    this.reqObj.params.start = 1;
    this.reqObj.params.limit = 10;
    this.reqObj.params.sortField = 'scanDtm';
    this.reqObj.params.sortOrder = 'desc';
  }

  initTableHeaders() {
    this.tableHeaders = [
      {
        title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.TABLE',
        type: 'text',
        row: 'tableName',
        sortable: false
      },
      {
        title: 'application.app.TABLE_DASH_LABELS.CHIPTRAY.COLHEADERS.SCAN_TYPE',
        type: 'text',
        row: 'scanType',
        sortable: false
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.DATE_TIME',
        type: 'dateTime',
        row: 'scanDtm',
        sortable: false,
        sortFirst: true,
        defaultSortOrder: 'desc',
        dateFormat: 'HH:mm'
      },
      {
        title: 'application.app.common.labels.SUPERVISOR',
        type: 'text_no_translation',
        row: 'supervisorName',
        sortable: false,
        employeeId: 'supervisorEmployeeCode'
      },
      {
        title: 'application.app.common.labels.DEALER',
        type: 'text_no_translation',
        row: 'dealerName',
        sortable: false,
        employeeId: 'dealerEmployeeCode',
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

  getLastScanDetails(): void {
    this.chipSecurityService.getScanDetailData(this.reqObj).subscribe(res => {
      this.lastScanDetails = res.body['chipTrayScanDataList'];
      this.lastScanDetails.map((item) => {
        if (item.scanType !== null) {
          item.scanType = 'application.app.CASINO_MGR_LABELS.CHIP_SECURITY.SCAN_TYPES.' + item.scanType;
        }
      });
      this.totalRecord = parseInt(res.headers.get('TotalRecords'), 10);
      this.loaded = true;
    });
  }

  backClicked() {
    const currentRoute = this._router.url;
    const backRoute = WDTSUtility.routeBack(currentRoute, '/comparescans');
    this._router.navigate([backRoute]);
  }

  updatePagination(paginationObj): void {
    this.inputStart = paginationObj.start;
    this.inputLimit = paginationObj.limit;
    this.inputCurrentPage = paginationObj.currentPage;
    Object.assign(this.reqObj.params, paginationObj);
    this.getLastScanDetails();
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
}
