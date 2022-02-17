import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {urls} from 'common-ui';
import {Observable} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';
import {DatePipe} from '@angular/common';
import * as _ from 'lodash';
export interface ChipData {
  chipId: string;
  topologyName: string;
  createDtm: string;
  denom: string;
  chipSetLabel: string;
  negotiability: string;
  currency: string;
  dealer: string;
  supervisor: string;
  status: string;
  suspectType: string;
  scanId: string;
  missingEvent: string;
}

import {ChipSetLabelObject} from '../chip-security/interfaces/chip-sets-label';

@Injectable({
  providedIn: 'root'
})
export class ChipSecurityService {

  chipTrayScans: string;
  scannedDataFilters = {};
  tableId = '';
  tableName = '';
  chipStatusChangeResult = new EventEmitter();
  chipStatusChangeScanResultPage = new EventEmitter();
  loading = new EventEmitter();

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private datepipe: DatePipe,
              private appService: AppService) {
  }

  setTableId(tableId) {
    this.tableId = tableId;
    localStorage.setItem('tableIdForChipSecurity', JSON.stringify(this.tableId));
  }

  getTableId() {
    return ( this.tableId || JSON.parse(localStorage.getItem('tableIdForChipSecurity'))  );
  }

  setTableName(tableName) {
    this.tableName = tableName;
    localStorage.setItem('tableNameForChipSecurity', JSON.stringify(this.tableName));
  }

  getTableName() {
    return ( this.tableName || JSON.parse(localStorage.getItem('tableNameForChipSecurity'))  );
  }

  setChipTrayScans(payloadArray) {
    localStorage.setItem('chipTrayScans', JSON.stringify(payloadArray));
  }

  getChipTrayScans() {
    return JSON.parse(localStorage.getItem('chipTrayScans'));
  }

  setTableScannedDataFilters(_filters) {
    this.scannedDataFilters = _filters;
  }

  getTableScannedDataFilters() {
    return this.scannedDataFilters;
  }

  getMissingChips(options: {}) {
    const params = this.formatParams(options);
    const url = `${urls.chipSet.missingChips}`;
    return this.http.get<HttpResponse<Object>>(url, params);
  }

  updateChipStatus(options: {}, urlParams = []): Observable<any> {
    let url = `${urls.chipSet.missingChips}`;
    if (urlParams['params']) {
      let allParams = '';
      Object.keys(urlParams['params']).forEach((key, index) => {
        if (key === 'start') {
          urlParams['params'][key] = 1;
        }
        allParams += key + `=` + urlParams['params'][key] + `&`;
      });
      url = url + `?` + allParams.substring(0, allParams.length - 1);
    }
    return this.http.post<HttpResponse<Object>>(url, options, {observe: 'response'});
  }

  getChipTray(gaminDay, options: {}): Observable<any> {
    const url = `${urls.chipSet.chipTrayScan_NEW}?gamingDay=${gaminDay}`;
    return this.http.get<any>(url, options);
  }

  getChipSetData(options: {}): Observable<ChipSetLabelObject> {
    return this.http.get<ChipSetLabelObject>(urls.chipSet.chipSet, options);
  }

  /*Pit & Table level missing chip scan*/
  getScanDetailData(options: {}): Observable<HttpResponse<Object>> {
    const url = `${urls.chipSet.missingChipScan}`;
    return this.http.get<HttpResponse<Object>>(url, options);
  }

  getMissingChipDetails(options: {}): Observable<HttpResponse<Object>> {
    const url = `${urls.chipSet.getScanCompDetail}`;
    return this.http.get<HttpResponse<Object>>(url, options);
  }

  updateChipsStatus(postData, isScanResultPage = false, urlParams) {
    this.loading.emit('updateChipStatusCall');
    this.updateChipStatus(postData, urlParams)
      .subscribe(response => {
        if (response) {
          if (isScanResultPage) {
            this.chipStatusChangeScanResultPage.emit(response);
          } else {
            this.chipStatusChangeResult.emit(response);
          }
        }

      }, errorMessage => {

        const message = 'application.app.CASINO_MGR_LABELS.MESSAGE.CHANGE_STATUS_REQUEST_INPROGRESS';
        this.snackBar.open(this.translate.instant(message), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__warn'
        });

        if (isScanResultPage) {
          this.chipStatusChangeScanResultPage.emit(true);
        } else {
          this.chipStatusChangeResult.emit(true);
        }
      });
  }

  handleStatusSuspectTypeCombo(_postData, _suspectType, _loggedInUser, _status = 'suspect') {
    const suspectType = _suspectType.toUpperCase();
    if (_postData && suspectType && suspectType !== 'SELECT') {
      if (suspectType === 'VALID') {
        if (_postData['status']) {
          _postData['previousStatus'] = _postData['status'];
        }
        if (_postData['suspectType']) {
          _postData['previousSuspectType'] = _postData['suspectType'];
        }
        _postData['status'] = suspectType;
      } else {
        let status = _status.toUpperCase();
        if (status !== 'SUSPECT' && status !== 'WEAK') {
          status = 'SUSPECT';
        }
        if (_postData['status']) {
          _postData['previousStatus'] = _postData['status'];
        }
        if (_postData['suspectType'] && _postData['suspectType'] !== 'VALID') {
          _postData['previousSuspectType'] = _postData['suspectType'];
        }
        if (_postData['suspectType'] === 'VALID' && !_postData['gamingDay']) {
          if (this.appService.localGamingDays) {
            const count = this.appService.localGamingDays.length;
            _postData['gamingDay'] = this.appService.localGamingDays[count - 1];
          }
          if (!_postData['topologyId']) {
            _postData['topologyId'] = this.getTableId();
          }
        }
        _postData['status'] = status;
        _postData['suspectType'] = suspectType;
      }
      _postData['updatedBy'] = _loggedInUser;
    }
    return _postData;
  }

  formatParams(options) {
    const formatDataForkeys = ['supervisor', 'dealer'];
    formatDataForkeys.forEach((value) => {
      if (options['params'][value]) {
        const fieldValues = options['params'][value].split(',');
        if (fieldValues.length > 1) {
          let formattedValues = '';
          let i = 1;
          fieldValues.map((item) => {
            if (i % 2 === 0) {
              formattedValues += item + ',';
            } else {
              formattedValues += item + '@$';
            }
            i++;
          });
          options['params'][value] = formattedValues.substring(0, formattedValues.length - 1);
        }
      }
    });
    return options;
  }

  transformMultipleDateStr(input, seprator, dateFormat): string {
    if (_.isEmpty(input)) {
      return;
    }
    if (input.indexOf(seprator) === -1) {
      return this.datepipe.transform(input, dateFormat);
    }
    const eleArray = input.split(seprator);
    for (let i = 0; i < eleArray.length; i++) {
      eleArray[i] = this.datepipe.transform(eleArray[i], dateFormat);
    }

    return eleArray.join(seprator);
  }
}
