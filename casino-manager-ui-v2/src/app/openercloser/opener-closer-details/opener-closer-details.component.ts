import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {CageService} from '../../services/cage.service';


@Component({
  selector: 'app-opener-closer-details',
  templateUrl: './opener-closer-details.component.html',
  styleUrls: ['./opener-closer-details.component.scss']
})
export class OpenerCloserDetailsComponent implements OnInit, OnDestroy {
  openerTotalValue;
  closerTotalValue;
  openerChipSetData;
  closerChipSetData;
  GamingDayOpenerLength;
  GamingDayCloserLength;
  toggleOpener = true;
  chipTraySub;
  constructor(
    public dialogRef: MatDialogRef<OpenerCloserDetailsComponent>,
    private cageService: CageService,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.getChipTrayData();
  }
  getChipTrayData() {
      this.chipTraySub = this.cageService.getChipTrayOpenerCloser(this.data).subscribe((response) => {
        this.createChipSetPanelData(response);
      });
  }
  createChipSetPanelData(data) {
    this.GamingDayOpenerLength = Object.keys(data.GamingDayOpener).length;
    this.GamingDayCloserLength = Object.keys(data.GamingDayCloser).length;
    this.openerTotalValue = data.GamingDayOpener['openerValue'];
    this.closerTotalValue = data.GamingDayCloser['closerValue'];
    this.openerChipSetData = data.GamingDayOpener['openerChipSummary'] ?
      this.createDataByChipsLabel(data.GamingDayOpener['openerChipSummary']['casinoOwned']['byChipset']) : [];
    this.closerChipSetData = data.GamingDayCloser['closerChipSummary'] ?
      this.createDataByChipsLabel(data.GamingDayCloser['closerChipSummary']['casinoOwned']['byChipset']) : [];
  }
  createDataByChipsLabel(data) {
    const chipsData = data;
    for (let i = 0, iLen = chipsData.length; i < iLen; i++) {
      chipsData[i].count = this.getChipsCount(chipsData[i]['byDenom']);
    }
    return chipsData;
  }
  getChipsCount(chipsArr) {
    let count = 0;
    for (let j = 0, jLen = chipsArr.length; j < jLen; j++) {
      count += chipsArr[j].count;
    }
    return count;
  }
  closeDialogBox(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.chipTraySub) {
      this.chipTraySub.unsubscribe();
    }

  }
}
