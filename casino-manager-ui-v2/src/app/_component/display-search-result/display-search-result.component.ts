import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-display-search-result',
  templateUrl: './display-search-result.component.html',
  styleUrls: ['./display-search-result.component.scss']
})
export class DisplaySearchResultComponent implements OnInit {
  playerList = [];
  totalRecords: number;
  tableHeaders = [];
  typeOfResults;
  titleForTable = '';
  loading = false;
  constructor(private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              private appService: AppService,
              @Inject(MAT_DIALOG_DATA) public data,
              private dialogRef: MatDialogRef<DisplaySearchResultComponent>) {
    this.typeOfResults = this.data.type;
  }

  ngOnInit() {
    this.initTableHeader();
  }
  initTableHeader() {
    if (this.typeOfResults === 'user') {
      this.titleForTable = 'application.app.ALERTS_LABELS.Users';
      this.tableHeaders = [
        {title: 'application.app.common.labels.USER', type: 'lastfirstnameId', firstName: 'firstName',
          lastName: 'lastName', employeeId: 'employeeId'},
        {title: 'application.app.common.labels.TOPSUBNAV.USERNAME', type: 'text', row: 'userName'},
        {title: 'application.app.common.labels.TOPSUBNAV.LOGIN_LOCATION', type: 'text_no_translation', row: 'location'},
        {title: 'application.app.common.labels.TOPSUBNAV.LOGIN_TIME', type: 'dateTime', row: 'creationDate'}
      ];
    }
    if (this.typeOfResults === 'player') {
      this.titleForTable = 'application.app.common.labels.PLAYERS';
      if (this.appService.isCBPT) {
        this.tableHeaders = [
          {title: 'application.app.common.labels.PLAYERID', type: 'text_no_translation', row: 'casinoPlayerId'},
          {title: 'application.app.common.labels.PLAYER_NAME', type: 'nameImage', firstName: 'playerFirstName',
            lastName: 'playerLastName', imageFieldInObject: 'playerImage'},
          {title: 'PP_ID', type: 'text_no_translation', row: 'playerId'},
          {title: 'application.app.common.labels.TOPSUBNAV.LAST_SESSION_ID', type: 'text_no_translation', row: 'lastSessionId'},
          {title: 'application.app.common.labels.TOPSUBNAV.LAST_PLAYER_LOCATION', type: 'text_no_translation', row: 'lastTopologyNodeName'},
          {title: 'application.app.common.labels.TOPSUBNAV.SESSION_LOCATION', type: 'text', row: 'lastTopologyNodeName'},
          {title: 'application.app.common.labels.TOPSUBNAV.LAST_ACTIVITY_TIME', type: 'time', row: 'lastActiveDtm'},
          {title: 'Status', type: 'text', row: 'lastSessionStatus' }
        ];
      } else {
        this.tableHeaders = [
          {title: 'application.app.common.labels.PLAYERID', type: 'text_no_translation', row: 'casinoPlayerId'},
          {title: 'application.app.common.labels.PLAYER_NAME', type: 'nameImage', firstName: 'playerFirstName',
            lastName: 'playerLastName', imageFieldInObject: 'playerImage'},
          {title: 'application.app.common.labels.TOPSUBNAV.LAST_SESSION_ID', type: 'text_no_translation', row: 'lastSessionId'},
          {title: 'application.app.common.labels.TOPSUBNAV.LAST_PLAYER_LOCATION', type: 'text_no_translation', row: 'lastTopologyNodeName'},
          {title: 'application.app.common.labels.TOPSUBNAV.SESSION_LOCATION', type: 'text', row: 'lastTopologyNodeName'},
          {title: 'application.app.common.labels.TOPSUBNAV.LAST_ACTIVITY_TIME', type: 'time', row: 'lastActiveDtm'},
          {title: 'Status', type: 'text', row: 'lastSessionStatus' }
        ];
      }
    }
  }
  getSearchObj(evt) {
    this.playerList = evt;
    this.totalRecords = 0;
    this.loading = false;
    if (evt && evt.length) {
      this.totalRecords = evt.length;
    }
    if (this.totalRecords > 0) {
      this.loading = true;
    }
  }
  updateEventObj(evt) {
    if (evt.type === 'row-click') {
      if (evt.obj.playerId) {
        this.appService.openPlayerDashboard(evt.obj.playerId, this.appService.appGlobalObj.gamingDay);
      }
    }
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }
}
