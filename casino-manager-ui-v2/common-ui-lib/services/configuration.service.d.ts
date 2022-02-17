import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemProperty } from '../interface/configuration.interface';
import * as ɵngcc0 from '@angular/core';
export declare class ConfigurationService {
    private http;
    constructor(http: HttpClient);
    getLimits(options: {}): Observable<HttpResponse<Object>>;
    getInActiveLimits(options: {}): Observable<HttpResponse<Object>>;
    getConfigurationProperties(options: {}, type: any): Observable<HttpResponse<Object>>;
    getConfigurationPropertyValues(options: {}, topologyId: any): Observable<HttpResponse<Object>>;
    saveConfigurationproperties(options: {}): Observable<HttpResponse<Object>>;
    getSystemData(): Observable<SystemProperty[]>;
    getConfigurations(topologyId: any): Observable<HttpResponse<Object>>;
    isGlobalAnonymousHostEnabled(): Observable<HttpResponse<Object>>;
    checkGlobalCbpt(): Observable<HttpResponse<Object>>;
    checkFctxnEnabled(): Observable<HttpResponse<Object>>;
    getHostcallTemplate(): Observable<HttpResponse<Object>>;
    getHostcallDataOnTopology(topologyId: any): Observable<HttpResponse<Object>>;
    postHostcallDataOnTopology(data: any): Observable<HttpResponse<Object>>;
    putHostcallData(data: any, id: any): Observable<HttpResponse<Object>>;
    isPlayerAdustmentEnabled(): Observable<HttpResponse<Object>>;
    getPlayerRankingList(): Observable<HttpResponse<Object>>;
    getPlayerAdjustment(topologyId: any, propertyId: any): Observable<HttpResponse<Object>>;
    postPlayerAdjustment(topologyId: any, propertyId: any, objData: any): Observable<HttpResponse<Object>>;
    updatePlayerAdjustment(topologyId: any, propertyId: any, objData: any): Observable<HttpResponse<Object>>;
    putPlayerAdjustment(configId: any, propertyId: any, objData: any): Observable<HttpResponse<Object>>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ConfigurationService, never>;
}

//# sourceMappingURL=configuration.service.d.ts.map