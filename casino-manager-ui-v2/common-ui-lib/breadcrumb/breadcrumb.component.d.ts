import { EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../services/utility.service';
import { TopologyService } from '../services/topology.service';
import * as ɵngcc0 from '@angular/core';
export declare class BreadcrumbComponent implements OnInit {
    private translate;
    private utilityService;
    private topologyService;
    breadCrumbArray: any;
    clickOnBreadCrumb: EventEmitter<any>;
    homeUrl: any;
    constructor(translate: TranslateService, utilityService: UtilityService, topologyService: TopologyService);
    ngOnInit(): void;
    clickEvnt(itemObj: any, index: any): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BreadcrumbComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BreadcrumbComponent, "app-breadcrumb", never, { "breadCrumbArray": "breadCrumbArray"; }, { "clickOnBreadCrumb": "clickOnBreadCrumb"; }, never, never>;
}

//# sourceMappingURL=breadcrumb.component.d.ts.map