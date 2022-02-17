import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {CageService, DecodedTokenService} from '../../../../common-ui-lib';
import {DatePipe} from '@angular/common';
import {AppService} from '../../app.service';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-roll-time',
  templateUrl: './roll-time.component.html',
  styleUrls: ['./roll-time.component.scss']
})
export class RollTimeComponent implements OnInit, OnDestroy {
  @Input() topologyId;
  dataForRollTime = [];
  rollDateArray = [];
  rollTimeDataMap = new Map();
  gamingDaySelected;
  selectedRows = [];
  JSON1 = JSON;
  maxDate = this.addNewDay();
  minDate = new Date();
  rollTimeUpdatPermited = false;
  userId;
  employeeId;
  postRollTimeDtSub;
  getRollDTMSub;
  loading = false;

  constructor(private dialogRef: MatDialogRef<RollTimeComponent>,
              private cageService: CageService,
              private datePipe: DatePipe,
              private snackBar: MatSnackBar,
              private appService: AppService,
              private translate: TranslateService,
              private decodedTokenService: DecodedTokenService) {
  }

  ngOnInit() {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    this.userId = jwtToken.userId;
    this.employeeId = jwtToken.employeeId;
    this.checkRollTimePermission();
    this.getDataForRollTime();
  }

  gamingDayChanged() {
    this.dataForRollTime = this.rollTimeDataMap.get(this.gamingDaySelected);
  }

  addNewDay() {
    const current = new Date();
    const followingDay = new Date(current.getTime() + 86400000);
    return followingDay;
  }

  getDataForRollTime() {
    this.loading = true;
    this.getRollDTMSub = this.cageService.getRollDTM(this.topologyId).subscribe(res => {
      res.forEach((obj: any, idx) => {
        obj['path'] = this.convertStringToArry(obj.topologyNode.path, obj.topologyNode.shortName);
        obj['nodeId'] = obj.topologyNode.nodeId;
        obj['checked'] = false;
        // obj['disabled'] = (obj.rollMode === null || obj.rollMode === 'Auto') ? false : true;
        obj['disabled'] = ( Math.abs(new Date(obj.nextRollDtm).getTime() - new Date().getTime()) / (3600 * 1000)) > 24;
        let tempDate = this.datePipe.transform(obj.currentGamingDay, 'dd-MM-yyyy');
        if (this.rollTimeDataMap.get(tempDate)) {
          const tempArry = this.rollTimeDataMap.get(tempDate);
          tempArry.push(obj);
          this.rollTimeDataMap.set(tempDate, tempArry);
        } else {
          this.rollTimeDataMap.set(tempDate, [obj]);
        }
        tempDate = '';
      });
      this.rollDateArray = Array.from(this.rollTimeDataMap.keys());
      if (!this.gamingDaySelected) {
        this.gamingDaySelected = this.rollDateArray[0];
      }
      this.dataForRollTime = this.rollTimeDataMap.get(this.gamingDaySelected);
      this.loading = false;
    }, err => {
      console.log(err, 'Error');
    });

  }

  addOrRemoveRows(obj, val) {
    if (val.checked) {
      if (!this.selectedRows.find(ob => ob.nodeId === obj.nodeId)) {
        if (!obj['disabled']) {
          this.selectedRows.push(obj);
          obj['checked'] = true;
        }
      }
    } else {
      this.selectedRows = this.selectedRows.filter(ob => ob.nodeId !== obj.nodeId);
      if (!obj['disabled']) {
        obj['checked'] = false;
      }
    }

  }

  addOrRemoveAccordingToTopology(obj, val) {
    for (let i = 0; i <= this.dataForRollTime.length - 1; i++) {
      if (this.dataForRollTime[i].path.find(o => o.trim() === obj.path[obj.path.length - 1].trim())) {
        this.addOrRemoveRows(this.dataForRollTime[i], val);
      }
    }
  }

  convertStringToArry(arStr, lastNode) {
    arStr = arStr.replace('[', '');
    arStr = arStr.replace(']', '');
    arStr = arStr.split(',').reverse();
    arStr.push(lastNode);
    return arStr;
  }

  createPostData() {
    const retunVal = [];
    for (let i = 0; i <= this.selectedRows.length - 1; i++) {
      const temp = {};
      temp['nextRollDtm'] = this.selectedRows[i].nextRollDtm;
      temp['nodeId'] = this.selectedRows[i].nodeId;
      retunVal.push(temp);
    }
    return retunVal;
  }

  submitSelectedRollDate() {
    const reqObj = this.createPostData();
    this.postRollTimeDtSub = this.cageService.postRollTimeData(reqObj, this.userId, this.employeeId).subscribe(res => {
      this.rollTimeDataMap = new Map();
      this.snackBar.open(this.translate.instant('application.app.common.labels.TOPSUBNAV.ROLL_TIME_UPDATED'), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__success'
      });
      this.getDataForRollTime();

    }, err => {
      console.log(err);
    });
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  checkRollTimePermission() {
    this.rollTimeUpdatPermited = this.appService.hasPermissionOf('CASINO_MGR', 'ROLL_TIME_UPDATE_CMR');
  }

  triggerDtChange(obj) {
    if (obj.checked) {
      for (let i = 0; i < this.selectedRows.length; i++) {
        /*const temp = this.selectedRows[i]['path'].join('/');*/
        /*const objPath = obj['path'].join('/');*/
        /*if (temp.includes(objPath)) {*/
        this.selectedRows[i]['nextRollDtm'] = obj['nextRollDtm'];
        /*}*/
      }
    }
  }

  ngOnDestroy() {
    if (this.postRollTimeDtSub) {
      this.postRollTimeDtSub.unsubscribe();
    }
    if (this.getRollDTMSub) {
      this.getRollDTMSub.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }


}
