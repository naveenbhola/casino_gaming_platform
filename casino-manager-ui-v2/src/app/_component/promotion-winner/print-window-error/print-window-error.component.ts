import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-print-window-error',
  template: `
  <h2 mat-dialog-title class="print-error-window-title">
    <span class="space-filler"></span>

    <button mat-icon-button tabindex="0">
      <mat-icon (click)="closePrintWindow()">close</mat-icon>
    </button>
  </h2>
  <mat-dialog-content class="print-error-window-content">
    <h5 class="msg-text">
      {{data.message | translate}}
    </h5>
  </mat-dialog-content>`,
  styleUrls: ['./print-window-error.component.scss']
})
export class PrintWindowErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private dialogRef: MatDialogRef<PrintWindowErrorComponent>,
              ) { }

  closePrintWindow() {
    this.dialogRef.close();
  }
}
