import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  CommonTranslationService,
  PromotionService,
  DecodedTokenService,
  AuthService,
  ConfigurationService,
  protocol,
  webServerDNS,
  webAlertsTLSPort
} from 'common-ui';
import {JwtHelperService} from "@auth0/angular-jwt";
import {AppService} from '../app.service';
import * as _ from 'lodash';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-topsubnav-data-bar',
  templateUrl: 'topsubnav-data-bar.component.html',
  styleUrls: ['topsubnav-data-bar.component.scss']
})
export class TopSubnavDataBarComponent implements OnInit, OnDestroy {
  @Input() alertCounts;
  @Input() topologyStatistics;
  @Input() backButton;
  // private currentToplogyId: number;
  private currentGamingDay: Date;
  // Subcribers
  languageChanged: Subscription;
  globleAnonHostSub: Subscription;
  globlAnonHostSub: Subscription;
  refreshTokenSub: Subscription;
  isPlayerAdjustEnabledSub: Subscription;
  promotionEnableSub: Subscription;
  FCTXNSub: Subscription;


  hasAdvKpiPermission;
  advKpis;
  currentTopologyId;
  math = Math;

  constructor(private translate: TranslateService,
              private commonTranslation: CommonTranslationService,
              private configurationService: ConfigurationService,
              private decodedTokenService: DecodedTokenService,
              private jwtHelper: JwtHelperService,
              private PromotionSvc: PromotionService,
              private authService: AuthService,
              private appService: AppService) {
  }

  ngOnInit() {
    this.hasAdvKpiPermission = this.appService.hasPermissionOf('CASINO_MGR', 'VIEW_ADVANCED_CASINO_KPIS');
    this.advKpis = ['UTILIZATION', 'THEO_WIN', 'HOLD', 'RATED_PLAY'];
    this.handleSubscription();
    this.checkGlobalCbpt();
    this.checkGlobalAnonymousHostAlert();
    this.checkPlayerAdustmentEnabled();
    this.checkPromotionWinnerEnabled();
    this.checkFctxnEnabled();
  }


  openAlerts = function (severity) {
    this.currentTopologyId = this.getCurrentTopologyId();
    const loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    const jwtToken = this.decodedTokenService.getJwtToken();
    if ((loggedInUserInfo.userId || loggedInUserInfo.superuser === true) && !this.jwtHelper.isTokenExpired(jwtToken)) {
      this.refreshTokenSub = this.authService.getRefreshToken('alrt').subscribe(res => {
        const treasuryUrl = protocol + webServerDNS + ':' + webAlertsTLSPort + '/#/alert/table/' + this.currentTopologyId + '?app=casino&severity=' + severity + '&access_token=' + res.access_token;
        window.open(treasuryUrl);
      });
    } else {
      const treasuryUrl = protocol + webServerDNS + ':' + webAlertsTLSPort + '/#/alert/table/' + '?app=casino&severity=' + severity;
      window.open(treasuryUrl);
    }
  }

  getCurrentTopologyId() {
    if (this.appService.appGlobalObj.currentPitId) {
      return this.appService.appGlobalObj.currentPitId;
    } else if (this.appService.appGlobalObj.currentOAId) {
      return this.appService.appGlobalObj.currentOAId;
    } else if (this.appService.appGlobalObj.currentGAId) {
      return this.appService.appGlobalObj.currentGAId;
    } else if (this.appService.appGlobalObj.currentSiteId) {
      return this.appService.appGlobalObj.currentSiteId;
    } else if (this.appService.appGlobalObj.vgId) {
      return this.appService.appGlobalObj.vgId;
    } else {
      return this.appService.companyNode.nodeId;
    }
  }

  checkGlobalAnonymousHostAlert() {
    this.globleAnonHostSub = this.configurationService.isGlobalAnonymousHostEnabled().subscribe(data => {
      this.appService.isGlobalAnonymousHostEnabled = data[0].propertyValues[0].propertyValue.toLowerCase();
    });
  }

  checkGlobalCbpt() {
    this.globlAnonHostSub = this.configurationService.checkGlobalCbpt().subscribe(data => {
      this.appService.isCBPT = 'true' === data[0].propertyValues[0].propertyValue.toLowerCase();
    });
  }

  checkPlayerAdustmentEnabled() {
    this.isPlayerAdjustEnabledSub = this.configurationService.isPlayerAdustmentEnabled().subscribe(data => {
      if (data[0] && data[0].propertyValues && data[0].propertyValues[0] &&
        _.has(data[0].propertyValues[0], 'propertyValue')) {
        this.appService.isPlayerAdjustmentEnabled = (   data[0].propertyValues[0].propertyValue.toLowerCase() === 'true' );
      } else {
        this.appService.isPlayerAdjustmentEnabled = false;
      }
    });
  }

  checkPromotionWinnerEnabled() {
    this.promotionEnableSub = this.PromotionSvc.managePromotionEnabled().subscribe(data => {
      if (data) {
        this.appService.isPromotionWinnerEnabled = data;
      }
    });
  }

  checkFctxnEnabled() {
    this.FCTXNSub = this.configurationService.checkFctxnEnabled().subscribe(data => {
      this.appService.checkFctxnEnabled = 'true' === data[0].propertyValues[0].propertyValue.toLowerCase();
    });
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
    if (this.globleAnonHostSub) {
      this.globleAnonHostSub.unsubscribe();
    }
    if (this.globlAnonHostSub) {
      this.globlAnonHostSub.unsubscribe();
    }
    if (this.refreshTokenSub) {
      this.refreshTokenSub.unsubscribe();
    }
    if (this.isPlayerAdjustEnabledSub) {
      this.isPlayerAdjustEnabledSub.unsubscribe();
    }
    if (this.promotionEnableSub) {
      this.promotionEnableSub.unsubscribe();
    }
    if (this.FCTXNSub) {
      this.FCTXNSub.unsubscribe();
    }
  }
}
