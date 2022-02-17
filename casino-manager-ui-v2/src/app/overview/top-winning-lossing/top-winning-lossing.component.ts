import { Component, Input, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import {TranslateService} from '@ngx-translate/core';
import {CommonTranslationService} from 'common-ui';

@Component({
  selector: 'app-top-winning-lossing',
  templateUrl: './top-winning-lossing.component.html',
  styleUrls: ['./top-winning-lossing.component.scss']
})
export class TopWinningLossingComponent implements OnInit {
  languageChanged;
  playersListColumns: string[] = ['playername', 'playerwinloss'];
  @Input() winningPlayersList: [];
  @Input() losingPlayersList: [];
  constructor(
    private appService: AppService,
    private translate: TranslateService,
    private commonTranslation: CommonTranslationService
    ) {
    this.handleSubscription();
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

  ngOnInit() {
  }

}
