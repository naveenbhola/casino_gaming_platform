import { BehaviorSubject } from 'rxjs';
import { UserDetailInterface } from '../interface/user-detail.interface';
import * as ɵngcc0 from '@angular/core';
export declare class TopNavBarService {
    private userDetails;
    userDetailsSubject: BehaviorSubject<UserDetailInterface>;
    userDetailsObservable: import("rxjs").Observable<UserDetailInterface>;
    constructor();
    updateUserDetails(userDetails: UserDetailInterface): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TopNavBarService, never>;
}

//# sourceMappingURL=top-nav-bar.service.d.ts.map