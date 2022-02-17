import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
  CommonTranslationService, FilterComponent, AppTablesService,
  CageService, dialogSize
} from 'common-ui';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
import {NGXLogger} from 'ngx-logger';
import {FillCreditDetailsComponent} from './fill-credit-details/fill-credit-details.component';


@Component({
  selector: 'fctxns',
  templateUrl: './fctxns.component.html',
  styleUrls: ['./fctxns.component.scss']
})
export class FctxnsComponent implements OnInit, OnDestroy {
  @ViewChildren(FilterComponent) filterComponents: QueryList<FilterComponent>;
  perPageOption: Array<number> = [10, 20, 30, 50, 100];
  totalRecords: number;
  isRenderPagination: Boolean;
  reqObj;
  inputCurrentPage = 1;
  inputStart = 1;
  defaultStart = 1;
  defaultLimit = 10;
  inputLimit;
  start = this.defaultStart;
  limit = this.defaultLimit;
  sortField: string;
  sortOrder: string;
  selectedFilter: any;
  loading: boolean;
  filterConfig = [];
  fctxnsTableHeaders;
  fctxnsTableData = [];
  topologyID;
  gamingDay: String;
  titleNotReq = true;
  selectedView = 'table';
  renderFlag = false;
  completeFilterObj: any;
  currentScreen: string;
  updateFilterFlag;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private tableService: AppTablesService,
              private cageService: CageService,
              private nGXLogger: NGXLogger,
              private appService: AppService,
              private matDialog: MatDialog) {
    //this.setTableHeaders();
    this.initReqObj();
  }

  ngOnInit() {
    this.appService.broadcastGlobalObj.subscribe(globalObj => {
      if (this.appService.currentTab === 'fctxns') {
        if (this.renderFlag) { return; }
        this.setFilterConfig();
        this.getTopologyId(globalObj);
        this.gamingDay = this.appService.appGlobalObj.gamingDay;
      }
    });
  }

  initReqObj() {
    this.reqObj = this.tableService.reqObj;
    this.tableService.clearPreFilters();
    this.reqObj.params.sortField = 'event_dtm';
    this.reqObj.params.sortOrder = 'asc';
    this.reqObj.params.start = this.start;
    this.reqObj.params.limit = this.limit;
  }

  setFilterConfig() {
    this.filterConfig = [
        {
          title: 'application.app.TABLE_DASH_LABELS.MANUAL_RATINGS.PIT',
          column: 'pit',
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
          title: 'application.app.CONFIGURATION_LABELS.AREAS.TYPE',
          column: 'transactionType',
          options: [],
          selectedOptions: '',
          searchOption: true
        },
        {
          title: 'Status',
          column: 'status',
          options: [],
          selectedOptions: '',
          searchOption: true
        },
      ];
    if (this.currentScreen === 'PIT'){
      this.filterConfig.splice(this.filterConfig.indexOf(this.filterConfig.find(obj => obj.column === 'pit')),1);
    }
    this.tableService.filterConfigOptions = this.filterConfig;
  }

  setTableHeaders() {
    this.fctxnsTableHeaders = [
      {title: 'Time', type: 'time', row: 'eventDtm', sortable: true},
      {title: 'application.app.common.labels.GA_OPERATING_AREA', type: 'text_no_translation', row: 'operatingArea', sortable: true},
      {title: 'application.app.CONFIGURATION_LABELS.PROMOTION.PIT_NAME', type: 'text_no_translation', row: 'pitName', sortable: true},
      {title: 'application.app.CONFIGURATION_LABELS.PROMOTION.TABLE_NAME', type: 'text_no_translation', row: 'tableName', sortable: true},
      {title: 'application.app.common.labels.ID', type: 'text_no_translation', row: 'transactionId', sortable: true},
      {title: 'application.app.common.labels.DOCUMENT_ID', type: 'text_no_translation', row: 'documentId', sortable: true},
      {title: 'application.app.TABLE_DASH_LABELS.GAME_HISTORY.COLHEADERS.SUPERVISOR', type: 'text_no_translation', row: 'supervisor', sortable: true},
      {title: 'application.app.TABLE_DASH_LABELS.GAME_HISTORY.COLHEADERS.DEALER', type: 'text_no_translation', row: 'dealer', sortable: true},
      {title: 'application.app.CONFIGURATION_LABELS.AREAS.TYPE', type: 'text', row: 'type', sortable: true},
      {title: 'Status', type: 'fcstatus', row: 'currentStatus', sortable: true},
      {title: 'application.app.common.labels.VALUE', type: 'number-two-decimal', row: 'totalValue', sortable: true}
    ];
  }

  getTopologyId(globalObj) {
    this.topologyID = globalObj['currentPitId'] || globalObj['currentOAId'] || globalObj['currentGAId'];
    if (this.topologyID) {
      this.renderFlag = true;
      if (globalObj.currentPitId) {
        this.currentScreen = 'PIT';
      } else if (globalObj.currentOAId) {
        this.currentScreen = 'OA';
      } else if (globalObj.currentGAId) {
        this.currentScreen = 'GA';
      } else {
        this.currentScreen = 'SITE';
      }
      if (this.currentScreen === 'PIT'){
        this.filterConfig.splice(this.filterConfig.indexOf(this.filterConfig.find(obj => obj.column === 'pit')),1)
      }
      this.setTableHeaders();
      this.deleteHeader(this.currentScreen, this.topologyID);
      this.getFctxnsData();
    }
  }

  deleteHeader(topologyType, topologyID) {
    if (topologyType === 'OA') {
      this.fctxnsTableHeaders.forEach((item, index) => {
        if (item.row === 'operatingArea') {
          this.fctxnsTableHeaders.splice(index, 1);
        }
      });
    }
    else if (topologyType === 'PIT') {
      for (let i = 0, iLen = this.fctxnsTableHeaders.length; i < iLen; i++) {
        if (this.fctxnsTableHeaders[i] && this.fctxnsTableHeaders[i].row && (this.fctxnsTableHeaders[i].row === 'pitName' ||
          this.fctxnsTableHeaders[i].row === 'operatingArea')) {
          this.fctxnsTableHeaders.splice(i, 1);
          i--;
        }
      }
    }
    //this.setOpenerCloserTableData(topologyID);
  }

  getFctxnsData(filterVal?) {
    const selectedFilter = filterVal && Object.keys(filterVal).length > 0 ? filterVal : this.selectedFilter;
    this.reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    this.reqObj.params['topologyId'] = this.topologyID;
    this.reqObj.params['sortField'] = this.sortField ? this.sortField : 'event_dtm';
    this.reqObj.params['sortOrder'] = this.sortOrder ? this.sortOrder : 'ASC';
    if (selectedFilter && Object.keys(selectedFilter).length > 0) {
      this.reqObj.params['filter'] = true;
      Object.assign(this.reqObj.params, selectedFilter);
    }
    this.cageService.getfcTransactions(this.reqObj).subscribe((response) => {
      const resp = response['body'];
      this.fctxnsTableData = resp.successObj['results'];
      this.totalRecords = parseInt(response['headers'].get('TotalRecords'), 10);

      if (this.currentScreen === 'PIT'){
        if (resp.successObj['filters']) {
          this.filterConfig[0].options = resp.successObj['filters'].tableName;
          this.filterConfig[1].options = resp.successObj['filters'].transactionType;
          this.filterConfig[2].options = resp.successObj['filters'].status;
        }
      }else{
        if (resp.successObj['filters']) {
          this.filterConfig[0].options = resp.successObj['filters'].pit;
          this.filterConfig[1].options = resp.successObj['filters'].tableName;
          this.filterConfig[2].options = resp.successObj['filters'].transactionType;
          this.filterConfig[3].options = resp.successObj['filters'].status;
        }
      }
      this.filterConfig = JSON.parse(JSON.stringify(this.filterConfig));
    }, (error) => {
      this.totalRecords = 0;
      this.fctxnsTableHeaders = [];
      this.fctxnsTableData = [];
    });
  }

  updateFilter(filterObj) {
    this.updateFilterFlag=true;
    this.completeFilterObj = filterObj;
    const selectedFilter = filterObj.selectedFilter;
    this.selectedFilter = selectedFilter;
    this.tableService.updateFilter(filterObj);
    switch (filterObj.state) {
      case 'apply': {
        for (const filter in selectedFilter) {
          if (selectedFilter.hasOwnProperty(filter)) {
            const stringedValue = selectedFilter[filter];
            for (let i = 0, iLen = this.filterConfig.length; i < iLen; i++) {
              if (this.filterConfig[i]['column'] === filter) {
                this.filterConfig[i]['selectedOptions'] = stringedValue;
              } else {
                if (this.reqObj.params.hasOwnProperty(this.filterConfig[i]['column'])) {
                  delete this.reqObj.params[this.filterConfig[i]['column']];
                }
              }
            }
          }
        }
        this.filterConfig = JSON.parse(JSON.stringify(this.filterConfig));
        this.getFctxnsData(filterObj.selectedFilter);
        break;
      }
      case 'clear': {
        this.selectedFilter = undefined;
        this.start = this.defaultStart;
        this.limit = this.defaultLimit;
        this.reqObj.params.limit = this.inputLimit ? this.inputLimit : this.defaultLimit;
        this.setFilterConfig();
        this.getFctxnsData();
        this.updateFilterFlag = false;
        break;
      }
    }
  }

  updateEventObj(node) {
    switch (node.type) {
      case 'row-click':
        this.matDialog.open(FillCreditDetailsComponent, {
          width: dialogSize.medium,
          panelClass: 'js-fills-credits-details-dialog',
          data: {data: node.obj}
        });
        break;
    }
  }

  sortData(sort) {
    this.sortField = sort['active'];
    this.sortOrder = sort['direction'].toUpperCase();
    switch (sort['active']) {
      case 'Time' :
        this.sortField = 'event_dtm';
        break;
      case 'application.app.common.labels.GA_OPERATING_AREA':
        this.sortField = 'operating_area';
        break;
      case 'application.app.CONFIGURATION_LABELS.PROMOTION.PIT_NAME':
        this.sortField = 'pit_name';
        break;
      case 'application.app.CONFIGURATION_LABELS.PROMOTION.TABLE_NAME':
        this.sortField = 'table_name';
        break;
      case 'application.app.common.labels.ID':
        this.sortField = 'tr_id';
        break;
      case 'application.app.common.labels.DOCUMENT_ID':
        this.sortField = 'document_id';
        break;
      case 'application.app.TABLE_DASH_LABELS.GAME_HISTORY.COLHEADERS.SUPERVISOR':
        this.sortField = 'supervisor';
        break;
      case 'application.app.TABLE_DASH_LABELS.GAME_HISTORY.COLHEADERS.DEALER':
        this.sortField = 'dealer';
        break;
      case 'application.app.CONFIGURATION_LABELS.AREAS.TYPE':
        this.sortField = 'transaction_type';
        break;
      case 'Status':
        this.sortField = 'status';
        break;
      case 'application.app.common.labels.VALUE':
        this.sortField = 'total_value';
        break;
    }
    this.getFctxnsData();
  }

  updatePagination(paginationObj) {
    this.start = paginationObj.start;
    this.limit = paginationObj.limit;
    this.inputCurrentPage = paginationObj.currentPage;
    this.inputStart = paginationObj.start;
    this.inputLimit = paginationObj.limit;
    Object.assign(this.reqObj.params, paginationObj);
    if (this.updateFilterFlag===true){
      this.updateFilterFlag=false;
      return;
    }
    this.getFctxnsData();
  }
  ngOnDestroy() {
  }

}
