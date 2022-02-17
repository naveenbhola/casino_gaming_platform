import {Component, Inject, Input, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-print-window',
  templateUrl: './print-window.component.html',
  styleUrls: ['./print-window.component.scss']
})
export class PrintWindowComponent implements OnInit {
  @Input() reportURL: string;
  urlSafe: SafeResourceUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public dataUrl,
              private dialogRef: MatDialogRef<PrintWindowComponent>,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.dataUrl);
  }
  closePrintWindow() {
    this.dialogRef.close();
  }
}
