import { CurrentTopologyService } from '../../services/current-topology.service';
import { AlertCount } from '../../interface/alert.interface';
import { TopologyStatistics } from '../../interface/topology-types.interface';
import * as ɵngcc0 from '@angular/core';
export declare class SubnavDataBarComponent {
    private currentTopology;
    alertsCount: AlertCount;
    topologyStatistics: TopologyStatistics;
    private currentToplogyId;
    private currentGamingDay;
    constructor(currentTopology: CurrentTopologyService);
    updateTopology(): void;
    convertToNumber(value: any): number;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SubnavDataBarComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SubnavDataBarComponent, "app-subnav-data-bar", never, { "alertsCount": "alertsCount"; "topologyStatistics": "topologyStatistics"; }, {}, never, never>;
}

//# sourceMappingURL=subnav-data-bar.component.d.ts.map