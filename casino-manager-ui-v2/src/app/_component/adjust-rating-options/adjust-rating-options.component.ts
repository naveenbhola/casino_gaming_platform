import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppService} from '../../app.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ConfigurationService, DecodedTokenService} from 'common-ui';
import {TranslateService} from '@ngx-translate/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {FormGroup} from '@angular/forms';
import {WDTSUtility} from '../../utils/wdts-utils';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-adjust-rating-options',
  templateUrl: './adjust-rating-options.component.html',
  styleUrls: ['./adjust-rating-options.component.scss']
})
export class AdjustRatingOptionsComponent implements OnInit, OnDestroy {
  breadCrumsPath: string = '';
  initialPlayersRankingData: boolean = false;
  isPlayerRankingEditing: boolean = false;
  seletedRanking: string;
  playerRankingList: Array<any> = [];
  playerRankingObj: object = {
    minMaxError: false,
    handsPlayedRange: {min: '0', max: '0'},
    discount: '',
    discountError: '',
    playerTierType: '',
    maxPlayerRanking: false,
    playerRanking: ''
  };
  arrPlayerRankingData: Array<any> = [];
  dataFetched: boolean = false;
  number = 1;
  maxAllowableVal: number = 1000;
  minAllowableVal: number = 1;
  isResetForm: boolean = false;
  ishandsPlayedMaxSmaller: boolean = false;
  isAskRemovePlayerRankings: boolean = false;
  selectedConfigurationId: string = '';
  savedPlayerRanking: Array<any> = [];
  itemToEdit: object = {ind: ''};
  pitId: string = '';
  gamingDay;
  pitName;
  loading;
  allData;
  configurationId;
  loggedInUserInfo;
  prevPlayerRankingObj;
  itemToRemove;
  isPlayerRankingRemoving: boolean = false;
  numericNumberReg = /^\d*(?:[.,]\d{1,2})?$/;
  adjustRatingForm: FormGroup;

  // Subcribers
  breadCrumbSub: Subscription;
  playerRankingSub: Subscription;
  playerAdjustmentSub: Subscription;
  postPlayerAdjSub: Subscription;
  putPlayerAdjSub: Subscription;
  putPlayerAdjSub_1: Subscription;
  languageChanged: Subscription;

