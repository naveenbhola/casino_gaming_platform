import { Component, Input } from '@angular/core';
import { DecimalPipe } from "@angular/common";
export class ChipIconsComponent {
    /*chipsIcon = {
        '50000000': 'icon-chip-color chip-50-million',
        '10000000': 'icon-chip-color chip-10-million',
        '500000': 'icon-chip-color chip-500-thousand',
        '100000': 'icon-chip-color chip-100-thousand',
        '50000': 'icon-chip-color chip-50-thousand',
        '25000': 'icon-chip-color chip-25-thousand',
        '10000': 'icon-chip-color chip-10-thousand',
        '5000': 'icon-chip-color chip-5-thousand',
        '1000': 'icon-chip-color chip-1-thousand',
        '500': 'icon-chip-color chip-500',
        '100': 'icon-chip-color chip-100',
        '50': 'icon-chip-color chip-50',
        '25': 'icon-chip-color chip-25',
        '5': 'icon-chip-color chip-5',
        '3': 'icon-chip-color chip-3',
        '1': 'icon-chip-color chip-1'
    };*/
    constructor(decimalPipe) {
        this.decimalPipe = decimalPipe;
    }
    ngOnInit() {
        this.getChipIcon();
    }
    getChipIcon() {
        if (typeof this.chipIconKey !== 'undefined') {
            this.strKey = this.chipIconKey.replace('.00', '');
        }
        this.chipLabel = this.getChipLabel(this.strKey);
        // this.strCss = this.chipsIcon[this.strKey] ? this.chipsIcon[this.strKey] : 'icon-chip-color default-chip-color';
        this.strCss = 'icon-chip-color chip-grey';
        return this.strCss;
    }
    getChipLabel(chipKey) {
        if (chipKey === undefined) {
            return;
        }
        if (this.isFractionalChipDenom(chipKey.toString())) {
            return this.decimalPipe.transform(chipKey.toString(), '1.2-2') /*.replace('.00', '')*/;
        }
        else {
            switch (chipKey) {
                case '1000':
                case '1000.0':
                case '1000.00': {
                    return '1K';
                }
                case '5000':
                case '5000.0':
                case '5000.00': {
                    return '5K';
                }
                case '10000':
                case '10000.0':
                case '10000.00': {
                    return '10K';
                }
                case '25000':
                case '25000.0':
                case '25000.00': {
                    return '25K';
                }
                case '50000':
                case '50000.0':
                case '50000.00': {
                    return '50K';
                }
                case '100000':
                case '100000.0':
                case '100000.00': {
                    return '100K';
                }
                case '500000':
                case '500000.0':
                case '500000.00': {
                    return '500K';
                }
                case '1000000':
                case '1000000.0':
                case '1000000.00': {
                    return '1M';
                }
                case '5000000':
                case '5000000.0':
                case '5000000.00': {
                    return '5M';
                }
                case '10000000':
                case '10000000.0':
                case '10000000.00': {
                    return '10M';
                }
                case '50000000':
                case '50000000.0':
                case '50000000.00': {
                    return '50M';
                }
                default:
                    return chipKey;
            }
        }
    }
    isFractionalChipDenom(denom) {
        if (typeof denom === 'number') {
            denom = denom.toString();
        }
        return (denom && denom.indexOf('.') > -1);
    }
}
ChipIconsComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-chip-icons',
                template: "<!--This html is applicable for this common-library only.-->\n<span *ngIf=\"(chipLabel && chipLabel.length === 1)\">\n         <svg class=\"icon-chip-color icon-chip\" [ngClass]=\"getChipIcon()\" xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"70\" height=\"70\" version=\"1.2\" x=\"0\" y=\"0\"\n              viewBox=\"0 0 30 30\" xml:space=\"preserve\">\n             <path d=\"M14 2c7 0 12 5 12 12s-5 12-12 12S2 21 2 14 7 2 14 2M14 0C6 0 0 6 0 14s6 14 14 14 14-6 14-14S22 0 14 0L14 0z\"/>\n             <path d=\"M14 7c4 0 7 3 7 7s-3 7-7 7 -7-3-7-7S10 7 14 7M14 5c-5 0-9 4-9 9s4 9 9 9 9-4 9-9S19 5 14 5L14 5z\"/>\n             <line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"6\"/>\n             <line x1=\"14\" y1=\"22\" x2=\"14\" y2=\"27\"/>\n             <line x1=\"22\" y1=\"14\" x2=\"27\" y2=\"14\"/>\n             <line x1=\"1\" y1=\"14\" x2=\"6\" y2=\"14\"/>\n             <line x1=\"24\" y1=\"4\" x2=\"19\" y2=\"9\"/>\n             <line x1=\"9\" y1=\"19\" x2=\"5\" y2=\"24\"/>\n             <line x1=\"19\" y1=\"19\" x2=\"24\" y2=\"24\"/>\n             <line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>\n             <text  text-anchor=\"start\" x=\"12\" y=\"16.5\" font-size=\"7\" font-weight=\"bold\" fill=\"black\">{{chipLabel}}</text>\n         </svg>\n</span>\n<span *ngIf=\"chipLabel.length === 2 && (chipLabel.indexOf('M') > -1)\">\n         <svg class=\"icon-chip-color icon-chip\" [ngClass]=\"getChipIcon()\" xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"70\" height=\"70\" version=\"1.2\" x=\"0\" y=\"0\"\n              viewBox=\"0 0 30 30\" xml:space=\"preserve\">\n             <path d=\"M14 2c7 0 12 5 12 12s-5 12-12 12S2 21 2 14 7 2 14 2M14 0C6 0 0 6 0 14s6 14 14 14 14-6 14-14S22 0 14 0L14 0z\"/>\n             <path d=\"M14 7c4 0 7 3 7 7s-3 7-7 7 -7-3-7-7S10 7 14 7M14 5c-5 0-9 4-9 9s4 9 9 9 9-4 9-9S19 5 14 5L14 5z\"/>\n             <line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"6\"/>\n             <line x1=\"14\" y1=\"22\" x2=\"14\" y2=\"27\"/>\n             <line x1=\"22\" y1=\"14\" x2=\"27\" y2=\"14\"/>\n             <line x1=\"1\" y1=\"14\" x2=\"6\" y2=\"14\"/>\n             <line x1=\"24\" y1=\"4\" x2=\"19\" y2=\"9\"/>\n             <line x1=\"9\" y1=\"19\" x2=\"5\" y2=\"24\"/>\n             <line x1=\"19\" y1=\"19\" x2=\"24\" y2=\"24\"/>\n             <line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>\n             <text  text-anchor=\"start\" x=\"9.5\" y=\"16.5\" font-size=\"6\" font-weight=\"bold\" fill=\"black\">{{chipLabel}}</text>\n         </svg>\n</span>\n<span *ngIf=\"chipLabel.length === 2 && !(chipLabel.indexOf('K') > -1) && !(chipLabel.indexOf('M') > -1)\">\n         <svg class=\"icon-chip-color icon-chip\" [ngClass]=\"getChipIcon()\" xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"70\" height=\"70\" version=\"1.2\" x=\"0\" y=\"0\"\n              viewBox=\"0 0 30 30\" xml:space=\"preserve\">\n             <path d=\"M14 2c7 0 12 5 12 12s-5 12-12 12S2 21 2 14 7 2 14 2M14 0C6 0 0 6 0 14s6 14 14 14 14-6 14-14S22 0 14 0L14 0z\"/>\n             <path d=\"M14 7c4 0 7 3 7 7s-3 7-7 7 -7-3-7-7S10 7 14 7M14 5c-5 0-9 4-9 9s4 9 9 9 9-4 9-9S19 5 14 5L14 5z\"/>\n             <line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"6\"/>\n             <line x1=\"14\" y1=\"22\" x2=\"14\" y2=\"27\"/>\n             <line x1=\"22\" y1=\"14\" x2=\"27\" y2=\"14\"/>\n             <line x1=\"1\" y1=\"14\" x2=\"6\" y2=\"14\"/>\n             <line x1=\"24\" y1=\"4\" x2=\"19\" y2=\"9\"/>\n             <line x1=\"9\" y1=\"19\" x2=\"5\" y2=\"24\"/>\n             <line x1=\"19\" y1=\"19\" x2=\"24\" y2=\"24\"/>\n             <line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>\n             <text text-anchor=\"start\" x=\"10.5\" y=\"16.5\" font-size=\"6\" font-weight=\"bold\" fill=\"black\">{{chipLabel}}</text>\n         </svg>\n</span>\n<span *ngIf=\"chipLabel.length === 2 && (chipLabel.indexOf('K') > -1)\">\n         <svg class=\"icon-chip-color icon-chip\" [ngClass]=\"getChipIcon()\" xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"70\" height=\"70\" version=\"1.2\" x=\"0\" y=\"0\"\n              viewBox=\"0 0 30 30\" xml:space=\"preserve\">\n             <path d=\"M14 2c7 0 12 5 12 12s-5 12-12 12S2 21 2 14 7 2 14 2M14 0C6 0 0 6 0 14s6 14 14 14 14-6 14-14S22 0 14 0L14 0z\"/>\n             <path d=\"M14 7c4 0 7 3 7 7s-3 7-7 7 -7-3-7-7S10 7 14 7M14 5c-5 0-9 4-9 9s4 9 9 9 9-4 9-9S19 5 14 5L14 5z\"/>\n             <line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"6\"/>\n             <line x1=\"14\" y1=\"22\" x2=\"14\" y2=\"27\"/>\n             <line x1=\"22\" y1=\"14\" x2=\"27\" y2=\"14\"/>\n             <line x1=\"1\" y1=\"14\" x2=\"6\" y2=\"14\"/>\n             <line x1=\"24\" y1=\"4\" x2=\"19\" y2=\"9\"/>\n             <line x1=\"9\" y1=\"19\" x2=\"5\" y2=\"24\"/>\n             <line x1=\"19\" y1=\"19\" x2=\"24\" y2=\"24\"/>\n             <line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>\n             <text text-anchor=\"start\" x=\"10\" y=\"16.5\" font-size=\"6\" font-weight=\"bold\" fill=\"black\">{{chipLabel}}</text>\n         </svg>\n</span>\n<span *ngIf=\"chipLabel.length === 3  && !(chipLabel.indexOf('M') > -1)\">\n         <svg class=\"icon-chip-color icon-chip\" [ngClass]=\"getChipIcon()\" xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"70\" height=\"70\" version=\"1.2\" x=\"0\" y=\"0\"\n              viewBox=\"0 0 30 30\" xml:space=\"preserve\">\n             <path d=\"M14 2c7 0 12 5 12 12s-5 12-12 12S2 21 2 14 7 2 14 2M14 0C6 0 0 6 0 14s6 14 14 14 14-6 14-14S22 0 14 0L14 0z\"/>\n             <path d=\"M14 7c4 0 7 3 7 7s-3 7-7 7 -7-3-7-7S10 7 14 7M14 5c-5 0-9 4-9 9s4 9 9 9 9-4 9-9S19 5 14 5L14 5z\"/>\n             <line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"6\"/>\n             <line x1=\"14\" y1=\"22\" x2=\"14\" y2=\"27\"/>\n             <line x1=\"22\" y1=\"14\" x2=\"27\" y2=\"14\"/>\n             <line x1=\"1\" y1=\"14\" x2=\"6\" y2=\"14\"/>\n             <line x1=\"24\" y1=\"4\" x2=\"19\" y2=\"9\"/>\n             <line x1=\"9\" y1=\"19\" x2=\"5\" y2=\"24\"/>\n             <line x1=\"19\" y1=\"19\" x2=\"24\" y2=\"24\"/>\n             <line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>\n             <text  text-anchor=\"start\" x=\"8.5\" y=\"16.5\" font-size=\"6\" font-weight=\"bold\" fill=\"black\">{{chipLabel}}</text>\n         </svg>\n</span>\n<span *ngIf=\"chipLabel.length === 3 && (chipLabel.indexOf('M') > -1)\">\n         <svg class=\"icon-chip-color icon-chip\" [ngClass]=\"getChipIcon()\" xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"70\" height=\"70\" version=\"1.2\" x=\"0\" y=\"0\"\n              viewBox=\"0 0 30 30\" xml:space=\"preserve\">\n             <path d=\"M14 2c7 0 12 5 12 12s-5 12-12 12S2 21 2 14 7 2 14 2M14 0C6 0 0 6 0 14s6 14 14 14 14-6 14-14S22 0 14 0L14 0z\"/>\n             <path d=\"M14 7c4 0 7 3 7 7s-3 7-7 7 -7-3-7-7S10 7 14 7M14 5c-5 0-9 4-9 9s4 9 9 9 9-4 9-9S19 5 14 5L14 5z\"/>\n             <line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"6\"/>\n             <line x1=\"14\" y1=\"22\" x2=\"14\" y2=\"27\"/>\n             <line x1=\"22\" y1=\"14\" x2=\"27\" y2=\"14\"/>\n             <line x1=\"1\" y1=\"14\" x2=\"6\" y2=\"14\"/>\n             <line x1=\"24\" y1=\"4\" x2=\"19\" y2=\"9\"/>\n             <line x1=\"9\" y1=\"19\" x2=\"5\" y2=\"24\"/>\n             <line x1=\"19\" y1=\"19\" x2=\"24\" y2=\"24\"/>\n             <line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>\n             <text  text-anchor=\"start\" x=\"7.5\" y=\"16.5\" font-size=\"6\" font-weight=\"bold\" fill=\"black\">{{chipLabel}}</text>\n         </svg>\n</span>\n<span *ngIf=\"chipLabel.length === 4\">\n         <svg class=\"icon-chip-color icon-chip\" [ngClass]=\"getChipIcon()\" xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"70\" height=\"70\" version=\"1.2\" x=\"0\" y=\"0\"\n              viewBox=\"0 0 30 30\" xml:space=\"preserve\">\n             <path d=\"M14 2c7 0 12 5 12 12s-5 12-12 12S2 21 2 14 7 2 14 2M14 0C6 0 0 6 0 14s6 14 14 14 14-6 14-14S22 0 14 0L14 0z\"/>\n             <path d=\"M14 7c4 0 7 3 7 7s-3 7-7 7 -7-3-7-7S10 7 14 7M14 5c-5 0-9 4-9 9s4 9 9 9 9-4 9-9S19 5 14 5L14 5z\"/>\n             <line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"6\"/>\n             <line x1=\"14\" y1=\"22\" x2=\"14\" y2=\"27\"/>\n             <line x1=\"22\" y1=\"14\" x2=\"27\" y2=\"14\"/>\n             <line x1=\"1\" y1=\"14\" x2=\"6\" y2=\"14\"/>\n             <line x1=\"24\" y1=\"4\" x2=\"19\" y2=\"9\"/>\n             <line x1=\"9\" y1=\"19\" x2=\"5\" y2=\"24\"/>\n             <line x1=\"19\" y1=\"19\" x2=\"24\" y2=\"24\"/>\n             <line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>\n             <text  text-anchor=\"start\" x=\"8\" y=\"16\" font-size=\"5\" font-weight=\"bold\" fill=\"black\">{{chipLabel}}</text>\n         </svg>\n</span>\n",
                styles: [".icon-chip{background:url(\"data:image/svg+xml,%3C%3Fxml version%3D%221.0%22 encoding%3D%22utf-8%22%3F%3E%3C!-- Generator%3A Adobe Illustrator 19.1.0%2C SVG Export Plug-In . SVG Version%3A 6.00 Build 0)  --%3E%3Csvg version%3D%221.1%22 id%3D%22Layer_1%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22 x%3D%220px%22 y%3D%220px%22%09 viewBox%3D%220 0 33 33%22 style%3D%22enable-background%3Anew 0 0 33 33%3B%22 xml%3Aspace%3D%22preserve%22%3E%3Cstyle type%3D%22text%2Fcss%22%3E%09.st0%7Bopacity%3A0.105%3B%7D%09.st1%7Bfill%3A%23000%3B%7D%09.st2%7Bfill%3A%23FFFFFF%3B%7D%3C%2Fstyle%3E%3Cg id%3D%22XMLID_1829_%22%3E%09%3Cg id%3D%22XMLID_2222_%22%3E%09%09%3Cg class%3D%22st0%22%3E%09%09%09%3Ccircle class%3D%22st1%22 cx%3D%2217%22 cy%3D%2217%22 r%3D%2216%22%2F%3E%09%09%3C%2Fg%3E%09%09%3Cg%3E%09%09%09%3Ccircle class%3D%22st2%22 cx%3D%2214%22 cy%3D%2214%22 r%3D%2215%22%2F%3E%09%09%3C%2Fg%3E%09%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E\") 50%/100% no-repeat;background-size:100%;margin:-10px 0}.icon-chip-color{display:block;margin:2px 0 0 2px}.icon-chip-color line,.icon-chip-color path{fill:none;stroke:none;stroke-miterlimit:10;stroke-width:2}.icon-chip-color path{fill:#bb9156}.icon-chip-color line{stroke:#bb9156}.icon-chip-color.chip-1-million path{fill:#f7ef41}.icon-chip-color.chip-1-million line{stroke:#f7ef41}.icon-chip-color.chip-500-thousand path{fill:#d95d68}.icon-chip-color.chip-500-thousand line{stroke:#d95d68}.icon-chip-color.chip-100-thousand path{fill:#e79501}.icon-chip-color.chip-100-thousand line{stroke:#e79501}.icon-chip-color.chip-50-thousand path{fill:#74cc52}.icon-chip-color.chip-50-thousand line{stroke:#74cc52}.icon-chip-color.chip-10-thousand path{fill:#993c51}.icon-chip-color.chip-10-thousand line{stroke:#993c51}.icon-chip-color.chip-5-thousand path{fill:#d95d68}.icon-chip-color.chip-5-thousand line{stroke:#d95d68}.icon-chip-color.chip-1-thousand path{fill:#f7ef41}.icon-chip-color.chip-1-thousand line{stroke:#f7ef41}.icon-chip-color.chip-500 path{fill:#9f7abd}.icon-chip-color.chip-500 line{stroke:#9f7abd}.icon-chip-color.chip-100 path{fill:#979797}.icon-chip-color.chip-100 line{stroke:#979797}.icon-chip-color.chip-25 path{fill:#1573bb}.icon-chip-color.chip-25 line{stroke:#1573bb}.icon-chip-color.chip-5 path{fill:#d95d68}.icon-chip-color.chip-5 line{stroke:#d95d68}.icon-chip-color.chip-grey path{fill:#979797}.icon-chip-color.chip-grey line{stroke:#979797}"]
            },] }
];
ChipIconsComponent.ctorParameters = () => [
    { type: DecimalPipe }
];
ChipIconsComponent.propDecorators = {
    chipIconKey: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1pY29ucy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9jaGlwLWljb25zL2NoaXAtaWNvbnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQU81QyxNQUFNLE9BQU8sa0JBQWtCO0lBTzNCOzs7Ozs7Ozs7Ozs7Ozs7OztRQWlCSTtJQUNKLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQzVDLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssV0FBVyxFQUFFO1lBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRCxrSEFBa0g7UUFDbEgsSUFBSSxDQUFDLE1BQU0sR0FBRywyQkFBMkIsQ0FBQztRQUMxQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELFlBQVksQ0FBQyxPQUFPO1FBQ2hCLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUN2QixPQUFPO1NBQ1Y7UUFDRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRTtZQUNoRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQSx1QkFBdUIsQ0FBQztTQUN6RjthQUFNO1lBQ0gsUUFBUSxPQUFPLEVBQUU7Z0JBQ2IsS0FBSyxNQUFNLENBQUU7Z0JBQ2IsS0FBSyxRQUFRLENBQUU7Z0JBQ2YsS0FBSyxTQUFVLENBQUMsQ0FBQztvQkFDYixPQUFPLElBQUksQ0FBQztpQkFDZjtnQkFDRCxLQUFLLE1BQU0sQ0FBRTtnQkFDYixLQUFLLFFBQVEsQ0FBRTtnQkFDZixLQUFLLFNBQVUsQ0FBQyxDQUFDO29CQUNiLE9BQU8sSUFBSSxDQUFDO2lCQUNmO2dCQUNELEtBQUssT0FBTyxDQUFFO2dCQUNkLEtBQUssU0FBUyxDQUFFO2dCQUNoQixLQUFLLFVBQVcsQ0FBQyxDQUFDO29CQUNkLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjtnQkFDRCxLQUFLLE9BQU8sQ0FBRTtnQkFDZCxLQUFLLFNBQVMsQ0FBRTtnQkFDaEIsS0FBSyxVQUFXLENBQUMsQ0FBQztvQkFDZCxPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBQ0QsS0FBSyxPQUFPLENBQUM7Z0JBQ2IsS0FBSyxTQUFTLENBQUM7Z0JBQ2YsS0FBSyxVQUFVLENBQUMsQ0FBQztvQkFDYixPQUFPLEtBQUssQ0FBQztpQkFDaEI7Z0JBQ0QsS0FBSyxRQUFRLENBQUM7Z0JBQ2QsS0FBSyxVQUFVLENBQUM7Z0JBQ2hCLEtBQUssV0FBVyxDQUFDLENBQUM7b0JBQ2QsT0FBTyxNQUFNLENBQUM7aUJBQ2pCO2dCQUNELEtBQUssUUFBUSxDQUFDO2dCQUNkLEtBQUssVUFBVSxDQUFDO2dCQUNoQixLQUFLLFdBQVcsQ0FBQyxDQUFDO29CQUNkLE9BQU8sTUFBTSxDQUFDO2lCQUNqQjtnQkFDRCxLQUFLLFNBQVMsQ0FBQztnQkFDZixLQUFLLFdBQVcsQ0FBQztnQkFDakIsS0FBSyxZQUFZLENBQUMsQ0FBQztvQkFDZixPQUFPLElBQUksQ0FBQztpQkFDZjtnQkFDRCxLQUFLLFNBQVMsQ0FBQztnQkFDZixLQUFLLFdBQVcsQ0FBQztnQkFDakIsS0FBSyxZQUFZLENBQUMsQ0FBQztvQkFDZixPQUFPLElBQUksQ0FBQztpQkFDZjtnQkFDRCxLQUFLLFVBQVUsQ0FBQztnQkFDaEIsS0FBSyxZQUFZLENBQUM7Z0JBQ2xCLEtBQUssYUFBYSxDQUFDLENBQUM7b0JBQ2hCLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjtnQkFDRCxLQUFLLFVBQVUsQ0FBQztnQkFDaEIsS0FBSyxZQUFZLENBQUM7Z0JBQ2xCLEtBQUssYUFBYSxDQUFDLENBQUM7b0JBQ2hCLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjtnQkFDRDtvQkFDSSxPQUFPLE9BQU8sQ0FBQzthQUN0QjtTQUNKO0lBQ0wsQ0FBQztJQUVELHFCQUFxQixDQUFDLEtBQUs7UUFDdkIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDM0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM1QjtRQUNELE9BQU8sQ0FBRSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRyxDQUFDO0lBQ2pELENBQUM7OztZQXpISixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIscStRQUEwQzs7YUFFN0M7OztZQU5PLFdBQVc7OzswQkFTZCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEZWNpbWFsUGlwZX0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FwcC1jaGlwLWljb25zJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2hpcC1pY29ucy5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2hpcC1pY29ucy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIENoaXBJY29uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSBjaGlwSWNvbktleTogc3RyaW5nO1xuICAgIHN0ckNzczogc3RyaW5nO1xuICAgIHN0cktleTogc3RyaW5nO1xuICAgIGNoaXBMYWJlbDogc3RyaW5nO1xuXG4gICAgLypjaGlwc0ljb24gPSB7XG4gICAgICAgICc1MDAwMDAwMCc6ICdpY29uLWNoaXAtY29sb3IgY2hpcC01MC1taWxsaW9uJyxcbiAgICAgICAgJzEwMDAwMDAwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTEwLW1pbGxpb24nLFxuICAgICAgICAnNTAwMDAwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTUwMC10aG91c2FuZCcsXG4gICAgICAgICcxMDAwMDAnOiAnaWNvbi1jaGlwLWNvbG9yIGNoaXAtMTAwLXRob3VzYW5kJyxcbiAgICAgICAgJzUwMDAwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTUwLXRob3VzYW5kJyxcbiAgICAgICAgJzI1MDAwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTI1LXRob3VzYW5kJyxcbiAgICAgICAgJzEwMDAwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTEwLXRob3VzYW5kJyxcbiAgICAgICAgJzUwMDAnOiAnaWNvbi1jaGlwLWNvbG9yIGNoaXAtNS10aG91c2FuZCcsXG4gICAgICAgICcxMDAwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTEtdGhvdXNhbmQnLFxuICAgICAgICAnNTAwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTUwMCcsXG4gICAgICAgICcxMDAnOiAnaWNvbi1jaGlwLWNvbG9yIGNoaXAtMTAwJyxcbiAgICAgICAgJzUwJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTUwJyxcbiAgICAgICAgJzI1JzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTI1JyxcbiAgICAgICAgJzUnOiAnaWNvbi1jaGlwLWNvbG9yIGNoaXAtNScsXG4gICAgICAgICczJzogJ2ljb24tY2hpcC1jb2xvciBjaGlwLTMnLFxuICAgICAgICAnMSc6ICdpY29uLWNoaXAtY29sb3IgY2hpcC0xJ1xuICAgIH07Ki9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlY2ltYWxQaXBlOiBEZWNpbWFsUGlwZSkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmdldENoaXBJY29uKCk7XG4gICAgfVxuXG4gICAgZ2V0Q2hpcEljb24oKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmNoaXBJY29uS2V5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5zdHJLZXkgPSB0aGlzLmNoaXBJY29uS2V5LnJlcGxhY2UoJy4wMCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoaXBMYWJlbCA9IHRoaXMuZ2V0Q2hpcExhYmVsKHRoaXMuc3RyS2V5KTtcbiAgICAgICAgLy8gdGhpcy5zdHJDc3MgPSB0aGlzLmNoaXBzSWNvblt0aGlzLnN0cktleV0gPyB0aGlzLmNoaXBzSWNvblt0aGlzLnN0cktleV0gOiAnaWNvbi1jaGlwLWNvbG9yIGRlZmF1bHQtY2hpcC1jb2xvcic7XG4gICAgICAgIHRoaXMuc3RyQ3NzID0gJ2ljb24tY2hpcC1jb2xvciBjaGlwLWdyZXknO1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJDc3M7XG4gICAgfVxuXG4gICAgZ2V0Q2hpcExhYmVsKGNoaXBLZXkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoY2hpcEtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNGcmFjdGlvbmFsQ2hpcERlbm9tKGNoaXBLZXkudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRlY2ltYWxQaXBlLnRyYW5zZm9ybShjaGlwS2V5LnRvU3RyaW5nKCksICcxLjItMicpLyoucmVwbGFjZSgnLjAwJywgJycpKi87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGNoaXBLZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcxMDAwJyA6XG4gICAgICAgICAgICAgICAgY2FzZSAnMTAwMC4wJyA6XG4gICAgICAgICAgICAgICAgY2FzZSAnMTAwMC4wMCcgOiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnMUsnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICc1MDAwJyA6XG4gICAgICAgICAgICAgICAgY2FzZSAnNTAwMC4wJyA6XG4gICAgICAgICAgICAgICAgY2FzZSAnNTAwMC4wMCcgOiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnNUsnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICcxMDAwMCcgOlxuICAgICAgICAgICAgICAgIGNhc2UgJzEwMDAwLjAnIDpcbiAgICAgICAgICAgICAgICBjYXNlICcxMDAwMC4wMCcgOiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnMTBLJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnMjUwMDAnIDpcbiAgICAgICAgICAgICAgICBjYXNlICcyNTAwMC4wJyA6XG4gICAgICAgICAgICAgICAgY2FzZSAnMjUwMDAuMDAnIDoge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzI1Syc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJzUwMDAwJzpcbiAgICAgICAgICAgICAgICBjYXNlICc1MDAwMC4wJzpcbiAgICAgICAgICAgICAgICBjYXNlICc1MDAwMC4wMCc6IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc1MEsnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICcxMDAwMDAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzEwMDAwMC4wJzpcbiAgICAgICAgICAgICAgICBjYXNlICcxMDAwMDAuMDAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnMTAwSyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJzUwMDAwMCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnNTAwMDAwLjAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzUwMDAwMC4wMCc6IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc1MDBLJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnMTAwMDAwMCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnMTAwMDAwMC4wJzpcbiAgICAgICAgICAgICAgICBjYXNlICcxMDAwMDAwLjAwJzoge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzFNJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnNTAwMDAwMCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnNTAwMDAwMC4wJzpcbiAgICAgICAgICAgICAgICBjYXNlICc1MDAwMDAwLjAwJzoge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzVNJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnMTAwMDAwMDAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzEwMDAwMDAwLjAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzEwMDAwMDAwLjAwJzoge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzEwTSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJzUwMDAwMDAwJzpcbiAgICAgICAgICAgICAgICBjYXNlICc1MDAwMDAwMC4wJzpcbiAgICAgICAgICAgICAgICBjYXNlICc1MDAwMDAwMC4wMCc6IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc1ME0nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hpcEtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRnJhY3Rpb25hbENoaXBEZW5vbShkZW5vbSkge1xuICAgICAgICBpZiAodHlwZW9mIGRlbm9tID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZGVub20gPSBkZW5vbS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoIGRlbm9tICYmIGRlbm9tLmluZGV4T2YoJy4nKSA+IC0xICApO1xuICAgIH1cbn1cbiJdfQ==