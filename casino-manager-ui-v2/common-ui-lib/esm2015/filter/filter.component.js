import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TopologyService } from '../services/topology.service';
import { DatePipe, DecimalPipe } from '@angular/common';
export class FilterComponent {
    constructor(translate, topologyService, decimalPipe, datePipe) {
        this.translate = translate;
        this.topologyService = topologyService;
        this.decimalPipe = decimalPipe;
        this.datePipe = datePipe;
        this.isDisabled = false;
        this.EMIT_FILTER = new EventEmitter();
        this.EMIT_FILTER_ALL = new EventEmitter();
        this.filterConfigOption = {
            title: '',
            column: '',
            class: '',
            options: [],
            isTopology: false,
            selectedOptions: [],
            isPromotionPit: false,
            type: ''
        };
        this.filterNeedsTranslation = ['status', 'rolled', 'fStatus', 'missingEvent', 'scan1Filter', 'scan2Filter', 'transactionType'];
        this.filterNeedsCapsUnderscore = ['missingEvent', 'scan1Filter', 'scan2Filter'];
        this.options = [];
        this.disableOption = false;
        this.searchKey = '';
        this.index = -1;
    }
    ngOnChanges() {
        this.disableOption = this.isDisabled;
        this.filterConfigOption = this.configOptions;
        for (let i = 0; i < this.filterConfigOption.selectedOptions.length; i++) {
            if (this.options.indexOf(this.filterConfigOption.selectedOptions[i]) === -1) {
                this.options.push(this.filterConfigOption.selectedOptions[i]);
            }
        }
        if (!this.filterConfigOption.isPromotionPit) {
            this.defaultSelectAll();
        }
        else if (this.filterConfigOption.isPromotionPit &&
            this.filterConfigOption.options.length === this.filterConfigOption.selectedOptions.length) {
            this.defaultSelectAll();
        }
        else if (this.filterConfigOption.isPromotionPit) {
            if (this.filterConfigOption.selectedOptions.length === 0) {
                this.selectDeselectAll(null, this.filterConfigOption.isPromotionPit);
            }
            else {
                const tmpOption = Array.from(this.filterConfigOption.selectedOptions);
                this.options = tmpOption;
                this.emitFilter(false);
            }
        }
    }
    defaultSelectAll() {
        if (this.filterConfigOption.options.length === this.filterConfigOption.selectedOptions.length ||
            !this.filterConfigOption.selectedOptions.length) {
            this.options = ['All', ...this.filterConfigOption.options];
        }
    }
    selectOption(params) {
        if (params) {
            this.selectDeselectAll(params, false);
        }
        else {
            this.selectDeselectOtherOptions();
        }
    }
    selectDeselectAll(params, isPromotionPit) {
        if (isPromotionPit && params === null) {
            this.options = [];
        }
        else if (this.options.indexOf('All') > -1) {
            const tmpOption = ['All'];
            for (let i = 0; i < this.filterConfigOption.options.length; i++) {
                tmpOption.push(this.filterConfigOption.options[i]);
            }
            this.options = tmpOption;
        }
        else {
            this.options = [];
        }
        this.emitFilter(params);
    }
    selectDeselectOtherOptions() {
        if (this.options.length === this.filterConfigOption.options.length && this.options.indexOf('All') < 0) {
            const tmpOption = ['All'];
            for (let i = 0; i < this.filterConfigOption.options.length; i++) {
                tmpOption.push(this.filterConfigOption.options[i]);
            }
            this.options = tmpOption;
            this.emitFilter(true);
        }
        else if (this.options.length === this.filterConfigOption.options.length) {
            const tmpOption = Array.from(this.options);
            tmpOption.shift();
            this.options = tmpOption;
            this.emitFilter(false);
        }
        else {
            this.emitFilter(false);
        }
    }
    emitFilter(params) {
        let selectedOptions = [];
        if (this.filterConfigOption.isPromotionPit) {
            selectedOptions = Array.from(this.options);
            if (params) {
                selectedOptions.shift();
            }
        }
        else {
            selectedOptions = Array.from(this.options).indexOf('All') < 0 ? Array.from(this.options) : [];
            if (params && selectedOptions) {
                selectedOptions.shift();
            }
        }
        if (Array.from(this.options).indexOf('All') > -1) {
            this.EMIT_FILTER_ALL.emit({ columnName: this.filterConfigOption.column, selectedOption: ['All'] });
        }
        else {
            this.EMIT_FILTER_ALL.emit({ columnName: this.filterConfigOption.column, selectedOption: selectedOptions });
        }
        this.EMIT_FILTER.emit({ columnName: this.filterConfigOption.column, selectedOption: selectedOptions });
    }
    translateFilterOptions(option) {
        let translateStr = '';
        if (option === '' && option === undefined) {
            return translateStr;
        }
        if (this.filterConfigOption.translatePath && option !== 'All') {
            translateStr = this.filterConfigOption.column === 'eventTypes' ? this.translate.instant(option + '.Alert_Type_Description') :
                this.translate.instant(this.filterConfigOption.translatePath + '.' + option);
        }
        else if (parseInt(option, 10) === -17 || option === '(Blanks)') {
            translateStr = this.translate.instant('(Blanks)');
        }
        else {
            if (this.filterConfigOption.isTopology && this.topologyService.topologyNodeNames[option]) {
                translateStr = this.topologyService.topologyNodeNames[option].name;
            }
            else if (this.filterNeedsTranslation.indexOf(this.filterConfigOption.column) !== -1) {
                if (option !== '' && option !== undefined) {
                    if (this.filterNeedsCapsUnderscore.indexOf(this.filterConfigOption.column) !== -1) {
                        translateStr = this.translate.instant(option.replace(/ /g, '_').toUpperCase());
                    }
                    else {
                        translateStr = this.translate.instant(option);
                    }
                }
            }
            else {
                translateStr = option;
            }
        }
        return translateStr;
    }
    getFormattedValue(option, columnName, columnType) {
        if (columnName === 'gamingDay') {
            return this.datePipe.transform(option, 'dd-MMM-yyyy');
        }
        else if (columnType === 'number' && option > 999) {
            return this.decimalPipe.transform(option, '2.');
        }
        else {
            return option;
        }
    }
}
FilterComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-filter',
                template: "<mat-form-field class=\"filter-field__container\">\n  <mat-select placeholder=\"{{filterConfigOption.title | translate}}\"\n              [(ngModel)]=\"options\"\n              multiple\n              [disableOptionCentering]=\"true\">\n\n    <mat-select-trigger>\n      <span *ngIf=\"(options && options.indexOf('All') > -1)\" [translate]=\"'All'\"></span>\n      <span *ngIf=\"(options && options.indexOf('All') < 0)\">\n        {{options ? getFormattedValue( translateFilterOptions(options[0]),filterConfigOption.column, filterConfigOption.type  ) : ''}}\n      </span>\n      <span *ngIf=\"options?.length > 1 && options.indexOf('All') < 0\" class=\"example-additional-selection\">\n        (+{{options.length - 1}})\n      </span>\n    </mat-select-trigger>\n\n    <mat-option [value]=\"'All'\"\n                [disabled]=\"disableOption\"\n                (click)=\"selectOption(true)\">\n      <span [translate]=\"'All'\"></span></mat-option>\n\n    <mat-option *ngFor=\"let option of filterConfigOption.options; let idx=index\"\n                id=\"option{{idx}}\"\n                [disabled]=\"disableOption\"\n                [value]=\"option\"\n                (click)=\"selectOption(false)\">\n      {{\n      (filterConfigOption.type === 'number') ? ((option > 999) ? (option | number: '2.') : (option))\n              : getFormattedValue( translateFilterOptions(option),filterConfigOption.column, filterConfigOption.type)\n      }}\n    </mat-option>\n  </mat-select>\n</mat-form-field>\n",
                styles: [":root{--accent:#9c1c23;--accent-bright:#ff562d;--accent-dark:#7d161b;--black:#000;--blue:#00ceff;--blue-dark:#00a3cc;--cyan:#23a6ad;--danger:#dc3545;--dark:#333;--dark-light:grey;--gray30:#5a5858;--gray50:#817e7e;--gray80:#d9d8d8;--green-dark:#1c925d;--green-darker:#0a3321;--green-light:#b2f0d5;--info:#0facd2;--primary:#bb9156;--primary-beige:#f0edca;--primary-bg:#eee7dd;--primary-dark:#ab7348;--primary-light:#d9cb9e;--primary-lighten:#e0cdb2;--secondary:#ccc;--secondary-light:#e6e6e6;--success:#22b573;--success-bright:#24ff00;--warning:#fbb03b;--white:#fff;--white-text:#f5f5f5;--yellow:#ff0;--yellow-bright:#ffea00;--yellow-dark:#cc0}.filter-field__container{width:100%}@media only screen and (max-width:1024px) and (max-height:768px){.filter-field__container.mat-form-field-appearance-legacy .mat-form-field-infix{width:120px}}"]
            },] }
];
FilterComponent.ctorParameters = () => [
    { type: TranslateService },
    { type: TopologyService },
    { type: DecimalPipe },
    { type: DatePipe }
];
FilterComponent.propDecorators = {
    configOptions: [{ type: Input }],
    isDisabled: [{ type: Input }],
    EMIT_FILTER: [{ type: Output }],
    EMIT_FILTER_ALL: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL2ZpbHRlci9maWx0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBYSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzdELE9BQU8sRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFPdEQsTUFBTSxPQUFPLGVBQWU7SUFzQnhCLFlBQW9CLFNBQTJCLEVBQzNCLGVBQWdDLEVBQ2hDLFdBQXdCLEVBQ3hCLFFBQWtCO1FBSGxCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBdkI3QixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN0QyxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDcEQsdUJBQWtCLEdBQVE7WUFDdEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUUsRUFBRTtZQUNWLEtBQUssRUFBRSxFQUFFO1lBQ1QsT0FBTyxFQUFFLEVBQUU7WUFDWCxVQUFVLEVBQUUsS0FBSztZQUNqQixlQUFlLEVBQUUsRUFBRTtZQUNuQixjQUFjLEVBQUUsS0FBSztZQUNyQixJQUFJLEVBQUUsRUFBRTtTQUNYLENBQUM7UUFHRiwyQkFBc0IsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDMUgsOEJBQXlCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzNFLFlBQU8sR0FBZSxFQUFFLENBQUM7UUFDekIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFNbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUM3QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqRTtTQUNKO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUU7WUFDekMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDM0I7YUFBTSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjO1lBQzdDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO1lBQzNGLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQzNCO2FBQU0sSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFO1lBQy9DLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN0RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUN4RTtpQkFBTTtnQkFDSCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDMUI7U0FDSjtJQUNMLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsTUFBTTtZQUN6RixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFO1lBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUQ7SUFDTCxDQUFDO0lBRUQsWUFBWSxDQUFDLE1BQWU7UUFDeEIsSUFBSSxNQUFNLEVBQUU7WUFDUixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztTQUNyQztJQUNMLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsY0FBYztRQUNwQyxJQUFJLGNBQWMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN6QyxNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0QsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEQ7WUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztTQUM1QjthQUFNO1lBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCwwQkFBMEI7UUFDdEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkcsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdELFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3REO1lBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QjthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDdkUsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0MsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7YUFBTTtZQUNILElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQU07UUFDYixJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFO1lBQ3hDLGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQyxJQUFJLE1BQU0sRUFBRTtnQkFDUixlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDM0I7U0FDSjthQUFNO1lBQ0gsZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUYsSUFBSSxNQUFNLElBQUksZUFBZSxFQUFFO2dCQUMzQixlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDM0I7U0FDSjtRQUNELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzlDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1NBQ3BHO2FBQU07WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFDO1NBQzVHO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQztJQUN6RyxDQUFDO0lBRUQsc0JBQXNCLENBQUMsTUFBTTtRQUN6QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxNQUFNLEtBQUssRUFBRSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDdkMsT0FBTyxZQUFZLENBQUM7U0FDdkI7UUFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtZQUMzRCxZQUFZLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pILElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQ3BGO2FBQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7WUFDOUQsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDSCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdEYsWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ3RFO2lCQUFNLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ25GLElBQUksTUFBTSxLQUFLLEVBQUUsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO29CQUN2QyxJQUFJLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO3dCQUMvRSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztxQkFDbEY7eUJBQU07d0JBQ0gsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNqRDtpQkFFSjthQUVKO2lCQUFNO2dCQUNILFlBQVksR0FBRyxNQUFNLENBQUM7YUFDekI7U0FFSjtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVU7UUFDNUMsSUFBSSxVQUFVLEtBQUssV0FBVyxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ3pEO2FBQU0sSUFBSSxVQUFVLEtBQUssUUFBUSxJQUFJLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDaEQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbkQ7YUFBTTtZQUNILE9BQU8sTUFBTSxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQzs7O1lBdktKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsNCtDQUFzQzs7YUFFekM7OztZQVJPLGdCQUFnQjtZQUNoQixlQUFlO1lBQ0wsV0FBVztZQUFyQixRQUFROzs7NEJBUVgsS0FBSzt5QkFDTCxLQUFLOzBCQUNMLE1BQU07OEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHtUb3BvbG9neVNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL3RvcG9sb2d5LnNlcnZpY2UnO1xuaW1wb3J0IHtEYXRlUGlwZSwgRGVjaW1hbFBpcGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYXBwLWZpbHRlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2ZpbHRlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZmlsdGVyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgRmlsdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgICBASW5wdXQoKSBjb25maWdPcHRpb25zOiBPYmplY3Q7XG4gICAgQElucHV0KCkgaXNEaXNhYmxlZCA9IGZhbHNlO1xuICAgIEBPdXRwdXQoKSBFTUlUX0ZJTFRFUiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAgIEBPdXRwdXQoKSBFTUlUX0ZJTFRFUl9BTEwgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgICBmaWx0ZXJDb25maWdPcHRpb246IGFueSA9IHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBjb2x1bW46ICcnLFxuICAgICAgICBjbGFzczogJycsXG4gICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICBpc1RvcG9sb2d5OiBmYWxzZSxcbiAgICAgICAgc2VsZWN0ZWRPcHRpb25zOiBbXSxcbiAgICAgICAgaXNQcm9tb3Rpb25QaXQ6IGZhbHNlLFxuICAgICAgICB0eXBlOiAnJ1xuICAgIH07XG4gICAgc2VhcmNoS2V5OiBzdHJpbmc7XG4gICAgaW5kZXg6IG51bWJlcjtcbiAgICBmaWx0ZXJOZWVkc1RyYW5zbGF0aW9uID0gWydzdGF0dXMnLCAncm9sbGVkJywgJ2ZTdGF0dXMnLCAnbWlzc2luZ0V2ZW50JywgJ3NjYW4xRmlsdGVyJywgJ3NjYW4yRmlsdGVyJywgJ3RyYW5zYWN0aW9uVHlwZSddO1xuICAgIGZpbHRlck5lZWRzQ2Fwc1VuZGVyc2NvcmUgPSBbJ21pc3NpbmdFdmVudCcsICdzY2FuMUZpbHRlcicsICdzY2FuMkZpbHRlciddO1xuICAgIG9wdGlvbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgICBkaXNhYmxlT3B0aW9uID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHRvcG9sb2d5U2VydmljZTogVG9wb2xvZ3lTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZGVjaW1hbFBpcGU6IERlY2ltYWxQaXBlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZGF0ZVBpcGU6IERhdGVQaXBlKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoS2V5ID0gJyc7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcygpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlT3B0aW9uID0gdGhpcy5pc0Rpc2FibGVkO1xuICAgICAgICB0aGlzLmZpbHRlckNvbmZpZ09wdGlvbiA9IHRoaXMuY29uZmlnT3B0aW9ucztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5zZWxlY3RlZE9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW5kZXhPZih0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5zZWxlY3RlZE9wdGlvbnNbaV0pID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wdXNoKHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLnNlbGVjdGVkT3B0aW9uc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5pc1Byb21vdGlvblBpdCkge1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2VsZWN0QWxsKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5maWx0ZXJDb25maWdPcHRpb24uaXNQcm9tb3Rpb25QaXQgJiZcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLm9wdGlvbnMubGVuZ3RoID09PSB0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5zZWxlY3RlZE9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRTZWxlY3RBbGwoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5pc1Byb21vdGlvblBpdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLnNlbGVjdGVkT3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdERlc2VsZWN0QWxsKG51bGwsIHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLmlzUHJvbW90aW9uUGl0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG1wT3B0aW9uID0gQXJyYXkuZnJvbSh0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5zZWxlY3RlZE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHRtcE9wdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXRGaWx0ZXIoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVmYXVsdFNlbGVjdEFsbCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLm9wdGlvbnMubGVuZ3RoID09PSB0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5zZWxlY3RlZE9wdGlvbnMubGVuZ3RoIHx8XG4gICAgICAgICAgICAhdGhpcy5maWx0ZXJDb25maWdPcHRpb24uc2VsZWN0ZWRPcHRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gWydBbGwnLCAuLi50aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5vcHRpb25zXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdE9wdGlvbihwYXJhbXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3REZXNlbGVjdEFsbChwYXJhbXMsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0RGVzZWxlY3RPdGhlck9wdGlvbnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbGVjdERlc2VsZWN0QWxsKHBhcmFtcywgaXNQcm9tb3Rpb25QaXQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGlzUHJvbW90aW9uUGl0ICYmIHBhcmFtcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gW107XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmluZGV4T2YoJ0FsbCcpID4gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IHRtcE9wdGlvbiA9IFsnQWxsJ107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0bXBPcHRpb24ucHVzaCh0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5vcHRpb25zW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHRtcE9wdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdEZpbHRlcihwYXJhbXMpO1xuICAgIH1cblxuICAgIHNlbGVjdERlc2VsZWN0T3RoZXJPcHRpb25zKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxlbmd0aCA9PT0gdGhpcy5maWx0ZXJDb25maWdPcHRpb24ub3B0aW9ucy5sZW5ndGggJiYgdGhpcy5vcHRpb25zLmluZGV4T2YoJ0FsbCcpIDwgMCkge1xuICAgICAgICAgICAgY29uc3QgdG1wT3B0aW9uID0gWydBbGwnXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJDb25maWdPcHRpb24ub3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRtcE9wdGlvbi5wdXNoKHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLm9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gdG1wT3B0aW9uO1xuICAgICAgICAgICAgdGhpcy5lbWl0RmlsdGVyKHRydWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5sZW5ndGggPT09IHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLm9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCB0bXBPcHRpb24gPSBBcnJheS5mcm9tKHRoaXMub3B0aW9ucyk7XG4gICAgICAgICAgICB0bXBPcHRpb24uc2hpZnQoKTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHRtcE9wdGlvbjtcbiAgICAgICAgICAgIHRoaXMuZW1pdEZpbHRlcihmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRGaWx0ZXIoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW1pdEZpbHRlcihwYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkT3B0aW9ucyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJDb25maWdPcHRpb24uaXNQcm9tb3Rpb25QaXQpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucyA9IEFycmF5LmZyb20odGhpcy5vcHRpb25zKTtcbiAgICAgICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZE9wdGlvbnMuc2hpZnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGVjdGVkT3B0aW9ucyA9IEFycmF5LmZyb20odGhpcy5vcHRpb25zKS5pbmRleE9mKCdBbGwnKSA8IDAgPyBBcnJheS5mcm9tKHRoaXMub3B0aW9ucykgOiBbXTtcbiAgICAgICAgICAgIGlmIChwYXJhbXMgJiYgc2VsZWN0ZWRPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb25zLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmZyb20odGhpcy5vcHRpb25zKS5pbmRleE9mKCdBbGwnKSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLkVNSVRfRklMVEVSX0FMTC5lbWl0KHtjb2x1bW5OYW1lOiB0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5jb2x1bW4sIHNlbGVjdGVkT3B0aW9uOiBbJ0FsbCddfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkVNSVRfRklMVEVSX0FMTC5lbWl0KHtjb2x1bW5OYW1lOiB0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5jb2x1bW4sIHNlbGVjdGVkT3B0aW9uOiBzZWxlY3RlZE9wdGlvbnN9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkVNSVRfRklMVEVSLmVtaXQoe2NvbHVtbk5hbWU6IHRoaXMuZmlsdGVyQ29uZmlnT3B0aW9uLmNvbHVtbiwgc2VsZWN0ZWRPcHRpb246IHNlbGVjdGVkT3B0aW9uc30pO1xuICAgIH1cblxuICAgIHRyYW5zbGF0ZUZpbHRlck9wdGlvbnMob3B0aW9uKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHRyYW5zbGF0ZVN0ciA9ICcnO1xuICAgICAgICBpZiAob3B0aW9uID09PSAnJyAmJiBvcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVN0cjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWx0ZXJDb25maWdPcHRpb24udHJhbnNsYXRlUGF0aCAmJiBvcHRpb24gIT09ICdBbGwnKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGVTdHIgPSB0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5jb2x1bW4gPT09ICdldmVudFR5cGVzJyA/IHRoaXMudHJhbnNsYXRlLmluc3RhbnQob3B0aW9uICsgJy5BbGVydF9UeXBlX0Rlc2NyaXB0aW9uJykgOlxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlLmluc3RhbnQodGhpcy5maWx0ZXJDb25maWdPcHRpb24udHJhbnNsYXRlUGF0aCArICcuJyArIG9wdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyc2VJbnQob3B0aW9uLCAxMCkgPT09IC0xNyB8fCBvcHRpb24gPT09ICcoQmxhbmtzKScpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0ZVN0ciA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoJyhCbGFua3MpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJDb25maWdPcHRpb24uaXNUb3BvbG9neSAmJiB0aGlzLnRvcG9sb2d5U2VydmljZS50b3BvbG9neU5vZGVOYW1lc1tvcHRpb25dKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlU3RyID0gdGhpcy50b3BvbG9neVNlcnZpY2UudG9wb2xvZ3lOb2RlTmFtZXNbb3B0aW9uXS5uYW1lO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlck5lZWRzVHJhbnNsYXRpb24uaW5kZXhPZih0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5jb2x1bW4pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb24gIT09ICcnICYmIG9wdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlck5lZWRzQ2Fwc1VuZGVyc2NvcmUuaW5kZXhPZih0aGlzLmZpbHRlckNvbmZpZ09wdGlvbi5jb2x1bW4pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlU3RyID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudChvcHRpb24ucmVwbGFjZSgvIC9nLCAnXycpLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlU3RyID0gdGhpcy50cmFuc2xhdGUuaW5zdGFudChvcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlU3RyID0gb3B0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZVN0cjtcbiAgICB9XG5cbiAgICBnZXRGb3JtYXR0ZWRWYWx1ZShvcHRpb24sIGNvbHVtbk5hbWUsIGNvbHVtblR5cGUpOiBzdHJpbmcge1xuICAgICAgICBpZiAoY29sdW1uTmFtZSA9PT0gJ2dhbWluZ0RheScpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGVQaXBlLnRyYW5zZm9ybShvcHRpb24sICdkZC1NTU0teXl5eScpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbHVtblR5cGUgPT09ICdudW1iZXInICYmIG9wdGlvbiA+IDk5OSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVjaW1hbFBpcGUudHJhbnNmb3JtKG9wdGlvbiwgJzIuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=