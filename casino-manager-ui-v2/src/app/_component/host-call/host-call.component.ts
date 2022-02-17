import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonTranslationService, ConfigurationService} from 'common-ui';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-host-call',
  templateUrl: 'host-call.component.html',
  styleUrls: ['host-call.component.scss']
})
export class HostCallComponent implements OnInit, OnDestroy {
  languageChanged;
  hostCallForm;
  pitName;
  hostCallSystemData;
  hostCall;
  minAllowableVal = 1;
  minAllowableVal_five = 5;
  maxAllowableVal = 9999999;
  hasHostCallPermission;

  // Subscribers
  hostCallDataSub: Subscription;

  constructor(private appService: AppService,
              private configurationService: ConfigurationService,
              private matSnackBar: MatSnackBar,
              public dialogRef: MatDialogRef<HostCallComponent>,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.pitName = data.pitName;
    this.hostCallSystemData = data.hostCallSystemData;
    this.hostCall = data.hostCall;

    this.hostCallForm = fb.group({
      win: [this.checkIsNAN(this.hostCall.win), Validators.compose([Validators.required, Validators.min(1), Validators.max(9999999)])],
      loss: [this.checkIsNAN(this.hostCall.loss), Validators.compose([Validators.required, Validators.min(1), Validators.max(9999999)])],
      avgBet: [this.checkIsNAN(this.hostCall.avgBet), Validators.compose([Validators.required, Validators.min(this.minAllowableVal_five), Validators.max(1000000)])],
      handle: [this.checkIsNAN(this.hostCall.handle), Validators.compose([Validators.required, Validators.min(this.minAllowableVal_five), Validators.max(9999999)])],
      gamesPlayed: [this.checkIsNAN(this.hostCall.gamesPlayed), Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])],
      theoWin: [this.checkIsNAN(this.hostCall.theoWin), Validators.compose([Validators.required, Validators.min(1), Validators.max(9999999)])],
    });
    this.handleSubscription();
  }

  checkIsNAN(Number) {
    return isNaN(Number) ? 0 : Number;
  }

  ngOnInit() {
    this.hasHostCallPermission = this.appService.hasPermissionOf('CASINO_MGR', 'ANONYMOUS_PLAY_CRITERIA');
  }

  saveAnonymousHostCallData() {
    if (!this.hostCallForm.valid) {
      return;
    } else {
      if (this.hostCallSystemData.propertyValues) {
        for (let propertyval in this.hostCallSystemData.propertyValues) {
          switch (this.hostCallSystemData.propertyValues[propertyval].propertyCode) {
            case 'com.wdts.anonymous.session.win':
              this.hostCallSystemData.propertyValues[propertyval].propertyValue = this.hostCallForm.value.win;
              break;
            case 'com.wdts.anonymous.session.lose':
              this.hostCallSystemData.propertyValues[propertyval].propertyValue = this.hostCallForm.value.loss;
              break;
            case 'com.wdts.anonymous.session.avg.bet':
              this.hostCallSystemData.propertyValues[propertyval].propertyValue = this.hostCallForm.value.avgBet;
              break;
            case 'com.wdts.anonymous.session.handle':
              this.hostCallSystemData.propertyValues[propertyval].propertyValue = this.hostCallForm.value.handle;
              break;
            case 'com.wdts.anonymous.session.games.played':
              this.hostCallSystemData.propertyValues[propertyval].propertyValue = this.hostCallForm.value.gamesPlayed;
              break;
            case 'com.wdts.anonymous.session.theo.win':
              this.hostCall.theoWin = parseInt(this.hostCallSystemData.propertyValues[propertyval].propertyValue);
              this.hostCallSystemData.propertyValues[propertyval].propertyValue = this.hostCallForm.value.theoWin;
              break;
          }
        }
      }
      this.hostCallDataSub = this.configurationService.putHostcallData(this.hostCallSystemData, this.hostCallSystemData.configurationId).subscribe(data => {
        this.matSnackBar.open(this.translate.instant('application.app.CONFIGURATION_LABELS.SYSTEM.MESSAGE.SAVED_SUCCESSFULLY'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__success'
        });
        this.dialogRef.close();
      });
    }
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  handleSubscription() {
    const language = sessionStorage.getItem('language');
    if (language) {
      this.translate.setDefaultLang(language);
    }
    this.languageChanged = this.appService.languageChanged
      .subscribe((translation) => {
        this.translate.setDefaultLang(translation);
      });
  }

  ngOnDestroy() {
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
    }
    if (this.hostCallDataSub) {
      this.hostCallDataSub.unsubscribe();
    }
  }
}
