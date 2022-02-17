import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ChipsInventoryInterface, LocalGamingDayInterface, LocalGamingDaysInHeirarchyInterface, RollTimeInterface, RollTimePayloadInterface, ChipTrayOpenerCloser, OpenerCloserReportData, FcTxnsInterface } from '../interface/cage.interface';
import * as ɵngcc0 from '@angular/core';
export declare class CageService {
    private http;
    constructor(http: HttpClient);
    getInventoryData(id: any, options: {}): Observable<ChipsInventoryInterface[]>;
    getCurrentGamingDay(topologyId: any): Observable<HttpResponse<Object>>;
    getLocalGamingDay(id: any): Observable<LocalGamingDayInterface>;
    getRollTimeData(options: {}): Observable<RollTimeInterface[]>;
    getRollDTM(topologyId: any): Observable<any>;
    localGamingDaysInHierarchy(topologyId: any): Observable<LocalGamingDaysInHeirarchyInterface>;
    postRollTimeData(payLoad: {}, userId?: string, employeeId?: string): Observable<HttpResponse<RollTimePayloadInterface>>;
    getChipTrayOpenerCloser(options: {}): Observable<ChipTrayOpenerCloser>;
    getOpenerCloserReportData(options: {}): Observable<OpenerCloserReportData>;
    getReportUrl(data: any): string;
    getReportData(data: any): Observable<HttpResponse<any>>;
    getfcTransactions(options: {}): Observable<FcTxnsInterface>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CageService, never>;
}

//# sourceMappingURL=cage.service.d.ts.map