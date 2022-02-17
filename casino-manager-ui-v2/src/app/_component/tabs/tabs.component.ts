import {Component, OnDestroy, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {AppService} from '../../app.service';
import {TopologyService, UtilityService, CageService, AlertService, CommonTranslationService} from 'common-ui';
import {CasinomanagerService} from '../../services/casinomanager.service';
import {TranslateService} from '@ngx-translate/core';
import {DecodedTokenService} from 'common-ui';
import {WDTSUtility} from "../../utils/wdts-utils";
import * as _ from 'lodash';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnDestroy {
  SITE_OA_GA_PIT: boolean;
  SITE_GA_PIT: boolean;
  SITE_OA_PIT: boolean;
  VG_PIT: boolean;
  SITE_OA_GA: boolean;
  SITE_GA: boolean;
  SITE_OA: boolean;
  SITE: boolean;
  COMPANY: boolean;
  IS_VIRTUAL_GROUP: boolean;
  routeParams;
  isPPMaster: boolean;
  currentGamingDay;
  public breadcrumbs;
  tabs = [];
  tabsLabelArray = ['TABLES', 'PLAYERS_TAB', 'PERFORMANCE', 'MANUAL_RATINGS', 'OPENER_CLOSER', 'CHIP_SECURITY'];
  tabsNameArray = ['tables', 'players', 'performance', 'mratings', 'openercloser', 'chipsecurity'];
  chipSecuritySubTabs = ['comparescans', 'compare', 'chipdetail'];
  chipSecurityTabAccess = false;
  // Subscibers
  paramMapSub: Subscription;
  virtualGroupSub: Subscription;
  currentGameDaySub: Subscription;
  getRollDTMSub: Subscription;
  localGamingDaysSub: Subscription;
  getAlertByCatSub: Subscription;
  getAlertByCatVGSub: Subscription;
  getTopoStatsSub: Subscription;
  VGtopoStatsSub: Subscription;
  languageChanged: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private titleService: Title,
              private appService: AppService,
              private decodedTokenService: DecodedTokenService,
              public topologyService: TopologyService,
              public utilityService: UtilityService,
              public cageService: CageService,
              public alertService: AlertService,
              public casinoManagerService: CasinomanagerService,
              private translate: TranslateService,
              private commonTranslation: CommonTranslationService) {
  }

  ngOnInit() {
    this.handleSubscription();
    this.paramMapSub = this.route.paramMap.subscribe(params => {
      this.setClickedTabName(null, params);
      this.routeParams = params['params'];
      if (this.routeParams.gamingDay) {
        this.appService.gamingDayPresentInUrl = this.routeParams.gamingDay;
      }
      setTimeout(() => {
        this.setTabFlags();
      }, 0);
    });
  }

  setTabFlags() {
    location.href.includes('virtualGroup') ? this.IS_VIRTUAL_GROUP = true : this.IS_VIRTUAL_GROUP = false;
    if ((location.href.includes('site') || location.href.includes('virtualGroup')) && location.href.includes('OA') && location.href.includes('GA') && location.href.includes('pit')) {
      this.SITE_OA_GA_PIT = true;
    } else if ((location.href.includes('site') || location.href.includes('virtualGroup')) && location.href.includes('GA') && location.href.includes('pit')) {
      this.SITE_GA_PIT = true;
    } else if ((location.href.includes('site') || location.href.includes('virtualGroup')) && location.href.includes('OA') && location.href.includes('pit')) {
      this.SITE_OA_PIT = true;
    } else if ((location.href.includes('site') || location.href.includes('virtualGroup')) && location.href.includes('pit')) {
      this.VG_PIT = true;
    } else if ((location.href.includes('site') || location.href.includes('virtualGroup')) && location.href.includes('OA') && location.href.includes('GA')) {
      this.SITE_OA_GA = true;
    } else if ((location.href.includes('site') || location.href.includes('virtualGroup')) && location.href.includes('GA')) {
      this.SITE_GA = true;
    } else if ((location.href.includes('site') || location.href.includes('virtualGroup')) && location.href.includes('OA')) {
      this.SITE_OA = true;
    } else if ((location.href.includes('site') || location.href.includes('virtualGroup'))) {
      this.SITE = true;
    } else if (!location.href.includes('site') && !location.href.includes('virtualGroup')) {
      this.COMPANY = true;
    }

    this.checkPermission();
    this.setTabs();
    if (!this.appService.checkFctxnEnabled) {
      if (this.tabs.find(ob => ob.content === "FILL_CREDIT_REQUESTS")) {
        this.tabs.splice(this.tabs.indexOf(this.tabs.find(ob => ob.content === "FILL_CREDIT_REQUESTS")), 1)
      }
    }
  }

  checkPermission() {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    this.isPPMaster = jwtToken.superuser;
    if (jwtToken) {
      const appIndx = jwtToken.authorities.findIndex(app => app.applicationCode === 'CASINO_MGR');
      // if (jwtToken.authorities[appIndx].permissions.indexOf('CHIP_SECURITY_MANAGE') !== -1 || jwtToken.authorities[appIndx].permissions.indexOf('CHIP_SECURITY_VIEW') !== -1 || jwtToken.superuser) {
      this.chipSecurityTabAccess = false;
      // }
    }
  }

  setTabs() {
    this.appService.updateGlobalObj(this.routeParams);
    this.appService.showGamingDay = true;
    if (this.SITE_OA_GA_PIT) {
      this.tabs = [
        {
          content: 'application.app.common.labels.TABLES',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`,
          selected: false, state: 'tables', isDisable: false
        },
        {
          content: 'application.app.common.labels.PLAYERS_TAB',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`,
          selected: false, state: 'players', isDisable: false
        },
        {
          content: 'application.app.common.labels.PERFORMANCE',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`,
          selected: false, state: 'performance', isDisable: false
        },
        {
          content: 'application.app.common.labels.MANUAL_RATINGS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`,
          selected: false, state: 'manual-rating', isDisable: false
        },
        {
          content: 'application.app.common.labels.OPENER_CLOSER',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`,
          selected: false, state: 'opener-closer', isDisable: false
        },
        {
          content: 'FILL_CREDIT_REQUESTS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`,
          selected: false, state: 'fctxns', isDisable: false
        }
      ];

      if (this.chipSecurityTabAccess) {
        const chipSecurityTabObj = {
          content: 'application.app.common.labels.CHIP_SECURITY',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`,
          selected: false,
          state: 'chip-security-home',
          isDisable: false
        };
        this.tabs.push(chipSecurityTabObj);
      }
      this.getGamingDayData(this.routeParams.pitId, 'SITE_OA_GA_PIT');
      this.updateBreadCrumbs('SITE_OA_GA_PIT');
    } else if (this.SITE_GA_PIT) {
      this.tabs = [
        {
          content: 'application.app.common.labels.TABLES',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`,
          selected: false, state: 'tables', isDisable: false
        },
        {
          content: 'application.app.common.labels.PLAYERS_TAB',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`,
          selected: false, state: 'players', isDisable: false
        },
        {
          content: 'application.app.common.labels.PERFORMANCE',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`,
          selected: false, state: 'performance', isDisable: false
        },
        {
          content: 'application.app.common.labels.MANUAL_RATINGS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`,
          selected: false, state: 'manual-rating', isDisable: false
        },
        {
          content: 'application.app.common.labels.OPENER_CLOSER',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`,
          selected: false, state: 'opener-closer', isDisable: false
        }
        ,
        {
          content: 'FILL_CREDIT_REQUESTS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`,
          selected: false, state: 'fctxns', isDisable: false
        }
      ];

      if (this.chipSecurityTabAccess) {
        const chipSecurityTabObj = {
          content: 'application.app.common.labels.CHIP_SECURITY',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`,
          selected: false,
          state: 'chip-security-home',
          isDisable: false
        };
        this.tabs.push(chipSecurityTabObj);
      }
      this.getGamingDayData(this.routeParams.pitId, 'SITE_GA_PIT');
      this.updateBreadCrumbs('SITE_GA_PIT');
    } else if (this.SITE_OA_PIT) {
      this.tabs = [
        {
          content: 'application.app.common.labels.TABLES',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`,
          selected: false, state: 'tables', isDisable: false
        },
        {
          content: 'application.app.common.labels.PLAYERS_TAB',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`,
          selected: false, state: 'players', isDisable: false
        },
        {
          content: 'application.app.common.labels.PERFORMANCE',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`,
          selected: false, state: 'performance', isDisable: false
        },
        {
          content: 'application.app.common.labels.MANUAL_RATINGS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`,
          selected: false, state: 'manual-rating', isDisable: false
        },
        {
          content: 'application.app.common.labels.OPENER_CLOSER',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`,
          selected: false, state: 'opener-closer', isDisable: false
        },
        {
          content: 'FILL_CREDIT_REQUESTS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`,
          selected: false, state: 'fctxns', isDisable: false
        }
      ];

      if (this.chipSecurityTabAccess) {
        const chipSecurityTabObj = {
          content: 'application.app.common.labels.CHIP_SECURITY',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`,
          selected: false,
          state: 'chip-security-home',
          isDisable: false
        };
        this.tabs.push(chipSecurityTabObj);
      }
      this.getGamingDayData(this.routeParams.pitId, 'SITE_OA_PIT');
      this.updateBreadCrumbs('SITE_OA_PIT');
    } else if (this.VG_PIT) {
      this.tabs = [
        {
          content: 'application.app.common.labels.TABLES',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/pit/${this.routeParams.pitId}/tables/${this.routeParams.gamingDay}`,
          selected: false, state: 'tables', isDisable: false
        },
        {
          content: 'application.app.common.labels.PLAYERS_TAB',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/pit/${this.routeParams.pitId}/players/${this.routeParams.gamingDay}`,
          selected: false, state: 'players', isDisable: false
        },
        {
          content: 'application.app.common.labels.PERFORMANCE',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/pit/${this.routeParams.pitId}/performance/${this.routeParams.gamingDay}`,
          selected: false, state: 'performance', isDisable: false
        },
        {
          content: 'application.app.common.labels.MANUAL_RATINGS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/pit/${this.routeParams.pitId}/mratings/${this.routeParams.gamingDay}`,
          selected: false, state: 'manual-rating', isDisable: false
        },
        {
          content: 'application.app.common.labels.OPENER_CLOSER',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/pit/${this.routeParams.pitId}/openercloser/${this.routeParams.gamingDay}`,
          selected: false, state: 'opener-closer', isDisable: false
        },
        {
          content: 'FILL_CREDIT_REQUESTS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/pit/${this.routeParams.pitId}/fctxns/${this.routeParams.gamingDay}`,
          selected: false, state: 'fctxns', isDisable: false
        }
      ];

      if (this.chipSecurityTabAccess) {
        const chipSecurityTabObj = {
          content: 'application.app.common.labels.CHIP_SECURITY',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/pit/${this.routeParams.pitId}/chipsecurity/${this.routeParams.gamingDay}`,
          selected: false,
          state: 'chip-security-home',
          isDisable: false
        };
        this.tabs.push(chipSecurityTabObj);
      }
      this.getGamingDayData(this.routeParams.pitId, 'SITE_PIT');
      this.updateBreadCrumbs('SITE_PIT');
    } else if (this.SITE_OA_GA) {
      this.tabs = [
        {
          content: 'application.app.CASINO_MGR_LABELS.OVERVIEW',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/${this.routeParams.gamingDay}`,
          selected: false, state: 'overview', isDisable: false
        },
        {
          content: 'application.app.common.labels.TABLES',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/tables/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/tables/${this.routeParams.gamingDay}`,
          selected: false, state: 'tables', isDisable: false
        },
        {
          content: 'application.app.common.labels.PLAYERS_TAB',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/players/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/players/${this.routeParams.gamingDay}`,
          selected: false, state: 'players', isDisable: false
        },
        {
          content: 'application.app.common.labels.OPENER_CLOSER',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/openercloser/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/openercloser/${this.routeParams.gamingDay}`,
          selected: false, state: 'opener-closer', isDisable: false
        },
        {
          content: 'FILL_CREDIT_REQUESTS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/fctxns/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/fctxns/${this.routeParams.gamingDay}`,
          selected: false, state: 'fctxns', isDisable: false
        }
      ];
      this.getGamingDayData(this.routeParams.OAId, 'SITE_OA_GA');
      this.updateBreadCrumbs('SITE_OA_GA');
    } else if (this.SITE_GA) {
      this.tabs = [
        {
          content: 'application.app.CASINO_MGR_LABELS.OVERVIEW',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`,
          selected: false, state: 'overview', isDisable: false
        },
        {
          content: 'application.app.common.labels.OPENER_CLOSER',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/openercloser/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/openercloser/${this.routeParams.gamingDay}`,
          selected: false, state: 'opener-closer', isDisable: false
        },
        {
          content: 'FILL_CREDIT_REQUESTS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/fctxns/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/fctxns/${this.routeParams.gamingDay}`,
          selected: false, state: 'fctxns', isDisable: false
        }
      ];
      this.getGamingDayData(this.routeParams.GAId, 'SITE_GA');
      this.updateBreadCrumbs('SITE_GA');

    } else if (this.SITE_OA) {
      this.tabs = [
        {
          content: 'application.app.CASINO_MGR_LABELS.OVERVIEW',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/${this.routeParams.gamingDay}`,
          selected: false, state: 'overview', isDisable: false
        },
        {
          content: 'application.app.common.labels.TABLES',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/tables/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/tables/${this.routeParams.gamingDay}`,
          selected: false, state: 'tables', isDisable: false
        },
        {
          content: 'application.app.common.labels.PLAYERS_TAB',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/players/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/players/${this.routeParams.gamingDay}`,
          selected: false, state: 'players', isDisable: false
        },
        {
          content: 'application.app.common.labels.OPENER_CLOSER',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/openercloser/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/openercloser/${this.routeParams.gamingDay}`,
          selected: false, state: 'opener-closer', isDisable: false
        },
        {
          content: 'FILL_CREDIT_REQUESTS',
          url: location.href.includes('virtualGroup') ?
            `/overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/fctxns/${this.routeParams.gamingDay}`
            : `/overview/site/${this.routeParams.siteId}/OA/${this.routeParams.OAId}/fctxns/${this.routeParams.gamingDay}`,
          selected: false, state: 'fctxns', isDisable: false
        }
      ];
      this.getGamingDayData(this.routeParams.GAId, 'SITE_OA');
      this.updateBreadCrumbs('SITE_OA');

    } else {
      if (this.COMPANY) {
        this.appService.showGamingDay = false;
        this.appService.lastVisitedTopologyId = '';
        this.updateBreadCrumbs('COMPANY');
      }
      else if (this.IS_VIRTUAL_GROUP) {
        this.getGamingDayData(this.routeParams.vgId, 'SITE');
        this.updateBreadCrumbs('SITE');
      }
      else if (this.SITE) {
        this.getGamingDayData(this.routeParams.siteId, 'SITE');
        this.updateBreadCrumbs('SITE');
      }
      this.tabs = [
        {
          content: 'application.app.CASINO_MGR_LABELS.OVERVIEW',
          url: `/overview/${this.routeParams.gamingDay}`,
          selected: false,
          state: 'overview',
          isDisable: false
        }
      ];
    }
  }

  updateBreadCrumbs(topology) {
    const jwtToken = this.decodedTokenService.getDecodedJwtToken();
    this.breadcrumbs = [];
    if (this.IS_VIRTUAL_GROUP) {
      if (!this.appService.virtualGroupNodes) {
        this.virtualGroupSub = this.topologyService.getVirtualGroups(jwtToken.userId || jwtToken.userId).subscribe((response) => {
          // console.log('@@@!virtualGroupNodes@@@')
          this.appService.virtualGroupNodes = response;
          this.updateBreadCrumbsVG(topology);
        });
      } else {
        this.updateBreadCrumbsVG(topology);
      }
    } else {
      if (topology === 'SITE') {
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.siteId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.siteId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/${this.routeParams.gamingDay}`
        });
      } else if (topology === 'SITE_GA') {
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.siteId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.siteId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/${this.routeParams.gamingDay}`
        });
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.GAId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '', url: ``
        });
      } else if (topology === 'SITE_OA_GA') {
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.siteId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.siteId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/${this.routeParams.gamingDay}`
        });
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.GAId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`
        });
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.OAId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.OAId].shortName, params: '', url: ``
        });
      } else if (topology === 'SITE_GA_PIT') {
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.siteId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.siteId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/${this.routeParams.gamingDay}}`
        });
        this.breadcrumbs.push({
          labelName: (this.appService.nodeNames[this.routeParams.GAId] && this.appService.nodeNames[this.routeParams.GAId].name),
          labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`
        });
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.pitId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.pitId].shortName, params: '', url: ``
        });
      } else if (topology === 'SITE_OA_GA_PIT') {
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.siteId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.siteId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/${this.routeParams.gamingDay}}`
        });
        this.breadcrumbs.push({
          labelName: (this.appService.nodeNames[this.routeParams.GAId] && this.appService.nodeNames[this.routeParams.GAId].name),
          labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`
        });
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.OAId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.OAId].shortName, params: '',
          url: `/overview/site/${this.routeParams.siteId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/${this.routeParams.gamingDay}`
        });
        this.breadcrumbs.push({
          labelName: this.appService.nodeNames[this.routeParams.pitId].name,
          labelShortName: this.appService.nodeNames[this.routeParams.pitId].shortName, params: '', url: ``
        });
      }
    }
    this.appService.updateBreadCrumb(this.breadcrumbs);
  }

  updateBreadCrumbsVG(topology) {
    if (topology === 'SITE') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
    } else if (topology === 'SITE_GA') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.GAId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '', url: ``
      });
    } else if (topology === 'SITE_OA') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.OAId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.OAId].shortName, params: '', url: ``
      });
    } else if (topology === 'SITE_PIT') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.pitId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.pitId].shortName, params: '', url: ``
      });
    } else if (topology === 'SITE_OA_GA') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.GAId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '',
        url: `overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.OAId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.OAId].shortName, params: '', url: ``
      });
    } else if (topology === 'SITE_GA_PIT') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: (this.appService.nodeNames[this.routeParams.GAId] && this.appService.nodeNames[this.routeParams.GAId].name),
        labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '',
        url: `overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.pitId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.pitId].shortName, params: '', url: ``
      });
    } else if (topology === 'SITE_OA_PIT') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: (this.appService.nodeNames[this.routeParams.OAId] && this.appService.nodeNames[this.routeParams.OAId].name),
        labelShortName: this.appService.nodeNames[this.routeParams.OAId].shortName, params: '',
        url: `overview/virtualGroup/${this.routeParams.vgId}/OA/${this.routeParams.OAId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.pitId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.pitId].shortName, params: '', url: ``
      });
    } else if (topology === 'SITE_OA_GA_PIT') {
      this.breadcrumbs.push({
        labelName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        labelShortName: this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).groupName,
        params: '',
        url: `/overview/virtualGroup/${this.routeParams.vgId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: (this.appService.nodeNames[this.routeParams.GAId] && this.appService.nodeNames[this.routeParams.GAId].name),
        labelShortName: this.appService.nodeNames[this.routeParams.GAId].shortName, params: '',
        url: `overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.OAId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.OAId].shortName, params: '',
        url: `overview/virtualGroup/${this.routeParams.vgId}/GA/${this.routeParams.GAId}/OA/${this.routeParams.OAId}/${this.routeParams.gamingDay}`
      });
      this.breadcrumbs.push({
        labelName: this.appService.nodeNames[this.routeParams.pitId].name,
        labelShortName: this.appService.nodeNames[this.routeParams.pitId].shortName, params: '', url: ``
      });
    }

  }


  setClickedTabName(val?: any, params?: any): void {
    if (val && val.content) {
      const x = val.content.split('.');
      if (x === undefined) {
        return;
      }
      const y = this.tabsLabelArray.indexOf(x[x.length - 1]);
      if (y === -1) {
        this.appService.currentTab = (this.translate.instant(val.content)).toLowerCase();
      } else {
        this.appService.currentTab = this.tabsNameArray[y];
      }
      this.setTabTitle(this.appService.currentTab);
    } else {
      // @ts-ignore
      const activeUrl = this.router.location.path();
      if (params && params['params'] && !_.isEmpty(params.params)) {
        const gamingDay = (params['params']['gamingDay']);
        if (gamingDay) {
          const urlPartsArr = activeUrl.split('/');
          const slashSplitlength = activeUrl.split(gamingDay)[0].split('/').length;
          let index = 2;
          if (params['params']['pitId']) {
            index = 2;
          } else if (params['params']['GAId']) {
            if (activeUrl.split('/').indexOf(params.params.GAId) === urlPartsArr.length - 2) {
              index = 6;
            } else {
              /* tabs without pitId Other than overview.*/
              index = 2;
            }
          } else if (params['params']['siteId']) {
            index = 4;
          }
          const tabName = activeUrl.split(gamingDay)[0].split('/')[slashSplitlength - index];
          const noSubTabs = urlPartsArr.indexOf(gamingDay) === urlPartsArr.length - 1;
          if (noSubTabs) {
            this.appService.currentTab = tabName;
            this.setTabTitle(this.appService.currentTab);
          } else {
            /* Chip Security Sub-Tabs */
            if (WDTSUtility.equalIgnoreCase(tabName, this.tabsNameArray[5], true, true)) {
              const subTabName = urlPartsArr[urlPartsArr.length - 1];
              if (this.chipSecuritySubTabs.indexOf(subTabName) !== -1) {
                this.appService.currentTab = subTabName;
                this.setTabTitle(this.appService.currentTab);
              }
            }
          }
        }
      } else {
        const slashSplitlength = activeUrl.split('/').length;
        let tabName = '';
        if (slashSplitlength > 2) {
          tabName = activeUrl.split('/')[slashSplitlength - 2];
        } else {
          tabName = activeUrl.split('/')[slashSplitlength - 1];
        }
        this.appService.currentTab = tabName;
        this.setTabTitle(tabName);
      }
    }
  }

  setTabTitle(tabName) {
    let tabTitle;
    switch (tabName) {
      case 'PLAYERS':
      case 'player':
        tabTitle = 'Casino Manager: Players';
        this.titleService.setTitle(tabTitle);
        break;
      case 'INVENTORY':
      case 'inventory':
        tabTitle = 'Casino Manager: Inventory';
        this.titleService.setTitle(tabTitle);
        break;
      case 'GAMES':
      case 'game':
        tabTitle = 'Casino Manager: Games';
        this.titleService.setTitle(tabTitle);
        break;
      case 'SESSIONS':
      case 'session':
        tabTitle = 'Casino Manager: Sessions';
        this.titleService.setTitle(tabTitle);
        break;
      case 'OVERRIDE':
      case 'override':
        tabTitle = 'Casino Manager: Override';
        this.titleService.setTitle(tabTitle);
        break;
      case 'VIEW_TABLE':
      case 'view-table':
        tabTitle = 'Casino Manager: View Table';
        this.titleService.setTitle(tabTitle);
        break;
    }
  }

  getGamingDayData(topologyId, topology) {
    if (topology === 'SITE' && this.IS_VIRTUAL_GROUP) {
      let vgTopologyID;
      let vgTopologyGroupID;
      if (_.isArray(this.appService.virtualGroupNodes)) {
        vgTopologyGroupID = this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).topologyGroupId;
        vgTopologyID = this.appService.virtualGroupNodes.find(ob => ob.topologyGroupId === parseInt(this.routeParams.vgId)).topologyId;
      }
      if (vgTopologyID !== undefined) {
        this.getCurrentGamingDay(vgTopologyID);
        this.getRollDTM(vgTopologyID);
      }
      if (vgTopologyGroupID !== undefined) {
        this.getTopologyStatisticsForVirtualGroup(vgTopologyGroupID);
        this.getAlertCountsVG(vgTopologyGroupID);
      }
      return;
    }
    if (this.appService.lastVisitedSiteId !== this.routeParams.siteId) {
      this.getCurrentGamingDay(this.routeParams.siteId);
      this.getRollDTM(this.routeParams.siteId);
      this.appService.lastVisitedSiteId = this.routeParams.siteId;
    } else {
      this.currentGamingDay = this.appService.gamingDay;
    }
    if ((this.appService.currentRouteGamingDay !== this.routeParams.gamingDay)
      || (this.appService.lastVisitedTopologyId !== topologyId)
      || ((this.appService.lastVisitedSiteId === this.routeParams.siteId) && (topology !== 'SITE'))) {
      this.appService.currentRouteGamingDay = this.routeParams.gamingDay;
      if (topologyId !== undefined && topologyId !== '') {
        this.localGamingDaysInHierarchy(topologyId);
        this.getAlertCounts(topologyId);
        this.getTopologyStatistics(topologyId);
        this.appService.lastVisitedTopologyId = topologyId;
      }

    }
  }

  getCurrentGamingDay(siteorparamid) {
    this.currentGameDaySub = this.cageService.getCurrentGamingDay(siteorparamid).subscribe(data => {
      this.currentGamingDay = data['successObj'];
      this.appService.gamingDay = this.currentGamingDay;
    });
  }

  getRollDTM(siteorparamid) {
    this.getRollDTMSub = this.cageService.getRollDTM(siteorparamid).subscribe(data => {
      let nextRollDTMData = [];
      nextRollDTMData = data;
      if (nextRollDTMData != null) {
        for (let i = 0; i < nextRollDTMData.length; i++) {
          if (parseInt(nextRollDTMData[i].topologyNode.nodeId) === parseInt(siteorparamid)) {
            this.appService.nextRollDTM = nextRollDTMData[i].nextRollDtm;
            return;
          }
        }
      }
    });
  }

  localGamingDaysInHierarchy(topologyId) {
    this.localGamingDaysSub = this.cageService.localGamingDaysInHierarchy(topologyId).subscribe(data => {
      this.appService.localGamingDays = data.successObj;
    });
  }

  getAlertCounts(topologyId) {
    const alertStatus = 'ACKNOWLEDGED, OPEN';
    this.getAlertByCatSub = this.alertService.getAlertCountsByCategory(alertStatus, topologyId, 'table').subscribe(data => {
      let temp_data = [];
      temp_data = data;
      if (temp_data.length && temp_data.length > 0) {
        this.appService.alertCounts = temp_data[0];
      }
    });
  }

  getAlertCountsVG(topologyId) {
    const alertStatus = 'ACKNOWLEDGED, OPEN';
    this.getAlertByCatVGSub = this.alertService.getAlertCountsByCategoryVG(alertStatus, topologyId, 'table').subscribe(data => {
      let temp_data = [];
      temp_data = data;
      if (temp_data.length && temp_data.length > 0) {
        this.appService.alertCounts = temp_data[0];
      }
    });
  }

  getTopologyStatistics(topologyId) {
    if (topologyId !== '' && topologyId !== undefined) {
      this.getTopoStatsSub = this.casinoManagerService.getTopologyStatistics(this.routeParams.gamingDay, topologyId, 1, {}).subscribe(data => {
        this.appService.subnavTopologyStatistics = data;
      });
    }
  }

  getTopologyStatisticsForVirtualGroup(topologyId) {
    if (topologyId !== undefined && topologyId !== '') {
      this.VGtopoStatsSub = this.casinoManagerService.getTopologyStatisticsForVirtualGroup(this.routeParams.gamingDay, topologyId, 1, {}).subscribe(data => {
        this.appService.subnavTopologyStatistics = data;
      });
    }
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
    if (this.paramMapSub) {
      this.paramMapSub.unsubscribe();
    }
    if (this.virtualGroupSub) {
      this.virtualGroupSub.unsubscribe();
    }
    if (this.currentGameDaySub) {
      this.currentGameDaySub.unsubscribe();
    }
    if (this.getRollDTMSub) {
      this.getRollDTMSub.unsubscribe();
    }
    if (this.localGamingDaysSub) {
      this.localGamingDaysSub.unsubscribe();
    }
    if (this.getAlertByCatSub) {
      this.getAlertByCatSub.unsubscribe();
    }
    if (this.getAlertByCatVGSub) {
      this.getAlertByCatVGSub.unsubscribe();
    }
    if (this.getTopoStatsSub) {
      this.getTopoStatsSub.unsubscribe();
    }
    if (this.VGtopoStatsSub) {
      this.VGtopoStatsSub.unsubscribe();
    }
  }
}
