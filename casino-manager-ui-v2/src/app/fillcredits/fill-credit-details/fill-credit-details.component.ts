import {Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fill-credit-details',
  templateUrl: './fill-credit-details.component.html',
  styleUrls: ['./fill-credit-details.component.scss']
})
export class FillCreditDetailsComponent implements OnInit {
  requestedTime;
  intransitTime;
  completedTime;
  chipsetsDataByDenom;
  currentStatus;

  constructor(public dialogRef: MatDialogRef<FillCreditDetailsComponent>,
              //private cageService: CageService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    if (this.data.data.status.txnrequests.find(ob => ob.reqState === 'Requested')) {
      this.requestedTime = this.data.data.status.txnrequests.find(ob => ob.reqState === 'Requested').date;
    }
    if (this.data.data.status.txnrequests.find(ob => ob.reqState === 'In Transit')) {
      this.intransitTime = this.data.data.status.txnrequests.find(ob => ob.reqState === 'In Transit').date;
    }
    if (this.data.data.status.txnrequests.find(ob => ob.reqState === 'Completed')) {
      this.completedTime = this.data.data.status.txnrequests.find(ob => ob.reqState === 'Completed').date;
    }

    this.currentStatus = this.data.data.currentStatus.toUpperCase();


    this.formatChipsetDetail();
  }


  formatChipsetDetail() {
    this.chipsetsDataByDenom = [];
    const chipsetsData = this.formatChipsetData(this.data.data.chipGrouping.fillCreditChipMapping);

    for (let i = 0; i < chipsetsData.length; i++) {
      if (this.chipsetsDataByDenom.length === 0) {
        const obj = {
          chipSetLabel: chipsetsData[i].chipSetLabel,
          label: chipsetsData[i].chipSetLabel,
          denom: chipsetsData[i].denom,
          count: parseFloat(chipsetsData[i].count),
          totalValue: chipsetsData[i].totalValue,
          total: parseFloat(chipsetsData[i].totalValue),
          byDenom: [{denom: chipsetsData[i].denom, count: chipsetsData[i].count, total: chipsetsData[i].totalValue}]
        };
        this.chipsetsDataByDenom.push(obj);
      } else {
        const isChipsetExit = this.chipsetsDataByDenom.findIndex(chipset => chipset.chipSetLabel === chipsetsData[i].chipSetLabel);
        if (isChipsetExit > -1) {
          this.chipsetsDataByDenom[isChipsetExit].count += parseFloat(chipsetsData[i].count);
          this.chipsetsDataByDenom[isChipsetExit].total += parseFloat(chipsetsData[i].totalValue);
          this.chipsetsDataByDenom[isChipsetExit].byDenom.push({
            denom: chipsetsData[i].denom,
            count: chipsetsData[i].count,
            total: chipsetsData[i].totalValue
          })
        } else {
          const obj = {
            chipSetLabel: chipsetsData[i].chipSetLabel,
            label: chipsetsData[i].chipSetLabel,
            denom: chipsetsData[i].denom,
            count: parseFloat(chipsetsData[i].count),
            totalValue: chipsetsData[i].totalValue,
            total: parseFloat(chipsetsData[i].totalValue),
            byDenom: [{denom: chipsetsData[i].denom, count: chipsetsData[i].count, total: chipsetsData[i].totalValue}]
          };
          this.chipsetsDataByDenom.push(obj);
        }
      }
    }
  }

  formatChipsetData = function (chipSetData) {
    const data = [];
    for (let i = 0; i < chipSetData.length; i++) {
      chipSetData[i]['total'] = chipSetData[i].totalValue;
      chipSetData[i]['label'] = chipSetData[i].chipSetLabel;
      data.push(chipSetData[i]);
    }
    return data;
  }


  closeDialogBox(): void {
    this.dialogRef.close();
  }
}
