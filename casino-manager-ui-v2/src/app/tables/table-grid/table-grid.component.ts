import {Component, Input, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  dialogSize, protocol, tableUIPort, tableUIProtocol, webAlertsTLSPort, webCasinoManagerTLSPort, webServerDNS,
  DecodedTokenService, AuthService
} from 'common-ui';
import {OpenSessionsComponent} from '../open-sessions/open-sessions.component';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {DataService} from '../../services/data.service';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-table-grid',
  templateUrl: './table-grid.component.html',
  styleUrls: ['./table-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableGridComponent implements OnInit, OnDestroy {
  @Input() lastGameData;
  @Input() tableStats;
  @Input() tableData;
  @Input() nodesMap;
  @Input() alertsData;
  @Input() pagesMap;
  @Input() allNodeIds;
  @Input() pageStarters;
  @Input() totalRecords;
  gameData = new Map();
  perPageOption = [5, 10, 15, 20, 25, 30];
  completeTableData;
  limit = 5;
  // Subscribers
  lastGameDataSub: Subscription;
  refreshTokenSub: Subscription;

  constructor(private matDialog: MatDialog,
              public snackBar: MatSnackBar,
              private translate: TranslateService,
              private jwtHelper: JwtHelperService,
              private decodedTokenService: DecodedTokenService,
              private authService: AuthService,
              private appService: AppService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.completeTableData = JSON.parse(JSON.stringify(this.tableData));
    this.lastGameDataSub = this.dataService.updateLastGameData.subscribe((gameData) => {
      this.lastGameData = gameData;
      this.createSessionsCount(this.lastGameData);
    });
    this.createSessionsCount(this.lastGameData);
  }

  getTableStats(tableName, prop?) {
    let reqValue;
    if (prop && prop === 'limit') {
      for (let i = 0, iLen = this.tableData.length; i < iLen; i++) {
        if (tableName === this.tableData[i]['TABLE_NAME']) {
          reqValue = this.tableData[i]['TABLE_LIMITS'];
        }
      }
    } else if (prop && prop === 'table-positions') {
      let tableNode;
      this.nodesMap.forEach((value, key) => {
        if (value['name'] === tableName) {
          tableNode = value;
        }
      });
      const nodeID = (tableNode.nodeId).toString();
      const tablePositions = this.tableStats[nodeID]['PLAYER_POSITIONS'];
      if (tablePositions) {
        reqValue = Array.from(Array(parseInt(tablePositions, 10)).keys());
      } else {
        reqValue = [];
      }
    } else {
      let tableNode;
      this.nodesMap.forEach((value, key) => {
        if (value['name'] === tableName) {
          tableNode = value;
        }
      });
      reqValue = (tableNode && tableNode.nodeId);
    }
    return reqValue;
  }

  getTablePositionsNum(tableName) {
    let tableId, tablePos, nodeObj;
    this.nodesMap.forEach((value, key) => {
      if (value['name'] === tableName) {
        nodeObj = value;
      }
    });
    if (nodeObj) {
      tableId = (nodeObj.nodeId).toString();
    }
    if (nodeObj && nodeObj.nodeId && this.tableStats[tableId]) {
      tablePos = this.tableStats[tableId]['PLAYER_POSITIONS'];
    } else {
      tablePos = '0';
    }
    return parseInt(tablePos, 10);
  }

  createSessionsCount(gameData) {
    const tableIdWithNames = this.getIdsWithName();
    for (const tableId in gameData) {
      const countData = [];
      const playerData = gameData[tableId]['playerCounts'];
      if (playerData) {
        for (let i = 0, iLen = playerData.length; i < iLen; i++) {
          if (parseInt(playerData[i]['pos'], 10) > 0) {
            const obj = {};
            obj['pos'] = playerData[i]['pos'];
            obj['anonSessions'] = (playerData[i]['anon']).length;
            obj['knownSessions'] = (playerData[i]['known']).length;
            obj['swipedSessions'] = (playerData[i]['swiped']).length;
            countData.push(obj);
          }
        }
      }
      this.gameData.set(tableIdWithNames[tableId], countData);
    }
  }

  getIdsWithName() {
    const reqObj = {};
    this.nodesMap.forEach(function (value, key) {
      reqObj[value.nodeId] = value.name;
    });
    return reqObj;
  }

  getSessionsNumOrColor(tableName, positionNum, seatNum, colorReq?: boolean) {
    let reqSession;
    let reqColor;
    const tablePosition = parseInt(positionNum, 10) + 1;
    const playerData = this.gameData.get(tableName);
    if (playerData && playerData.length > 0) {
      for (let i = 0, iLen = playerData.length; i < iLen; i++) {
        if (parseInt(playerData[i]['pos'], 10) === tablePosition) {
          if (playerData[i]['anonSessions'] > 0) {
            if (playerData[i]['knownSessions'] > 0 && playerData[i]['swipedSessions'] > 0) {
              reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['swipedSessions'] :
                parseInt(seatNum, 10) === 2 ? playerData[i]['knownSessions'] : playerData[i]['anonSessions'];
              if (colorReq) {
                reqColor = parseInt(seatNum, 10) === 1 ? '#00b32d' :
                  parseInt(seatNum, 10) === 2 ? '#ffd500' : '#cd3500';
                break;
              }
            } else if (playerData[i]['knownSessions'] === 0 && playerData[i]['swipedSessions'] > 0) {
              if (playerData[i]['anonSessions'] === 2) {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['swipedSessions'] :
                  parseInt(seatNum, 10) === 2 ? 1 : playerData[i]['anonSessions'] - 1;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#00b32d' :
                    parseInt(seatNum, 10) === 2 ? '#cd3500' : '#cd3500';
                  break;
                }
              } else {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['swipedSessions'] :
                  parseInt(seatNum, 10) === 2 ? playerData[i]['anonSessions'] : 0;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#00b32d' :
                    parseInt(seatNum, 10) === 2 ? '#cd3500' : '';
                  break;
                }
              }
            } else if (playerData[i]['knownSessions'] > 0 && playerData[i]['swipedSessions'] === 0) {
              if (playerData[i]['knownSessions'] === 2 && (playerData[i]['anonSessions'] === 1 || playerData[i]['anonSessions'] > 2)) {
                reqSession = parseInt(seatNum, 10) === 1 ? 1 :
                  parseInt(seatNum, 10) === 2 ? playerData[i]['knownSessions'] - 1 : playerData[i]['anonSessions'];
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#ffd500' :
                    parseInt(seatNum, 10) === 2 ? '#ffd500' : '#cd3500';
                  break;
                }
              } else if ((playerData[i]['knownSessions'] === 1 || playerData[i]['knownSessions'] > 2) &&
                playerData[i]['anonSessions'] === 2) {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['knownSessions'] :
                  parseInt(seatNum, 10) === 2 ? 1 : playerData[i]['anonSessions'] - 1;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#ffd500' :
                    parseInt(seatNum, 10) === 2 ? '#cd3500' : '#cd3500';
                  break;
                }
              } else {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['knownSessions'] :
                  parseInt(seatNum, 10) === 2 ? playerData[i]['anonSessions'] : 0;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#ffd500' :
                    parseInt(seatNum, 10) === 2 ? '#cd3500' : '';
                  break;
                }
              }
            } else if (playerData[i]['knownSessions'] === 0 && playerData[i]['swipedSessions'] === 0) {
              if (playerData[i]['anonSessions'] === 2) {
                reqSession = parseInt(seatNum, 10) === 1 ? 1 :
                  parseInt(seatNum, 10) === 2 ? playerData[i]['anonSessions'] - 1 : 0;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#cd3500' : parseInt(seatNum, 10) === 2 ?
                    '#cd3500' : '';
                  break;
                }
              } else if (playerData[i]['anonSessions'] === 3) {
                reqSession = parseInt(seatNum, 10) === 1 ? 1 :
                  parseInt(seatNum, 10) === 2 ? 1 : playerData[i]['anonSessions'] - 2;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#cd3500' : parseInt(seatNum, 10) === 2 ?
                    '#cd3500' : '#cd3500';
                  break;
                }
              } else {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['anonSessions'] : 0;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#cd3500' : '';
                  break;
                }
              }
            }
          } else {
            if (playerData[i]['knownSessions'] > 0 && playerData[i]['swipedSessions'] > 0) {
              if (playerData[i]['knownSessions'] === 2) {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['swipedSessions'] : parseInt(seatNum, 10) === 2 ?
                  1 : playerData[i]['knownSessions'] - 1;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#00b32d' : parseInt(seatNum, 10) === 2 ?
                    '#ffd500' : '#ffd500';
                  break;
                }
              } else {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['swipedSessions'] : parseInt(seatNum, 10) === 2 ?
                  playerData[i]['knownSessions'] : 0;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#00b32d' : parseInt(seatNum, 10) === 2 ?
                    '#ffd500' : '';
                  break;
                }
              }
            } else if (playerData[i]['knownSessions'] === 0 && playerData[i]['swipedSessions'] > 0) {
              reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['swipedSessions'] : 0;
              if (colorReq) {
                reqColor = parseInt(seatNum, 10) === 1 ? '#00b32d' : '';
                break;
              }
            } else if (playerData[i]['knownSessions'] > 0 && playerData[i]['swipedSessions'] === 0) {
              if (playerData[i]['knownSessions'] === 2) {
                reqSession = parseInt(seatNum, 10) === 1 ? 1 :
                  parseInt(seatNum, 10) === 2 ? playerData[i]['knownSessions'] - 1 : 0;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#ffd500' : parseInt(seatNum, 10) === 2 ?
                    '#ffd500' : '';
                  break;
                }
              } else if (playerData[i]['knownSessions'] === 3) {
                reqSession = parseInt(seatNum, 10) === 1 ? 1 :
                  parseInt(seatNum, 10) === 2 ? 1 : playerData[i]['knownSessions'] - 2;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#ffd500' : parseInt(seatNum, 10) === 2 ?
                    '#ffd500' : '#ffd500';
                  break;
                }
              } else {
                reqSession = parseInt(seatNum, 10) === 1 ? playerData[i]['knownSessions'] : 0;
                if (colorReq) {
                  reqColor = parseInt(seatNum, 10) === 1 ? '#ffd500' : '';
                  break;
                }
              }
            }
          }
        }
      }
    }
    return colorReq ? reqColor : reqSession;
  }

  getTheCount(sessionCount, seatNum, colorReq?: string) {
    let reqSession;
    let reqColor;
    const sessCount = parseInt(sessionCount, 10);
    const seatNo = parseInt(seatNum, 10);
    if (sessCount <= 3) {
      reqSession = (sessCount - seatNo) >= 0 ? 1 : 0;
      reqColor = (sessCount - seatNo) >= 0 ? colorReq : '';
    } else {
      if (seatNo === 1) {
        reqSession = sessCount;
        reqColor = colorReq;
      } else {
        reqSession = 0;
        reqColor = '';
      }
    }
    return colorReq ? reqColor : reqSession;
  }

  createDataToView(playerData) {
    const dataArr = [];
    for (const sessionType in playerData) {
      if (playerData[sessionType].length > 0) {
        for (let i = 0, iLen = playerData[sessionType].length; i < iLen; i++) {
          const obj = {};
          const playerObj = playerData[sessionType][i];
          obj['name'] = playerObj['name'];
          obj['ccasId'] = playerObj['ccasId'];
          obj['casinoId'] = playerObj['casinoId'];
          obj['sessionType'] = sessionType === 'anon' ? 'Anonymous' : sessionType === 'known' ? 'Known' : 'Swiped';
          if (obj['ccasId']) {
            dataArr.push(obj);
          }
        }
      }
    }
    return dataArr;
  }

  viewOpenSessions(tableName, position) {
    const tablePosition = parseInt(position, 10) + 1;
    let tableId, sessionsData;
    const tableWithKeys = this.getIdsWithName();
    for (const tableKey in tableWithKeys) {
      if (tableWithKeys[tableKey] === tableName) {
        tableId = tableKey;
      }
    }
    const playerData = this.lastGameData[tableId]['playerCounts'];
    if (playerData) {
      for (let i = 0, iLen = playerData.length; i < iLen; i++) {
        if (parseInt(playerData[i]['pos'], 10) === tablePosition) {
          sessionsData = this.createDataToView(playerData[i]);
        }
      }
    }
    if (sessionsData) {
      event.stopPropagation();
      this.matDialog.open(OpenSessionsComponent, {
        width: dialogSize.small,
        data: sessionsData
      });
    }
  }

  openTableDash(tableName) {
    let tableObj;
    this.nodesMap.forEach((value, key) => {
      if (value['name'] === tableName) {
        tableObj = value;
      }
    });
    if (tableObj.host) {
      const jwtData = localStorage.getItem('jwt_cmr');
      const decodedJwt = this.jwtHelper.decodeToken(jwtData);
      const isPermitted = this.appService.hasPermissionOf('CASINO_MGR', 'ACCESS_TABLE_DASHBOARD');
      if (decodedJwt.applications.includes('TABLE_DASH') && isPermitted) {
        const casinoMngrUrl = protocol + webServerDNS + ':' + webCasinoManagerTLSPort;
        const tableDashboardURL = tableUIProtocol + tableObj.host + ':' + tableUIPort + '/single-table-view?access_token=' +
          jwtData + '&externalRedirection=' + casinoMngrUrl + '/#/overview&topologyId=' + tableObj.nodeId;
        window.open(tableDashboardURL);
      } else {
        this.snackBar.open(this.translate.instant
        ('application.app.common.labels.NO_ACCESS_TO_REQUESTED_PAGE'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });
      }
    }
  }

  openAlertsTab(severity, tableTopologyId, event: any) {
    event.stopPropagation();
    const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    const jwtToken = this.decodedTokenService.getJwtToken();
    if ((loggedInUserInfo.userId || loggedInUserInfo.superuser === true) && !this.jwtHelper.isTokenExpired(jwtToken)) {
      this.refreshTokenSub = this.authService.getRefreshToken('alrt').subscribe(res => {
        const alertUrl = protocol + webServerDNS + ':' + webAlertsTLSPort + '/#/alert/table/' + tableTopologyId + '?app=casino&severity=' + severity + '?access_token=' + res.access_token;
        window.open(alertUrl);
      });
    } else {
      const alertUrl = protocol + webServerDNS + ':' + webAlertsTLSPort + '/#/alert/table/' + '?app=casino&severity=' + severity;
      window.open(alertUrl);
    }
  }

  isNegativeNumber(propValue) {
    const value = parseFloat(propValue);
    return value < 0;
  }

  getNumber(propValue) {
    const num = parseFloat(propValue);
    let formattedNum;
    formattedNum = num < 0 ? num * -1 : num;
    return formattedNum;
  }

  getCasinoWLValue(tableName) {
    let reqValue;
    for (let i = 0, iLen = this.tableData.length; i < iLen; i++) {
      if (tableName === this.tableData[i]['TABLE_NAME']) {
        reqValue = this.tableData[i]['CASINO_WIN'];
      }
    }
    return reqValue;
  }

  updatePagination(obj) {
    this.dataService.updateGridData.next({paginationObj: obj, topologies: this.allNodeIds});
  }

  ngOnDestroy() {
    if (this.lastGameDataSub) {
      this.lastGameDataSub.unsubscribe();
    }
    if (this.refreshTokenSub) {
      this.refreshTokenSub.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