  constructor(public dialogRef: MatDialogRef<AdjustRatingOptionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private translate: TranslateService,
              private jwtHelperService: JwtHelperService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              public appService: AppService,
              private decodedTokenService: DecodedTokenService,
              private configurationService: ConfigurationService) {
    this.handleSubscription();
    this.getUpdatedBreadCrumb();
    this.adjustRatingForm = this.fb.group({
      playerRanking: [this.playerRankingObj['playerRanking']],
      handsPlayedMin: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(this.minAllowableVal),
        Validators.max(this.maxAllowableVal - 1), Validators.maxLength(3)])],
      handsPlayedMax: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(this.minAllowableVal),
        Validators.max(this.maxAllowableVal), Validators.maxLength(4)])],
      discount: ['', Validators.compose([Validators.required,
        Validators.pattern(this.numericNumberReg), Validators.max(100), Validators.maxLength(5)])]
    });
  }

  editPlayerRanking(selectedObj) {
    if (this.isAskRemovePlayerRankings) {
      return;
    } else {
      this.isPlayerRankingEditing = true;
      this.seletedRanking = selectedObj.name;
      this.resetPlayerRenking();
      selectedObj['editing'] = true;
      this.itemToEdit = selectedObj;
      this.prevPlayerRankingObj = Object.assign({}, selectedObj);
      this.playerRankingObj = {
        playerTierType: this.seletedRanking,
        handsPlayedRange: {
          min: selectedObj.min,
          max: selectedObj.max
        },
        discount: selectedObj.discount
      };
      this.adjustRatingForm.setValue({
        playerRanking: selectedObj.name,
        handsPlayedMin: selectedObj.min,
        handsPlayedMax: selectedObj.max,
        discount: selectedObj.discount
      });
      this.initialPlayersRankingData = false;
      this.setConfigurationId();
    }
  }


  ngOnInit() {
    this.initData();
    let labelArray;
    if (this.appService.appGlobalObj.breadCrumbList.length > 0) {
      labelArray = this.appService.appGlobalObj.breadCrumbList.map(function (value) {
        return value['labelName'];
      });
    }
    if (labelArray && labelArray.length > 0) {
      this.breadCrumsPath = labelArray.join('/');
    }
  }

  getUpdatedBreadCrumb() {
    this.breadCrumbSub = this.appService.broadcastBreadCrumb.subscribe(breadCrumb => {
      this.breadCrumsPath = breadCrumb;
    });
  }

  initData() {
    this.dataFetched = true;
    this.gamingDay = this.appService.appGlobalObj.gamingDay;
    this.pitId = this.appService.appGlobalObj.currentPitId;
    this.loading = false;
    this.isAskRemovePlayerRankings = false;
    if (this.allData && this.allData['topologyMap']) {
      this.pitName = this.allData['topologyMap'].get(parseInt(this.pitId));
    }
    this.loggedInUserInfo = this.decodedTokenService.getDecodedJwtToken();
    this.configurationId = null;
    this.arrPlayerRankingData = [];
    this.playerRankingSub = this.configurationService.getPlayerRankingList().subscribe((res) => {
      this.playerRankingList = res[0].propertyValues[0].propertyValue.split(',');
      this.seletedRanking = this.playerRankingList[0];
      this.playerRankingObj['playerTierType'] = this.seletedRanking;
      this.playerRankingObj['playerRanking'] = this.seletedRanking;
      this.adjustRatingForm.patchValue({playerRanking: this.seletedRanking});
      this.getPlayerAdjustment();
    });
  }

  getPlayerAdjustment() {
    this.savedPlayerRanking = [];
    this.playerAdjustmentSub = this.configurationService.getPlayerAdjustment(this.pitId, '3082').subscribe((res) => {
      this.savedPlayerRanking = res as any;
      this.setInitialData();
    });
  }

  setInitialData() {
    if (this.savedPlayerRanking.length > 0) {
      this.setConfigurationId();
      this.createPlayersRankingListData();
      this.dataFetched = false;
      this.cancelPlayerTier();
    } else {
      this.dataFetched = false;
    }
  }

  setConfigurationId() {
    if (this.savedPlayerRanking.length > 0) {
      const fountItem = this.savedPlayerRanking.find(item => {
        return item.name === this.seletedRanking;
      })
      if (fountItem) {
        this.selectedConfigurationId = fountItem.configurationId;
      } else {
        this.selectedConfigurationId = null;
      }
    }
  }

  createPlayersRankingListData() {
    const arrPlayerRankListData = this.savedPlayerRanking.map((item, index) => {
      let propValue = [];
      if (item.propertyValues && item.propertyValues.length > 0) {
        propValue = this.getArrToString(item.propertyValues[0].propertyValue, item);
      } else {
        propValue = [];
      }
      if (index === 0) {
        this.initialPlayersRankingData = true;
        this.playerRankingObj = {};
      }
      return propValue;
    });
    // by default it flat one level of arr if we want two level pass like this arr.flat(2) etc.
    // this.arrPlayerRankingData = arrPlayerRankListData.flat();
    this.arrPlayerRankingData = arrPlayerRankListData.reduce((a, b) => a.concat(b), []);
  }

  getArrToString(arr, itemObj) {
    let newArr = [];
    if (arr.length > 0) {
      const tempArr = JSON.parse(arr);
      newArr = tempArr.map((item, index) => {
        return {
          name: itemObj.name,
          objPlayerRanking: itemObj,
          configurationId: itemObj.configurationId,
          discount: item.value,
          handsPlayedRange: {min: 0, max: 0},
          min: parseInt(item.min, 10),
          max: parseInt(item.max, 10),
          editing: false,
          ind: index
        };
      });
    }
    return newArr;
  }


  savePlayerTierData() {
    /* update view to model */
    this.playerRankingObj['playerRanking'] = this.adjustRatingForm.value.playerRanking;
    this.playerRankingObj['playerTierType'] = this.adjustRatingForm.value.playerRanking;
    if (this.playerRankingObj['handsPlayedRange'] === undefined) {
      this.playerRankingObj['handsPlayedRange'] = {min: '', max: ''};
    }
    this.playerRankingObj['handsPlayedRange']['min'] = this.adjustRatingForm.value.handsPlayedMin;
    this.playerRankingObj['handsPlayedRange']['max'] = this.adjustRatingForm.value.handsPlayedMax;
    this.playerRankingObj['min'] = this.adjustRatingForm.value.handsPlayedMin;
    this.playerRankingObj['max'] = this.adjustRatingForm.value.handsPlayedMax;
    this.playerRankingObj['discount'] = this.adjustRatingForm.value.discount;
    this.restricToRange();
    if (this.playerRankingObj['maxPlayerRanking'] ||
      this.playerRankingObj['minMaxError'] || this.playerRankingObj['discountError']) {
      return;
    }
    this.createPostAndPutData();
    this.isAskRemovePlayerRankings = false;
  }

  restricToRange() {
    const minValue = this.playerRankingObj['handsPlayedRange']['min'];
    const maxValue = this.playerRankingObj['handsPlayedRange']['max'];
    const selectedPlayerTierArr = this.arrPlayerRankingData.filter(elm => {
      return this.seletedRanking === ( elm['name'] );
    });
    this.playerRankingObj['maxPlayerRanking'] = selectedPlayerTierArr.length >= 10;
    if (this.playerRankingObj['maxPlayerRanking']) {
      return;
    }
    if (this.prevPlayerRankingObj && this.checkIfInputIsEqual(minValue, maxValue)) {
      return;
    }
    let isExist = false;
    if (this.checkIfInputIsNotEqualInEditMode(minValue, maxValue)) {

      if (selectedPlayerTierArr.length > 1) {
        for (let i = 0; i < selectedPlayerTierArr.length; i++) {
          const item = selectedPlayerTierArr[i];
          if (item.ind !== this.itemToEdit['ind']) {
            if (this.inRange(item.min, minValue, maxValue) ||
              this.inRange(item.max, minValue, maxValue) || this.inRange(minValue, item.min, item.max)
              || this.inRange(maxValue, item.min, item.max)) {
              isExist = true;
              break;
            }
          }
        }
      }
      this.playerRankingObj['minMaxError'] = isExist;
      return;
    } else {
      for (let i = 0; i < selectedPlayerTierArr.length; i++) {
        const item = selectedPlayerTierArr[i];
        if (this.inRange(item.min, minValue, maxValue) ||
          this.inRange(item.max, minValue, maxValue) || this.inRange(minValue, item.min, item.max)
          || this.inRange(maxValue, item.min, item.max)) {
          isExist = true;
          break;
        }
      }
    }
    this.playerRankingObj['minMaxError'] = isExist || this.checkIfInputFiledEmpty(minValue, maxValue);
  }

  inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
  }

  checkIfInputFiledEmpty(min, max) {
    return ( min === null || max === null || min === '' || max === '');
  }

  checkIfInputIsEqual(inputMin, inputMax) {
    return this.prevPlayerRankingObj && (inputMin === this.prevPlayerRankingObj.min && inputMax === this.prevPlayerRankingObj.max);
  }

  createPostAndPutData() {
    const d = new Date();
    const x = d.toISOString().split('.000Z');
    const min = parseInt(this.playerRankingObj['handsPlayedRange']['min'], 10);
    const max = parseInt(this.playerRankingObj['handsPlayedRange']['max'], 10);
    const playerTierType = this.playerRankingObj['playerTierType'];
    const discount = this.playerRankingObj['discount'] ? Number(this.playerRankingObj['discount']) : 0;
    const arr = [];
    arr.push({'min': min, 'max': max, 'value': discount});
    const newJSON = JSON.stringify(arr);
    const objPost = {
      'createDtm': x[0] + 'Z',
      'userId': this.loggedInUserInfo.userId,
      'name': playerTierType,
      'dataType': 'STRING',
      'propertyValues': [
        {
          'propertyCode': 'com.wdts.player.adjustment.hands.played.discount',
          'propertyId': 3082,
          'propertyValue': newJSON,
          'createdDtm': x[0] + 'Z',
          'dataType': 'STRING'

        }
      ],
      'state': 'ACTIVE',
      'templateTypeCode': 'PLAYER_ADJUSTMENT',
      'topologyId': this.pitId,
      'type': 'CURRENT'
    };

    this.dataFetched = true;
    this.arrPlayerRankingData = [];
    if ((!this.isPlayerRankingEditing) && (!this.selectedConfigurationId)) {
      this.postPlayerAdjSub = this.configurationService.postPlayerAdjustment(this.pitId, '3082', objPost).subscribe(res => {
        this.savedPlayerRanking.push(res[0]);
        this.setInitialData();
      });
    } else {
      const d = new Date();
      const x = d.toISOString().split('.000Z');
      const existingPlayerTier = this.savedPlayerRanking.find(elm => {
        return elm.configurationId === this.selectedConfigurationId;
      });

      const arrExisting = [];
      if (existingPlayerTier && existingPlayerTier.propertyValues && existingPlayerTier.propertyValues.length === 0) {
        arrExisting.push({'min': min, 'max': max, 'value': discount});
        existingPlayerTier.propertyValues[0] = {};
        existingPlayerTier.propertyValues[0].propertyValue = JSON.stringify(arrExisting);
      } else {
        const arrExisting = existingPlayerTier.propertyValues[0].propertyValue.length > 0
          ? JSON.parse(existingPlayerTier.propertyValues[0].propertyValue) : [];
        if (this.itemToEdit) {
          arrExisting[this.itemToEdit['ind']]['min'] = min;
          arrExisting[this.itemToEdit['ind']]['max'] = max;
          arrExisting[this.itemToEdit['ind']]['value'] = discount;
          existingPlayerTier.propertyValues[0].propertyValue = JSON.stringify(arrExisting);
        } else {
          arrExisting.push({'min': min, 'max': max, 'value': discount});
          existingPlayerTier.propertyValues[0].propertyValue = JSON.stringify(arrExisting);
        }
      }
      existingPlayerTier.propertyValues[0].propertyCode = 'com.wdts.player.adjustment.hands.played.discount';
      existingPlayerTier.propertyValues[0].propertyId = 3082;
      existingPlayerTier.propertyValues[0].dataType = 'STRING';
      existingPlayerTier.propertyValues[0].createdDtm = x[0] + 'Z';

      this.putPlayerAdjSub = this.configurationService.putPlayerAdjustment(existingPlayerTier.configurationId, '3082', existingPlayerTier).subscribe(res => {
        existingPlayerTier.propertyValues[0].propertyValue = res[0].propertyValues[0].propertyValue;
        this.setInitialData();
      });
    }
  }

  removePlayerRanking(e) {
    e.stopImmediatePropagation();
    this.dataFetched = true;
    this.arrPlayerRankingData = [];
    this.selectedConfigurationId = this.itemToRemove.configurationId;
    this.isPlayerRankingRemoving = true;
    this.isAskRemovePlayerRankings = false;
    const filteredArr = this.arrPlayerRankingData.filter(item => {
      if (item.configurationId !== this.itemToRemove.configurationId) {
        return item;
      }
    });
    this.removeDataAndUpdate(this.itemToRemove.ind);
  }

  removePlayerRankingConfirm(e, itemToRemove) {
    this.cancelPlayerTier();
    itemToRemove['editing'] = true;
    this.itemToRemove = itemToRemove;
    this.isAskRemovePlayerRankings = true;
  }

  removeDataAndUpdate(ind) {
    const existingPlayerTier = this.savedPlayerRanking.find(elm => {
      return elm.configurationId === this.selectedConfigurationId;
    });
    const removeItem = JSON.parse(existingPlayerTier.propertyValues[0].propertyValue);
    removeItem.splice(ind, 1);
    existingPlayerTier.propertyValues[0].propertyValue = removeItem.length === 0 ? '' : JSON.stringify(removeItem);
    this.putPlayerAdjSub_1 = this.configurationService.putPlayerAdjustment(existingPlayerTier.configurationId, '3082', existingPlayerTier).subscribe(res => {
      existingPlayerTier.propertyValues[0].propertyValue = res[0].propertyValues[0].propertyValue;
      this.setInitialData();

    });
  }

  cancelRemovePlayerRanking() {
    this.isAskRemovePlayerRankings = false;
    this.cancelPlayerTier();
  }

  resetError(e) {
    this.isResetForm = false;
    this.playerRankingObj['minMaxError'] = false;
    this.playerRankingObj['maxPlayerRanking'] = false;
    if (parseInt(this.adjustRatingForm.value.handsPlayedMax) <= parseInt(this.adjustRatingForm.value.handsPlayedMin)) {
      this.ishandsPlayedMaxSmaller = true;
    } else {
      this.ishandsPlayedMaxSmaller = false;
    }
  }

  validateDiscoutField(e) {
    if (this.adjustRatingForm.value.discount === null || this.adjustRatingForm.value.discount === '') {
      this.playerRankingObj['discountError'] = false;
      return;
    } else {
      const discount = this.adjustRatingForm.value.discount;
      if (parseFloat(discount) > 100 || this.isMoreThanOneDot()) {
        this.playerRankingObj['discountError'] = true;
      } else if (!this.numericNumberReg.test(discount)) {
        this.playerRankingObj['discountError'] = true;
      } else {
        this.playerRankingObj['discountError'] = false;
      }
      if (isNaN(parseInt(discount)) || this.hasDecimalPlace(discount, 3) || this.playerRankingObj['discountError']) {
        e.preventDefault();
        return false;
      }
    }
  }

  validatePercentage(e: any) {
    return ((e.charCode >= 48 && e.charCode <= 57) || e.charCode === 46);
  }

  isCharacterDeleted(e) {
    return ( (e.key === 'Backspace' && e.keyCode === 8) ||
      e.keyCode === 32 || e.keyCode === 46);
  }

  isMoreThanOneDot() {
    if (this.adjustRatingForm.value.discount.indexOf('.') !== -1) {
      return ( this.adjustRatingForm.value.discount.lastIndexOf('.') !== this.adjustRatingForm.value.discount.indexOf('.') );
    } else {
      return false;
    }
  }

  hasDecimalPlace(value, x) {
    const pointIndex = value.indexOf('.');
    if (pointIndex !== -1) {
      return pointIndex >= 0 && pointIndex < value.length - x;
    } else {
      return false;
    }

  }

  resetPlayerRenking() {
    this.arrPlayerRankingData.map(item => {
      item.editing = false;
      return item;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  checkIfInputIsNotEqualInEditMode(inputMin, inputMax) {
    return ( this.isPlayerRankingEditing && this.prevPlayerRankingObj
      && ( inputMin !== this.prevPlayerRankingObj.min || inputMax !== this.prevPlayerRankingObj.max ));
  }

  cancelPlayerTier() {
    this.seletedRanking = this.playerRankingList[0];
    this.setConfigurationId();
    this.playerRankingObj = {
      playerTierType: this.seletedRanking,
      handsPlayedRange: {
        min: '',
        max: ''
      },
      discount: '',
      discountError: false,
      minMaxError: false,
      maxPlayerRanking: false
    }
    this.resetPlayerRenking();
    this.isPlayerRankingEditing = false;
    this.isAskRemovePlayerRankings = false;
    this.isResetForm = true;
    this.itemToEdit = null;
    this.itemToRemove = null;
    this.initialPlayersRankingData = true;
    this.resetForm();
  }

  resetForm() {
    this.adjustRatingForm.setValue({
      playerRanking: this.seletedRanking,
      handsPlayedMin: '',
      handsPlayedMax: '',
      discount: ''
    });
  }

  performHandsPlayedValidation() {
    return ( (this.adjustRatingForm.controls['handsPlayedMax']['errors'] && this.adjustRatingForm.controls['handsPlayedMax']['errors']['maxlength']) ||
      (this.adjustRatingForm.controls['handsPlayedMin']['errors'] && this.adjustRatingForm.controls['handsPlayedMin']['errors']['maxlength']) ||
      (this.adjustRatingForm.controls['handsPlayedMax']['errors'] && this.adjustRatingForm.controls['handsPlayedMax']['errors']['max'] ) ||
      (this.adjustRatingForm.controls['handsPlayedMin']['errors'] && this.adjustRatingForm.controls['handsPlayedMin']['errors']['min']  ) ||
      (this.adjustRatingForm.controls['handsPlayedMin']['errors'] && this.adjustRatingForm.controls['handsPlayedMin']['errors']['max']) ||
      (this.adjustRatingForm.controls['handsPlayedMax'].value !== '' && !this.isResetForm) &&
      (this.adjustRatingForm.controls['handsPlayedMin'].value !== '' &&
        this.adjustRatingForm.controls['handsPlayedMax']['errors'] && this.adjustRatingForm.controls['handsPlayedMax']['errors']['max']
        && !this.isResetForm) );
  }

  selectedPlayerRanking = (e) => {
    this.seletedRanking = this.adjustRatingForm.value.playerRanking;
    this.playerRankingObj['playerTierType'] = this.seletedRanking;
    this.playerRankingObj['playerRanking'] = this.seletedRanking;
    this.setConfigurationId();
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

  validateHandsPlayedMin(event, maxLength) {
    return WDTSUtility.validateNumberField(event, maxLength, this.adjustRatingForm.value.handsPlayedMin);
  }

  validateHandsPlayedMax(event, maxLength) {
    return WDTSUtility.validateNumberField(event, maxLength, this.adjustRatingForm.value.handsPlayedMax);
  }

  onChangeValue(evt, maxlen) {
    return WDTSUtility.isNonZeroRegex(evt, maxlen);
  }

  ngOnDestroy() {
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
    }
    if (this.breadCrumbSub) {
      this.breadCrumbSub.unsubscribe();
    }
    if (this.playerRankingSub) {
      this.playerRankingSub.unsubscribe();
    }
    if (this.playerAdjustmentSub) {
      this.playerAdjustmentSub.unsubscribe();
    }
    if (this.postPlayerAdjSub) {
      this.postPlayerAdjSub.unsubscribe();
    }
    if (this.putPlayerAdjSub) {
      this.putPlayerAdjSub.unsubscribe();
    }
    if (this.putPlayerAdjSub_1) {
      this.putPlayerAdjSub_1.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

}
