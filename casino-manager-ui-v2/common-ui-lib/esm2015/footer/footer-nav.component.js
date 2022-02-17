import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
export class FooterNavComponent {
    constructor(translate) {
        this.translate = translate;
    }
    ngOnInit() {
        //console.log('FooterNavComponent:::', this.objFooterNavData);
    }
}
FooterNavComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-footer-nav',
                template: "<div class=\"footer-tabs__wrapper\">\n    <!-- for selector used only-->\n    <mat-card class=\"card-layout\" *ngFor=\"let item of objFooterNavData | async\">\n        <p>Jaychandra Kushwaha :::: {{item.id}}</p>\n    </mat-card>\n</div>\n",
                styles: [".card-layout{display:inline-block;height:130px;max-width:200px}.card-bg{background-color:#bb9156;border-radius:5px;min-width:100px}"]
            },] }
];
FooterNavComponent.ctorParameters = () => [
    { type: TranslateService }
];
FooterNavComponent.propDecorators = {
    objFooterNavData: [{ type: Input }],
    objTabsNameToDisplay: [{ type: Input }],
    translateLabel: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLW5hdi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9mb290ZXIvZm9vdGVyLW5hdi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFDdkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFPckQsTUFBTSxPQUFPLGtCQUFrQjtJQUkzQixZQUFtQixTQUEyQjtRQUEzQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtJQUFJLENBQUM7SUFFckQsUUFBUTtRQUNOLDhEQUE4RDtJQUNoRSxDQUFDOzs7WUFiRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsMFBBQTBDOzthQUUzQzs7O1lBTk8sZ0JBQWdCOzs7K0JBUW5CLEtBQUs7bUNBQ0wsS0FBSzs2QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUcmFuc2xhdGVTZXJ2aWNlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWZvb3Rlci1uYXYnLFxuICB0ZW1wbGF0ZVVybDogJy4vZm9vdGVyLW5hdi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2Zvb3Rlci1uYXYuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBGb290ZXJOYXZDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpIG9iakZvb3Rlck5hdkRhdGE7XG4gICAgQElucHV0KCkgb2JqVGFic05hbWVUb0Rpc3BsYXk7XG4gICAgQElucHV0KCkgdHJhbnNsYXRlTGFiZWw6IHN0cmluZ1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vY29uc29sZS5sb2coJ0Zvb3Rlck5hdkNvbXBvbmVudDo6OicsIHRoaXMub2JqRm9vdGVyTmF2RGF0YSk7XG4gIH1cblxufVxuIl19