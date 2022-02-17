import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy} from '@angular/core';
import {AppService} from '../../app.service';
import {WDTSUtility} from '../../utils/wdts-utils';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-player-grid-view',
  templateUrl: './player-grid-view.component.html',
  styleUrls: ['./player-grid-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerGridViewComponent implements OnInit {
  @Input() playerListArray = [];
  @Input() totalRecords;
  @Input() currentPaginationStatus;
  @Output() emitPaginationEvtFromGrid = new EventEmitter<any>();
  totalRecordsForGrid = 0;
  math = Math;

  constructor(private appService: AppService, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.totalRecordsForGrid = this.totalRecords;
  }

  openPlayeDashBoard(plrOb) {
    this.appService.openPlayerDashboard(plrOb.CCAS_ID_PLAYER, this.appService.appGlobalObj.gamingDay);
  }

  updatePagination(evt) {
    this.emitPaginationEvtFromGrid.emit(evt);
  }

  getTranslatedVal(val) {
    if (WDTSUtility.equalIgnoreCase(val, 'ANONYMOUS', true, true)) {
      return this.translateService.instant('ANONYMOUS');
    } else {
      return val;
    }
  }

  isPlayerAnonymous(val) {
    let retval = false;
    if (WDTSUtility.equalIgnoreCase(val, 'ANONYMOUS', true, true)) {
      retval = true;
    }
    return retval;
  }

  checkIsCBPTONAndNonAnony(val) {
    let retval = true;
    if (this.isPlayerAnonymous(val) && !this.appService.isCBPT) {
      retval = false;
    }
    return retval;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
