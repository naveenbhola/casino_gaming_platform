import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../services/utility.service';
import { TopologyService } from '../services/topology.service';
// import {ActivatedRoute, Router} from "@angular/router";
export class BreadcrumbComponent {
    constructor(translate, utilityService, topologyService) {
        this.translate = translate;
        this.utilityService = utilityService;
        this.topologyService = topologyService;
        this.clickOnBreadCrumb = new EventEmitter();
        this.translate.setDefaultLang('en_US');
    }
    ngOnInit() {
        this.homeUrl = { "labelName": "", "labelShortName": "", "params": "", "url": "/overview" };
        this.topologyService.areasLabelClicked.subscribe((obj) => {
            this.clickEvnt(this.homeUrl, -1);
        });
    }
    clickEvnt(itemObj, index) {
        if (this.breadCrumbArray.length - 1 > index) {
            this.utilityService.updateBreadCrumClick(itemObj);
        }
    }
}
BreadcrumbComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-breadcrumb',
                template: "<div class=\"breadcrumbs-wrapper\">\n  <div class=\"brand-logo\" (click)=\"clickEvnt(homeUrl,-1)\">\n    <img class=\"brand-logo__img\" src=\"./assets/images/logo-test.png\" />\n  </div>\n  <div class=\"breadcrumbs__item\" *ngFor=\"let item of breadCrumbArray; index as i;\" (click)=\"clickEvnt(item,i)\">\n    <span>{{item.labelShortName}}</span>\n  </div>\n</div>",
                styles: [":root{--accent:#9c1c23;--accent-bright:#ff562d;--accent-dark:#7d161b;--black:#000;--blue:#00ceff;--blue-dark:#00a3cc;--cyan:#23a6ad;--danger:#dc3545;--dark:#333;--dark-light:grey;--gray30:#5a5858;--gray50:#817e7e;--gray80:#d9d8d8;--green-dark:#1c925d;--green-darker:#0a3321;--green-light:#b2f0d5;--info:#0facd2;--primary:#bb9156;--primary-beige:#f0edca;--primary-bg:#eee7dd;--primary-dark:#ab7348;--primary-light:#d9cb9e;--primary-lighten:#e0cdb2;--secondary:#ccc;--secondary-light:#e6e6e6;--success:#22b573;--success-bright:#24ff00;--warning:#fbb03b;--white:#fff;--white-text:#f5f5f5;--yellow:#ff0;--yellow-bright:#ffea00;--yellow-dark:#cc0}.breadcrumbs__item:after,.breadcrumbs__item:before{border:18px solid transparent;border-left:9px solid hsla(0,0%,100%,.2);content:\"\";position:absolute}.breadcrumbs-wrapper{align-content:center;display:flex;flex-direction:row;justify-content:start;min-width:96px;padding:0}.breadcrumbs__item{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;align-items:center;background-color:#000;border-bottom-left-radius:4px;border-top-left-radius:4px;color:#f0edca;cursor:pointer;display:inline-flex;font-size:16px;font-weight:600;line-height:2.4;margin:0;min-width:12vmin;padding:0 4px 0 16px;position:relative;user-select:none}.breadcrumbs__item:before{border-left-color:#fff;border-width:24px 24px 24px 12px;left:0}.breadcrumbs__item:first-child{padding-left:8px}.breadcrumbs__item:first-child:before{display:none}.breadcrumbs__item:after{border-left-color:#000;right:-27px;z-index:10}.breadcrumbs__item:last-child:not(:first-of-type){background-color:#d9d9d9;color:#0f1235;cursor:default;font-weight:600}.breadcrumbs__item:last-child:not(:first-of-type):after{border-left-color:#d9d9d9}.brand-logo,.logo-breadcrumbs__wrapper{display:inline-flex}.brand-logo__img{height:100%;min-width:54px;width:100%}"]
            },] }
];
BreadcrumbComponent.ctorParameters = () => [
    { type: TranslateService },
    { type: UtilityService },
    { type: TopologyService }
];
BreadcrumbComponent.propDecorators = {
    breadCrumbArray: [{ type: Input }],
    clickOnBreadCrumb: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9icmVhZGNydW1iL2JyZWFkY3J1bWIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0UsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzNELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQTtBQUM1RCwwREFBMEQ7QUFPMUQsTUFBTSxPQUFPLG1CQUFtQjtJQUs5QixZQUNZLFNBQTJCLEVBQzNCLGNBQThCLEVBQzlCLGVBQWdDO1FBRmhDLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFMbEMsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQU8vQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBQyxXQUFXLEVBQUMsRUFBRSxFQUFDLGdCQUFnQixFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEtBQUssRUFBQyxXQUFXLEVBQUMsQ0FBQztRQUVsRixJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSztRQUN0QixJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxLQUFLLEVBQUU7WUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNyRDtJQUNILENBQUM7OztZQTdCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIseVhBQTBDOzthQUUzQzs7O1lBVE8sZ0JBQWdCO1lBQ2hCLGNBQWM7WUFDZCxlQUFlOzs7OEJBVXBCLEtBQUs7Z0NBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHtVdGlsaXR5U2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvdXRpbGl0eS5zZXJ2aWNlJztcbmltcG9ydCB7VG9wb2xvZ3lTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy90b3BvbG9neS5zZXJ2aWNlJ1xuLy8gaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1icmVhZGNydW1iJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2JyZWFkY3J1bWIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9icmVhZGNydW1iLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQnJlYWRjcnVtYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIC8vYnJlYWRDcnVtYnMgPSBbe3ZhbHVlOnt0ZXN0MTogJ3Rlc3QxJ319LHt2YWx1ZTp7dGVzdDogJ3Rlc3QnfX1dO1xuICBASW5wdXQoKSBicmVhZENydW1iQXJyYXk7XG4gIEBPdXRwdXQoKSBjbGlja09uQnJlYWRDcnVtYiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgaG9tZVVybDtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSxcbiAgICAgIHByaXZhdGUgdXRpbGl0eVNlcnZpY2U6IFV0aWxpdHlTZXJ2aWNlLFxuICAgICAgcHJpdmF0ZSB0b3BvbG9neVNlcnZpY2U6IFRvcG9sb2d5U2VydmljZVxuICApIHtcbiAgICB0aGlzLnRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZygnZW5fVVMnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaG9tZVVybCA9IHtcImxhYmVsTmFtZVwiOlwiXCIsXCJsYWJlbFNob3J0TmFtZVwiOlwiXCIsXCJwYXJhbXNcIjpcIlwiLFwidXJsXCI6XCIvb3ZlcnZpZXdcIn07XG5cbiAgICB0aGlzLnRvcG9sb2d5U2VydmljZS5hcmVhc0xhYmVsQ2xpY2tlZC5zdWJzY3JpYmUoIChvYmopID0+e1xuICAgICAgdGhpcy5jbGlja0V2bnQodGhpcy5ob21lVXJsLC0xKVxuICAgIH0pO1xuICB9XG4gIGNsaWNrRXZudChpdGVtT2JqLCBpbmRleCkge1xuICAgIGlmICh0aGlzLmJyZWFkQ3J1bWJBcnJheS5sZW5ndGggLSAxID4gaW5kZXgpIHtcbiAgICAgICAgdGhpcy51dGlsaXR5U2VydmljZS51cGRhdGVCcmVhZENydW1DbGljayhpdGVtT2JqKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==