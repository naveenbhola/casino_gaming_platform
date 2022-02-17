import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppService} from '../../app.service';
import {DecodedTokenService, AuthService, protocol, webPlayerDashboardTLSPort, webServerDNS} from 'common-ui';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-open-sessions',
  templateUrl: './open-sessions.component.html',
  styleUrls: ['./open-sessions.component.scss']
})
export class OpenSessionsComponent implements OnInit, OnDestroy {
  tableHeaders;
  tableData;
  totalRecords = 0;
  titleNotReq = true;
  refreshTokenSub;
  constructor(
    private appService: AppService,
    private decodedTokenService: DecodedTokenService,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<OpenSessionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.tableData = this.data;
    this.totalRecords = (this.data).length;
    this.setTableHeaders();
  }
  setTableHeaders() {
    if (this.appService.isCBPT){
      this.tableHeaders = [
        {title: 'session-type', type: 'session-type', row: 'sessionType'},
        {title: 'application.app.common.labels.PLAYERID', type: 'text_no_translation', row: 'casinoId', sortable: false},
        {title: 'application.app.common.labels.CCAS_ID', type: 'text_no_translation', row: 'ccasId', sortable: false},
        {title: 'application.app.common.labels.PLAYER_NAME', type: 'text_no_translation', row: 'name', sortable: false},
      ];
    } else{
      this.tableHeaders = [
        {title: 'session-type', type: 'session-type', row: 'sessionType'},
        {title: 'application.app.common.labels.PLAYERID', type: 'text_no_translation', row: 'casinoId', sortable: false},
        {title: 'application.app.common.labels.PLAYER_NAME', type: 'text_no_translation', row: 'name', sortable: false},
      ];
    }
  }
  updateEventObj(node) {
    switch (node.type) {
      case 'row-click':
        if (!this.appService.isCBPT){
          return;
        }
        this.openPlayerDash(node.obj);
        break;
    }
  }
  openPlayerDash(nodeObj) {
    const ccas_ID = parseInt(nodeObj['ccasId'], 10);
    const gamingDay = this.appService.appGlobalObj.gamingDay;
    const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    const jwtToken = this.decodedTokenService.getJwtToken();
    if ((loggedInUserInfo.userId || loggedInUserInfo.superuser === true) && !this.jwtHelper.isTokenExpired(jwtToken)) {
      this.refreshTokenSub = this.authService.getRefreshToken('plr').subscribe( res => {
        const playerDashboardUrl = protocol + webServerDNS + ':' + webPlayerDashboardTLSPort + '/#/player/session/' +
          ccas_ID + '/' + gamingDay  + '?access_token=' + res['access_token'];
        window.open(playerDashboardUrl);
      });
    } else {
      const playerDashboardUrl = protocol + webServerDNS + ':' + webPlayerDashboardTLSPort + '/#/player/session/' + ccas_ID +
        '/' + gamingDay;
      window.open(playerDashboardUrl);
    }
  }
  closeTheBox() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.refreshTokenSub) {
      this.refreshTokenSub.unsubscribe();
    }

  }
}
