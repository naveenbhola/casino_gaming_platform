import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {
  initiatedChangeStatusObj: any;
  currentStatus: any;

  constructor(public dialogRef: MatDialogRef<ChangeStatusComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogRef.disableClose = true;
    this.initiatedChangeStatusObj = data.changeStatusObj;
    this.currentStatus = data.status;
    //console.log('this.currentStatus::', this.currentStatus);
  }

  ngOnInit() {
  }

  closeDialog(cmd): void {
    this.dialogRef.close(cmd);
  }

}
