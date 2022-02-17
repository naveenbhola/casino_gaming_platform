import {Component, OnDestroy, OnInit, QueryList, ViewChildren, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {
  CommonTranslationService, FilterComponent, CasinomanagerService, AppTablesService, AuthService, DecodedTokenService,
  protocol, webServerDNS, webPlayerDashboardTLSPort
} from 'common-ui';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NGXLogger} from 'ngx-logger';


@Component({
  selector: 'app-players-tab',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PlayersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(FilterComponent) filterComponents: QueryList<FilterComponent>;
  perPageOption: Array<number> = [10, 20, 30, 50, 100];
  perPageOptionForGrid: Array<number> = [5, 10, 15, 20, 25, 30];
  totalRecords: number;
  isRenderPagination: Boolean;
  reqObj;
  inputCurrentPage = 1;
  inputStart = 1;
  start = 1;
  inputLimit;
  defaultLimit = 10;
  gridDefaultLimit = 5;
  gridStart;
  gridLimit;
  gridCurrentPage;
  limit = this.defaultLimit;
  sortField: string;
  sortOrder: string;
  selectedFilter: any;
  prevFilter: any;
  loading: boolean;
  filterConfig = [];
  playerTableHeaders;
  playersTableData = [];
  topologyID;
  gamingDay: String;
  titleNotReq = true;
  selectedView = 'table';
  hasAdvKpiPermission;
  renderFlag = false;
  completeFilterObj: any;
  globalObjSub;
  playerStatsSub;
  playerFilterSub;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private casinoManagerService: CasinomanagerService,
              private tableService: AppTablesService,
              private authService: AuthService,
              private jwtHelper: JwtHelperService,
              private decodedTokenService: DecodedTokenService,
              private nGXLogger: NGXLogger,
              private cdr: ChangeDetectorRef,
              private appService: AppService) {
    this.setPlayerTableHeaders();
    this.initReqObj();
  }

  ngOnInit() {
    this.globalObjSub = this.appService.broadcastGlobalObj.subscribe(globalObj => {
      if (this.appService.currentTab === 'players') {
        if (this.renderFlag) {
          return;
        }
        this.getTopologyId(globalObj);
        this.gamingDay = this.appService.appGlobalObj.gamingDay;
      }
    });
  }

  ngAfterViewInit() {
    // We only want to detach the change detectors after change detection has been performed for the first time
    // this.cdr.detach();

  }

  initReqObj() {
    this.reqObj = this.tableService.reqObj;
    this.tableService.clearPreFilters();
    this.reqObj.params.reqFilter = 1;
    this.reqObj.params.sortField = 'PLAYER_ID';
    this.reqObj.params.sortOrder = 'asc';
    this.reqObj.params.state = 'ACTIVE';
    this.reqObj.params.start = this.start;
    this.reqObj.params.limit = this.limit;
  }

  setFilterConfig() {
    if (this.appService.isCBPT) {
      this.filterConfig = [
        {
          title: 'application.app.TABLE_DASH_LABELS.SESSIONS.COLHEADERS.START_TIME',
          column: 'minStartTime',
          options: [],
          selectedOptions: '',
          searchOption: true,
          type: 'time',
          translatePath: 'application.app.common.labels'
        },
        {
          title: 'CCAS_ID_PLAYER',
          column: 'ccasIds',
          options: [],
          selectedOptions: [],
          searchOption: true,
          type: 'textAutofill'
        }
      ];
    } else {
      this.filterConfig = [
        {
          title: 'application.app.TABLE_DASH_LABELS.SESSIONS.COLHEADERS.START_TIME',
          column: 'minStartTime',
          options: [],
          selectedOptions: '',
          searchOption: true,
          type: 'time',
          translatePath: 'application.app.common.labels'
        },
        {
          title: 'application.app.TABLE_DASH_LABELS.SESSIONS.COLHEADERS.PLAYER_NAME',
          column: 'playerNames',
          options: [],
          selectedOptions: [],
          searchOption: true,
        }
      ];
    }
    this.tableService.filterConfigOptions = this.filterConfig;
  }

  setPlayerTableHeaders() {
    this.hasAdvKpiPermission = this.appService.hasPermissionOf('CASINO_MGR', 'VIEW_ADVANCED_CASINO_KPIS');
    if (this.appService.isCBPT && this.hasAdvKpiPermission) {
      this.playerTableHeaders = [
        {title: 'PLAYER_ID', type: 'text_no_translation', row: 'PLAYER_ID', sortable: true, sortFirst: true},
        {title: 'PLAYERS', type: 'text_no_translation', row: 'PLAYERS', sortable: true},
        {title: 'CCAS_ID_PLAYER', type: 'text_no_translation', row: 'CCAS_ID_PLAYER', sortable: true},
        {title: 'START_TIME', type: 'time', row: 'START_TIME', sortable: true},
        {title: 'END_TIME', type: 'time', row: 'END_TIME', sortable: true},
        {
          title: 'PLAYER_TOTAL_TIME_PLAYED',
          type: 'text_no_translation',
          row: 'PLAYER_TOTAL_TIME_PLAYED',
          sortable: true
        },
        {title: 'CASINO_WL_PLAYER', type: 'number-round-up', row: 'CASINO_WL_PLAYER', sortable: true},
        {title: 'THEO_WIN_PLAYER', type: 'number-round-up', row: 'THEO_WIN_PLAYER', sortable: true},
        {title: 'AVERAGE_BET_PLAYER', type: 'number-round-up', row: 'AVERAGE_BET_PLAYER', sortable: true},
        {title: 'TURNOVER_PLAYER', type: 'number-round-up', row: 'TURNOVER_PLAYER', sortable: true},
        {title: 'ACTIVE_FLAG', type: 'text', row: 'ACTIVE_FLAG', sortable: true},
        {title: 'CURRENT_ACTIVE_LOCATION', type: 'text_no_translation', row: 'CURRENT_ACTIVE_LOCATION', sortable: true},
        {title: 'LAST_ACTIVE_LOCATION', type: 'text_no_translation', row: 'LAST_ACTIVE_LOCATION', sortable: false},
        {title: 'TOTAL_BUY_INS_PLAYER', type: 'number-round-up', row: 'TOTAL_BUY_INS_PLAYER', sortable: true},
        {title: 'PLAYER_BANKROLL_VALUE', type: 'number-round-up', row: 'PLAYER_BANKROLL_VALUE', sortable: false},
      ];
    } else if (this.hasAdvKpiPermission) {
      this.playerTableHeaders = [
        {title: 'PLAYER_ID', type: 'text_no_translation', row: 'PLAYER_ID', sortable: true, sortFirst: true},
        {title: 'PLAYERS', type: 'text_no_translation', row: 'PLAYERS', sortable: true},
        {title: 'START_TIME', type: 'time', row: 'START_TIME', sortable: true},
        {title: 'END_TIME', type: 'time', row: 'END_TIME', sortable: true},
        {
          title: 'PLAYER_TOTAL_TIME_PLAYED',
          type: 'text_no_translation',
          row: 'PLAYER_TOTAL_TIME_PLAYED',
          sortable: true
        },
        {title: 'CASINO_WL_PLAYER', type: 'number-round-up', row: 'CASINO_WL_PLAYER', sortable: true},
        {title: 'THEO_WIN_PLAYER', type: 'number-round-up', row: 'THEO_WIN_PLAYER', sortable: true},
        {title: 'AVERAGE_BET_PLAYER', type: 'number-round-up', row: 'AVERAGE_BET_PLAYER', sortable: true},
        {title: 'TURNOVER_PLAYER', type: 'number-round-up', row: 'TURNOVER_PLAYER', sortable: true},
        {title: 'ACTIVE_FLAG', type: 'text', row: 'ACTIVE_FLAG', sortable: true},
        {title: 'CURRENT_ACTIVE_LOCATION', type: 'text_no_translation', row: 'CURRENT_ACTIVE_LOCATION', sortable: true},
        {title: 'LAST_ACTIVE_LOCATION', type: 'text_no_translation', row: 'LAST_ACTIVE_LOCATION', sortable: false},
        {title: 'TOTAL_BUY_INS_PLAYER', type: 'number-round-up', row: 'TOTAL_BUY_INS_PLAYER', sortable: true}
      ];
    } else {
      this.playerTableHeaders = [
        {title: 'PLAYER_ID', type: 'text_no_translation', row: 'PLAYER_ID', sortable: true, sortFirst: true},
        {title: 'PLAYERS', type: 'text_no_translation', row: 'PLAYERS', sortable: true},
        {title: 'START_TIME', type: 'time', row: 'START_TIME', sortable: true},
        {title: 'END_TIME', type: 'time', row: 'END_TIME', sortable: true},
        {
          title: 'PLAYER_TOTAL_TIME_PLAYED',
          type: 'text_no_translation',
          row: 'PLAYER_TOTAL_TIME_PLAYED',
          sortable: true
        },
        {title: 'CASINO_WL_PLAYER', type: 'number-round-up', row: 'CASINO_WL_PLAYER', sortable: true},
        /*{title: 'THEO_WIN_PLAYER', type: 'number', row: 'THEO_WIN_PLAYER', sortable: true},*/
        {title: 'AVERAGE_BET_PLAYER', type: 'number-round-up', row: 'AVERAGE_BET_PLAYER', sortable: true},
        {title: 'TURNOVER_PLAYER', type: 'number-round-up', row: 'TURNOVER_PLAYER', sortable: true},
        {title: 'ACTIVE_FLAG', type: 'text', row: 'ACTIVE_FLAG', sortable: true},
        {title: 'CURRENT_ACTIVE_LOCATION', type: 'text_no_translation', row: 'CURRENT_ACTIVE_LOCATION', sortable: true},
        {title: 'LAST_ACTIVE_LOCATION', type: 'text_no_translation', row: 'LAST_ACTIVE_LOCATION', sortable: false},
        {title: 'TOTAL_BUY_INS_PLAYER', type: 'number-round-up', row: 'TOTAL_BUY_INS_PLAYER', sortable: true}
      ];
    }
  }

  getTopologyId(globalObj) {
    this.topologyID = globalObj['currentPitId'] ||
      globalObj['currentOAId'];
    if (this.topologyID) {
      this.renderFlag = true;
      this.getPlayersData();
      this.getPlayersFilters();
    }
  }

  getPlayersData(filterVal?) {
    const selectedFilter = filterVal && Object.keys(filterVal).length > 0 ? filterVal : this.selectedFilter;
    this.reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    this.reqObj.params['topologyId'] = this.topologyID;
    this.reqObj.params['viewId'] = 10;
    this.reqObj.params['sortField'] = this.sortField ? this.sortField : 'PLAYER_ID';
    this.reqObj.params['sortOrder'] = this.sortOrder ? this.sortOrder : 'ASC';
    if (selectedFilter && Object.keys(selectedFilter).length > 0) {
      this.reqObj.params['filter'] = true;
      Object.assign(this.reqObj.params, selectedFilter);
    }
    //*GR-3791
    let customReqObj = JSON.parse(JSON.stringify(this.reqObj));
    if (customReqObj.params.playerNames) {
      for (let i = 0; i < customReqObj.params.playerNames.length; i++) {
        customReqObj.params.playerNames[i] = customReqObj.params.playerNames[i].replace(',', ';')
      }
    }
    //GR-3791*
    this.playerStatsSub = this.casinoManagerService.getPlayerStatistics(customReqObj).subscribe((response) => {
      const resp = response['body'];
      const statCodes = resp['statCodes'];
      const respData = resp['data'];
      const playerIds = resp['playerIds'];
      this.totalRecords = parseInt(response['headers'].get('TotalRecords'), 10);
      this.createPlayersData(statCodes, respData, playerIds);
    }, (error) => {
      this.totalRecords = 0;
      this.playerTableHeaders = [];
      this.playersTableData = [];
    });
  }

  getPlayersFilters() {
    const reqObj = {
      observe: 'response',
      params: {}
    };
    reqObj.params['gamingDay'] = this.appService.appGlobalObj.gamingDay;
    reqObj.params['topologyId'] = this.topologyID;
    reqObj.params['viewId'] = 10;
    this.playerFilterSub = this.casinoManagerService.getFilterForPlayer(reqObj).subscribe((response) => {
      this.setFilterConfig();
      this.setPlayerFilters(response['body']);
    });
  }

  setPlayerFilters(filterData) {
    for (let i = 0, iLen = this.filterConfig.length; i < iLen; i++) {
      const filterVal = this.filterConfig[i];
      const col = filterVal['column'];
      filterVal['options'] = filterData[col];
    }
  }

  updateFilter(filterObj, viewChange?) {
    this.completeFilterObj = filterObj;
    const selectedFilter = filterObj.selectedFilter;
    this.selectedFilter = selectedFilter;
    this.tableService.updateFilter(filterObj);
    const filterKeys = Object.keys(selectedFilter);
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
                if (filterKeys.indexOf(this.filterConfig[i]['column']) === -1) {
                  if (this.filterConfig[i]['column'] === 'minStartTime') {
                    this.filterConfig[i]['selectedOptions'] = '';
                  } else {
                    this.filterConfig[i]['selectedOptions'] = [];
                  }
                }
              }
            }
          }
        }
        if (viewChange) {
          this.reqObj.params.limit = this.inputLimit ? this.inputLimit : this.defaultLimit;
          this.reqObj.params.currentPage = this.inputCurrentPage;
          this.reqObj.params.start = this.inputStart;
        }
        this.filterConfig = JSON.parse(JSON.stringify(this.filterConfig));
        this.getPlayersData(filterObj.selectedFilter);
        break;
      }
      case 'clear': {
        this.reqObj.params.limit = this.inputLimit ? this.inputLimit : this.defaultLimit;
        this.getPlayersData();
        this.getPlayersFilters();
        break;
      }
    }
  }

  createPlayersData(statCodes, respData, playerIds) {
    const playersData = [];
    for (let i = 0, iLen = respData.length; i < iLen; i++) {
      const val = respData[i]['stats'];
      const obj = {};
      for (let j = 0, jLen = statCodes.length; j < jLen; j++) {
        if (statCodes[j] === 'ACTIVE_FLAG') {
          obj[statCodes[j]] = val[j] === 'true' ? 'ACTIVE' : 'INACTIVE';
        }
        // else if (statCodes[j] === 'CURRENT_ACTIVE_LOCATION' || statCodes[j] === 'LAST_ACTIVE_LOCATION') {
        //   obj[statCodes[j]] = val[j] = this.appService.getTopologyNodeNameFromId(val[j]);
        // }
        else if (statCodes[j] === 'PLAYER_ID' && ( val[j] === null || val[j] === '' || val[j] === undefined )) {
          obj[statCodes[j]] = '';
        } else {
          obj[statCodes[j]] = val[j];
        }
      }
      playersData.push(obj);
    }
    this.playersTableData = JSON.parse(JSON.stringify(playersData));
  }

  updateEventObj(node) {
    switch (node.type) {
      case 'row-click':
        this.appService.openPlayerDashboard(node.obj['CCAS_ID_PLAYER'], this.appService.appGlobalObj.gamingDay);
        break;
    }
  }

  sortData(sort) {
    this.sortField = sort['active'];
    this.sortOrder = sort['direction'].toUpperCase();
    this.getPlayersData();
  }

  selectViewType(viewType) {
    this.selectedView = viewType;
    if (viewType === 'table') {
      this.reqObj.params.limit = this.inputLimit ? this.inputLimit : this.defaultLimit;
      this.reqObj.params.currentPage = this.inputCurrentPage;
      this.reqObj.params.start = this.inputStart;
      let prevFilterKeys;
      if (this.prevFilter) { prevFilterKeys = Object.keys(this.prevFilter);}
      if (prevFilterKeys.length > 0) {
        const reqFilterObj = {
          selectedFilter: this.prevFilter,
          state: 'apply'
        };
        this.updateFilter(reqFilterObj, true);
      } else {
        this.getPlayersData();
      }
    } else if (viewType === 'grid') {
      this.reqObj.params.start = this.gridStart = 1;
      this.reqObj.params.limit = this.gridLimit = 5;
      this.reqObj.params.currentPage = this.gridCurrentPage = 1;
      this.prevFilter = this.selectedFilter;
      this.getPlayersData();
    }
  }

  updatePagination(paginationObj) {
    this.start = paginationObj.start;
    this.limit = paginationObj.limit;
    this.inputCurrentPage = paginationObj.currentPage;
    this.inputStart = paginationObj.start;
    this.inputLimit = paginationObj.limit;
    Object.assign(this.reqObj.params, paginationObj);
    this.getPlayersData();
  }

  updateGridPagination(paginationObj) {
    this.gridStart = paginationObj.start;
    this.gridLimit = paginationObj.limit;
    this.gridCurrentPage = paginationObj.currentPage;
    Object.assign(this.reqObj.params, paginationObj);
    this.getPlayersData();
  }

  ngOnDestroy() {
    if (this.playerFilterSub) {
      this.playerFilterSub.unsubscribe();
    }
    if (this.globalObjSub) {
      this.globalObjSub.unsubscribe();
    }
    if (this.playerStatsSub) {
      this.playerStatsSub.unsubscribe();
    }
  }

}


