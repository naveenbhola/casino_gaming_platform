import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class AlertService {
    private _http;
    constructor(_http: HttpClient);
    getAlertsData(url: any, options: {}): Observable<HttpResponse<Object>>;
    getEventData(): void;
    getAlertCounts(topologyId: any): Observable<[]>;
    getAlertCountsByCategory(alertStatus: any, topologyId: any, category: any): Observable<[]>;
    getAlertCountsByCategoryVG(alertStatus: any, topologyId: any, category: any): Observable<[]>;
    changeStatus(statusUrl: any, statusObj: any): Observable<HttpResponse<Object>>;
    changeSeverity(): void;
    addNote(noteUrl: any, noteObj: any): Observable<HttpResponse<Object>>;
    saveCustomerKnowledgeBase(baseUrl: any, baseObj: any): Observable<HttpResponse<Object>>;
    saveTableCustomerKnowledgeBase(baseUrl: any, baseObj: any): Observable<HttpResponse<Object>>;
    getAlertConfiguration(options?: {}): Observable<Object>;
    updateAlertConfiguration(data?: {}, params?: {}): Observable<Object>;
    getTableAlertsCount(options: {}): Observable<Object>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AlertService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<AlertService>;
}

//# sourceMappingURL=alert.service.d.ts.map