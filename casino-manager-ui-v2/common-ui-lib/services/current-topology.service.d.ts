import { BehaviorSubject } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class CurrentTopologyService {
    private defaultTopologyID;
    private defaultGamingDay;
    topology: BehaviorSubject<number>;
    currentTopology: import("rxjs").Observable<number>;
    gamingDay: BehaviorSubject<Date>;
    currentGamingDay: import("rxjs").Observable<Date>;
    constructor();
    updateTopology(topologyID: number, gamingDay: Date): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CurrentTopologyService, never>;
}

//# sourceMappingURL=current-topology.service.d.ts.map