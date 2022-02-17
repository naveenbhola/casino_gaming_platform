import {Component, OnInit, Inject} from '@angular/core';
import { VERSION } from '@angular/material/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.scss']
})
export class AlertBoxComponent implements OnInit {
  message: string = '';
  title: string = '';
  okButtonText = 'Ok';
  dialogType;
  statusType;
  languageChanged;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<any>,
              public translate: TranslateService,
              public appService: AppService) {
    if (data) {
      this.message = data.message || this.message;
      this.title = data.title || this.title;
      if (data.buttonText) {
        this.okButtonText = data.buttonText.cancel || this.okButtonText;
      }
    }
    this.handleSubscription();
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  ngOnInit() {
    this.dialogType = this.data.dialogType;
    this.statusType = this.data.statusType;
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
}
