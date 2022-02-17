import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})

export class NumberOnlyDirective {
  @Input() lengthForField;
  @Input() negativeValReq;
  @Input() isZeroValReq;
  @Output() inputChange = new EventEmitter();

  constructor(private _el: ElementRef) {
    this.lengthForField = 0;
    this.negativeValReq = false;
    this.isZeroValReq = true;
  }

  @HostListener('input', ['$event'])
  onInputChange(event) {
    const SPECIAL_CHAR_REPLACE = /[^\w\s]/gi;
    const SPECIAL_CHAR_REPLACE_ALLOW_MINUS = /[^\w\s\-]/gi;
    const REGEX_WITH_ZERO = /[^0-9]*/g;
    const REGEX_WITHOUT_ZERO = /[^1-9]*/g;
    /* "00001200000" ==> "1200000" */
    const REG_REMOVE_HEADING_ZERO = /^0+/;
    if (this._el.nativeElement.value.charAt(0) === '-' && this.negativeValReq) {
      this._el.nativeElement.value = this._el.nativeElement.value.replace(SPECIAL_CHAR_REPLACE_ALLOW_MINUS, '');
    }else{
      this._el.nativeElement.value = this._el.nativeElement.value.replace(SPECIAL_CHAR_REPLACE, '');
    }
    let isNegativeVal = this._el.nativeElement.value.charAt(0) === '-';
    let isZeroVal = this._el.nativeElement.value.charAt(0) === '0';
    const isZeroValAtSecond = this._el.nativeElement.value.charAt(1) === '0';
    if (isNegativeVal) {
      isZeroVal = this._el.nativeElement.value.charAt(1) === '0';
    }
    const initialValue = this._el.nativeElement.value;
    if (this.lengthForField) {
      this._el.nativeElement.value = initialValue.replace(REGEX_WITH_ZERO, '').slice(0, this.lengthForField);
    } else {
      this._el.nativeElement.value = initialValue.replace(REGEX_WITH_ZERO, '');
    }
    if (this.isZeroValReq === 'false') {
      if (isZeroVal) {
        this._el.nativeElement.value = this._el.nativeElement.value.replace(REG_REMOVE_HEADING_ZERO, '');
      } else if (isNegativeVal && isZeroValAtSecond) {
        this._el.nativeElement.value = this._el.nativeElement.value.replace(REG_REMOVE_HEADING_ZERO, '');
      }
    }
    isNegativeVal = this.negativeValReq ? isNegativeVal : false;
    isZeroVal = ( this.isZeroValReq !== 'false' ) ? isZeroVal : false;
    this._el.nativeElement.value = ( isNegativeVal ) ? '-' + this._el.nativeElement.value : this._el.nativeElement.value;
    // this._el.nativeElement.value = ( isZeroVal && !this.negativeValReq ) ? '0' + this._el.nativeElement.value : this._el.nativeElement.value;
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
    this.inputChange.emit(initialValue);
  }
}
