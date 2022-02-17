import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TopologyService } from '../services/topology.service';
export class AppAddNodeTopologyComponent {
    constructor(dialogRef, data, _topologyService, fb, snackBar, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this._topologyService = _topologyService;
        this.fb = fb;
        this.snackBar = snackBar;
        this.translate = translate;
        this.optionArr = [];
        this.min = 1;
        this.max = 10;
        this.isHost = false;
        this.loader = false;
        this.addedNodeEvent = new EventEmitter();
        this.sitesFromTopology = [];
        this.isAccessGroup = false;
        this.isAGNameInvalid = false;
        this.isShortNameInvalid = false;
        this.isLongNameInvalid = false;
        this.limitForm = this.fb.group({
            description: ['']
        });
        this.validateShortName = {
            isErrorState: (control) => {
                this.isShortNameInvalid = this.isDuplicate('shortName', this.limitForm.value['shortName']);
                return this.isShortNameInvalid;
            }
        };
        this.validateName = {
            isErrorState: (control) => {
                this.isLongNameInvalid = this.isDuplicate('name', this.limitForm.value['longName']);
                return this.isLongNameInvalid;
            }
        };
        this.validateAccessGroupName = {
            isErrorState: (control) => {
                this.isAGNameInvalid = this.isDuplicate('groupName', this.limitForm.value['accessGroupName']);
                return this.isAGNameInvalid;
            }
        };
        this.isAccessGroup = this.data.called === 'accessgroup';
        this.addValidations();
    }
    valChangeFunction(evt, fName) {
        const valObj = {};
        valObj[fName] = evt;
        this.limitForm.patchValue(valObj, { onlySelf: true });
    }
    addValidations() {
        if (this.isAccessGroup) {
            this.limitForm.addControl('typeValAGroup', new FormControl('', Validators.required));
            this.limitForm.addControl('accessGroupName', new FormControl('', Validators.required));
        }
        else {
            this.limitForm.addControl('typeVal', new FormControl('', Validators.required));
            this.limitForm.addControl('longName', new FormControl('', Validators.compose([Validators.required, this.noWhitespace])));
            this.limitForm.addControl('shortName', new FormControl('', Validators.compose([Validators.required, Validators.maxLength(this.max), this.noWhitespace])));
            this.limitForm.addControl('host', new FormControl('', Validators.required));
        }
    }
    noWhitespace(control) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }
    showHost(opt) {
        if (opt.value === 1000) {
            this.isHost = true;
            this.limitForm.addControl('host', new FormControl('', Validators.required));
        }
        else {
            this.isHost = false;
            this.limitForm.removeControl('host');
        }
    }
    ngOnInit() {
        if (this.data.called === 'accessgroup') {
            this.createDataForDropdownForAccessGroup(this._topologyService.topologyTypes);
        }
        if (this.data.called === 'assignednode') {
            this.createDataForDropdownForAssingedNode(this.data.typeMap);
        }
    }
    createDataForDropdownForAccessGroup(topologyTypes) {
        topologyTypes.forEach((value, key) => {
            if (value.topologyType === 'SITE') {
                this.siteTopologyCode = value.topologyTypeId;
            }
            if (value.topologyType === 'COMPANY_NAME') {
                this.companyLevelCode = value.topologyTypeId;
            }
        });
        const keyOfSits = Object.keys(this._topologyService.topologyNodeNames).
            filter(key => this._topologyService.topologyNodeNames[key].type
            === this.siteTopologyCode);
        for (let i of keyOfSits) {
            this.sitesFromTopology.push(this._topologyService.topologyNodeNames[i]);
            this.optionArr.push({ id: this._topologyService.topologyNodeNames[i].nodeId,
                type: this._topologyService.topologyNodeNames[i].name });
        }
    }
    createDataForDropdownForAssingedNode(types) {
        if (types.get(this.data.clickedNode.type).childTypeIds.length > 0) {
            const temp = types.get(this.data.clickedNode.type).childTypeIds;
            for (const tp of temp) {
                this.optionArr.push({ value: types.get(tp).labelCode, id: types.get(tp).topologyTypeId, type: types.get(tp).topologyType });
            }
        }
    }
    createAccessGroup() {
        const groupName = this.limitForm.value.accessGroupName;
        this.loader = true;
        // {"topologyId":2805,"groupName":"asdasdasaaaa","groupType":"ACCESS"}
        const param = {
            topologyId: this.limitForm.value.typeValAGroup,
            groupName: groupName.trim(),
            groupType: 'ACCESS'
        };
        this._topologyService.createNodeAccessGroup(param).subscribe((res) => {
            if (res[0] && res[0].code === 20001) {
                this.snackBar.open('Error Occurred. Pls try again later.', '', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    panelClass: 'snack__error'
                });
                return;
            }
            this.savedAccessGroup = groupName.trim();
            this.loader = false;
            this.closeDialogBox();
            const temp = { res: res, msg: 'createAccessGroup' };
            this._topologyService.nodeUpdated.next(temp);
            this.snackBar.open(this.translate.instant('application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.AG_ADDED'), '', {
                duration: 3000,
                horizontalPosition: 'right',
                panelClass: 'snack__success'
            });
        }, (err) => {
            this.loader = false;
            this.snackBar.open(err.error[0].message, '', {
                duration: 3000,
                horizontalPosition: 'right',
                panelClass: 'snack__warn'
            });
        });
    }
    createAssingedNode() {
        this.loader = true;
        const longName = this.limitForm.value.longName;
        const shortName = this.limitForm.value.shortName;
        let param;
        if (this.limitForm.value.typeVal === 1000) {
            param = {
                name: longName.trim(),
                shortName: shortName.trim(),
                type: this.limitForm.value.typeVal,
                host: this.limitForm.value.host,
                parentNodeId: this.data.clickedNode.nodeId,
                description: this.limitForm.value.description
            };
        }
        else {
            param = {
                name: longName.trim(),
                shortName: shortName.trim(),
                type: this.limitForm.value.typeVal,
                parentNodeId: this.data.clickedNode.nodeId,
                description: this.limitForm.value.description
            };
        }
        this._topologyService.createNodeOnTree(param).subscribe((res) => {
            if (res[0] && res[0].code === 20001) {
                this.snackBar.open('Error Occurred. Pls try again later.', '', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    panelClass: 'snack__error'
                });
                return;
            }
            this.savedLocation = res[0];
            res[0].typeName = this._topologyService.topologyTypes.get(res[0].type).topologyType;
            const temp = { res: res, clickNode: this.data.clickedNode, msg: 'createNode' };
            this._topologyService.nodeUpdated.next(temp);
            this.loader = false;
            this.closeDialogBox();
            this.snackBar.open(this.translate.instant('application.app.CONFIGURATION_LABELS.AREAS.SUCCESS_ADDED'), '', {
                duration: 3000,
                horizontalPosition: 'right',
                panelClass: 'snack__success'
            });
        }, (err) => {
            this.loader = false;
            this.snackBar.open(err, '', {
                duration: 3000,
                horizontalPosition: 'right',
                panelClass: 'snack__warn'
            });
        });
    }
    createNode() {
        if (this.isAccessGroup) {
            this.createAccessGroup();
        }
        else {
            this.createAssingedNode();
        }
    }
    closeDialogBox() {
        this.dialogRef.closeAll();
    }
    isDuplicate(field, value) {
        let isRedundant = false;
        if (field === 'groupName' && value !== '') {
            const accessGroups = this._topologyService.accessGroupNodes;
            for (let i = 0, iLen = accessGroups.length; i < iLen; i++) {
                if (accessGroups[i].groupName === value.trim() && value.trim() !== this.savedAccessGroup) {
                    isRedundant = true;
                }
            }
        }
        else if (field === 'name' && value !== '') {
            const allNodes = this._topologyService.topologyNodeNames;
            for (const obj in allNodes) {
                if (allNodes.hasOwnProperty(obj)) {
                    if (allNodes[obj].name.toUpperCase() === value.trim().toUpperCase()) {
                        if (this.savedLocation && value.trim().toUpperCase() !== this.savedLocation.name.toUpperCase()) {
                            isRedundant = true;
                        }
                        else if (this.savedLocation === undefined) {
                            isRedundant = true;
                        }
                    }
                }
            }
        }
        else if (field === 'shortName' && value !== '') {
            const allNodes = this._topologyService.topologyNodeNames;
            for (const obj in allNodes) {
                if (allNodes.hasOwnProperty(obj)) {
                    if (allNodes[obj].shortName.toUpperCase() === value.trim().toUpperCase()) {
                        if (this.savedLocation && value.trim().toUpperCase() !== this.savedLocation.shortName.toUpperCase()) {
                            isRedundant = true;
                        }
                        else if (this.savedLocation === undefined) {
                            isRedundant = true;
                        }
                    }
                }
            }
        }
        return isRedundant;
    }
    isSaveDisabled() {
        return this.limitForm.invalid || this.isAGNameInvalid || this.isLongNameInvalid || this.isShortNameInvalid;
    }
}
AppAddNodeTopologyComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-app-add-node-topology',
                template: "<h2 mat-dialog-title class=\"d-flex border-bottom\">\n  <!--Add New Limit-->\n  <span *ngIf=\"!isAccessGroup\" translate=\"application.app.CONFIGURATION_LABELS.AREAS.ADD_NEW_LOCATION\"></span>\n  <span *ngIf=\"isAccessGroup\" translate=\"application.app.CONFIGURATION_LABELS.AREAS.ADD_ACCESS_GROUP\"></span>\n  <span class=\"space-filler\"></span>\n  <button mat-button tabindex=\"-1\" class=\"close-btn\">\n    <mat-icon (click)=\"closeDialogBox()\">close</mat-icon>\n  </button>\n</h2>\n\n<div class=\"dialog__wrapper\">\n  <div class=\"dialog__content-wrapper\">\n    <form [formGroup]= 'limitForm' (ngSubmit) = \"createNode()\" >\n\n      <div class=\"form-control__wrapper\" *ngIf=\"!isAccessGroup\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"{{'application.app.CONFIGURATION_LABELS.AREAS.TYPE' | translate}}\"\n                      formControlName=\"typeVal\"\n                      [disableOptionCentering]=\"true\"\n                      (selectionChange)=\"showHost($event)\">\n            <mat-option [value]=\"opt.id\" *ngFor=\"let opt of optionArr\">\n              <span >{{'application.app.common.labels.'+opt.type | translate}}</span>\n            </mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n      <div class=\"form-control__wrapper\" *ngIf=\"isAccessGroup\">\n        <mat-form-field class=\"w-100\">\n          <mat-select placeholder=\"{{'application.app.CONFIGURATION_LABELS.AREAS.SITE_NAME' | translate}}\"\n                      formControlName=\"typeValAGroup\"\n                      [disableOptionCentering]=\"true\"\n                      (selectionChange)=\"showHost($event)\">\n            <mat-option [value]=\"opt.id\" *ngFor=\"let opt of optionArr\">\n              <span>{{opt.type}}</span>\n            </mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n      <div class=\"form-control__wrapper\" *ngIf=\"isAccessGroup\">\n        <mat-form-field class=\"w-100\">\n          <mat-label [translate]=\"'application.app.CONFIGURATION_LABELS.AREAS.ACCESS_GROUP_NAME'\"></mat-label>\n          <input matInput\n                 formControlName=\"accessGroupName\"\n                 appWdtsSpecialChar\n                 (valChangeEvent)=\"valChangeFunction($event, 'accessGroupName')\"\n                 placeholder=\"{{'application.app.CONFIGURATION_LABELS.AREAS.ACCESS_GROUP_NAME' | translate}}\"\n                 [errorStateMatcher]=\"validateAccessGroupName\"\n                 type=\"text\">\n          <mat-error *ngIf=\"isAGNameInvalid\"\n                     [translate]=\"'application.app.CONFIGURATION_LABELS.CHIPSETS.MESSAGE.GROUP_WITH_SAME_NAME_EXIST'\">\n          </mat-error>\n        </mat-form-field>\n      </div>\n      <div class=\"form-control__wrapper\" *ngIf=\"!isAccessGroup\">\n        <mat-form-field class=\"w-100\">\n          <mat-label [translate]=\"'application.app.CONFIGURATION_LABELS.AREAS.LONG_NAME'\">Long Name</mat-label>\n          <input matInput\n                 formControlName=\"longName\"\n                 appWdtsSpecialChar\n                 (valChangeEvent)=\"valChangeFunction($event, 'longName')\"\n                 placeholder=\"{{'application.app.CONFIGURATION_LABELS.AREAS.GAME_AREA_FIVE' | translate}}\"\n                 [errorStateMatcher]=\"validateName\"\n                 type=\"text\">\n          <mat-error *ngIf=\"isLongNameInvalid\"\n                  [translate]=\"'application.app.CONFIGURATION_LABELS.AREAS.NAME_ALREADY_EXIST'\">\n          </mat-error>\n        </mat-form-field>\n      </div>\n\n      <div class=\"form-control__wrapper\" *ngIf=\"!isAccessGroup\">\n        <mat-form-field class=\"w-100\" hintLabel=\"{{'application.app.CONFIGURATION_LABELS.AREAS.MAX_TEN_CHARS' | translate}}\">\n          <mat-label [translate]=\"'application.app.CONFIGURATION_LABELS.AREAS.SHORT_NAME'\">Short Name</mat-label>\n          <input matInput\n                 #input\n                 maxlength=\"10\"\n                 appWdtsSpecialChar\n                 (valChangeEvent)=\"valChangeFunction($event, 'shortName')\"\n                 formControlName=\"shortName\"\n                 placeholder=\"{{'application.app.CONFIGURATION_LABELS.AREAS.MAX_TEN_CHARS' | translate}}\"\n                 [errorStateMatcher]=\"validateShortName\"\n                 type=\"text\">\n          <mat-hint align=\"end\">{{input.value?.length || 0}}/10</mat-hint>\n          <mat-error *ngIf=\"isShortNameInvalid\"\n                     [translate]=\"'application.app.CONFIGURATION_LABELS.AREAS.SHORT_NAME_ALREADY_EXIST'\">\n          </mat-error>\n        </mat-form-field>\n      </div>\n      <div class=\"form-control__wrapper\" *ngIf=\"isHost && !isAccessGroup\">\n        <mat-form-field class=\"w-100\">\n          <mat-label  [translate]=\"'application.app.CONFIGURATION_LABELS.AREAS.HOST_IP_ADD'\">Host</mat-label>\n          <input matInput\n                 formControlName=\"host\"\n                 type=\"text\">\n        </mat-form-field>\n      </div>\n      <div class=\"form-control__wrapper\" *ngIf=\"!isAccessGroup\">\n        <mat-form-field class=\"w-100\">\n          <mat-label [translate]=\"'application.app.CONFIGURATION_LABELS.PROMOTION.DESCRIPTION'\">Description</mat-label>\n          <input matInput\n                 formControlName=\"description\"\n                 placeholder=\"{{'application.app.CONFIGURATION_LABELS.AREAS.GAME_AREA_FIVE' | translate}}\"\n                 type=\"text\">\n        </mat-form-field>\n      </div>\n      <mat-card-actions class=\"text-center d-flex w-100\">\n        <span class=\"space-filler\"></span>\n        <button class=\"common-button mr-2\" mat-stroked-button tabindex=\"-1\"\n                type=\"button\"\n                color=\"primary\"\n                (click)=\"closeDialogBox()\">\n          <span [translate]=\"'application.app.common.labels.CANCEL'\"></span>\n        </button>\n        <button type=\"submit\" class=\"p-2 rounded\"\n                [disabled]=\"isSaveDisabled()\"\n                mat-raised-button color=\"primary\">\n          <mat-progress-bar mode=\"indeterminate\" *ngIf=\"loader\"></mat-progress-bar>\n          <span [translate]=\"'application.app.common.labels.SAVE'\">Save</span>\n        </button>\n      </mat-card-actions>\n    </form>\n  </div>\n</div>\n\n\n",
                styles: ["@import url(/opt/wdts/common-ui-v2/node_modules/bootstrap/dist/css/bootstrap.min.css);:root{--accent:#9c1c23;--accent-bright:#ff562d;--accent-dark:#7d161b;--black:#000;--blue:#00ceff;--blue-dark:#00a3cc;--cyan:#23a6ad;--danger:#dc3545;--dark:#333;--dark-light:grey;--gray30:#5a5858;--gray50:#817e7e;--gray80:#d9d8d8;--green-dark:#1c925d;--green-darker:#0a3321;--green-light:#b2f0d5;--info:#0facd2;--primary:#bb9156;--primary-beige:#f0edca;--primary-bg:#eee7dd;--primary-dark:#ab7348;--primary-light:#d9cb9e;--primary-lighten:#e0cdb2;--secondary:#ccc;--secondary-light:#e6e6e6;--success:#22b573;--success-bright:#24ff00;--warning:#fbb03b;--white:#fff;--white-text:#f5f5f5;--yellow:#ff0;--yellow-bright:#ffea00;--yellow-dark:#cc0}body,html{-webkit-font-smoothing:antialiased;font-family:Lato,sans-serif;font-size:16px;font-weight:600;margin:0}html{overflow:hidden!important}.mat-menu-item,.mat-menu-item:focus,a,a:focus,button,button:focus{outline:0!important}button{border-radius:4px}.app-switcher__wrapper.cdk-overlay-pane{position:relative;top:-18vh}.app-switcher__wrapper.cdk-overlay-pane .mat-dialog-container{padding:0!important;position:relative;top:0}::ng-deep .mat-tab-label,::ng-deep .mat-tab-link{font-size:15px;font-weight:600;line-height:inherit}@media only screen and (max-width:1024px) and (max-height:768px){::ng-deep .mat-tab-label,::ng-deep .mat-tab-link{font-size:1em}}.app-spinner{margin:25vh auto 0}.mat-header-cell{font-size:15px}@media only screen and (max-width:1024px) and (max-height:768px){.mat-header-cell{font-size:.8em}}::ng-deep .mat-sort-header-arrow .mat-sort-header-indicator,::ng-deep .mat-sort-header-arrow .mat-sort-header-stem{display:none}::ng-deep .mat-sort-header-sorted .mat-sort-header-arrow .mat-sort-header-indicator,::ng-deep .mat-sort-header-sorted .mat-sort-header-arrow .mat-sort-header-stem{display:block}.fixed-at-top,.sub-nav__fixed-at-top{left:0;position:fixed;top:0;width:100%;z-index:200}.sub-nav__fixed-at-top{top:50px}.wrapper__top-padding{position:relative;top:100px;z-index:100}.text-color__primary{color:#bb9156}::ng-deep .btn-progress-bar{margin-left:-1rem;margin-right:-1rem;min-width:70px;top:-.25rem}.dialog__title{border-bottom:1px solid rgba(0,0,0,.2);display:flex;width:100%}::ng-deep .mat-dialog-title.dialog__title{margin-bottom:10px}.notes__list-item__header-color{color:rgba(0,0,0,.5)}.list-item__wrapper,.text-area__wrapper{background-color:hsla(0,0%,90.2%,.16);border:1px solid #e6e6e6;border-radius:4px;margin-bottom:.5rem;margin-top:1rem;padding:.5rem .5rem 0;width:100%}.list-item__wrapper:first-child,.text-area__wrapper:first-child{margin-top:0}::ng-deep .mat-option .mat-pseudo-checkbox-checked:after{height:5px;top:3.4px;width:10px}::ng-deep .cdk-overlay-pane{max-width:90vw!important}::ng-deep .mat-header-cell,::ng-deep .mat-tab-label,::ng-deep .mat-tab-link{font-size:15px;font-weight:600}::ng-deep .mat-radio-outer-circle{background-color:#fff}.icon-tbl-properties,.icon__tbl-properties{font-size:18px}.icon__hovered{color:#e6e6e6}.icon__hovered:hover{color:#bb9156}.no-data-div,.show__no-data-txt{background-color:rgba(187,145,86,.15);border:1px solid rgba(187,145,86,.3);border-radius:4px;margin:2vh auto 0;max-height:62px;position:relative;text-align:center;top:0;width:50vw}.no-data-div h4,.show__no-data-txt h4{color:#9c1c23;font-size:1.5rem;font-weight:500;margin-bottom:0;margin-top:0;padding:1rem}.material-icons{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;direction:ltr;display:inline-block;font-family:Material Icons;font-feature-settings:\"liga\";font-size:24px;font-style:normal;font-weight:400;letter-spacing:normal;line-height:1;text-rendering:optimizeLegibility;text-transform:none;white-space:nowrap;word-wrap:normal}.text-small{font-size:14px;font-weight:600}.text-base{font-size:16px;font-weight:600}.text-large{font-size:24px;font-weight:600}.text-xlarge{font-size:30px;font-weight:600}.common-button,.select-button{background-color:#fff;border-radius:4px;color:#bb9156;font-weight:600;line-height:2.5}.common-button:focus,.select-button:focus{outline:0}.common-button__sm{line-height:1;min-width:40px;padding:4px 0}.common-button__xsm{margin-left:.25rem;min-width:28px;padding:0}.common-button__xsm:first-child{margin-left:0}.common-button--primary{background-color:#bb9156;color:#fff}.common-button--secondary{border:2px solid #bb9156}.common-button--default{background-color:rgba(0,0,0,.15)}.select-button{min-width:60px}.close-btn{color:rgba(51,51,51,.6)}.close-btn:hover{color:#333}.footer-button__fixed{background-color:#fff;border:1px solid #e6e6e6;border-left:0;border-right:0;bottom:0;display:flex;padding:.5rem 1rem;position:fixed;width:100%;z-index:10}.table-properties__footer-button__margin{margin-left:-1rem}.manrate-button{border-radius:4px;font-size:20px;font-weight:600;min-height:64px;min-width:112px}.table-info__item{border-right:1px solid #fff;padding:0 16px}.table-info__item__left,.table-info__item__right{display:flex;flex-direction:row}.table-info__item__right{justify-content:flex-end}.table-info__item__right:last-child{border-right:0}.table-info__container{-ms-grid-columns:(minmax(80px,1fr))[2];-ms-grid-rows:24px;align-items:stretch;background-color:#000;color:#fff;display:-ms-grid;display:grid;grid-template-columns:repeat(2,minmax(80px,1fr));grid-template-rows:24px;justify-content:space-between}.chptray-chpset__form__select{background-color:#fff;border:2px solid grey;border-radius:4px;font-size:24px;font-weight:600;height:96px;letter-spacing:.2px;line-height:1;margin-bottom:8px;min-width:216px;padding:.5rem;text-align:left;width:100%}@media only screen and (max-width:1368px) and (max-height:768px){.chptray-chpset__form__select{font-size:20px;height:64px;height:72px;min-width:112px;padding:.25rem .5rem;width:100%}}.link-color__primary{color:#bb9156!important}.link-color__primary:hover{color:#7a191b!important}.refresh-btn{align-items:center;cursor:pointer!important;display:flex;height:24px;justify-content:center}.space-filler{flex-grow:1}.negative-value{color:#dc3522!important}.css--arrow-sign{background-color:#000;border-radius:8px;display:inline-block;height:4px;position:relative;width:24px}.css--arrow-sign:after,.css--arrow-sign:before{background-color:#000;border-radius:8px;content:\"\";height:4px;width:14px}.css--arrow-sign:before{position:absolute;right:-4px;top:-4px;transform:rotate(45deg)}.css--arrow-sign:after{position:absolute;right:-4px;top:4px;transform:rotate(-225deg)}.v-line,.vert-line{border-color:hsla(0,0%,100%,.2);color:#fff}.form-control__wrapper{background-color:hsla(0,0%,90.2%,.16);border:none;margin-bottom:.5rem;padding:.5rem .5rem 0}.form-control__wrapper:last-child{margin-bottom:0;padding-bottom:.5rem}"]
            },] }
];
AppAddNodeTopologyComponent.ctorParameters = () => [
    { type: MatDialog },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] },
    { type: TopologyService },
    { type: FormBuilder },
    { type: MatSnackBar },
    { type: TranslateService }
];
AppAddNodeTopologyComponent.propDecorators = {
    addedNodeEvent: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWFkZC1ub2RlLXRvcG9sb2d5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL2FwcC1hZGQtbm9kZS10b3BvbG9neS9hcHAtYWRkLW5vZGUtdG9wb2xvZ3kuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBVSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFOUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBUTdELE1BQU0sT0FBTywyQkFBMkI7SUFzQnBDLFlBQW1CLFNBQW9CLEVBQ0ssSUFBSSxFQUFTLGdCQUFpQyxFQUN2RSxFQUFlLEVBQVMsUUFBcUIsRUFBUyxTQUEyQjtRQUZqRixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ0ssU0FBSSxHQUFKLElBQUksQ0FBQTtRQUFTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBaUI7UUFDdkUsT0FBRSxHQUFGLEVBQUUsQ0FBYTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQWE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQXZCN0YsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQU1mLFFBQUcsR0FBRyxDQUFDLENBQUM7UUFDUixRQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ1QsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFD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SSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUU7NEJBQ2pHLFdBQVcsR0FBRyxJQUFJLENBQUM7eUJBQ3RCOzZCQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTLEVBQUU7NEJBQ3pDLFdBQVcsR0FBRyxJQUFJLENBQUM7eUJBQ3RCO3FCQUNKO2lCQUNKO2FBQ0o7U0FDSjtRQUNGLE9BQU8sV0FBVyxDQUFDO0lBQ3RCLENBQUM7SUFDRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDL0csQ0FBQzs7O1lBMVFKLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQywrdE1BQXFEOzthQUV0RDs7O1lBVnlCLFNBQVM7NENBbUNsQixNQUFNLFNBQUMsZUFBZTtZQS9CL0IsZUFBZTtZQUZmLFdBQVc7WUFEVixXQUFXO1lBRVosZ0JBQWdCOzs7NkJBb0JuQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFcnJvclN0YXRlTWF0Y2hlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2cgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHsgTWF0U25hY2tCYXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbmFjay1iYXInO1xuaW1wb3J0IHtGb3JtQnVpbGRlciwgRm9ybUNvbnRyb2wsIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7VHJhbnNsYXRlU2VydmljZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XG5pbXBvcnQge1RvcG9sb2d5U2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvdG9wb2xvZ3kuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1hcHAtYWRkLW5vZGUtdG9wb2xvZ3knLFxuICB0ZW1wbGF0ZVVybDogJy4vYXBwLWFkZC1ub2RlLXRvcG9sb2d5LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYXBwLWFkZC1ub2RlLXRvcG9sb2d5LmNvbXBvbmVudC5zY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBBZGROb2RlVG9wb2xvZ3lDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHB1YmxpYyBvcHRpb25BcnIgPSBbXTtcbiAgICBwdWJsaWMgdHlwZVZhbDtcbiAgICBwdWJsaWMgbG9uZ05hbWU7XG4gICAgcHVibGljIHNob3J0TmFtZTtcbiAgICBwdWJsaWMgZGVzY3JpcHRpb247XG4gICAgcHVibGljIGhvc3Q7XG4gICAgcHVibGljIG1pbiA9IDE7XG4gICAgcHVibGljIG1heCA9IDEwO1xuICAgIHB1YmxpYyBpc0hvc3QgPSBmYWxzZTtcbiAgICBwdWJsaWMgbG9hZGVyID0gZmFsc2U7XG4gICAgQE91dHB1dCgpIGFkZGVkTm9kZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHB1YmxpYyBzaXRlVG9wb2xvZ3lDb2RlO1xuICAgIHB1YmxpYyBzaXRlc0Zyb21Ub3BvbG9neSA9IFtdO1xuICAgIHB1YmxpYyBjb21wYW55TGV2ZWxDb2RlO1xuICAgIHB1YmxpYyBpc0FjY2Vzc0dyb3VwID0gZmFsc2U7XG4gICAgcHVibGljIGlzQUdOYW1lSW52YWxpZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBpc1Nob3J0TmFtZUludmFsaWQgPSBmYWxzZTtcbiAgICBwdWJsaWMgaXNMb25nTmFtZUludmFsaWQgPSBmYWxzZTtcbiAgICBwdWJsaWMgc2F2ZWRBY2Nlc3NHcm91cDogc3RyaW5nO1xuICAgIHB1YmxpYyBzYXZlZExvY2F0aW9uOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2csXG4gICAgICAgICAgICAgICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIHB1YmxpYyBkYXRhLCBwdWJsaWMgX3RvcG9sb2d5U2VydmljZTogVG9wb2xvZ3lTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBmYjogRm9ybUJ1aWxkZXIsIHB1YmxpYyBzbmFja0JhcjogTWF0U25hY2tCYXIsIHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5pc0FjY2Vzc0dyb3VwID0gdGhpcy5kYXRhLmNhbGxlZCA9PT0gJ2FjY2Vzc2dyb3VwJztcbiAgICAgICAgdGhpcy5hZGRWYWxpZGF0aW9ucygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsaW1pdEZvcm0gPSB0aGlzLmZiLmdyb3VwKHtcbiAgICAgICAgZGVzY3JpcHRpb246IFsnJ11cbiAgICB9KTtcblxuICAgIHZhbGlkYXRlU2hvcnROYW1lOiBFcnJvclN0YXRlTWF0Y2hlciA9IHtcbiAgICAgICAgaXNFcnJvclN0YXRlOiAoY29udHJvbDogRm9ybUNvbnRyb2wpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNTaG9ydE5hbWVJbnZhbGlkID0gdGhpcy5pc0R1cGxpY2F0ZSgnc2hvcnROYW1lJywgdGhpcy5saW1pdEZvcm0udmFsdWVbJ3Nob3J0TmFtZSddKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzU2hvcnROYW1lSW52YWxpZDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFsaWRhdGVOYW1lOiBFcnJvclN0YXRlTWF0Y2hlciA9IHtcbiAgICAgICAgaXNFcnJvclN0YXRlOiAoY29udHJvbDogRm9ybUNvbnRyb2wpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNMb25nTmFtZUludmFsaWQgPSB0aGlzLmlzRHVwbGljYXRlKCduYW1lJywgdGhpcy5saW1pdEZvcm0udmFsdWVbJ2xvbmdOYW1lJ10pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNMb25nTmFtZUludmFsaWQ7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhbGlkYXRlQWNjZXNzR3JvdXBOYW1lOiBFcnJvclN0YXRlTWF0Y2hlciA9IHtcbiAgICAgICAgaXNFcnJvclN0YXRlOiAoY29udHJvbDogRm9ybUNvbnRyb2wpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNBR05hbWVJbnZhbGlkID0gdGhpcy5pc0R1cGxpY2F0ZSgnZ3JvdXBOYW1lJywgdGhpcy5saW1pdEZvcm0udmFsdWVbJ2FjY2Vzc0dyb3VwTmFtZSddKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzQUdOYW1lSW52YWxpZDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFsQ2hhbmdlRnVuY3Rpb24oZXZ0LCBmTmFtZSkge1xuICAgICAgICBjb25zdCB2YWxPYmogPSB7fTtcbiAgICAgICAgdmFsT2JqW2ZOYW1lXSA9IGV2dDtcbiAgICAgICAgdGhpcy5saW1pdEZvcm0ucGF0Y2hWYWx1ZSh2YWxPYmosIHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH1cbiAgICBhZGRWYWxpZGF0aW9ucygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBY2Nlc3NHcm91cCkge1xuICAgICAgICAgICAgdGhpcy5saW1pdEZvcm0uYWRkQ29udHJvbCgndHlwZVZhbEFHcm91cCcsIG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5yZXF1aXJlZCkpO1xuICAgICAgICAgICAgdGhpcy5saW1pdEZvcm0uYWRkQ29udHJvbCgnYWNjZXNzR3JvdXBOYW1lJywgbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxpbWl0Rm9ybS5hZGRDb250cm9sKCd0eXBlVmFsJywgbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKSk7XG4gICAgICAgICAgICB0aGlzLmxpbWl0Rm9ybS5hZGRDb250cm9sKCdsb25nTmFtZScsIG5ldyBGb3JtQ29udHJvbCgnJyxcbiAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIHRoaXMubm9XaGl0ZXNwYWNlXSkpKTtcbiAgICAgICAgICAgIHRoaXMubGltaXRGb3JtLmFkZENvbnRyb2woJ3Nob3J0TmFtZScsIG5ldyBGb3JtQ29udHJvbCgnJyxcbiAgICAgICAgICAgICAgICBWYWxpZGF0b3JzLmNvbXBvc2UoW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMubWF4TGVuZ3RoKHRoaXMubWF4KSwgdGhpcy5ub1doaXRlc3BhY2VdKSkpO1xuICAgICAgICAgICAgdGhpcy5saW1pdEZvcm0uYWRkQ29udHJvbCgnaG9zdCcsIG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5yZXF1aXJlZCkpO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIG5vV2hpdGVzcGFjZShjb250cm9sOiBGb3JtQ29udHJvbCkge1xuICAgICAgICBjb25zdCBpc1doaXRlc3BhY2UgPSAoY29udHJvbC52YWx1ZSB8fCAnJykudHJpbSgpLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgY29uc3QgaXNWYWxpZCA9ICFpc1doaXRlc3BhY2U7XG4gICAgICAgIHJldHVybiBpc1ZhbGlkID8gbnVsbCA6IHsgJ3doaXRlc3BhY2UnOiB0cnVlIH07XG4gICAgfVxuICAgIHNob3dIb3N0KG9wdCkge1xuICAgICAgICBpZiAob3B0LnZhbHVlID09PSAxMDAwKSB7XG4gICAgICAgICAgICB0aGlzLmlzSG9zdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmxpbWl0Rm9ybS5hZGRDb250cm9sKCdob3N0JywgbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzSG9zdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5saW1pdEZvcm0ucmVtb3ZlQ29udHJvbCgnaG9zdCcpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5jYWxsZWQgPT09ICdhY2Nlc3Nncm91cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRGF0YUZvckRyb3Bkb3duRm9yQWNjZXNzR3JvdXAodGhpcy5fdG9wb2xvZ3lTZXJ2aWNlLnRvcG9sb2d5VHlwZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuY2FsbGVkID09PSAnYXNzaWduZWRub2RlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVEYXRhRm9yRHJvcGRvd25Gb3JBc3NpbmdlZE5vZGUodGhpcy5kYXRhLnR5cGVNYXApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgIGNyZWF0ZURhdGFGb3JEcm9wZG93bkZvckFjY2Vzc0dyb3VwKHRvcG9sb2d5VHlwZXMpIHtcbiAgICAgICAgdG9wb2xvZ3lUeXBlcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUudG9wb2xvZ3lUeXBlID09PSAnU0lURScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNpdGVUb3BvbG9neUNvZGUgPSB2YWx1ZS50b3BvbG9neVR5cGVJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2YWx1ZS50b3BvbG9neVR5cGUgPT09ICdDT01QQU5ZX05BTUUnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wYW55TGV2ZWxDb2RlID0gdmFsdWUudG9wb2xvZ3lUeXBlSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBrZXlPZlNpdHMgPSBPYmplY3Qua2V5cyh0aGlzLl90b3BvbG9neVNlcnZpY2UudG9wb2xvZ3lOb2RlTmFtZXMpLlxuICAgICAgICBmaWx0ZXIoa2V5ID0+IHRoaXMuX3RvcG9sb2d5U2VydmljZS50b3BvbG9neU5vZGVOYW1lc1trZXldLnR5cGVcbiAgICAgICAgICAgID09PSB0aGlzLnNpdGVUb3BvbG9neUNvZGUpO1xuICAgICAgICBmb3IgKGxldCBpIG9mIGtleU9mU2l0cykge1xuICAgICAgICAgICAgdGhpcy5zaXRlc0Zyb21Ub3BvbG9neS5wdXNoKHRoaXMuX3RvcG9sb2d5U2VydmljZS50b3BvbG9neU5vZGVOYW1lc1tpXSk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbkFyci5wdXNoKHtpZDogdGhpcy5fdG9wb2xvZ3lTZXJ2aWNlLnRvcG9sb2d5Tm9kZU5hbWVzW2ldLm5vZGVJZCxcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLl90b3BvbG9neVNlcnZpY2UudG9wb2xvZ3lOb2RlTmFtZXNbaV0ubmFtZX0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNyZWF0ZURhdGFGb3JEcm9wZG93bkZvckFzc2luZ2VkTm9kZSh0eXBlcykge1xuICAgICAgICBpZiAodHlwZXMuZ2V0KHRoaXMuZGF0YS5jbGlja2VkTm9kZS50eXBlKS5jaGlsZFR5cGVJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdGVtcCA9IHR5cGVzLmdldCh0aGlzLmRhdGEuY2xpY2tlZE5vZGUudHlwZSkuY2hpbGRUeXBlSWRzO1xuICAgICAgICAgICAgZm9yIChjb25zdCB0cCBvZiB0ZW1wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25BcnIucHVzaCh7dmFsdWU6IHR5cGVzLmdldCh0cCkubGFiZWxDb2RlLCBpZDogdHlwZXMuZ2V0KHRwKS50b3BvbG9neVR5cGVJZCwgdHlwZTogdHlwZXMuZ2V0KHRwKS50b3BvbG9neVR5cGV9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjcmVhdGVBY2Nlc3NHcm91cCgpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBOYW1lID0gdGhpcy5saW1pdEZvcm0udmFsdWUuYWNjZXNzR3JvdXBOYW1lO1xuICAgICAgICB0aGlzLmxvYWRlciA9IHRydWU7XG4gICAgICAgIC8vIHtcInRvcG9sb2d5SWRcIjoyODA1LFwiZ3JvdXBOYW1lXCI6XCJhc2Rhc2Rhc2FhYWFcIixcImdyb3VwVHlwZVwiOlwiQUNDRVNTXCJ9XG4gICAgICAgIGNvbnN0IHBhcmFtID0ge1xuICAgICAgICAgICAgdG9wb2xvZ3lJZDogdGhpcy5saW1pdEZvcm0udmFsdWUudHlwZVZhbEFHcm91cCxcbiAgICAgICAgICAgIGdyb3VwTmFtZTogZ3JvdXBOYW1lLnRyaW0oKSxcbiAgICAgICAgICAgIGdyb3VwVHlwZTogJ0FDQ0VTUydcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fdG9wb2xvZ3lTZXJ2aWNlLmNyZWF0ZU5vZGVBY2Nlc3NHcm91cChwYXJhbSkuc3Vic2NyaWJlKCAocmVzKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzWzBdICYmIHJlc1swXS5jb2RlID09PSAyMDAwMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc25hY2tCYXIub3BlbignRXJyb3IgT2NjdXJyZWQuIFBscyB0cnkgYWdhaW4gbGF0ZXIuJywgJycsIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxQb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgcGFuZWxDbGFzczogJ3NuYWNrX19lcnJvcidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNhdmVkQWNjZXNzR3JvdXAgPSBncm91cE5hbWUudHJpbSgpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VEaWFsb2dCb3goKTtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSB7cmVzOiByZXMsICBtc2c6ICdjcmVhdGVBY2Nlc3NHcm91cCd9O1xuICAgICAgICAgICAgdGhpcy5fdG9wb2xvZ3lTZXJ2aWNlLm5vZGVVcGRhdGVkLm5leHQodGVtcCk7XG4gICAgICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4odGhpcy50cmFuc2xhdGUuaW5zdGFudCgnYXBwbGljYXRpb24uYXBwLkNPTkZJR1VSQVRJT05fTEFCRUxTLkNISVBTRVRTLk1FU1NBR0UuQUdfQURERUQnKSwgJycsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsUG9zaXRpb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgcGFuZWxDbGFzczogJ3NuYWNrX19zdWNjZXNzJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oZXJyLmVycm9yWzBdLm1lc3NhZ2UsICcnLCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHBhbmVsQ2xhc3M6ICdzbmFja19fd2FybidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlQXNzaW5nZWROb2RlKCkge1xuICAgICAgICB0aGlzLmxvYWRlciA9IHRydWU7XG4gICAgICAgIGNvbnN0IGxvbmdOYW1lID0gdGhpcy5saW1pdEZvcm0udmFsdWUubG9uZ05hbWU7XG4gICAgICAgIGNvbnN0IHNob3J0TmFtZSA9IHRoaXMubGltaXRGb3JtLnZhbHVlLnNob3J0TmFtZTtcbiAgICAgICAgbGV0IHBhcmFtO1xuICAgICAgICBpZiAodGhpcy5saW1pdEZvcm0udmFsdWUudHlwZVZhbCA9PT0gMTAwMCkge1xuICAgICAgICAgICAgcGFyYW0gPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogbG9uZ05hbWUudHJpbSgpLFxuICAgICAgICAgICAgICAgIHNob3J0TmFtZTogc2hvcnROYW1lLnRyaW0oKSxcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmxpbWl0Rm9ybS52YWx1ZS50eXBlVmFsLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHRoaXMubGltaXRGb3JtLnZhbHVlLmhvc3QsXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZUlkOiB0aGlzLmRhdGEuY2xpY2tlZE5vZGUubm9kZUlkLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmxpbWl0Rm9ybS52YWx1ZS5kZXNjcmlwdGlvblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmFtID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IGxvbmdOYW1lLnRyaW0oKSxcbiAgICAgICAgICAgICAgICBzaG9ydE5hbWU6IHNob3J0TmFtZS50cmltKCksXG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5saW1pdEZvcm0udmFsdWUudHlwZVZhbCxcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlSWQ6IHRoaXMuZGF0YS5jbGlja2VkTm9kZS5ub2RlSWQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRoaXMubGltaXRGb3JtLnZhbHVlLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RvcG9sb2d5U2VydmljZS5jcmVhdGVOb2RlT25UcmVlKHBhcmFtKS5zdWJzY3JpYmUoKHJlcykgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc1swXSAmJiByZXNbMF0uY29kZSA9PT0gMjAwMDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNuYWNrQmFyLm9wZW4oJ0Vycm9yIE9jY3VycmVkLiBQbHMgdHJ5IGFnYWluIGxhdGVyLicsICcnLCB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAwLFxuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsUG9zaXRpb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIHBhbmVsQ2xhc3M6ICdzbmFja19fZXJyb3InXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zYXZlZExvY2F0aW9uID0gcmVzWzBdO1xuICAgICAgICAgICAgcmVzWzBdLnR5cGVOYW1lID0gdGhpcy5fdG9wb2xvZ3lTZXJ2aWNlLnRvcG9sb2d5VHlwZXMuZ2V0KHJlc1swXS50eXBlKS50b3BvbG9neVR5cGU7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0ge3JlczogcmVzLCBjbGlja05vZGU6IHRoaXMuZGF0YS5jbGlja2VkTm9kZSwgbXNnOiAnY3JlYXRlTm9kZSd9O1xuICAgICAgICAgICAgdGhpcy5fdG9wb2xvZ3lTZXJ2aWNlLm5vZGVVcGRhdGVkLm5leHQodGVtcCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jbG9zZURpYWxvZ0JveCgpO1xuICAgICAgICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJ2FwcGxpY2F0aW9uLmFwcC5DT05GSUdVUkFUSU9OX0xBQkVMUy5BUkVBUy5TVUNDRVNTX0FEREVEJyksICcnLCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMDAsXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIHBhbmVsQ2xhc3M6ICdzbmFja19fc3VjY2VzcydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zbmFja0Jhci5vcGVuKGVyciwgJycsIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwMCxcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsUG9zaXRpb246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgcGFuZWxDbGFzczogJ3NuYWNrX193YXJuJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGVOb2RlKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FjY2Vzc0dyb3VwKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUFjY2Vzc0dyb3VwKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUFzc2luZ2VkTm9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvc2VEaWFsb2dCb3goKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlQWxsKCk7XG4gICAgfVxuICAgIGlzRHVwbGljYXRlKGZpZWxkLCB2YWx1ZSk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgaXNSZWR1bmRhbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGZpZWxkID09PSAnZ3JvdXBOYW1lJyAmJiB2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc0dyb3VwcyA9IHRoaXMuX3RvcG9sb2d5U2VydmljZS5hY2Nlc3NHcm91cE5vZGVzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlMZW4gPSBhY2Nlc3NHcm91cHMubGVuZ3RoOyBpIDwgaUxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjY2Vzc0dyb3Vwc1tpXS5ncm91cE5hbWUgPT09IHZhbHVlLnRyaW0oKSAmJiB2YWx1ZS50cmltKCkgIT09IHRoaXMuc2F2ZWRBY2Nlc3NHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICBpc1JlZHVuZGFudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkID09PSAnbmFtZScgJiYgdmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICBjb25zdCBhbGxOb2RlcyA9IHRoaXMuX3RvcG9sb2d5U2VydmljZS50b3BvbG9neU5vZGVOYW1lcztcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb2JqIGluIGFsbE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbE5vZGVzLmhhc093blByb3BlcnR5KG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFsbE5vZGVzW29ial0ubmFtZS50b1VwcGVyQ2FzZSgpID09PSB2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2F2ZWRMb2NhdGlvbiAmJiB2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSAhPT0gdGhpcy5zYXZlZExvY2F0aW9uLm5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVkdW5kYW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zYXZlZExvY2F0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1JlZHVuZGFudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQgPT09ICdzaG9ydE5hbWUnICYmIHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgY29uc3QgYWxsTm9kZXMgPSB0aGlzLl90b3BvbG9neVNlcnZpY2UudG9wb2xvZ3lOb2RlTmFtZXM7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG9iaiBpbiBhbGxOb2Rlcykge1xuICAgICAgICAgICAgICAgIGlmIChhbGxOb2Rlcy5oYXNPd25Qcm9wZXJ0eShvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxOb2Rlc1tvYmpdLnNob3J0TmFtZS50b1VwcGVyQ2FzZSgpID09PSB2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2F2ZWRMb2NhdGlvbiAmJiB2YWx1ZS50cmltKCkudG9VcHBlckNhc2UoKSAhPT0gdGhpcy5zYXZlZExvY2F0aW9uLnNob3J0TmFtZS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNSZWR1bmRhbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNhdmVkTG9jYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUmVkdW5kYW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgIHJldHVybiBpc1JlZHVuZGFudDtcbiAgICB9XG4gICAgaXNTYXZlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbWl0Rm9ybS5pbnZhbGlkIHx8IHRoaXMuaXNBR05hbWVJbnZhbGlkIHx8IHRoaXMuaXNMb25nTmFtZUludmFsaWQgfHwgdGhpcy5pc1Nob3J0TmFtZUludmFsaWQ7XG4gICAgfVxufVxuIl19