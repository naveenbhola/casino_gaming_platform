import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {ChipSecurityService} from '../../services/chip-security.service';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['confirmation-box.component.scss']
})
export class ConfirmationBoxComponent implements OnInit {

  dialogType;
  postData;
  title = '';
  languageChanged;
  message;
  urlParams;

  constructor(private dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private translate: TranslateService,
              private appService: AppService,
              private chipSecurityService: ChipSecurityService) {
    this.handleSubscription();
  }

  handleSubscription() {
    const languageInSession = sessionStorage.getItem('language');
    if (typeof this.appService.selectedLanguage !== 'undefined') {
      this.translate.setDefaultLang(this.appService.selectedLanguage);
    } else if (typeof languageInSession !== 'undefined') {
      this.translate.setDefaultLang(languageInSession);
    }

    this.languageChanged = this.appService.languageChanged
      .subscribe((translation) => {
        this.translate.setDefaultLang(translation);
      });
  }

  ngOnInit() {
    this.dialogType = this.data.dialogType;
    this.postData = this.data.postData;
    this.message = this.data.message;
    this.urlParams = this.data.urlParams;
    this.title = this.data.title || this.title || 'Confirm';
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dispatchEvent();
    this.onClose();
  }

  dispatchEvent() {
    switch (this.dialogType) {
      case 'chip-detail-status-change':
        this.chipSecurityService.updateChipsStatus(this.postData, true, this.urlParams);
        break;
      default:
        this.chipSecurityService.updateChipsStatus(this.postData, false, this.urlParams);
        break;
    }
  }

}
