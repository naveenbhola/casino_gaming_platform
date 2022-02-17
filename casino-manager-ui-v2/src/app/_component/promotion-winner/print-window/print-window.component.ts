import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-print-window',
  template: `<iframe [attr.src]="urlSafe ? urlSafe : null" frameBorder="0" (load)="onLoad($event)" width="100%" height="95%"></iframe>
  <div class="print-dialog-footer">
    <div class="space-filler"></div>
    <button mat-stroked-button (click)="closePrintWindow()">Close</button>
  </div>`,
  styleUrls: ['./print-window.component.scss']
})
export class PrintWindowWinnerComponent implements OnInit {
  urlSafe: SafeResourceUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private dialogRef: MatDialogRef<PrintWindowWinnerComponent>,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
  }
  onLoad(evt) {
    this.data.sub.next('success');
  }

  closePrintWindow() {
    this.dialogRef.close();
  }
}
