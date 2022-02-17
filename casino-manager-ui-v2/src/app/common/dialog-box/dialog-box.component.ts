import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {ChipSetLabelObject, EditableChipSetObject, LabelObject, EditableCompanyObj} from '../../chip-security/interfaces/chip-sets-label';
import {ChipSecurityService} from '../../services/chip-security.service';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {
  arr: any;
  chipDataSource: any;
  labelEdited: boolean;
  loading: boolean;
  chipSetLabels: any;
  selectedLabelIndex: number;
  selectedLabel: EditableChipSetObject;
  constructor(private dialogRef: MatDialogRef<DialogBoxComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private chipSecurityService: ChipSecurityService) {
    this.getChipSetLabels();
    this.chipDataSource = [];
    this.arr = [];
    this.labelEdited = false;
  }

  ngOnInit() {
  }
  closeDialogBox(): void {
    this.dialogRef.close();
  }

  selectDenom(denom, label) {
    const tempArr = [];
    let tempLabel = JSON.parse(JSON.stringify(label));
    tempLabel = this.createReqObject(tempLabel);
    tempArr.push(denom);
    tempLabel.labels[0].denominations = tempArr;
    if (this.arr.length > 0) {
      if (!this.isDuplicate(tempLabel)) {
        this.arr.push(tempLabel);
        this.chipDataSource = new MatTableDataSource(this.arr);
      }
    } else {
      this.arr.push(tempLabel);
      this.chipDataSource = new MatTableDataSource(this.arr);
    }
  }

  isDuplicate(label): boolean {
    let isSame = true;
    for (let i = 0, len = this.arr.length; i < len; i++) {
      const item = this.arr[i];
      if (item.casinoSiteId === label.casinoSiteId && item.chipsetId === label.chipsetId &&
        item.currency === label.currency && item.negotiability === label.negotiability &&
        item.gamingCompany.companyName === label.gamingCompany.companyName &&
        item.gamingCompany.gamingCompanyId === label.gamingCompany.gamingCompanyId) {
        const itemDenom = item.labels[0].denominations[0];
        const labelDenom = label.labels[0].denominations[0];
        if (itemDenom === labelDenom) {
          isSame = true;
          break;
        } else {
          isSame = false;
        }
      } else {
        isSame = false;
      }
    }
    return isSame;
  }

  captureTabKey(event) {
    const code = (event.keyCode ? event.keyCode : event.which);
    if (code === 9) {
      event.preventDefault();
      return false;
    }
  }

  createReqObject(label): any {
    const labelTemp = <EditableChipSetObject>{};
    labelTemp.gamingCompany = <EditableCompanyObj>{};
    labelTemp.labels = [<LabelObject>{}];
    if (label && label.hasOwnProperty('labels') && label.hasOwnProperty('gamingCompany')) {
      labelTemp.labels[0].denominations = [label.labels[0].denominations[0]];
    }
    return labelTemp;
  }

  createDataSource() {
    this.arr.push(this.selectedLabel);
    this.chipDataSource = new MatTableDataSource(this.arr);
  }

  deleteRow(row, index) {
    this.arr.splice(index, 1);
    this.chipDataSource = new MatTableDataSource(this.arr);
  }

  getChipSetLabels(): void {
    this.loading = true;
    const reqObj = {
      observe: 'response',
      params: {
        sortField: 'LABEL',
        sortOrder: 'ASC'
      }
    };
    this.chipSecurityService.getChipSetData(reqObj)
      .subscribe((response: ChipSetLabelObject) => {
        this.loading = false;
        this.chipSetLabels = response.body;
        const tempObject = JSON.parse(JSON.stringify(this.chipSetLabels[0]));
        this.selectedLabel = this.createReqObject(tempObject);
        this.selectedLabelIndex = 0;
      });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
