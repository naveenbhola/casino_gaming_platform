import {Component, Inject, OnInit, Input, OnDestroy} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonTranslationService, ConfigurationService} from 'common-ui';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {TopologyService} from 'common-ui';
import {WDTSUtility} from '../../utils/wdts-utils';
import {NGXLogger} from 'ngx-logger';
import * as _ from 'lodash';

@Component({
  selector: 'create-virtual-group',
  templateUrl: 'create-virtual-group.html',
  styleUrls: ['create-virtual-group.scss']
})
export class CreateVirtualGroupComponent implements OnInit, OnDestroy {
  languageChanged;
  listOfSites;
  inpVGName: string;
  selectedSiteId;
  topologySubs;
  loggedInUserInfo;
  VGCreationInProg: boolean = false;
  constructor(private nGXLogger: NGXLogger,
              private appService: AppService,
              private matSnackBar: MatSnackBar,
              public dialogRef: MatDialogRef<CreateVirtualGroupComponent>,
              private translate: TranslateService,
              private fb: FormBuilder,
              private _topologyService: TopologyService,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.listOfSites = data.listOfSites;
    this.checkPermittedAccessGroup(this.listOfSites);
    this.inpVGName = '';
    this.handleSubscription();
  }

  checkPermittedAccessGroup(_listOFSites) {
    for (let i = 0; i < _listOFSites.length; i++) {
      const temp = this.checkByTopologyPerm(_listOFSites[i]);
      if (temp === false) {
        _listOFSites[i]['disabled'] = true;
      } else {
        continue;
      }
    }
  }

  checkByTopologyPerm(node) {
    if (node && _.has(node, 'name.nodeId')) {
      return this.appService.checkPermissionByTopologyID(node.name.nodeId.toString(), 'CASINO_MGR');
    }
  }

  ngOnInit() {
    this.loggedInUserInfo = this.appService.decodedTokenService.getDecodedJwtToken();
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  performLengthCheck() {
    if (this.inpVGName && this.inpVGName.length > 20) {
      return false;
    } else {
      return true;
    }
  }

  createVirtualGroup(): void {
    if (this.selectedSiteId && this.inpVGName.trim() !== '') {
      if (this.isDuplicateName(this.inpVGName)) {
        const message = 'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.GROUP_WITH_SAME_NAME_EXIST';
        this.matSnackBar.open(this.translate.instant(message), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__error'
        });
        return;
      }
      // hide button
      this.VGCreationInProg = true;
      this.inpVGName = this.inpVGName.trim();
      const node = {
        'topologyId': this.selectedSiteId,
        'groupName': this.inpVGName,
        'groupType': 'VIRTUAL',
        'userId': this.loggedInUserInfo.userId,
        'topologyNodeIds': []
      };
      this.topologySubs = this._topologyService.createVirtualGroup(node).subscribe(data => {
        this.closeDialogBox();
        const temp = {res: data, msg: 'createVirtualGroup'};
        this._topologyService.nodeUpdated.emit(temp);
        this.matSnackBar.open(this.translate.instant
        ('application.app.CASINO_MGR_LABELS.MESSAGE.VIRTUAL_GROUP_CREATED'), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__success'
        });
        // Show button
        this.VGCreationInProg = false;
      }, (err) => {
        const message = 'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.GROUP_WITH_SAME_NAME_EXIST' || err.error[0].message;
        this.matSnackBar.open(this.translate.instant(message), '', {
          duration: 3000,
          horizontalPosition: 'right',
          panelClass: 'snack__error'
        });
        // Show button
        this.VGCreationInProg = false;
      });

    }
    if (!this.selectedSiteId) {
      this.matSnackBar.open(this.translate.instant('application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.PLEASE_SELECT_SITENAME'), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__warn'
      });
    }
    if (this.inpVGName.trim() === '') {
      this.inpVGName = this.inpVGName.trim();
      this.matSnackBar.open(this.translate.instant('application.app.CASINO_MGR_LABELS.MESSAGE.NAME_REQUIRED'), '', {
        duration: 3000,
        horizontalPosition: 'right',
        panelClass: 'snack__error'
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

  isDuplicateName(_name) {
    let isRedundant = false;
    const accessGroups = this._topologyService.virtualGroupNodes;
    for (let i = 0, iLen = accessGroups.length; i < iLen; i++) {
      if (WDTSUtility.equalIgnoreCase(accessGroups[i].groupName, _name, true, true)) {
        isRedundant = true;
      }
    }
    return isRedundant;
  }

  ngOnDestroy() {
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
    }
    if (this.topologySubs) {
      this.topologySubs.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
